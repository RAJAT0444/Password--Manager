const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Create Express app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/passwordsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schemas and models
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

const passwordSchema = new mongoose.Schema({
  site: String,
  username: String,
  password: String
});

const Password = mongoose.model('Password', passwordSchema);

// JWT secret key
const JWT_SECRET = 'your_secret_key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes for authentication
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: 'User created' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Routes for passwords
app.get('/passwords', authenticateToken, async (req, res) => {
  try {
    const passwords = await Password.find();
    res.json(passwords);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/passwords', authenticateToken, async (req, res) => {
  try {
    const password = new Password(req.body);
    await password.save();
    res.status(201).json(password);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put('/passwords/:id', authenticateToken, async (req, res) => {
  try {
    const password = await Password.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(password);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete('/passwords/:id', authenticateToken, async (req, res) => {
  try {
    await Password.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
