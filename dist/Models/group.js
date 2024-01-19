"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../utils/database"));
class Group extends sequelize_1.Model {
}
Group.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    uuid: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.STRING,
}, {
    sequelize: database_1.default,
    modelName: 'groups',
});
exports.default = Group;
