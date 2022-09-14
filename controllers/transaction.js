// import { confirmBalance } from '../config/trans_config.js';
import express, { query } from 'express';
import { db } from '../config/Db.js';
import logger from '../config/winston.js';
import bcrypt from 'bcrypt';

export const sendMoney = async (req, res) => {
    try {
        const receiver = req.body.receiver;
        const amount = parseInt(req.body.amount);
        db.query('SELECT * FROM accounts WHERE user =?', [req.email], async (err, results) => {
            if (err) {
                logger.log('error', err.message);
                return res.status(404).json({ status: 'failed', message: err.message });
            }
            let balance = results[0]['account_balance'];
            let sender = results[0]['account_number'];
            if (amount >= balance) {
                logger.log('error', 'Insufficient Funds');
                return res.status(404).json({ status: 'failed', message: 'Insufficient Funds' });
            }
            let updatedBalance = balance - amount;
            db.query('UPDATE accounts SET account_balance =? WHERE user =?', [updatedBalance, req.email], async (err, rows) => {
                if (err) {
                    logger.log('error', err.message);
                    return res.status(404).json({ status: 'failed', message: err.message });
                }
                db.query('SELECT account_balance FROM accounts WHERE account_number =?', [receiver], async (err, results) => {
                    if (err) {
                        logger.log('error', err.message);
                        return res.status(404).json({ status: 'failed', message: err.message });
                    }
                    let balance = results[0]['account_balance'];
                    let updatedBalance = balance + amount;
                    db.query('UPDATE accounts SET account_balance =? WHERE account_number=?', [updatedBalance, receiver], async (err, result) => {
                        if (err) {
                            logger.log('error', err.message);
                            return res.status(404).json({ status: 'failed', message: err.message });
                        }
                        console.log(sender);
                        console.log(receiver);
                        db.query(
                            'INSERT INTO transactions SET?',
                            {
                                sender: sender,
                                receiver: receiver,
                                amount: amount,
                                statuss: 'successful',
                                types: 'transfer'
                            },
                            async (err, rowse) => {
                                if (err) {
                                    logger.log('error', err.message);
                                    return res.status(404).json({ status: 'failed', message: err.message });
                                }
                                logger.log('info', 'Transaction Succesful');
                                return res.status(200).json({ status: 'success', message: 'Transaction succesful' });
                            }
                        );
                    });
                });
            });
        });
    } catch (error) {
        logger.log('error', 'Internal Server Error');
        return res.status(500).json({ status: 'failed', message: 'Internal Server Error' });
    }
};

export const withdrawal = async (req, res) => {
    try {
        const { passcode } = req.body;
        const amount = parseInt(req.body.amount);

        db.query('SELECT users.passcode, account_number, account_balance FROM accounts INNER JOIN users ON  accounts.user = users.email WHERE user =?', [req.email], async (err, results) => {
            if (err) {
                logger.log('error', err.message);
                return res.status(400).json({ status: 'fail', message: err.message });
            }
            const hashedPasscode = results[0]['passcode'];
            logger.log('info', `User passcode ${hashedPasscode}`);
            const accountBalance = parseInt(results[0]['account_balance']);
            const accountNumber = results[0]['account_number'];
            const newBalance = accountBalance - amount;

            //Comparing Passwords
            const verifiedPassword = await bcrypt.compare(passcode, hashedPasscode);
            if (!verifiedPassword) {
                logger.log('error', 'Incorrect Passcode');
                return res.status(400).json({ status: 'fail', message: 'Incorrect Passcode' });
            }

            // Accrediting the withdrawal
            if (amount >= accountBalance) {
                logger.log('error', 'Insufficient Funds');
                return res.status(400).json({ status: 'fail', message: 'Insufficient Funds' });
            }

            db.query('UPDATE accounts SET account_balance = ? WHERE user =?', [newBalance, req.email], async (err, rows) => {
                if (err) {
                    logger.log('error', err.message);
                    return res.status(400).json({ status: 'fail', message: err.message });
                }
                db.query(
                    'INSERT INTO transactions SET?',
                    {
                        sender: accountNumber,
                        receiver: accountNumber,
                        amount: amount,
                        statuss: 'successful',
                        types: 'withdrawal'
                    },
                    async (err, rowse) => {
                        if (err) {
                            logger.log('error', err.message);
                            return res.status(404).json({ status: 'failed', message: err.message });
                        }
                        logger.log('info', 'Transaction Succesful');
                        return res.status(200).json({ status: 'success', message: 'Transaction succesful' });
                    }
                );
            });
        });
    } catch (error) {
        logger.log('error', 'Internal server error');
        return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
};

// export const getTransactions = async(req, res) => {
//     try {
//         const {transactionType} = req.body;
//         db.query('SELECT ')
//     } catch (error) {
//         logger.log('error', 'Internal server error');
//         return res.status(500).json({ status: 'failed', message: 'Internal server error' });
//     }
// }

export default (sendMoney, withdrawal);
