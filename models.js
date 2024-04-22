const { Sequelize, DataTypes } = require("sequelize");

const database = "node-mysql";
const user = "root";
const password = "";

// conexão com o banco de dados
const sequelize = new Sequelize(database, user, password, {
  dialect: "mysql",
  host: "localhost",
  port: "3306",
  define: {
    // desabilita colunas created_at e deleted_at
    timestamps: false,
  },
});

// definição do model
const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn("NOW"),
  },
});

const Task = sequelize.define("tasks", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn("NOW"),
  },
});

// associação - relacionamentos
// um usuário tem muitas tarefas
// adiciona a chave estrangeira na tabela task setando o userId
User.hasMany(Task, {
  onDelete: "NO ACTION",
  onUpdate: "NO ACTION",
});

// associação - relacionamento
// uma task pertence a um usuário
// também cria a coluna na tabela task, caso não tenha a relação anterior
Task.belongsTo(User, {
  onDelete: "NO ACTION",
  onUpdate: "NO ACTION",
});

module.exports = {
  sequelize,
  User,
  Task,
};
