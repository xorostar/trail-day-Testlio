import request from 'supertest';
import { callback } from '../app';
import { clearDatabase, createTestUser } from './helpers';

describe('Authentication', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(callback)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register with invalid email', async () => {
      const response = await request(callback)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should not register with existing email', async () => {
      await createTestUser('test@example.com', 'password123');

      const response = await request(callback)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      await createTestUser('test@example.com', 'password123');

      const response = await request(callback)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with invalid password', async () => {
      await createTestUser('test@example.com', 'password123');

      const response = await request(callback)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong-password'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(callback)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });
}); 