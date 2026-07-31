import { io } from "socket.io-client";
import getApiUrl from "../utils/apiUrl";

const SOCKET_URL = getApiUrl();

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
});

export default socket;