import { io } from "socket.io-client";
import getApiUrl from "../utils/apiUrl";

const socket = io(getApiUrl(), {
    transports: ["websocket"],
    withCredentials: true,
});

export default socket;
