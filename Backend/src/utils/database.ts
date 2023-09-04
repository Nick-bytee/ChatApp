import { Sequelize } from "sequelize";

const sequelize = new Sequelize('groupchat', 'root', 'Root123@#', {host : 'localhost', dialect : 'mysql'})

export default sequelize