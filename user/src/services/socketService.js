import socket from "../socket/socket.js";

const joinOrderRoom = (orderId) => {
    if (!orderId) return;
    socket.emit("joinOrderRoom", String(orderId));
};

const listenOrderStatus = (callback) => {
    socket.off("orderStatusUpdate");
    socket.on("orderStatusUpdate", callback);
};

const listenLocation = (callback) => {
    socket.off("liveLocation");
    socket.on("liveLocation", callback);
};

const listenDeliveryOtp = (callback) => {
    socket.off("deliveryOtp");
    socket.on("deliveryOtp", callback);
};

const removeSocketListeners = () => {
    socket.off("orderStatusUpdate");
    socket.off("liveLocation");
    socket.off("deliveryOtp");
};

export {
    joinOrderRoom,
    listenOrderStatus,
    listenLocation,
    listenDeliveryOtp,
    removeSocketListeners,
};
