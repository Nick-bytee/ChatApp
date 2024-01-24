import { Model, Optional, DataTypes } from "sequelize";
import Sequelize from "sequelize";
import sequelize from "../utils/database";

interface ArchivedChatsAttributes {
  id: number;
  message: string;
  message_type: string;
}

interface ArchivedChatCreationAttributes
  extends Optional<ArchivedChatsAttributes, "id"> {
  userId: number;
  groupId: number;
}

class ArchivedChats
  extends Model<ArchivedChatsAttributes, ArchivedChatCreationAttributes>
  implements ArchivedChatsAttributes
{
  public id!: number;
  public senderId!: number;
  public groupId!: number;
  public message!: string;
  public message_type!: string;
}

ArchivedChats.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      unique: true,
    },
    message: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    message_type: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  },
  { sequelize, modelName: "ArchivedMessages" }
);

export default ArchivedChats;
