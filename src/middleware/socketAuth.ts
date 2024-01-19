import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../Models/User";

export const socketAuthenticate = async (socket: Socket) => {
  try {
    const token = socket.handshake.query.token as string;
    console.log(token);
    if (!token) {
      throw new Error("Authentication Failed, Token Missing");
    }
    const userData = jwt.verify(token, "secretkey") as any;
    const user = await User.findByPk(userData.userId);
    if (user) {
      return user;
    } else {
      throw new Error("User Not Found");
    }
  } catch (err) {
    console.log("Socket Authentication Failed", err);
    throw new Error("Socket Authentication Failed");
  }
};
