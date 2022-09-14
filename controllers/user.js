import logger from '../config/winston.js';
import express from 'express';
import { hashPassword } from '../config/dbHelper.js';
import sendEmailTemp from '../config/templates/sendEmailTemp.js';
import { db } from '../config/Db.js';
import sendEmail from '../config/nodemailer.js';
import generateOTP from '../config/otp.js';
import createToken from '../config/jwt.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
        const { firstname, lastname, nationality, states, email, contact_address, phone, passwords, passcode } = req.body;

        // Checking if eMail exists
        db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, results) => {
            if (err) {
                logger.log('error', 'Unknown error from DB');
                return res.status(500).json({ status: 'failed', message: 'Unknown error from DB' });
            }
            if (results.length > 1) {
                logger.log('error', 'Oops User already exists');
                return res.status(404).json({ status: 'failed', message: 'Oops User already exists' });
            }

            // Generating OTP`
            let OTP = generateOTP();
            logger.log('info', `This is OTP: ${OTP}`);

            let options = {
                email: email,
                subject: 'Email Verification Mail',
                message: sendEmailTemp(OTP)
            };

            // Hashing Password b4 persisting DB
            logger.log('info', `Original Passcode: ${passcode}`);
            let hashedPassword = await hashPassword(passwords);
            logger.log('info', `This is hashedPassword: ${hashedPassword}`);

            // Hashing Passcode before persisting to DB
            let hashedPasscode = await hashPassword(passcode);
            logger.log('info', `This is hashedPasscode: ${hashedPasscode}`);

            // Hashing OTP b4 persisting DB
            let hashedOTP = await hashPassword(OTP);
            logger.log('info', `This is the hashedOTP: ${hashedOTP}`);

            // Generate Account number
            // let account = generateAccountNumber(2004000000, 2004999999);
            // logger.log('info', `Account number: ${account}`);

            // let sentMail = sendEmail(options, (err, result) => {
            //   if(err) {
            //     logger.log('error', err.message)
            //   }

            //   logger.log('info', 'Mail sent succesfully');
            // });

            db.query(
                `INSERT INTO users SET?`,
                { firstname, lastname, nationality, states, email, contact_address, phone, passwords: hashedPassword, OTP: hashedOTP, passcode: hashedPasscode },
                (err, results) => {
                    if (err) {
                        logger.log('error', err);
                        return res.status(400).json({ status: 'failed', message: err.message });
                    }
                    logger.log('info', results);
                    return res.status(200).json({ status: 'Success', message: results });
                }
            );
        });
    } catch (error) {
        logger.log('error', 'Something went wrong');
        return res.status(500).json({ status: 'failed', message: 'something went wrong' });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, passwords } = req.body;
        db.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, results) => {
            if (err) {
                logger.log('error', 'User does not exist');
                return res.status(404).json({ status: 'failed', message: err.message });
            }

            // Checking password
            let password = await bcrypt.compare(passwords, results[0]['passwords']);
            if (!password) {
                logger.log('error', 'Incorrect credentials');
                return res.status(404).json({ status: 'failed', message: 'password and email incorrect' });
            }
            let options = {
                email: results[0]['email']
            };

            // Creating a Token
            let token = await createToken(options);

            let data = {
                results,
                token
            };

            logger.log('info', 'User Token: ' + token);
            logger.log('info', 'User email: ' + results[0]['email']);
            logger.log('info', 'Login successful');
            return res.status(200).json({ status: 'Success', message: data });
        });
    } catch (error) {
        logger.log('error', 'Failed to Login');
        return res.status(500).json({ status: 'failed', message: 'Something went wrong' });
    }
};

export const verifyAccount = async (req, res) => {
    try {
        const { email, otp } = req.body;
        db.query('SELECT email, OTP FROM  users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                logger.log('error', err.message);
                return res.status(404).json({ status: 'Failed', message: 'Database Error' });
            }

            let verifiedOtp = await bcrypt.compare(otp, results[0]['OTP']);
            if (!verifiedOtp) {
                logger.log('error', "Bcrypt couldn't verify OTP");
                return res.status(404).json({ status: 'failed', message: 'Failed to verify by Bcrypt' });
            }
            db.query('UPDATE users SET OTP = ?, is_verified = ? WHERE email = ?', ['', 'true', email], async (err, rows) => {
                if (err) {
                    logger.log('error', err.message);
                    return res.status(404).json({ status: 'Failed', message: 'Database Error' });
                }
                logger.log('info', 'User successfully verified');
                return res.status(200).json({ status: 'succesful', message: 'User verified' });
            });
        });
    } catch (error) {
        logger.log('error', 'Something went wrong');
        return res.status(500).json({ status: 'Failed', message: 'Something went wrong' });
    }
};

export default (register, Login, verifyAccount);
