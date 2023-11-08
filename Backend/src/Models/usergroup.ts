import sequelize from "../utils/database"
import Sequelize from "sequelize"

const userGroup = sequelize.define('userGroup', {
    isAdmin : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    }
});

export default userGroup