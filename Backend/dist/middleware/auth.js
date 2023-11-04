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
exports.authenticate = void 0;
const User_1 = __importDefault(require("../Models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.header('Authenticate');
            if (!token) {
                console.log('Token Not Available');
                return res.status(401).json({ message: 'Unauthorized' });
            }
            let user;
            user = jsonwebtoken_1.default.verify(token, 'secretkey');
            if (typeof user === 'object' && user.userId) {
                const userData = yield User_1.default.findByPk(user.userId);
                if (userData) {
                    req.user = userData;
                    return next();
                }
                else {
                    return res.status(404).json({ message: 'User not found' });
                }
            }
            else {
                throw new Error('Internal Server Error');
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
}
exports.authenticate = authenticate;
exports.default = authenticate;
