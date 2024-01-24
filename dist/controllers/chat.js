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
exports.storeFile = exports.storeChat = exports.getAllChat = void 0;
const database_1 = __importDefault(require("../utils/database"));
const chat_1 = __importDefault(require("../Models/chat"));
const User_1 = __importDefault(require("../Models/User"));
const sequelize_1 = __importDefault(require("sequelize"));
const group_1 = __importDefault(require("../Models/group"));
const storage_blob_1 = require("@azure/storage-blob");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const latestChatId = req.header("id") || 0;
    try {
        const userChats = (yield chat_1.default.findAll({
            where: {
                id: { [sequelize_1.default.Op.gt]: latestChatId },
            },
            include: [
                {
                    model: User_1.default,
                    attributes: ["name"],
                },
            ],
            raw: true,
        }));
        const allChats = userChats.map((chat) => ({
            id: chat.id,
            message: chat.message,
            messageType: chat.messageType,
            username: chat["user.name"],
            time: `${new Date(chat.createdAt).getHours()}:${new Date(chat.createdAt).getMinutes()}`,
            isCurrentUser: chat.userId === currentUserId,
            currentUserName: req.user.name,
        }));
        console.log(allChats);
        res.status(200).json({ chats: allChats });
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ message: "Interal Server Error" });
    }
});
exports.getAllChat = getAllChat;
const storeChat = (obj, socketUser) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.default.transaction();
    const message = obj.message;
    const uuid = obj.id;
    const user = socketUser;
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid,
            },
            raw: true,
        });
        if (group) {
            const chat = yield chat_1.default.create({
                message: message,
                userId: user.id,
                groupId: group.id,
                messageType: obj.messageType,
            }, { transaction: t });
            yield t.commit();
            return chat.dataValues;
        }
    }
    catch (err) {
        console.log(err);
        yield t.rollback();
    }
});
exports.storeChat = storeChat;
const storeFile = (obj, socketUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("working");
    const t = yield database_1.default.transaction();
    const file = obj.file;
    const uuid = obj.id;
    const user = socketUser;
    const fileUrl = yield uploadFileToAzure(file, obj.fileName);
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid,
            },
            raw: true,
        });
        if (group) {
            const chat = yield chat_1.default.create({
                message: fileUrl,
                userId: user.id,
                groupId: group.id,
                messageType: obj.messageType,
            }, { transaction: t });
            yield t.commit();
            console.log(chat.dataValues);
            return chat.dataValues;
        }
    }
    catch (err) {
        console.error(err);
    }
});
exports.storeFile = storeFile;
function uploadFileToAzure(file, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Storing In Progress");
        const accountName = process.env.ACCOUNT_NAME;
        const sasToken = process.env.SAS_TOKEN;
        const containerName = process.env.CONTAINER_NAME;
        try {
            const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlockBlobClient(fileName);
            yield blobClient.uploadData(file);
            return blobClient.url;
        }
        catch (error) {
            console.error("Error uploading file", error);
            console.log("Failed to upload file");
        }
    });
}
