//Any file → getIO() → emit events
import { Server } from "socket.io";
import socketHandler from "../sockets/index.js";

let io;

//initiaze socket
const initSocket = (server, allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]) => {
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

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
