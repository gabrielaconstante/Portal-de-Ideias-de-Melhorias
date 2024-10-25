const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação
app.use('/auth', authRoutes); // Define o prefixo '/auth' para essas rotas

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});