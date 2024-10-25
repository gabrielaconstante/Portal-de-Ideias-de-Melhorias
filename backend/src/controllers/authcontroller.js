const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../configDB/db.js');
const dotenv = require('dotenv');
dotenv.config();

// Função para registro de usuário
exports.register = (req, res) => {
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
                return res.status(500).send('Erro ao registrar usuário');
            }
            res.status(201).send('Usuário registrado com sucesso');
        }
    );
};

// Função para login de usuário
exports.login = (req, res) => {
    const { username, password } = req.body;

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
};