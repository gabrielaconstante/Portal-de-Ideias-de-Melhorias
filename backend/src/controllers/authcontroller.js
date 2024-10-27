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
        'INSERT INTO usuario (nome, senha, email) VALUES (?, ?, ?)',
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
    const { email, password } = req.body;

    db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Usuário não encontrado');
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.senha);

        if (!passwordIsValid) {
            return res.status(401).send('Senha inválida');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 horas
        });

        res.status(200).send({ auth: true, token });
    });
};

// Função para criar uma publicação
exports.createPost = (req, res) => {
    const { conteudo } = req.body;
    const userId = req.userId;

    if (!conteudo) {
        return res.status(400).send('Conteúdo não pode estar vazio');
    }

    db.query(
        'INSERT INTO Publicacao (usuario_id, conteudo) VALUES (?, ?)',
        [userId, conteudo],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao criar publicação');
            }
            res.status(201).send('Publicação criada com sucesso');
        }
    );
};

// Função para curtir uma publicação
exports.likePost = (req, res) => {
    const { postId } = req.body;
    const userId = req.userId;

    db.query(
        'INSERT INTO Curtidas (post_id, user_id) VALUES (?, ?)',
        [postId, userId],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao curtir publicação');
            }
            res.status(200).send('Publicação curtida com sucesso');
        }
    );
};

// Função para comentar em uma publicação
exports.commentPost = (req, res) => {
    const { postId, conteudo } = req.body;
    const userId = req.userId;

    if (!conteudo) {
        return res.status(400).send('Comentário não pode estar vazio');
    }

    db.query(
        'INSERT INTO Comentarios (post_id, usuario_id, conteudo) VALUES (?, ?, ?)',
        [postId, userId, conteudo],
        (err, results) => {
            if (err) {
                console.error("Erro ao comentar na publicação:", err);
                return res.status(500).send('Erro ao comentar na publicação');
            }
            res.status(201).send('Comentário adicionado com sucesso');
        }
    );
};

// Função para votar em uma publicação
exports.votePost = (req, res) => {
    const { postId, peso_voto } = req.body;
    const userId = req.userId;

    db.query(
        'INSERT INTO Votos (post_id, user_id, peso_voto) VALUES (?, ?, ?)',
        [postId, userId, peso_voto],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao votar na publicação');
            }
            res.status(200).send('Voto registrado com sucesso');
        }
    );
};