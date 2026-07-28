import { getIO } from "../config/socket.js";
import deliveryModel from "../models/deliveryModel.js";
import orderModel from "../models/orderModel.js";
import {
    calculateDistance,
    calculateETA,
    geocodeAddress,
    isValidCoords,
} from "../utils/geoUtils.js";

const getDestinationForOrder = async (orderId, delivery) => {
    if (isValidCoords(delivery?.destinationLocation?.lat, delivery?.destinationLocation?.lng)) {
        return {
            lat: delivery.destinationLocation.lat,
            lng: delivery.destinationLocation.lng,
        };
    }

    const order = await orderModel.findById(orderId).select("address");
    if (!order?.address) return null;

    const destination = await geocodeAddress(order.address);
    if (!destination) return null;

    await deliveryModel.findOneAndUpdate(
        { orderId },
        { destinationLocation: destination }
    );

    return destination;
};

const emitLocationUpdate = async (orderId, lat, lng) => {
    const roomId = String(orderId);

    if (!isValidCoords(lat, lng)) {
        console.log(`[Tracking] Ignored invalid coords for order ${roomId}`);
        return null;
    }

    try {
        let delivery = await deliveryModel.findOne({ orderId });
        let eta = null;
        let distance = null;
        let destination = null;

        if (delivery) {
            destination = await getDestinationForOrder(orderId, delivery);

            if (destination) {
                distance = Number(calculateDistance(lat, lng, destination.lat, destination.lng).toFixed(2));
                eta = calculateETA(distance);
            }

            delivery = await deliveryModel.findOneAndUpdate(
                { orderId },
                {
                    currentLocation: { lat, lng },
                    lastEta: eta,
                    lastDistance: distance,
                    lastUpdated: Date.now(),
                },
                { new: true }
            );
        }

        const payload = {
            orderId: roomId,
            lat,
            lng,
            eta,
            distance,
            destination,
            updatedAt: new Date().toISOString(),
        };

        const io = getIO();
        io.to(roomId).emit("liveLocation", payload);

        console.log(
            `[Tracking] Order ${roomId} → lat:${lat.toFixed(5)} lng:${lng.toFixed(5)}` +
                (eta != null ? ` | ETA:${eta}min | ${distance}km` : " | ETA:n/a")
        );

        return payload;
    } catch (error) {
        console.log("[Tracking] Location emit failed:", error.message);
        return null;
    }
};

const emitOrderStatusUpdate = (orderId, status) => {
    try {
        const roomId = String(orderId);
        const io = getIO();
        io.to(roomId).emit("orderStatusUpdate", { orderId: roomId, status });
        console.log(`[Tracking] Order ${roomId} status → ${status}`);
    } catch (error) {
        console.log("[Tracking] Status emit failed:", error.message);
    }
};

const getLastKnownTracking = async (orderId) => {
    const delivery = await deliveryModel.findOne({ orderId }).populate("orderId", "address status");

    if (!delivery) return null;

    const current = delivery.currentLocation;
    const hasLocation = isValidCoords(current?.lat, current?.lng);

    return {
        orderId: String(orderId),
        status: delivery.status,
        location: hasLocation ? { lat: current.lat, lng: current.lng } : null,
        destination: isValidCoords(delivery.destinationLocation?.lat, delivery.destinationLocation?.lng)
            ? {
                  lat: delivery.destinationLocation.lat,
                  lng: delivery.destinationLocation.lng,
              }
            : null,
        eta: delivery.lastEta,
        distance: delivery.lastDistance,
        address: delivery.orderId?.address || null,
        lastUpdated: delivery.lastUpdated,
    };
};

export { emitLocationUpdate, emitOrderStatusUpdate, getLastKnownTracking };
