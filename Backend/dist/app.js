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
const User_1 = __importDefault(require("./Models/User"));
const chat_1 = __importDefault(require("./Models/chat"));
chat_1.default.belongsTo(User_1.default);
User_1.default.hasMany(chat_1.default);
//routes
const user_1 = __importDefault(require("./routes/user"));
const chat_2 = __importDefault(require("./routes/chat"));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/user', user_1.default);
app.use('/chat', chat_2.default);
database_1.default.sync().then(() => {
    app.listen(Port, () => {
        console.log(`Server is Running on ${Port}`);
    });
}).catch(err => console.log(err));
