import { Sequelize } from 'sequelize';
import config from '../../config';

/**
 * Connect to the database
 * @returns {Promise<void>}
 */
const sequelize = new Sequelize(
    config.mysql.database!,
    config.mysql.user!,
    config.mysql.password!,
    {
        host: config.mysql.host!,
        port: parseInt(config.mysql.port!),
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0
        },
        logging: (sql) => {
            console.log('Executing query:', sql);
        }
    }
);

/**
 * Connect to the database
 * @returns {Promise<void>}
 */
export const connect = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

/**
 * Disconnect from the database
 * @returns {Promise<void>}
 */
export const disconnect = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    throw error;
  }
};

/**
 * Query the database
 * @param {string} text - The query text
 * @param {any[]} params - The query parameters
 * @returns {Promise<any>}
 */
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const [results, metadata] = await sequelize.query(text, { replacements: params });
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: Array.isArray(results) ? results.length : 0 });
    return results;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

/**
 * Get the database connection
 * @returns {Sequelize}
 */
export const getConnection = (): Sequelize => {
  return sequelize;
};