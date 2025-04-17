import { getConnection } from '../lib/models/connection';
import User from '../lib/models/user';
import Issue from '../lib/models/issue';
import Role from '../lib/models/role';
import IssueRevision from '../lib/models/issue-revision';

export async function clearDatabase() {
  const connection = getConnection();
  await connection.sync({ force: true });
}

export async function createTestUser(email: string, password: string) {
  return await User.create({
    email,
    password,
    name: 'Test User'
  });
}

export async function createTestAdmin() {
  const user = await createTestUser('admin@example.com', 'password123');
  const adminRole = await Role.findOne({ where: { name: 'admin' } });
  if (adminRole) {
    await user.addRole(adminRole);
  }
  return user;
}

export async function createTestIssue(userId: number, title: string) {
  return await Issue.create({
    title,
    description: 'Test description',
    created_by: userId.toString()
  });
} 