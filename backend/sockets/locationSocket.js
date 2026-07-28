import { emitLocationUpdate } from "../services/trackingService.js";

const locationSocket = (socket) => {
    socket.on("locationUpdate", async (payload = {}) => {
        const { orderId, lat, lng } = payload;

        if (!orderId || lat == null || lng == null) {
            console.log(`[Socket] Bad locationUpdate from ${socket.id}`);
            return;
        }

        await emitLocationUpdate(orderId, Number(lat), Number(lng));
    });
};

export default locationSocket;
