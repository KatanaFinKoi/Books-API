// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';

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
    return !!token && !this.isTokenExpired(token);
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
}

export default new AuthService();