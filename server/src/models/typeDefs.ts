
import { gql } from 'apollo-server';

const Book = gql`
  type Book {
    id: ID,
    title: String,
    authors: [String],
    description: String
  }

  type Query {
    getBooks: [Book]
    getBook(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, authors: [String]!, description: String!): Book
    deleteBook(id: ID!): Book
  }`;

export default Book;