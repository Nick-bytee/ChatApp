"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class ArchivedChats extends sequelize_1.Model {
}
ArchivedChats.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        unique: true,
    },
    message: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    message_type: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
}, { sequelize: database_1.default, modelName: "ArchivedMessages" });
exports.default = ArchivedChats;
