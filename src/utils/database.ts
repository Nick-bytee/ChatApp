import { Sequelize } from "sequelize";

const sequelize = new Sequelize("groupchat", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;
