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
const database_1 = __importDefault(require("../utils/database"));
const chat_1 = __importDefault(require("../Models/chat"));
const User_1 = __importDefault(require("../Models/User"));
const sequelize_1 = __importDefault(require("sequelize"));
const group_1 = __importDefault(require("../Models/group"));
const getAllChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const latestChatId = req.header('id') || 0;
    try {
        const userChats = yield chat_1.default.findAll({
            where: {
                id: { [sequelize_1.default.Op.gt]: latestChatId }
            },
            include: [{
                    model: User_1.default,
                    attributes: ['name'],
                }],
            raw: true,
        });
        const allChats = userChats.map(chat => ({
            id: chat.id,
            message: chat.message,
            username: chat['user.name'],
            time: `${new Date(chat.createdAt).getHours()}:${new Date(chat.createdAt).getMinutes()}`,
            isCurrentUser: chat.userId === currentUserId
        }));
        res.status(200).json({ chats: allChats });
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Interal Server Error' });
    }
});
exports.getAllChat = getAllChat;
const storeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = database_1.default.transaction();
    const message = req.body.message;
    const uuid = req.body.id;
    const user = req.user;
    try {
        const group = yield group_1.default.findOne({ where: {
                uuid: uuid
            }, raw: true });
        if (group) {
            const chat = yield chat_1.default.create({
                message: message,
                userId: user.id,
                groupId: group.id
            });
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
    }
});
exports.storeChat = storeChat;
