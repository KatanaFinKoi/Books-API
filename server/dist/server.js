import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { resolvers } from './models/index';
import { verifyToken } from './services/auth';
dotenv.config();
const startServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    const typeDefs = `
    type Query {
      getBooks: [Book]
      getBook(id: String!): Book
    }

    type Mutation {
      addBook(title: String!, author: String!): Book
    }

    type Book {
      id: ID!
      title: String!
      author: String!
    }
  `;
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const user = verifyToken(authHeader);
            return { user };
        },
    }));
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks';
    mongoose
        .connect(dbURI)
        .then(() => console.log('MongoDB connected successfully'))
        .catch((err) => console.error('MongoDB connection error:', err));
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}/graphql`));
};
startServer();
