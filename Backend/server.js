import app from "./app.js";
import { connectToDb } from "./src/config/db.config.js";
import dotenv from "dotenv";
import {logger} from "./src/config/logger.env.js"
dotenv.config();
connectToDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        logger.info("server is listening!")
    })
}).catch(error=>logger.error("failed to connect to the Db!",error))

