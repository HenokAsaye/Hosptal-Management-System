import app from "./app.js";
import { connectToDb } from "./src/config/db.config.js";
import dotenv from "dotenv";
import {logger} from "./src/config/logger.env.js"
dotenv.config();

connectToDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        logger.info(`Server is listening`)
    })
}).catch((error)=>"error while server is running",error)




