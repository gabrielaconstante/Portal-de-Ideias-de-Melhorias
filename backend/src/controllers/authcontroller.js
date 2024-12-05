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
    const { conteudo, tag } = req.body;
    const userId = req.userId;

    if (!conteudo) {
        return res.status(400).send('Conteúdo não pode estar vazio');
    }

    if (!tag) {  
        return res.status(400).send('Tag não pode estar vazia');
    }

    db.query(
        'INSERT INTO Publicacao (usuario_id, conteudo, tag) VALUES (?, ?, ?)',
        [userId, conteudo, tag],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao criar publicação');
            }
            res.status(201).send('Publicação criada com sucesso');
        }
    );
};

exports.likePost = (req, res) => {
    const { postId } = req.body;
    const userId = req.userId;

    db.query(
        'SELECT * FROM Curtidas WHERE post_id = ? AND usuario_id = ?',
        [postId, userId],
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao verificar curtida');
            }

            if (results.length > 0) {

                db.query(
                    'DELETE FROM Curtidas WHERE post_id = ? AND usuario_id = ?',
                    [postId, userId],
                    (err, results) => {
                        if (err) {
                            return res.status(500).send('Erro ao remover curtida');
                        }
                        res.status(200).send('Curtida removida');
                    }
                );
            } else {
                db.query(
                    'INSERT INTO Curtidas (post_id, usuario_id) VALUES (?, ?)',
                    [postId, userId],
                    (err, results) => {
                        if (err) {
                            return res.status(500).send('Erro ao curtir publicação');
                        }
                        res.status(200).send('Publicação curtida');
                    }
                );
            }
        }
    );
};

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
exports.showPost = (req, res) => {
    db.query(
        'SELECT p.conteudo AS conteudo, p.tag AS tag, p.id AS id, u.nome AS nome, c.conteudo AS comentario, c.data_criacao AS comentario_data, p.data_criacao AS publicacao_data, IFNULL(l.TotalCurtidas, 0) AS TotalCurtidas FROM publicacao p JOIN usuario u ON p.usuario_id = u.id LEFT JOIN comentarios c ON c.post_id = p.id LEFT JOIN (SELECT post_id, COUNT(*) AS TotalCurtidas FROM curtidas GROUP BY post_id) l ON l.post_id = p.id ORDER BY p.data_criacao DESC;',
        (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao recuperar conteúdo');
            }

            if (results.length === 0) {
                return res.status(404).send('Nenhuma publicação encontrada');
            }

            const posts = [];
            results.forEach(row => {
                let post = posts.find(p => p.id === row.id);
                if (!post) {
                    post = {
                        id: row.id,
                        conteudo: row.conteudo,
                        tag: row.tag,
                        nome: row.nome,
                        curtidas: row.TotalCurtidas,
                        comentarios: []
                    };
                    posts.push(post);
                }
                if (row.comentario) {
                    post.comentarios.push({
                        conteudo: row.comentario,
                        data_criacao: row.comentario_data
                    });
                }
            });

            res.status(200).json({
                message: 'Conteúdos recuperados com sucesso',
                conteudos: posts
            });
        }
    );
};

exports.getCommentsByPostId = (req, res) => {
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ error: 'O ID do post (postId) é obrigatório' });
    }

    db.query(
        'SELECT * FROM comentarios WHERE post_id = ? ORDER BY data_criacao DESC;',
        [postId],
        (err, results) => {
            if (err) {
                console.error('Erro ao recuperar comentários:', err);
                return res.status(500).json({ error: 'Erro ao recuperar comentários. Tente novamente mais tarde.' });
            }

            // Verificar se há resultados
            if (results.length === 0) {
                return res.status(404).json({ message: 'Nenhum comentário encontrado para este post.' });
            }

            // Enviar os comentários encontrados
            res.status(200).json({
                message: 'Comentários recuperados com sucesso.',
                comentarios: results.map(row => ({
                    id: row.id,
                    conteudo: row.conteudo,
                    dataCriacao: row.data_criacao,
                })),
            });
        }
    );
};
exports.getPublicacoesByUser = (req, res) => {
    const userId = req.userId;

    db.query('SELECT p.*, u.nome FROM publicacao p LEFT JOIN usuario u ON p.usuario_id = u.id WHERE p.usuario_id = ?  ORDER BY p.data_criacao DESC', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar publicações' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Nenhuma publicação encontrada' });
        }

        res.status(200).json({ publicacoes: results });
    });
};




