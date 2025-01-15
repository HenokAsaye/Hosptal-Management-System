import { Server } from "socket.io";
let io;
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http:localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized! Call initializeSocket first.");
  }
  return io;
};
