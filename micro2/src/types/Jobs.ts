import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";
import parseString from "../util/parseString";

const Jobs = z.object({
    id: z.string(),
    status: z.enum(["created", "finished"]),
    requestId: z.string(),
    data: z.string().optional(),
    timestamp: z.number(),
}).describe("Jobs object schema")

const JobsIN = Jobs.pick({ requestId: true }).describe("JobsIN object schema, for url parameter")
const JobsOUT = Jobs.describe("JobsOUT object schema, for outgoing json payload")

let jobsSchema = zodToJsonSchema(Jobs, "Jobs").definitions!["Jobs"];
let jobsSchemaIN = zodToJsonSchema(JobsIN, "JobsIN").definitions!["JobsIN"];
let jobsSchemaOUT = zodToJsonSchema(JobsOUT, "JobsOUT").definitions!["JobsOUT"];

let jobsValidators = {
    IN: (str: string) => { 
        const parsed = JobsIN.safeParse(parseString(str));
        return parsed.success === true ? parsed.data : undefined
    },
    OUT: (str: string) => { 
        const parsed = JobsOUT.safeParse(parseString(str));
        return parsed.success === true ? parsed.data : undefined
    },
}

export {
    jobsSchema,
    jobsSchemaIN,
    jobsSchemaOUT,
    jobsValidators
}


export type Jobs = z.infer<typeof Jobs>
export type JobsIN = z.infer<typeof JobsIN>
export type JobsOUT = z.infer<typeof JobsOUT>