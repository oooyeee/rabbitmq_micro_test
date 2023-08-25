import pino from "pino";
import { service_name, service_port, isProd } from "./config";

import RabbitService from "./rabbit.service";
import { trycatch } from "./util";
import logger from "./logger";

let rabbitService = new RabbitService(logger);

console.log("starting " + service_name + " service");

await trycatch(async () => {
    await rabbitService.init();
})

function onProcessCloseHandler(sig: NodeJS.Signals) {
    // console.log(`recieved, ${sig}, terminating (tasker) programm for "${service_name}" service`);
    logger.info(`recieved, ${sig}, terminating (tasker) programm for "${service_name}" service`);
    rabbitService.close();
}

process.on("SIGTERM", onProcessCloseHandler)
process.on("SIGINT", onProcessCloseHandler)
process.on("SIGQUIT", onProcessCloseHandler)
process.on("SIGHUP", onProcessCloseHandler)