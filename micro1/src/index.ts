import { isProd, service_name, service_port } from "./config";
import getApp from "./app";
import rabbitService from "./services/rabbitmq.service";
import logger from "./logger";

const all_interfaces = "0.0.0.0";
const swagger_target_host = "localhost"

let app = await getApp(swagger_target_host, service_port, service_name);

app.listen({ port: service_port, host: all_interfaces }, () => {
    console.log("started " + service_name + " server at port " + service_port)
})


function onProcessCloseHandler(sig: NodeJS.Signals) {
    // console.log(`recieved, ${sig}, terminating (requester) programm for "${service_name}" service`);
    logger.info(`recieved, ${sig}, terminating (requester) programm for "${service_name}" service`);
    app.close();
    logger.info(`recieved ${sig}, closing rabbitmq service`);
    rabbitService.close();
}

process.on("SIGTERM", onProcessCloseHandler)
process.on("SIGINT", onProcessCloseHandler)
process.on("SIGQUIT", onProcessCloseHandler)
process.on("SIGHUP", onProcessCloseHandler)