"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../utils/database"));
const User = database_1.default.define('user', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: sequelize_1.default.STRING,
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true
    }, password: {
        type: sequelize_1.default.STRING
    }
});
exports.default = User;
