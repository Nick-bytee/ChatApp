import { Model, DataTypes } from "sequelize";
import  Sequelize from "sequelize";
import sequelize from "../utils/database";

class Group extends Model {
    public id!: number;
    public uuid!: string;
    public name!: string;
    public description!: string;
    getChats: any
    getUsers : any
  Users: any;
}

Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'groups',
    }
  );

export default Group