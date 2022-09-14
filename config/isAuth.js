import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import logger from './winston.js';
import express from 'express';

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            logger.log('error', 'No token found!');
            return res.status(400).json({ status: 'failed', message: 'No token found!' });
        }

        let decodedToken = await jwt.verify(token, process.env.SECRET);
        if (!decodedToken) {
            logger.log('error', 'Failed to verify token!');
            return res.status(400).json({ status: 'failed', message: 'Failed to verify token!' });
        }

        logger.log('info', 'JWT Authenticated');
        req.email = decodedToken.email;
        req.account = decodedToken.acc_number;
        next();
    } catch (error) {
        logger.log('error', 'Register as a User!');
        return res.status(500).json({ status: 'failed', message: 'Register as a User!' });
    }
};

export default isAuthenticated;
