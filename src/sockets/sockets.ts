import { Socket, Server } from "socket.io";
import { storeChat } from "../controllers/chat";
import { socketAuthenticate } from "../middleware/socketAuth";

export const socketEvents = (io: Server) => {
  io.on("connection", async (socket: Socket) => {
    try {
      const user: any = await socketAuthenticate(socket);

      socket.on("sendMessage", async (message) => {
        const chat: any = await storeChat(message, user);
        message.username = user.name;
        const updatedAt = new Date(chat.createdAt);
        message.time = `${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
        io.emit("newMessage", message);
      });
    } catch (err) {
      console.log(err);
    }
  });

  // io.on("sendMessage", (object: object) => {
  //   storeChat(object, "a");
  // });
};
