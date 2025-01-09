import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const verifyToken = (authHeader: string | undefined): JwtPayload | null => {
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    return user;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null; 
  }
};

export const signToken = (username: string, email: string, _id: unknown): string => {
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
