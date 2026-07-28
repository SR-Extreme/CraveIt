import { getLastKnownTracking } from "../services/trackingService.js";
import { isValidCoords } from "../utils/geoUtils.js";

const orderSocket = (socket) => {
    socket.on("joinOrderRoom", async (orderId) => {
        if (!orderId) return;

        const roomId = String(orderId);
        socket.join(roomId);
        console.log(`[Socket] ${socket.id} joined order ${roomId}`);

        // Send last saved agent location so refresh doesn't lose the marker
        try {
            const tracking = await getLastKnownTracking(orderId);
            if (tracking?.location && isValidCoords(tracking.location.lat, tracking.location.lng)) {
                socket.emit("liveLocation", {
                    orderId: roomId,
                    lat: tracking.location.lat,
                    lng: tracking.location.lng,
                    eta: tracking.eta,
                    distance: tracking.distance,
                    destination: tracking.destination,
                    updatedAt: tracking.lastUpdated,
                });
            }

            if (tracking?.status) {
                socket.emit("orderStatusUpdate", {
                    orderId: roomId,
                    status: tracking.status,
                });
            }
        } catch (error) {
            console.log(`[Socket] Failed to send snapshot for ${roomId}:`, error.message);
        }
    });
};

export default orderSocket;
