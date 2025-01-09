import { Schema, model, type Document } from 'mongoose';

// Define the interface for a Book document
export interface BookDocument extends Document {
  id: string;
  title: string;
  authors: string[];
  description: string;
}

// Define the Book schema
const bookSchema = new Schema<BookDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: [String], // An array of strings
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true, // Enables virtual fields when converting documents to JSON
    },
  }
);

// Export the Book model
const Book = model<BookDocument>('Book', bookSchema);

export { Book };
