import { trycatch, plog, pcolors, pause } from "../util";
import { connect, type Connection, type Channel } from "amqplib"
import { rabbit_hostname, rabbit_port, rabbit_user, rabbit_password, rabbit_vhost, rabbit_exchange, rabbit_reqkey, rabbit_readableQueue, isProd } from "../config";
import EventEmitter from "events";
import { JobsOUT, jobsValidators } from "../types/Jobs";
import { type Logger, type LoggerOptions, type DestinationStream, pino } from "pino";

import logger from "../logger";

class JobsEventEmitter extends EventEmitter {

    subs: Map<string, (json: JobsOUT) => void>
    constructor() {
        super();
        this.subs = new Map<string, () => void>()

        this.on("reply", (uuid: string, json: JobsOUT) => {
            let fn = this.subs.get(uuid)
            // console.log("map: ", this.subs.get(uuid));

            if (fn !== undefined) {
                fn(json);
                this.subs.delete(uuid);
            }
        })
    }

    addSub(uuid: string, action: (json: JobsOUT) => void) {
        this.subs.set(uuid, action)
    }
}

class RabbitService {
    #isInitiated = false;
    #ee: JobsEventEmitter
    #connection!: Connection;
    #channel!: Channel;

    #logger: Logger<LoggerOptions | DestinationStream> | undefined

    constructor(logger?: Logger<LoggerOptions | DestinationStream>) {
        this.#ee = new JobsEventEmitter();
        this.#logger = logger
    }

    async init() {
        if (this.#isInitiated === true) { return; }

        let isConnectionEstablished = false

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
            this.#channel.consume(rabbit_readableQueue, (msg) => {
                trycatch(() => {
                    if (msg) {
                        let message = msg.content.toString()
                        // console.log("message: ", message);
                        let json = jobsValidators.OUT(message)
                        // console.log("json: ", json);

                        if (json?.status === "finished") {
                            this.#ee.emit("reply", json.requestId, json)
                        }

                        this.#channel.ack(msg)
                    }
                });
            });
            this.#logger && this.#logger.info("subscired successfully to a queue " + rabbit_readableQueue);
        }

        this.#isInitiated = true;
    }

    async createRequest(description: string) {
        if (this.#isInitiated === false) { return; }

        const isSent = this.#channel.publish(rabbit_exchange, rabbit_reqkey, Buffer.from(description))

        return isSent
    }

    async subscribe(uuid: string, action: (json: JobsOUT) => void) {
        if (this.#connection !== undefined) {
            this.#ee.addSub(uuid, action)
        }
    }

    close() {
        if (this.#connection !== undefined) {
            this.#logger && this.#logger.info("closing rmq connection");
            this.#connection.close();
            this.close = () => { }
        }
    }
}

const rabbitService = new RabbitService(logger);

await trycatch(async () => {
    rabbitService.init();
});

export default rabbitService
