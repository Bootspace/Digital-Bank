import express from 'express';
const user = express.Router();
import { register, Login, verifyAccount} from '../controllers/user.js';

user.post('/register', register);
user.post('/login', Login);
user.put('/verify', verifyAccount);
export default user;