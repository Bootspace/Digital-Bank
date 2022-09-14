import mysql from 'mysql2';
import db from './Db.js';
import logger from './winston.js';
import bcrypt from 'bcrypt';
let salt = await bcrypt.genSalt(10);

export const hashPassword = async (data, next) => {
  let hashedPassword = await bcrypt.hash(data, salt);
  if(!hashedPassword) {
    logger.log('error','Encrypting Password failed...');
    return;
  }
  return hashedPassword;
}

export const generateAccountNumber = (min, max) => {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
};

export default (hashPassword, generateAccountNumber);