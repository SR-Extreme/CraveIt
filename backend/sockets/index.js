import orderSocket from "./orderSocket.js";
import locationSocket from "./locationSocket.js";

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        orderSocket(socket);
        locationSocket(socket);

        socket.on("disconnect", () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
};

export default socketHandler;
