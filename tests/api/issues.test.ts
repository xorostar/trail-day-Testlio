import { clearDatabase, createTestUser, makeRequest } from '../helpers';

describe('Issues API', () => {
  let authToken: string;

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
  });

  describe('POST /issues', () => {
    it('should create a new issue', async () => {
      const response = await makeRequest()
        .post('/issues')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Issue',
          description: 'Test Description'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Test Issue');
      expect(response.body.data.description).toBe('Test Description');
    });
  });

  describe('GET /issues', () => {
    it('should get all issues', async () => {
      const response = await makeRequest()
        .get('/issues')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
}); 