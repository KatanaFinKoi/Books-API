import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';

import typeDefs from './models/typeDefs';
import resolvers from './models/resolvers';

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: any }) => {
        const token = req.headers.authorization || '';
        return { token };
    }
});

server.applyMiddleware({ app });

mongoose.connect('mongodb://localhost:27017/yourDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
