const express = require("express");
const mysql = require("mysql2");

const router = express.Router();

// conexão com o banco de dados cru
const connection = mysql.createConnection({
  database: "node-mysql",
  host: "localhost",
  user: "root",
  password: "",
});

// localhost:3000/users
router.get("/", function (request, response, next) {
  connection.query("select * from users", (err, result, field) => {
    // callback
    if (err) {
      console.log(err);
      response.status(400).send("Erro ao se conectar com o BD");
      return;
    }

    response.status(200).json(result);
  });
});

router.get("/:userId", function (request, response, next) {
  // função assíncrona
  connection.query(
    "select * from users u where u.id = ?",
    [request.params.userId],
    (err, result, field) => {
      // callback
      if (err) {
        console.log(err);
        response.status(400).send("Erro ao se conectar com o BD");
        return;
      }

      if (!result.length) {
        response.status(404).send("Usuário não encontrado");
        return;
      }

      response.status(200).json(result[0]);
    }
  );
});

module.exports = router;
