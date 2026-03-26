//Controller → trackingService → Socket → Frontend
//emits outgoing socket events
import { getIO } from "../config/socket.js";

//emit order status update
const emitOrderStatus = (orderId, status) => {
    try {
        const io = getIO();

        io.to(orderId).emit("orderStatusUpdate", { //Users connected to the ROOM (orderId) will get the event
            orderId, status
        });
    } catch (error) {
        console.log("Socket error (status):", error);
    }
};

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

export { emitLocationUpdate, emitOrderStatus };