import { Server } from "socket.io";
import { EventEmitter } from "events";

let io;
const socketEvents = new EventEmitter();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your frontend URL
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    // Listen for the join event to associate a socket with a patient
    socket.on("join", (patientId) => {
      console.log(`Patient ${patientId} joined the room`);
      socket.join(patientId); // Join a room based on the patientId
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });

  // Emit an event after initializing Socket.IO
  socketEvents.emit("socketInitialized");
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized! Call initializeSocket first.");
  }
  return io;
};

// Export the event emitter for other modules to listen for initialization
export { socketEvents };
