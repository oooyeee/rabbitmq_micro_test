import { randomUUID } from "crypto";
import { connect, type Connection, type Channel } from "amqplib"
import { pause, trycatch } from "./util";
import { rabbit_hostname, rabbit_port, rabbit_user, rabbit_password, rabbit_vhost, rabbit_exchange, rabbit_reqkey, rabbit_readableQueue } from "./config";
import emulateJob from "./worker";
import type { JobsOUT } from "./types/Jobs";
import { requestsValidators } from "./types/Requests";
import type { Logger, LoggerOptions, DestinationStream } from "pino";

class RabbitService {
    #isInitiated = false;

    #connection!: Connection;
    #channel!: Channel;
    #logger: Logger<LoggerOptions | DestinationStream> | undefined

    constructor(logger?: Logger<LoggerOptions | DestinationStream>) {
        this.#logger = logger
    }

    async init() {
        if (this.#isInitiated === true) { return; }

        let isConnectionEstablished = false;

        this.#logger && this.#logger.info("establishing connection with rmq");
        // connection checking works only for app start
        while (!isConnectionEstablished) {
            try {
                this.#connection = await connect({
                    protocol: "amqp",
                    hostname: rabbit_hostname,
                    port: rabbit_port,
                    vhost: rabbit_vhost,
                    username: rabbit_user,
                    password: rabbit_password
                });

                if (this.#connection !== undefined) {
                    isConnectionEstablished = true
                }
            } catch (err) {
                // console.log("connection error, trying to reconnect in 2s");
                this.#logger && this.#logger.info("connection error, trying to reconnect in 2s");
                await pause(2000);
            }
        }


        this.#logger && this.#logger.info("creating messaging channel with rmq");
        this.#channel = await this.#connection.createChannel();

        this.#channel.prefetch(1);

        this.#logger && this.#logger.info(`checking ${rabbit_exchange} exchange`);
        let checkW = await this.#channel.checkExchange(rabbit_exchange);
        this.#logger && this.#logger.info(`${rabbit_exchange} exchange ${checkW ? "present" : "not present"}`);
        this.#logger && this.#logger.info(`checking ${rabbit_readableQueue} queue`);
        let checkR = await this.#channel.checkQueue(rabbit_readableQueue);
        this.#logger && this.#logger.info(`${rabbit_readableQueue} queue ${checkR ? "present" : "not present"}`);

        if (checkW && checkR) {
            this.#logger && this.#logger.info("subscribing to a queue " + rabbit_readableQueue + " to read");
            this.#channel.consume(rabbit_readableQueue, async (msg) => {
                if (msg !== null) {
                    await trycatch(async () => {
                        let message = msg.content.toString();
                        // console.log("got msg: " + message);
                        this.#logger && this.#logger.info("received msg from " + rabbit_readableQueue + " :" + message);
                        let json = requestsValidators.OUT(message);
                        if (json === undefined) {
                            // console.log("got msg: json invalid");
                            this.#logger && this.#logger.info("json invalid for message: " + message)
                            // delete invalid from queue
                            this.#channel.nack(msg, undefined, false);
                            return;
                        }

                        let jobID = randomUUID();

                        let jobStartedMsg: JobsOUT = {
                            id: jobID,
                            requestId: json.id,
                            status: "created",
                            timestamp: Date.now(),
                            data: undefined
                        }

                        const isStarted = this.#channel.publish(rabbit_exchange, rabbit_reqkey, Buffer.from(JSON.stringify(jobStartedMsg)));

                        if (!isStarted) {
                            return
                        }

                        let result = await emulateJob(jobStartedMsg);
                        // console.log("finished message job: ", message);

                        const isDone = this.#channel.publish(rabbit_exchange, rabbit_reqkey, Buffer.from(JSON.stringify(result)));

                        if (isDone) {
                            this.#logger && this.#logger.info("job done: " + JSON.stringify(result));
                            this.#channel.ack(msg)
                        }
                    });
                }
            });
            this.#logger && this.#logger.info("subscired successfully to a queue " + rabbit_readableQueue);
        }
        
        this.#isInitiated = true;
    }

    close() {
        if (this.#connection !== undefined) {
            this.#logger && this.#logger.info("closing rmq connection");
            this.#connection.close();
            this.close = () => { }
        }
    }
}


export default RabbitService
