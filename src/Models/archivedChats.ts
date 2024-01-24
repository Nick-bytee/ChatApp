import { Model, Optional, DataTypes } from "sequelize";
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
      type: DataTypes.UUID,
      unique: true,
    },
    message: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    message_type: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  },
  { sequelize, modelName: "ArchivedMessages" }
);

export default ArchivedChats;
