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
exports.signUpUser = void 0;
const User_1 = __importDefault(require("../Models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../utils/database"));
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.default.transaction();
    try {
        const psk = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield User_1.default.create({
            name: req.body.name,
            email: req.body.email,
            password: psk,
        });
        console.log(user);
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
