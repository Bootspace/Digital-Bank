import express from 'express';
const account = express.Router();
import { deposit, createAccount } from '../controllers/account.js';
import isAuthenticated from '../config/isAuth.js';
import { isVerified } from '../config/is_verified.js';

account.post('/create', isVerified, isAuthenticated, createAccount);
account.post('/deposit', isVerified, isAuthenticated, deposit);

export default account;
