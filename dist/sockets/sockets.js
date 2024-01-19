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
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketEvents = void 0;
const chat_1 = require("../controllers/chat");
const socketAuth_1 = require("../middleware/socketAuth");
const socketEvents = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield (0, socketAuth_1.socketAuthenticate)(socket);
            socket.on("sendMessage", (message) => __awaiter(void 0, void 0, void 0, function* () {
                const chat = yield (0, chat_1.storeChat)(message, user);
                message.username = user.name;
                const updatedAt = new Date(chat.createdAt);
                message.time = `${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
                io.emit("newMessage", message);
            }));
        }
        catch (err) {
            console.log(err);
        }
    }));
    // io.on("sendMessage", (object: object) => {
    //   storeChat(object, "a");
    // });
};
exports.socketEvents = socketEvents;
