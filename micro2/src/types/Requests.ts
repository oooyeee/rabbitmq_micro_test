import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";
import parseString from "../util/parseString";

const Requests = z.object({
    description: z.string(),
    id: z.string(),
    status: z.enum(["created", "finished"]),
    timestamp: z.number()
}).describe("Request object schema")

const RequestsIN = Requests.pick({ description: true }).describe("RequestIN object schema, for json body parameters")
const RequestsOUT = Requests.pick({ id: true, status: true, timestamp: true }).describe("RequestOUT object schema, for outgoing json payload")

const requestsSchemas = {
    default: zodToJsonSchema(Requests, "Requests").definitions!["Requests"],
    IN: zodToJsonSchema(RequestsIN, "RequestsIN").definitions!["RequestsIN"],
    OUT: zodToJsonSchema(RequestsOUT, "RequestsOUT").definitions!["RequestsOUT"],
}


let requestsValidators = {
    IN: (str: string) => { 
        const parsed = RequestsIN.safeParse(parseString(str));
        return parsed.success === true ? parsed.data : undefined
    },
    OUT: (str: string) => { 
        const parsed = RequestsOUT.safeParse(parseString(str));
        // console.log("parsing ", str);
        
        return parsed.success === true ? parsed.data : undefined
    },
}


export {
    requestsSchemas,
    requestsValidators
}

export type Requests = z.infer<typeof Requests>
export type RequestsIN = z.infer<typeof RequestsIN>
export type RequestsOUT = z.infer<typeof RequestsOUT>
