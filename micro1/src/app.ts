import fastify from "fastify"
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import requestsRoute from "./routes/requests";
import healtCheckhRoute from "./routes/health";
import logger, { loggerOptions } from "./logger";
import cors from "@fastify/cors"
import { isProd } from "./config";

export default async function getApp(host: string, port: string | number, serviceName: string) {

    let app = fastify({
        logger: isProd ? true : loggerOptions
    });

    if (true) { // prod | dev
        await app.register(fastifySwagger, {
            swagger: {
                info: {
                    title: "Requests microservice ( " + serviceName + " ) api test",
                    description: "use routes to test",
                    version: "1.0.0",
                },
                host: [host, port].join(":"),
                schemes: ["http"],
                consumes: ["application/json"],
                produces: ["application/json"],
            },
        })

        await app.register(fastifySwaggerUi, {
            routePrefix: "/swagger",
        })
    }

    try {
        await app.register(cors, {
            origin: true
        })
        await app.register(requestsRoute);
        await app.register(healtCheckhRoute);
    } catch (err) {
        console.log(err)
    }


    app.setNotFoundHandler((req, res) => {
        res.status(404).header("Content-Type", "application/json").send({
            message: "route not found",
            error: "could not find the route: " + req.url,
            statusCode: 404
        })
    })

    return app
}