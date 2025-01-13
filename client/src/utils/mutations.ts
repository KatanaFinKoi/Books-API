import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        username
        email
        bookCount
        savedBooks {
          bookId
          title
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
        bookCount
        savedBooks {
          bookId
          title
        }
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook(
    $bookId: String!
    $authors: [String!]!
    $description: String
    $title: String!
    $image: String
    $link: String
  ) {
    saveBook(
      bookId: $bookId
      authors: $authors
      description: $description
      title: $title
      image: $image
      link: $link
    ) {
      username
      savedBooks {
        bookId
        title
      }
      bookCount
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      username
      savedBooks {
        bookId
        title
      }
      bookCount
    }
  }
`;
