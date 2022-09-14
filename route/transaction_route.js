import express from 'express';
const transaction = express.Router();
import { sendMoney, withdrawal } from '../controllers/transaction.js';
import isAuthenticated from '../config/isAuth.js';
import { isVerified } from '../config/is_verified.js';

transaction.post('/sendmoney', isVerified, isAuthenticated, sendMoney);
transaction.post('/withdraw', isVerified, isAuthenticated, withdrawal);

export default transaction;
