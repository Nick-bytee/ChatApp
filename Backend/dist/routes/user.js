"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_1 = require("../controllers/user");
const user_2 = require("../controllers/user");
router.post('/addUser', user_1.signUpUser);
router.post('/signIn', user_2.signInUser);
exports.default = router;
