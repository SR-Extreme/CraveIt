//listens incoming socket events
import { emitLocationUpdate } from "../services/trackingService.js";

const locationSocket = (socket, io) => {
    socket.on("locationUpdate", ({ orderId, lat, lng, eta = null }) => {
        console.log(`Location update for order ${orderId}:`, lat, lng);

        emitLocationUpdate(orderId, lat, lng, eta);
    });
};

export default locationSocket;