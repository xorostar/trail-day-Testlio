interface MySQLConfig {
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
  database: string | undefined;
  port: string | undefined;
}

interface Config {
  appUrl: string | undefined;
  port: string | undefined;
  mysql: MySQLConfig;
}

const config: Config = {
  appUrl: process.env.APP_URL,
  port: process.env.PORT,
  mysql: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  }
};

export default config; 