import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import logger from './winston.js';
import express from 'express';

dotenv.config();

export const sendEmail = async (options, next) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  try {
    const emailOptions = {
      from: process.env.EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.message
    }
    
    const message = await transporter.sendMail(emailOptions);
    if(!message) {
      logger.log('error', 'Could not send message');
    }
    else {
      logger.log('info', 'Message sent');
    }
    
    next();
  } catch (error) {
    logger.log('error', error.message);
  }
}


export default sendEmail;