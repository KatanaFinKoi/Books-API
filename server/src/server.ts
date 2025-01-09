import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { User, resolvers, book } from './models/index'
import { verifyToken } from './services/auth';

dotenv.config();

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: express.Request }) => {
      const authHeader = req.headers.authorization || '';
      const user = verifyToken(authHeader); 
      return { user }; 
    },
  });

  await server.start(); 

  server.applyMiddleware({ app });

  const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourDB';
  mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
};

startServer();
