import request from 'supertest';
import { callback } from '../../app';
import { clearDatabase, createTestUser, createTestIssue, createTestAdmin } from '../helpers';
import { ValidationError } from '../../lib/utils/errors';

describe('Issues API', () => {
  let user: any;
  let admin: any;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await clearDatabase();
    user = await createTestUser('user@example.com', 'password123');
    admin = await createTestAdmin();
  });

  beforeEach(async () => {
    // Login to get tokens
    const userResponse = await request(callback)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userResponse.body.data.token;

    const adminResponse = await request(callback)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminResponse.body.data.token;
  });

  describe('POST /issues', () => {
    it('should create a new issue', async () => {
      const response = await request(callback)
        .post('/issues')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Issue',
          description: 'This is a test issue'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Issue');
      expect(response.body.data.description).toBe('This is a test issue');
      expect(response.body.data.created_by).toBe(user.id.toString());
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(callback)
        .post('/issues')
        .send({
          title: 'Test Issue',
          description: 'This is a test issue'
        });

      expect(response.status).toBe(401);
    });

    it('should validate input data', async () => {
      const response = await request(callback)
        .post('/issues')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: '', // Invalid: empty title
          description: 'This is a test issue'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /issues', () => {
    beforeEach(async () => {
      await clearDatabase();
      await createTestUser('user@example.com', 'password123');
      await createTestIssue(user.id, 'Issue 1');
      await createTestIssue(user.id, 'Issue 2');
    });

    it('should list issues with pagination', async () => {
      const response = await request(callback)
        .get('/issues?limit=1&offset=0')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.limit).toBe(1);
      expect(response.body.data.offset).toBe(0);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(callback)
        .get('/issues');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /issues/:id', () => {
    let issue: any;

    beforeEach(async () => {
      await clearDatabase();
      await createTestUser('user@example.com', 'password123');
      issue = await createTestIssue(user.id, 'Original Title');
    });

    it('should update an issue', async () => {
      const response = await request(callback)
        .patch(`/issues/${issue.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.updated_by).toBe(user.id.toString());
    });

    it('should return 404 if issue not found', async () => {
      const response = await request(callback)
        .patch('/issues/999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(callback)
        .patch(`/issues/${issue.id}`)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(401);
    });
  });
}); 