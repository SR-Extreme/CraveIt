//Controller → trackingService → Socket → Frontend
//emits outgoing socket events
import { getIO } from "../config/socket.js";

//live location update
const emitLocationUpdate = (orderId, lat, lng, eta = null) => {
    try {
        const io = getIO();

        io.to(orderId).emit("liveLocation", {
            lat, lng, eta
        });
    } catch (error) {
        console.log("Socket error (location):", error);
    }
}

export { emitLocationUpdate };