import {createLogger,transports,format} from "winston";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const file_name = fileURLToPath(import.meta.url)
const __dirname = path.dirname(file_name)
const logDirectory = path.join(__dirname,"log")
if(!fs.existsSync(logDirectory)){
    fs.mkdir(logDirectory)
}
export const logger = createLogger({
    level:'info',
    format:format.combine(
        format.timeStamp('YY:MM:DD  HH:MM:SS'),
        format.json()
    ),
    transports:[
        new transports.File({filename:path.join(logDirectory,'access.log'),level:'info'}),
        new transports.File({filename:path.join(logDirectory,'custom.log'),level:'warn'}),
        new transports.File({filename:path.join(logDirectory,'error.log'),level:'error'}),
        new transports.File({filename:path.join(logDirectory,'combine.log')})
    ]
})
if(process.env.NODE_ENVIROMENT !== 'production'){
    logger.add(
        new transports.console({
            format:format.combine(format.simple(),format.colorize)
        }
    )
    )
}