import { type FastifyError, type ValidationResult } from "fastify";
import { SchemaErrorDataVar } from "fastify/types/schema";
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";


const zHttpValidationError = z.object({
    code: z.string(),
    name: z.string(),
    message: z.string(),
    cause: z.any().optional(),
    // stack: z.string().optional(),
    statusCode: z.number().optional(),
    validation: z.any().optional(),
    validationContext: z.any().optional(),
}).describe("HTTP Validation Error object schema")

const zHttpRequestTimeoutError = zHttpValidationError.pick({
    code: true, statusCode: true, message: true, name: true
}).describe("HTTP Timeout Error object schema")

const zHttpInternalError = z.object({
    message: z.string(),
    name: z.string(),
    cause: z.unknown().optional(),
    stack: z.string().optional()
}).describe("HTTP Internal Error object schema")

const HttpValidationErrorSchema = zodToJsonSchema(zHttpValidationError, "HttpValidationError").definitions!["HttpValidationError"];
const HttpInternalErrorSchema = zodToJsonSchema(zHttpInternalError, "HttpInternalError").definitions!["HttpInternalError"];
const HttpRequestTimeoutErrorSchema = zodToJsonSchema(zHttpRequestTimeoutError, "HttpInternalError").definitions!["HttpInternalError"];

class HttpInternalError extends Error implements z.infer<typeof zHttpInternalError> {
    constructor(...args: Parameters<typeof Error>) {
        super(...args)
        this.name = this.constructor.name
    }
}

class HttpRequestTimeoutError extends Error implements z.infer<typeof zHttpRequestTimeoutError> {
    code;
    statusCode;
    constructor(message: string, opts: {cause?: string } & Omit<z.infer<typeof zHttpRequestTimeoutError>, "message" | "name" >) {
        super(message, opts)
        this.name = this.constructor.name
        this.code = opts.code
        this.statusCode = opts.statusCode
    }
}

type HttpValidationError = FastifyError & z.infer<typeof zHttpValidationError>;

export type {
    HttpValidationError
}

export {
    HttpInternalError,
    HttpRequestTimeoutError,
    HttpRequestTimeoutErrorSchema,
    HttpValidationErrorSchema,
    HttpInternalErrorSchema
}