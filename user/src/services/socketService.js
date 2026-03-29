//UI → socketService → socket.js → backend
import socket from "../socket/socket.js";

const joinOrderRoom = (orderId) => {
    socket.emit("joinOrderRoom", orderId);
};

const listenOrderStatus = (callback) => {
    socket.on("orderStatusUpdate", callback);
};

const listenLocation = (callback) => {
    socket.on("liveLocation", callback);
};

const sendLocation = ({ orderId, lat, lng, eta = null }) => {
    socket.emit("locationUpdate", {
        orderId,
        lat,
        lng,
        eta
    });
};

const removeSocketListeners = () => {
    socket.off("orderStatusUpdate");
    socket.off("liveLocation");
};

export {
    joinOrderRoom,
    listenOrderStatus,
    listenLocation,
    sendLocation,
    removeSocketListeners
};
