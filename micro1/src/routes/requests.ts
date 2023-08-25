import { randomUUID } from "crypto"
import { routeWrapper } from "../util"
import rabbitService from "../services/rabbitmq.service"
import { type Requests, RequestsIN, RequestsOUT, requestsSchemas } from "../types/Requests"
import { HttpInternalError, HttpInternalErrorSchema, HttpValidationErrorSchema, HttpRequestTimeoutError, HttpRequestTimeoutErrorSchema, type HttpValidationError } from "../types/httpErrorSchemas"
import { JobsOUT, jobsSchemaOUT } from "../types/Jobs"

let tasksRoute = routeWrapper((app) => {
    app.post<{ Body: RequestsIN, Reply: RequestsOUT | HttpInternalError | HttpValidationError }>(
        "/requests", {
        schema: {
            body: requestsSchemas.IN,
            response: {
                200: jobsSchemaOUT,
                400: HttpValidationErrorSchema,
                408: HttpRequestTimeoutErrorSchema,
                500: HttpInternalErrorSchema,
                503: HttpInternalErrorSchema
            }
        },
    }, async (req, res) => {
        let request: Requests = {
            description: req.body["description"],
            id: randomUUID(),
            status: "created",
            timestamp: Date.now()
        }

        req.log.info("sending request to rmq with id: " + request.id)
        let isSent = await rabbitService.createRequest(JSON.stringify(request));

        res.header('Content-Type', 'application/json');
        if (isSent) {
            res.statusCode = 200;
            // res.send(request)         
               
            return await new Promise((resolve, reject) => {
                rabbitService.subscribe(request.id, (json: JobsOUT) => {
                    resolve(json)
                });
                let timeout = setTimeout(() => {
                    let error = new HttpRequestTimeoutError("request to rmq timed out", {
                        code: "REQUEST_TIMEDOUT",
                        statusCode: 408
                    })

                    reject(error)
                    clearTimeout(timeout);
                }, 15000)
            })
        } else {
            res.statusCode = 503;
            return new HttpInternalError("failed to send request to rmq")
        }
    });

    app.setErrorHandler((err, req, res) => {
        req.log.info(err)
        res.status(err.statusCode ?? res.statusCode ?? 500).send(err as HttpInternalError);
    })
})


export default tasksRoute
