import orderSocket from "./orderSocket.js";
import locationSocket from "./locationSocket.js";

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("Client Connected:(backend)", socket.id);

        orderSocket(socket, io);
        locationSocket(socket, io);

        socket.on("disconnect", () => {
            console.log("Client disconnected:(backend)", socket.id);
        });
    });
};

export default socketHandler;