import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();

interface JwtPayload {
  exp: number;
  _id: string;
  username: string;
  email: string;
}

export const verifyToken = (authHeader: string | undefined): JwtPayload | null => {
  if (!authHeader) {
    console.error('Authorization header is missing.');
    return null;
  }

  const token = authHeader.split(' ')[1]; 

  if (!token) {
    console.error('Token is missing.');
    return null;
  }

  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.error('Token has expired.');
      return null;
    }

    return decoded;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null; 
  }
};

export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); 
};

export const context = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization || null;

  if (!authHeader) {
    return { user: null };
  }

  const user = verifyToken(authHeader);

  return { user };
};
