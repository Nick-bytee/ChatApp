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
exports.signInUser = exports.signUpUser = void 0;
const User_1 = __importDefault(require("../Models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../utils/database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.default.transaction();
    try {
        const psk = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield User_1.default.create({
            name: req.body.name,
            email: req.body.email,
            password: psk,
        });
        res.status(200).json({ success: true, message: "Registered Successfully" });
        yield t.commit();
    }
    catch (err) {
        console.log(err);
        yield t.rollback();
        if (err.name === "SequelizeUniqueConstraintError") {
            res.status(500).json({ message: "User Already Exists" });
        }
    }
});
exports.signUpUser = signUpUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = yield User_1.default.findAll({
            where: {
                email: email,
            },
        });
        if (user.length > 0) {
            const data = user[0].dataValues;
            bcrypt_1.default.compare(password, data.password, (err, result) => {
                if (result) {
                    const token = jsonwebtoken_1.default.sign({ userId: data.id, name: data.name }, 'secretkey', { expiresIn: '10h' }, function (err, token) {
                        if (!err) {
                            res.status(200).json({ success: true, token: token, message: 'Authentication Successful' });
                        }
                        else {
                            throw new Error('Internal Server Error');
                        }
                    });
                }
                else if (!result) {
                    res.status(401).json({ message: "Incorrect Password", err: 'psk' });
                }
                else {
                    throw new Error("An Error Occured");
                }
            });
        }
        else {
            res.status(404).json({ message: "User Not Found", err: 'NF' });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.signInUser = signInUser;
