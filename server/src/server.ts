import express, { Application, Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';

import { typeDefs, resolvers } from './models/index';

dotenv.config();

interface User {
  id: string;
  email: string;
}

interface Context {
  user?: User | null;
}

const getUserFromToken = (token: string): User | null => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET_KEY || '') as User;
    }
    return null;
  } catch (err) {
    return null;
  }
};

const startServer = async () => {
  const app: Application = express();

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<Context> => {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token);
        return { user };
      },
    })
  );

  const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks';
  mongoose
    .connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();
