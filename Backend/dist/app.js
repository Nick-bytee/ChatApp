"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./utils/database"));
const app = (0, express_1.default)();
const Port = 3000;
//routes
const user_1 = __importDefault(require("./routes/user"));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/user', user_1.default);
database_1.default.sync().then(() => {
    app.listen(Port, () => {
        console.log(`Server is Running on ${Port}`);
    });
}).catch(err => console.log(err));
