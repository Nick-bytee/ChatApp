"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const chat_1 = require("../controllers/chat");
router.get('/home', chat_1.getAllChat);
exports.default = router;
