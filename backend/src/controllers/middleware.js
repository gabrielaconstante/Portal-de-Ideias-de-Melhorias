const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Token não encontrado');
    }

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) {
            return res.status(403).send('Token inválido');
        }
        req.userId = user.id;
        next();
    });
};

module.exports = authenticateToken;