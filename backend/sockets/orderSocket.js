import { emitOrderStatus } from "../services/trackingService.js";

const orderSocket = (socket, io) => {
    socket.on("joinOrderRoom", (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room: ${orderId}`);
    });

    //Optional
    socket.on("orderStatusUpdate", ({ orderId, status }) => {
        emitOrderStatus(orderId, status);
    });
};

export default orderSocket;