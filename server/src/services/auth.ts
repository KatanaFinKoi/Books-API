import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Adjust the import based on your project structure

const app = express();
app.use(express.json());

const secret = 'your-secret-key';
const expiresIn = '1h'; // Token expiration time

// User registration endpoint
app.post('/signUp', async (req, res) => {
  const { email, password, username } = req.body;

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the hashed password
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
  });

  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate user credentials
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  } else {
    console.log('User found:', user);
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  } else {
    console.log('Password is valid');
  }

  // Generate a token
  const payload = { name: user.username, id: user._id };
  const token = jwt.sign(payload, secret, { expiresIn });

  // Send the token to the client
  return res.json({ token });
});

export default app;