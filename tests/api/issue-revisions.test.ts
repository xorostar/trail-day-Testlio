import { clearDatabase, createTestUser, makeRequest } from '../helpers';
import request from 'supertest';
import { callback } from '../../app';
import Issue from '../../lib/models/issue';
import IssueRevision from '../../lib/models/issue-revision';

describe('Issue Revisions API', () => {
  let authToken: string;
  let issueId: number;

  beforeEach(async () => {
    await clearDatabase();
    // Create a test user and get auth token
    const user = await createTestUser('test@example.com', 'password123');
    const loginResponse = await makeRequest()
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = loginResponse.body.data.token;

    // Create a test issue
    const issueResponse = await makeRequest()
      .post('/issues')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Issue',
        description: 'Test Description'
      });
    issueId = issueResponse.body.data.id;
  });

  afterAll(async () => {
    // Clean up test data
    await IssueRevision.destroy({ where: { issue_id: issueId } });
    await Issue.destroy({ where: { id: issueId } });
  });

  describe('GET /issues/:issueId/revisions', () => {
    it('should return 200 and an empty list when no revisions exist', async () => {
      const response = await request(callback)
        .get(`/issues/${issueId}/revisions`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          items: [],
          total: 0,
          limit: 10,
          offset: 0
        }
      });
    });

    it('should return 200 and a list of revisions', async () => {
      // Create a test revision
      await IssueRevision.create({
        issue_id: issueId,
        title: 'Updated Title',
        description: 'Updated Description',
        changes: { title: 'Updated Title', description: 'Updated Description' },
        created_by: 'test@example.com'
      });

      const response = await request(callback)
        .get(`/issues/${issueId}/revisions`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          items: expect.arrayContaining([
            expect.objectContaining({
              issue_id: issueId,
              title: 'Updated Title',
              description: 'Updated Description',
              changes: { title: 'Updated Title', description: 'Updated Description' },
              created_by: 'test@example.com'
            })
          ]),
          total: 1,
          limit: 10,
          offset: 0
        }
      });
    });

    it('should return 404 when issue does not exist', async () => {
      const response = await request(callback)
        .get('/issues/999999/revisions')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Issue not found'
        }
      });
    });

    it('should handle pagination parameters', async () => {
      const response = await request(callback)
        .get(`/issues/${issueId}/revisions?limit=5&offset=0`)
        .expect(200);

      expect(response.body.data).toHaveProperty('limit', 5);
      expect(response.body.data).toHaveProperty('offset', 0);
    });
  });

  describe('GET /issue-revisions/:issueId', () => {
    it('should get revisions for an issue', async () => {
      const response = await makeRequest()
        .get(`/issue-revisions/${issueId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
}); 