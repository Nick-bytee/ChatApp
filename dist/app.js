"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./utils/database"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const sockets_1 = require("./sockets/sockets");
const cron_1 = require("cron");
const dotenv_1 = __importDefault(require("dotenv"));
const chronJob_1 = require("./utils/chronJob");
const admin_ui_1 = require("@socket.io/admin-ui");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const Port = 3000;
const User_1 = __importDefault(require("./Models/User"));
const chat_1 = __importDefault(require("./Models/chat"));
const group_1 = __importDefault(require("./Models/group"));
const usergroup_1 = __importDefault(require("./Models/usergroup"));
const archivedChats_1 = __importDefault(require("./Models/archivedChats"));
chat_1.default.belongsTo(User_1.default);
User_1.default.hasMany(chat_1.default);
User_1.default.belongsToMany(group_1.default, { through: usergroup_1.default });
group_1.default.belongsToMany(User_1.default, { through: usergroup_1.default });
group_1.default.hasMany(chat_1.default, { foreignKey: "groupId" });
chat_1.default.belongsTo(group_1.default, { foreignKey: "groupId" });
User_1.default.hasMany(archivedChats_1.default);
archivedChats_1.default.belongsTo(User_1.default);
group_1.default.hasMany(archivedChats_1.default);
archivedChats_1.default.belongsTo(User_1.default);
//routes
const user_1 = __importDefault(require("./routes/user"));
const chat_2 = __importDefault(require("./routes/chat"));
const group_2 = __importDefault(require("./routes/group"));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use("/user", user_1.default);
app.use("/chat", chat_2.default);
app.use("/group", group_2.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "public", "views")));
app.use("/", (req, res) => {
    const filePath = path_1.default.join(__dirname, `/${req.url}`);
    res.sendFile(filePath);
});
// console.log(process.env.BOX_CLIENT_ID);
const io = new socket_io_1.Server(server, {
    cors: {
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});
(0, admin_ui_1.instrument)(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "password",
    },
});
(0, sockets_1.socketEvents)(io);
database_1.default
    .sync({ force: false })
    .then(() => {
    server.listen(Port, () => {
        console.log(`Server is Running on ${Port}`);
    });
})
    .catch((err) => console.log(err));
const job = new cron_1.CronJob("59 59 23 * * *", chronJob_1.archiveChats, null, true, "UTC");
