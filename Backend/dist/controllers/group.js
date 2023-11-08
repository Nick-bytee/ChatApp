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
exports.joinGroup = exports.updateGroupInfo = exports.addUser = exports.searchUser = exports.removeUser = exports.createAdmin = exports.getGroupInfo = exports.getGroupChat = exports.storeChat = exports.getGroups = exports.createGroup = void 0;
const User_1 = __importDefault(require("../Models/User"));
const group_1 = __importDefault(require("../Models/group"));
const uuid_1 = require("uuid");
const usergroup_1 = __importDefault(require("../Models/usergroup"));
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
        yield user.addGroup(group);
        const usergroup = yield usergroup_1.default.findOne({ where: { userId: user.id, groupId: group.id } });
        if (usergroup) {
            yield usergroup.update({ isAdmin: true });
        }
        console.log(usergroup);
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
        });
        if (!group) {
            res.status(200).json("Err Occured");
            return;
        }
        const users = yield group.getUsers({
            attributes: ["id", "name", "createdAt"],
            raw: true,
        });
        const userData = users.map((user) => ({
            id: user.id,
            name: user.name,
            isCurrentUser: req.user.id === user.id,
            isAdmin: user["userGroup.isAdmin"]
        }));
        res.status(200).json({ group, userData });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getGroupInfo = getGroupInfo;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuid = req.body.uuid;
        const userId = req.body.userId;
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid,
            },
        });
        const usergroup = yield usergroup_1.default.findOne({ where: { userId: userId, groupId: group.id } });
        if (usergroup) {
            yield usergroup.update({ isAdmin: true });
            res.status(200).json({ success: true });
        }
        else {
            throw new Error('Internal Server Error');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
});
exports.createAdmin = createAdmin;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.query.uuid;
    const userId = req.query.id;
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid
            }
        });
        if (group) {
        }
        const user = yield User_1.default.findOne({
            where: {
                id: userId
            }
        });
        if (user && group) {
            // @ts-ignore
            user.removeGroup(group);
        }
        res.status(200).json({ message: 'success' });
    }
    catch (err) {
        console.log(err);
    }
});
exports.removeUser = removeUser;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.body.uuid;
    const email = req.body.userData;
    try {
        const user = yield User_1.default.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const userData = {
                name: user.dataValues.name,
                email: user.dataValues.email
            };
            // @ts-ignore
            // await user.addGroup(group)
            res.status(200).json({ data: user });
        }
        else {
            throw new Error('User Not Found!');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});
exports.searchUser = searchUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const uuid = req.body.uuid;
    try {
        const group = yield group_1.default.findOne({
            where: {
                uuid: uuid
            }
        });
        const user = yield User_1.default.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            //@ts-ignore
            yield user.addGroup(group);
            res.status(200).json({ message: 'success' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.addUser = addUser;
const updateGroupInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield group_1.default.update({
            name: req.body.name,
            description: req.body.description
        }, {
            where: {
                uuid: req.body.uuid
            }
        });
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
