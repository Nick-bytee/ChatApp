"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(socket);
    });
    io.on("sendMessage", (object) => {
        console.log(object);
    });
};
