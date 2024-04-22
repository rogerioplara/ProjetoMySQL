const express = require("express");
const { Op, Sequelize } = require("sequelize");

const { User, Task, sequelize } = require("../models");

const router = express.Router();

// GET localhost:3000/users
router.get("/", async function (request, response, next) {
  try {
    const name = request.query.name;

    const where = {};
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    const users = await User.findAll({
      where,
      include: [
        {
          model: Task,
          required: false, // faz um left join, traz todos os usuários e todas as tarefas, mesmo que não tenha tarefa
        },
      ],
      order: [["id", "asc"]],
    });

    response.status(200).json(users);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao consultar os usuários");
  }
});

// GET localhost:3000/users/count
router.get("/count", async (request, response) => {
  try {
    const users = await User.findAll({
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
    });

    response.status(200).json(users);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao consultar os usuários");
  }
});

// GET localhost:3000/users/paginate?limit=10&offset=5 - limit traz 10 registros, offset pula 5 registros
router.get("/paginate", async (request, response) => {
  try {
    // converte para number (vem como string)
    const limit = Number(request.query.limit);
    const offset = Number(request.query.offset);

    const users = await User.findAndCountAll({
      // tratamento de erro para verificar se é um número finito
      limit: Number.isFinite(limit) ? limit : undefined,
      offset: Number.isFinite(offset) ? limit : undefined,
    });

    response.status(200).json(users);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao consultar os usuários");
  }
});

// GET localhost:3000/users/1
router.get("/:userId", async function (request, response, next) {
  try {
    const user = await User.findByPk(request.params.userId);
    // validação caso não encontre o usuário
    if (!user) {
      response.status(404).send("Usuário não encontrado");
      return;
    }
    response.status(200).json(user);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao buscar usuário");
  }
});

// POST localhost:3000/users
router.post("/", async (request, response) => {
  try {
    // pega o body passado
    const body = request.body;

    // cadastra uma nova tarefa para cada usuário cadastrado - tarefa padrão
    const user = await sequelize.transaction(async (transaction) => {
      // tudo que for executado nesse callback será executado nessa transação
      // cria o usuario no banco
      let user = await User.create(body, {
        transaction,
      });
      // busca novamente para corrigir o objeto que retorna
      user = await User.findByPk(user.id, {
        transaction, // parâmetro passado para que tudo seja executado dentro da transação
      });
      // criação da
      await Task.create(
        {
          title: "Terminar o Bootcamp",
          userId: user.id,
        },
        {
          transaction,
        }
      );
      // retorna o usuário criado na transação
      return user;
    });

    // retorna status 201 e o usuario criado
    response.status(201).json(user);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao criar usuário");
  }
});

/*
// PATCH localhost:3000/users/123 - pega a entidade do banco primeiro e depois faz o update
router.patch("/:userId", async (request, response) => {
  try {
    // pega o parâmetro da query
    const user = await User.findByPk(request.params.userId);
    // testa se existe
    if (!user) {
      response.status(404).send("Usuário não encontrado");
      return;
    }
    // faz o update
    await user.update(request.body);
    // retorna um status 200 e o usuario atualizado
    response.status(200).json(user);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao atualizar usuário");
  }
});
*/

// outra maneira de fazer o patch - fazendo o update direto e depois buscando no banco para retornar
router.patch("/:userId", async (request, response) => {
  try {
    const [affectedRows] = await User.update(request.body, {
      where: {
        id: request.params.userId,
      },
    });

    const user = await User.findByPk(request.params.userId);
    if (!user) {
      response.status(404).send("Usuário não encontrado");
      return;
    }

    response.status(200).send(user);
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao atualizar usuário");
  }
});

// DELETE localhost:3000/users/123
router.delete("/:userId", async (request, response) => {
  try {
    const deletedRows = await User.destroy({
      where: {
        id: request.params.userId,
      },
    });

    if (!deletedRows) {
      response.status(404).send("Usuário não encontrado");
      return;
    }

    response.status(204).send();
  } catch (err) {
    console.log(err);
    response.status(400).send("Falha ao excluir usuário");
  }
});

module.exports = router;
