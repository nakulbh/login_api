const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'nakul',
  password: 'StrongP@ssw0rd',
  database: 'login_api',
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user data in the database
    const user = {
      username: username,
      password: hashedPassword,
    };

    // Insert the user data into the database
    connection.query('INSERT INTO user SET ?', user, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Error registering user.' });
      }
      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered successfully.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user from the database
    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({ message: 'Error finding user.' });
      }

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }

      const token = jwt.sign({ username: user.username }, config.secretKey);
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

module.exports = router;
