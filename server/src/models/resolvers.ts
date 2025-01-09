import { gql } from 'apollo-server';
// const books = [];

const resolvers = gql`
    Query: {
        getBooks: () => books,
        getBook: (_, { id }) => books.find(book => book.id === id),
    },
    Mutation: {
        addBook: (_, { title, authors, description }) => {
            const newBook = { id: `${books.length + 1}`, title, authors, description };
            books.push(newBook);
            return newBook;
        },
        deleteBook: (_, { id }) => {
            const index = books.findIndex(book => book.id === id);
            return books.splice(index, 1)[0];
        }
    }`;

export default resolvers;
