import socket from "../socket/socket.js";

const joinOrderRoom = (orderId) => {
    if (!orderId) return;
    socket.emit("joinOrderRoom", String(orderId));
};

const sendLocation = ({ orderId, lat, lng }) => {
    if (!orderId || lat == null || lng == null) return;

    socket.emit("locationUpdate", {
        orderId: String(orderId),
        lat: Number(lat),
        lng: Number(lng),
    });
};

export { joinOrderRoom, sendLocation };
