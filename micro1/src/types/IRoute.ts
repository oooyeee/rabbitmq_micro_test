import type { FastifyBaseLogger, FastifyInstance, FastifyTypeProvider, RawServerDefault, FastifyPluginOptions } from "fastify";
import type { IncomingMessage, ServerResponse } from "http";

type IFastifyInstance = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProvider>

type Done = (err?: Error | undefined) => void;

type cbRegistrarHandler  = (app: IFastifyInstance, _: FastifyPluginOptions, done: Done) => void


export type {
    IFastifyInstance,
    cbRegistrarHandler
}