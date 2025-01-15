// import express, { Application, Request } from 'express';
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import bodyParser from 'body-parser';
// import cors from 'cors';

// import { typeDefs, resolvers } from './models/index.js';

// dotenv.config();

// interface User {
//   id: string;
//   email: string;
// }

// interface Context {
//   user?: User | null;
// }

// const getUserFromToken = (token: string): User | null => {
//   try {
//     if (token) {
//       return jwt.verify(token, process.env.JWT_SECRET_KEY || '') as User;
//     }
//     return null;
//   } catch (err) {
//     return null;
//   }
// };

// const startServer = async () => {
//   const app: Application = express();

//   const server = new ApolloServer<Context>({
//     typeDefs,
//     resolvers,
//   });

//   await server.start();

//   app.use(
//     '/graphql',
//     cors(),
//     bodyParser.json(),
//     expressMiddleware(server, {
//       context: async ({ req }: { req: Request }): Promise<Context> => {
//         const token = req.headers.authorization || '';
//         const user = getUserFromToken(token);
//         return { user };
//       },
//     })
//   );

//   // const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks';
//   // mongoose
//   //   .connect(dbURI)
//   //   .then(() => console.log('Connected to MongoDB'))
//   //   .catch((err) => console.error('MongoDB connection error:', err));

//   const PORT = process.env.PORT || 3001;

//   app.listen(PORT, () => {
//     console.log(`Server ready at http://localhost:${PORT}/graphql`);
//   });
// };

// startServer();

import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './models/index.js';
import { authenticateToken } from './services/auth.js';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

