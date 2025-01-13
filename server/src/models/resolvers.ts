import User from './User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: { user: { id: any; }; }) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user.id);
    },
  },

  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error('Invalid password');

      if (!process.env.JWT_SECRET_KEY) throw new Error('JWT_SECRET is not defined');
      if (!process.env.JWT_SECRET_KEY) throw new Error('JWT_SECRET is not defined');
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
      return { token, user };
    },

    addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      if (!process.env.JWT_SECRET_KEY) throw new Error('JWT_SECRET is not defined');
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
      return { token, user };
    },

    saveBook: async (_: any, { book }: { book: any }, context: { user: { id: any } }) => {
      if (!context.user) throw new Error('Not authenticated');

      const updatedUser = await User.findByIdAndUpdate(
        context.user.id,
        { $push: { savedBooks: book } },
        { new: true }
      );

      return updatedUser;
    },

    removeBook: async (_: any, { bookId }: { bookId: string }, context: { user: { id: any } }) => {
      if (!context.user) throw new Error('Not authenticated');

      const updatedUser = await User.findByIdAndUpdate(
        context.user.id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      return updatedUser;
    },
  },
};

module.exports = resolvers;
