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
exports.joinGroup = exports.updateGroupInfo = exports.getGroupInfo = exports.getGroupChat = exports.storeChat = exports.getGroups = exports.createGroup = void 0;
const User_1 = __importDefault(require("../Models/User"));
const group_1 = __importDefault(require("../Models/group"));
const uuid_1 = require("uuid");
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupName, groupDescription } = req.body;
    const uuid = (0, uuid_1.v4)();
    const user = req.user;
    try {
        const group = yield group_1.default.create({
            name: groupName,
            description: groupDescription,
            uuid: uuid,
        });
        user.addGroup(group);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "An Error Occurred" });
    }
});
exports.createGroup = createGroup;
const getGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const groups = yield user.getGroups({
            attributes: ["name", "description", "uuid"],
            raw: true,
        });
        res.status(200).json({ groups: groups });
    }
    catch (err) {
        console.log(err);
        res.status(500).json("An Error Occured");
    }
});
exports.getGroups = getGroups;
const storeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.storeChat = storeChat;
const getGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.params.id;
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid,
            },
        });
        if (!group) {
            res.status(200).json("Err Occured");
            return;
        }
        const currentUser = req.user;
        const chats = (yield group.getChats({
            include: [
                {
                    model: User_1.default,
                    attributes: ["name"],
                },
            ],
            raw: true,
        }));
        const users = yield group.getUsers({
            attributes: ["id", "name", "createdAt"],
            raw: true,
        });
        const allChats = chats.map((chat) => ({
            id: chat.id,
            message: chat.message,
            username: chat["user.name"],
            time: `${new Date(chat.createdAt).getHours()}:${new Date(chat.createdAt).getMinutes()}`,
            isCurrentUser: chat.userId === currentUser.id,
        }));
        res.status(200).json({ users: users, chats: allChats, group: group });
    }
    catch (Err) {
        console.log(Err);
        res.status(500).json("Internal Server Error");
    }
});
exports.getGroupChat = getGroupChat;
const getGroupInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.params.id;
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid,
            },
            raw: true,
        });
        if (!group) {
            res.status(200).json("Err Occured");
            return;
        }
        res.status(200).json(group);
    }
    catch (err) {
        console.log(err);
    }
});
exports.getGroupInfo = getGroupInfo;
const updateGroupInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield group_1.default.update({
            name: req.body.name,
            description: req.body.description
        }, { where: {
                uuid: req.body.uuid
            } });
        res.status(200).json({ message: 'success' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.updateGroupInfo = updateGroupInfo;
const joinGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: req.body.uuid
            }
        });
        if (group) {
            const userGroup = yield user.addGroup(group);
            if (userGroup) {
                res.status(200).json({ message: 'Group Joined' });
            }
            else {
                throw new Error('Already in the Group');
            }
        }
        else {
            res.status(500).json({ message: 'Group Not Found' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});
exports.joinGroup = joinGroup;
