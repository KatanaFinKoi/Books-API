import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface Book {
  bookId: string; 
  authors: string[]; 
  description: string; 
  title: string; 
  image: string;
  link: string; 
}

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: Book[]; 
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number; 
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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

    savedBooks: [
      {
        bookId: { type: String, required: true },
        authors: { type: [String], required: true },
        description: { type: String },
        title: { type: String, required: true },
        image: { type: String },
        link: { type: String },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model<UserDocument>('User', userSchema);

export default User;
