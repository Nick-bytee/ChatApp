import { Sequelize } from "sequelize";

const sequelize = new Sequelize('groupchat', 'root', 'root', {host : 'localhost', dialect : 'mysql'})

export default sequelize