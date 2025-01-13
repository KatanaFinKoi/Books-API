import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const bookSchema = new Schema({
  authors: [String],
  description: String,
  title: String,
  bookId: String,
  image: String,
  link: String,
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema], // Embedded schema for saved books
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Virtual to calculate the number of saved books
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

userSchema.methods.isCorrectPassword = async function (password: string) {

  return bcrypt.compare(password, this.password);

};

export const User = model('User', userSchema);

module.exports = User;
