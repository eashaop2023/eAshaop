import { io } from "socket.io-client";
import { API_BASE_URL } from "../api-config";  // adjust path if needed

const socket = io(API_BASE_URL, {
  transports: ["websocket"],
});

export default socket;