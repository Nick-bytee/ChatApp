"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeChat = exports.getAllChat = void 0;
const chat_1 = __importDefault(require("../Models/chat"));
const database_1 = __importDefault(require("../utils/database"));
const getAllChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = null;
});
exports.getAllChat = getAllChat;
const storeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = database_1.default.transaction();
    const message = req.body.message;
    const user = req.user.dataValues;
    try {
        yield chat_1.default.create({
            userId: user.id,
            message: message
        });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
    }
});
exports.storeChat = storeChat;
