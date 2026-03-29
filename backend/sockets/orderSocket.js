const orderSocket = (socket, io) => {
    socket.on("joinOrderRoom", (orderId) => {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room: ${orderId}`);
    });
};

export default orderSocket;