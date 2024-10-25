const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../configDB/db.js');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());  // Permite interpretar JSON no body das requisições

const loginRouter = require('./routes/auth/routes');  // Ajuste o caminho conforme seu projeto
app.use('/', loginRouter);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// Registro
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send('Coloque as credenciais');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email],
    (err, results) => {
      if (err) {
        return res.status(500).send('Erro registando usuario');
      }
      res.status(201).send('Usuario registrado com sucesso');
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body; // Aqui, username é o email

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err || results.length === 0) {
          return res.status(400).send('Usuário não encontrado');
      }

      const user = results[0];

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
          return res.status(401).send('Senha inválida');
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 86400 // 24 horas
      });

      res.status(200).send({ auth: true, token });
  });

  module.exports = router;

});

module.exports = router;
