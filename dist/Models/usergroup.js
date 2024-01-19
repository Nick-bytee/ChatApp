"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = __importDefault(require("sequelize"));
const userGroup = database_1.default.define('userGroup', {
    isAdmin: {
        type: sequelize_1.default.BOOLEAN,
        defaultValue: false
    }
});
exports.default = userGroup;
