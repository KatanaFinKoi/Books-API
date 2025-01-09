// import { BookDocument } from './typeDefs';
import { Book } from './typeDefs';

const resolvers = {
  Query: {
    getBooks: async () => {
      try {
        return await Book.find();
      } catch (err) {
        throw new Error('Failed to fetch books');
      }
    },
    getBook: async (_: unknown, { id }: { id: string }) => {
      try {
        return await Book.findById(id);
      } catch (err) {
        throw new Error('Book not found');
      }
    },
  },
  Mutation: {
    addBook: async (_: unknown, { title, authors, description }: { title: string; authors: string[]; description: string }) => {
      try {
        const newBook = new Book({ title, authors, description });
        return await newBook.save();
      } catch (err) {
        throw new Error('Failed to add book');
      }
    },
    deleteBook: async (_: unknown, { id }: { id: string }) => {
      try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
          throw new Error('Book not found');
        }
        return deletedBook;
      } catch (err) {
        throw new Error('Failed to delete book');
      }
    },
  },
};

export default resolvers;
