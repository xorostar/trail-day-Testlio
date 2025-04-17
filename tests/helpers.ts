import { getConnection } from '../lib/models/connection';
import User from '../lib/models/user';
import { setupAssociations } from '../lib/models/associations';
import request from 'supertest';
import { callback } from '../app';

export async function clearDatabase() {
  const connection = getConnection();
  setupAssociations();
  await connection.sync({ force: true });
}

export async function createTestUser(email: string, password: string) {
  return await User.create({
    email,
    password,
    name: 'Test User'
  });
}

export function makeRequest() {
  return request(callback)
    .set('x-client-id', 'test-client');
} 