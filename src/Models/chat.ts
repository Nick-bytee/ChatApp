import Sequelize, { Model, Optional } from "sequelize";
import sequelize from "../utils/database";

interface ChatsAttributes {
  id: number;
  message: string;
  messageType: string;
  groupId: number;
  userId: number;
}

interface ChatsCreationAttributes extends Optional<ChatsAttributes, "id"> {}

class Chats
  extends Model<ChatsAttributes, ChatsCreationAttributes>
  implements ChatsAttributes
{
  public id!: number;
  public message!: string;
  public messageType!: string;
  groupId!: number;
  userId!: number;
}

Chats.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    message: Sequelize.STRING,
    messageType: Sequelize.STRING,
    groupId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
  },
  { sequelize, modelName: "chats" }
);

export default Chats;
