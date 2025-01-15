import http from "http";
import app from "./app.js";
import { connectToDb } from "./src/config/db.config.js";
import dotenv from "dotenv";
import { logger } from "./src/config/logger.env.js";
import { initializeSocket } from "./utils/socketService.js";

dotenv.config();
const server = http.createServer(app);
initializeSocket(server);

connectToDb()
  .then(() => {
    server.listen(process.env.PORT, () => {
      logger.info("Server is listening!");
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to the DB!", error);
  });
