require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: process.env.DB_HOST ||' mysqldb',
    port: parseInt(process.env.MYSQLDB_DOCKER_PORT),
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  test: {
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: process.env.DB_HOST || 'mysqldb',
    port: parseInt(process.env.MYSQLDB_DOCKER_PORT),  
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    host: process.env.DB_HOST || 'mysqldb',
    port: parseInt(process.env.MYSQLDB_DOCKER_PORT),
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  }
}; 