import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2';
import logger from './winston.js';

export const db =
  mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: '',
    database: process.env.DBNAME
  });

  db.connect((err) => {
    if(err) {
      logger.log('error', err.message)
    }
    logger.log('info', 'Database succesfully connected');
  })

export default db;