import { jwtDecode } from 'jwt-decode';
import { LOGIN_USER } from './mutations';

interface UserToken {
  name: string;
  exp: number;
}

// create a new class to instantiate for a user
class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) {
      console.log("No token found");
      return null;
    }
    const profile = jwtDecode<UserToken>(token);
    console.log("User Profile:", profile);
    return profile;
  }

  loggedIn() {
    const token = this.getToken();
    console.log("Token:", token);
    const isLoggedIn = !!token && !this.isTokenExpired(token);
    console.log("Is Logged In:", isLoggedIn);
    return isLoggedIn;
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      console.log("Decoded Token Expiration:", decoded.exp);
      console.log("Current Time:", Date.now() / 1000);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.log("Error decoding token:", err);
      return false;
    }
  }

  getToken() {
    // Retrieve the token from localStorage or cookies
    return localStorage.getItem('id_token');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }

  async login(email: string, password: string, apolloClient: any) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_USER,
        variables: { email, password },
      });

      if (data && data.login.token) {
        localStorage.setItem('id_token', data.login.token);
        return true;
      }

      throw new Error('Failed to log in');
    } catch (error) {
      console.error('Login Error:', error);
      throw new Error('Failed to log in');
    }
  }
};


export default new AuthService();