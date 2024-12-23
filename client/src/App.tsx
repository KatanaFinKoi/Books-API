import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Navbar from './components/Navbar';

function App() {
  return (
    <apolloProvider client = {client}>
      <Navbar />
      <Outlet />
    <apolloProvider/>
  );
}

export default App;
