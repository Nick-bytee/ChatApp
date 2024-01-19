import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sequelize from "./utils/database";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { socketEvents } from "./sockets/sockets";

const app = express();
const server = http.createServer(app);
const Port = 3000;

import User from "./Models/User";
import Chat from "./Models/chat";
import Group from "./Models/group";
import userGroup from "./Models/usergroup";

Chat.belongsTo(User);
User.hasMany(Chat);

User.belongsToMany(Group, { through: userGroup });
Group.belongsToMany(User, { through: userGroup });

Group.hasMany(Chat, { foreignKey: "groupId" });
Chat.belongsTo(Group, { foreignKey: "groupId" });

//routes
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";
import groupRoutes from "./routes/group";

app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);

app.use(express.static(path.join(__dirname, "public", "views")));

app.use("/", (req, res) => {
  const filePath = path.join(__dirname, `/${req.url}`);
  res.sendFile(filePath);
});

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

socketEvents(io);

sequelize
  .sync()
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server is Running on ${Port}`);
    });
  })
  .catch((err) => console.log(err));
