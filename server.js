// Importa o módulo Express, que facilita a criação de servidores web.
import express, { request } from 'express';
// Importa o PrismaClient, que permite interagir com o banco de dados usando Prisma.
import { PrismaClient } from '@prisma/client';

// Cria uma instância do PrismaClient, que será usada para fazer operações no banco de dados.
const prisma = new PrismaClient();

// Cria uma instância do aplicativo Express.
const app = express();

// Middleware do Express que permite que o servidor interprete o corpo das requisições como JSON.
app.use(express.json());

// Rota que lida com requisições POST para criar um novo usuário.
app.post('/usuarios', async (req, res) => {
    // Utiliza o Prisma para criar um novo registro na tabela "user" no banco de dados.
    await prisma.user.create({
        data: {
            email: req.body.email,  // Captura o e-mail enviado no corpo da requisição.
            name: req.body.name,     // Captura o nome enviado no corpo da requisição.
            age: req.body.age        // Captura a idade enviada no corpo da requisição.
        }
    });
    // Retorna uma resposta com o status 201 (Criado) e os dados do usuário criado.
    res.status(201).json(req.body);
});

// Rota que lida com requisições GET para obter usuários.
app.get('/usuarios', async (req, res) => {
    let users = []; // Inicializa um array vazio para armazenar usuários.

    // Verifica se há parâmetros de consulta (query params) na requisição.
    if (req.query) {
        // Se houver, busca usuários no banco de dados que correspondem aos critérios fornecidos.
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,   // Filtra os usuários pelo nome, se fornecido.
                email: req.query.email, // Filtra os usuários pelo e-mail, se fornecido.
                age: req.query.age      // Filtra os usuários pela idade, se fornecido.
            }
        });
    } else {
        // Se não houver parâmetros de consulta, busca todos os usuários na tabela.
        users = await prisma.user.findMany();
    }

    // Retorna uma resposta com o status 200 (OK) e a lista de usuários encontrados.
    res.status(200).json(users);
});

// Rota que lida com requisições PUT para atualizar um usuário existente.
app.put('/usuarios/:id', async (req, res) => {
    // Atualiza um registro de usuário no banco de dados com base no ID fornecido na URL.
    await prisma.user.update({
        where: {
            id: req.params.id // Captura o ID do usuário a ser atualizado a partir da URL.
        },
        data: {
            email: req.body.email, // Atualiza o e-mail com o novo valor enviado no corpo da requisição.
            name: req.body.name,   // Atualiza o nome com o novo valor enviado no corpo da requisição.
            age: req.body.age      // Atualiza a idade com o novo valor enviado no corpo da requisição.
        }
    });
    // Retorna uma resposta com o status 201 (Criado) e os dados atualizados do usuário.
    res.status(201).json(req.body);
});

// Rota que lida com requisições DELETE para remover um usuário.
app.delete('/usuarios/:id', async (req, res) => {
    // Deleta o registro de um usuário no banco de dados com base no ID fornecido na URL.
    await prisma.user.delete({
        where: {
            id: req.params.id // Captura o ID do usuário a ser deletado a partir da URL.
        }
    });

    // Retorna uma resposta com o status 200 (OK) e uma mensagem de confirmação.
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

// Inicia o servidor na porta 3000, aguardando requisições.
app.listen(3000);
