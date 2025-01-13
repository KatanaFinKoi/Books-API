import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';
    try {
        const user = jwt.verify(token, secretKey);
        return user;
    }
    catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
export const context = ({ req }) => {
    const authHeader = req.headers.authorization || null;
    if (!authHeader) {
        return { user: null };
    }
    const user = verifyToken(authHeader);
    return { user };
};
