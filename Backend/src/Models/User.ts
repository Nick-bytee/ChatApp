import Sequelize from "sequelize";

import sequelize from "../utils/database"

const User = sequelize.define('user', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }, 
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    }, password : {
        type : Sequelize.STRING
    }
})

export default User