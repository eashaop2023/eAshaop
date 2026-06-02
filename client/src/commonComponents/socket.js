// ✅ frontend/src/commonComponents/socket.js
import { io } from "socket.io-client";

if (!window.socketInstance) {
  const socket = io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  // 🔁 Reconnect & rejoin room on every connect event
  const joinRoom = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      socket.emit("joinUser", user.id);
      console.log("🔗 Joined user room:", user.id);
    }
  };

  socket.on("connect", joinRoom);
  socket.on("reconnect", joinRoom);

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  window.socketInstance = socket;
}

export default window.socketInstance;
