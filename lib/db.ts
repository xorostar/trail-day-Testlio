import { getConnection } from './models/connection';
import { setupAssociations } from './models/associations';

export async function initializeDatabase() {
  try {
    // Set up model associations
    setupAssociations();
    console.log('Model associations have been set up successfully.');

    // Sync all models
    await getConnection().sync();
    console.log('Database models have been synchronized.');
  } catch (error) {
    console.error('Unable to initialize database:', error);
    throw error;
  }
} 