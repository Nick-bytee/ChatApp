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
exports.socketAuthenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../Models/User"));
const socketAuthenticate = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = socket.handshake.query.token;
        console.log(token);
        if (!token) {
            throw new Error("Authentication Failed, Token Missing");
        }
        const userData = jsonwebtoken_1.default.verify(token, "secretkey");
        const user = yield User_1.default.findByPk(userData.userId);
        if (user) {
            return user;
        }
        else {
            throw new Error("User Not Found");
        }
    }
    catch (err) {
        console.log("Socket Authentication Failed", err);
        throw new Error("Socket Authentication Failed");
    }
});
exports.socketAuthenticate = socketAuthenticate;
