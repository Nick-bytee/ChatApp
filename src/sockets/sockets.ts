import { Socket, Server } from "socket.io";
import { storeChat, storeFile } from "../controllers/chat";
import { socketAuthenticate } from "../middleware/socketAuth";

export const socketEvents = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    console.log("user connected");
    try {
      const user: any = await socketAuthenticate(socket);

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("sendMessage", async (message) => {
        const chat: any = await storeChat(message, user);
        message.username = user.name;
        const updatedAt = new Date(chat.createdAt);
        message.time = `${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
        io.emit("newMessage", message);
      });

      socket.on("sendFile", async (obj) => {
        console.log("working socket function");
        const chat: any = await storeFile(obj, user);
        obj.username = user.name;
        const updatedAt = new Date(chat.createdAt);
        obj.time = `${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
        obj.message = chat.message;
        console.log(chat);
        return io.emit("newMessage", obj);
      });
    } catch (err) {
      console.log(err);
    }
  });

  // io.on("sendMessage", (object: object) => {
  //   storeChat(object, "a");
  // });
};
