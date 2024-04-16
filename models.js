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
    defaultValue: DataTypes.NOW,
  },
});

module.exports = {
  sequelize,
  User,
};
