import logger from '../config/winston.js';
import express from 'express';
import { db } from '../config/Db.js';
import { generateAccountNumber } from '../config/dbHelper.js';

export const createAccount = (req, res) => {
    try {
        const { account_type } = req.body;
        const email = req.email;

        // Generate Account number
        let account_number = generateAccountNumber(2004000000, 2004999999);
        logger.log('info', `Account number: ${account_number}`);

        db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, results) => {
            if (err) {
                logger.log('error', 'This user does not exists');
                return res.status(400).json({ status: 'failed', message: err.message });
            }
            let user = email;
            logger.log('info', `This is user ${user}`);

            db.query(
                `INSERT INTO accounts SET?`,
                {
                    account_type,
                    user,
                    account_number
                },
                async (err, result) => {
                    if (err) {
                        logger.log('error', `err.message`);
                        return res.status(404).json({ status: 'failed', message: err.message });
                    }
                    logger.log('info', 'Account succesfully created');
                    return res.status(200).json({ status: 'success', message: result });
                }
            );
        });
    } catch (error) {
        logger.log('error', 'Internal Server Error');
        return res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
    }
};

export const deposit = (req, res) => {
    try {
        const amount = parseInt(req.body.amount);

        db.query('UPDATE accounts SET account_balance = ? WHERE user = ?', [amount, req.email], (err, results) => {
            if (err) {
                logger.log('error', err.message);
                return res.status(404).json({ status: 'Failed', message: 'Deposit Failed' });
            }

            logger.log('info', 'Deposit Succesful!');
            return res.status(200).json({ status: 'succesful', message: 'Deposit was succesful1' });
        });
    } catch (error) {
        logger.log('error', 'Internal Server Error');
        return res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
    }
};

export default (deposit, createAccount);
