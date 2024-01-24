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
exports.archiveChats = void 0;
const chat_1 = __importDefault(require("../Models/chat"));
const archivedChats_1 = __importDefault(require("../Models/archivedChats"));
const group_1 = __importDefault(require("../Models/group"));
const database_1 = __importDefault(require("./database"));
const archiveChats = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("working");
    const t = yield database_1.default.transaction();
    try {
        const chats = yield chat_1.default.findAll({
            include: {
                model: group_1.default,
            },
        });
        const archiveChats = chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            yield archivedChats_1.default.create({
                message: chat.message,
                userId: chat.userId,
                groupId: chat.groupId,
                message_type: chat.messageType,
            }, { transaction: t });
        }));
        yield chat_1.default.destroy({ truncate: true, transaction: t });
        yield t.commit();
        console.log("Archived Chats Successfully");
    }
    catch (err) {
        yield t.rollback();
        console.log("Failed to Archive Chats");
        console.error(err);
    }
});
exports.archiveChats = archiveChats;
