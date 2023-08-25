import pino from "pino";
import { isProd } from "./config";

let loggerOptions: any = {};

if (!isProd) {
    loggerOptions = {
        transport: {
            target: "pino-pretty"
        }
    }
}

const logger = pino(loggerOptions);

export default logger

export {
    loggerOptions
}