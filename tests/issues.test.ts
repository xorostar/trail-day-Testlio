import request from 'supertest';
import { app } from '../app';
import { clearDatabase, createTestUser, createTestIssue } from './helpers';
import { Server } from 'http';

describe('Issues API', () => {
  let server: Server;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    server = app.listen();
    const user = await createTestUser('test@example.com', 'password123');
    userId = user.id;

    // Login to get auth token
    const response = await request(server)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = response.body.data.token;
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /issues', () => {
    it('should create a new issue', async () => {
      const response = await request(server)
        .post('/issues')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Issue',
          description: 'This is a test issue'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Test Issue');
      expect(response.body.data.description).toBe('This is a test issue');
      expect(response.body.data.created_by).toBe(userId.toString());
    });

    it('should not create issue without title', async () => {
      const response = await request(server)
        .post('/issues')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'This is a test issue'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should not create issue without authentication', async () => {
      const response = await request(server)
        .post('/issues')
        .send({
          title: 'Test Issue',
          description: 'This is a test issue'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /issues', () => {
    it('should list issues', async () => {
      await createTestIssue(userId, 'Test Issue 1');
      await createTestIssue(userId, 'Test Issue 2');

      const response = await request(server)
        .get('/issues')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.issues).toHaveLength(2);
      expect(response.body.data.total).toBe(2);
    });

    it('should paginate issues', async () => {
      await createTestIssue(userId, 'Test Issue 1');
      await createTestIssue(userId, 'Test Issue 2');

      const response = await request(server)
        .get('/issues?limit=1&offset=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.issues).toHaveLength(1);
      expect(response.body.data.total).toBe(2);
    });

    it('should not list issues without authentication', async () => {
      const response = await request(server)
        .get('/issues');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /issues/:id', () => {
    it('should get issue by id', async () => {
      const issue = await createTestIssue(userId, 'Test Issue');

      const response = await request(server)
        .get(`/issues/${issue.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Test Issue');
    });

    it('should not get non-existent issue', async () => {
      const response = await request(server)
        .get('/issues/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });

    it('should not get issue without authentication', async () => {
      const response = await request(server)
        .get('/issues/1');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /issues/:id', () => {
    it('should update issue', async () => {
      const issue = await createTestIssue(userId, 'Test Issue');

      const response = await request(server)
        .put(`/issues/${issue.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Issue',
          description: 'This is an updated issue'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Updated Issue');
      expect(response.body.data.description).toBe('This is an updated issue');
    });

    it('should not update non-existent issue', async () => {
      const response = await request(server)
        .put('/issues/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Issue',
          description: 'This is an updated issue'
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });

    it('should not update issue without authentication', async () => {
      const response = await request(server)
        .put('/issues/1')
        .send({
          title: 'Updated Issue',
          description: 'This is an updated issue'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /issues/:id', () => {
    it('should delete issue', async () => {
      const issue = await createTestIssue(userId, 'Test Issue');

      const response = await request(server)
        .delete(`/issues/${issue.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    it('should not delete non-existent issue', async () => {
      const response = await request(server)
        .delete('/issues/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });

    it('should not delete issue without authentication', async () => {
      const response = await request(server)
        .delete('/issues/1');

      expect(response.status).toBe(401);
    });
  });
}); 