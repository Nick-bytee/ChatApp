import Sequelize  from "sequelize";
import sequelize from "../utils/database";

const Chat = sequelize.define('chats', {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement  : true
    },
    message : Sequelize.STRING
})

export default Chat