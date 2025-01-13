import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Adjust the import based on your project structure

const app = express();
app.use(express.json());

const secret = 'your-secret-key';
const expiresIn = '1h'; // Token expiration time

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate user credentials (use your own logic here)
  const user = await User.findOne({ username });
  if (!user || !(await user.isCorrectPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a token
  const payload = { name: user.username, id: user._id };
  const token = jwt.sign(payload, secret, { expiresIn });

  // Send the token to the client
  return res.json({ token });
});

export default app;