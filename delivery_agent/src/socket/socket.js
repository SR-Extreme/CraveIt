import { io } from "socket.io-client";
import { StoreContext } from "../context/StoreContext";
import { useContext } from "react";

const socket = io("http://localhost:4000", {
    transports: ["websocket"],
});

export default socket;