import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const createToken = async (options) => {
    let token = jwt.sign(
        {
            email: options.email
        },
        process.env.SECRET,
        { expiresIn: '7d' }
    );
    return token;
};

export default createToken;
