"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const chat_1 = require("../controllers/chat");
const chat_2 = require("../controllers/chat");
const auth_1 = __importDefault(require("../middleware/auth"));
router.get('/home', auth_1.default, chat_1.getAllChat);
router.post('/sendChat', auth_1.default, chat_2.storeChat);
exports.default = router;
