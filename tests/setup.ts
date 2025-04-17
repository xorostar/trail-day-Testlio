import { getConnection } from '../lib/models/connection';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DB_HOST = 'mysqldb';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'issue_tracker_test';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'password';

// Global setup
beforeAll(async () => {
  // Connect to test database
  await getConnection();
});

// Global teardown
afterAll(async () => {
  // Close database connection
  const sequelize = getConnection();
  await sequelize.close();
}); 