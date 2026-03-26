//Any file → getIO() → emit events
import { Server } from "socket.io";
import socketHandler from "../sockets/index.js";

let io;

//initiaze socket
const initSocket = (server) => {
    io = new Server(server, { cors: { origin: "*" } }); //server=backend

    socketHandler(io);

    return io;
};

//get socket instance
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
};

export { initSocket, getIO };
