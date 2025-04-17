import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('3306'),
  DB_NAME: z.string().default('testlio'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
});

const envConfig = configSchema.parse(process.env);

interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
  dialectOptions?: {
    bigNumberStrings: boolean;
  };
}

export interface Config {
  server: {
    port: number;
    env: string;
  };
  db: {
    development: DatabaseConfig;
    test: DatabaseConfig;
    production: DatabaseConfig;
  };
}

const config: Config = {
  server: {
    port: parseInt(envConfig.PORT),
    env: envConfig.NODE_ENV,
  },
  db: {
    development: {
      username: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      host: envConfig.DB_HOST,
      port: parseInt(envConfig.DB_PORT),
      dialect: 'mysql',
      dialectOptions: {
        bigNumberStrings: true
      }
    },
    test: {
      username: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      host: envConfig.DB_HOST,
      port: parseInt(envConfig.DB_PORT),
      dialect: 'mysql',
      dialectOptions: {
        bigNumberStrings: true
      }
    },
    production: {
      username: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
      host: envConfig.DB_HOST,
      port: parseInt(envConfig.DB_PORT),
      dialect: 'mysql',
      dialectOptions: {
        bigNumberStrings: true
      }
    }
  },
};

export default config; 