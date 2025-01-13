import { Schema, model } from 'mongoose';
// Define the Book schema
const bookSchema = new Schema({
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
}, {
    toJSON: {
        virtuals: true, // Enables virtual fields when converting documents to JSON
    },
});
// Export the Book model
const Book = model('Book', bookSchema);
export { Book };
