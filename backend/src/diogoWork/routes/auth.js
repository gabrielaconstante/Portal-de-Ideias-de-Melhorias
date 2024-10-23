const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../configDB/db.js');
const dotenv = require('dotenv');
dotenv.config();

// Registro
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Coloque as credenciais');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (err, results) => {
      if (err) {
        return res.status(500).send('Erro registando usuario');
      }
      res.status(201).send('Usuario registrado');
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = results[0];

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400
    });

    res.status(200).send({ auth: true, token });
  });
});

module.exports = router;