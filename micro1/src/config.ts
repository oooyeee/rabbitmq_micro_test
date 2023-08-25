import path from "path"
import {fileURLToPath} from "url"
export const __projectDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../");

// export const __projectDir = path.join(__dirname, "../")


export const isProd = process.env["NODE_ENV"] === "production" ? true : false;
export const service_name = process.env["SERVICE_NAME"] ?? "unknown service";
export const service_port = Number(process.env["SERVICE_PORT"] ?? "9091");
export const rabbit_user = process.env["RABBIT_USER"] ?? "requester";
export const rabbit_password = process.env["RABBIT_PASSWORD"] ?? "password";
export const rabbit_port = Number(process.env["RABBIT_PORT"] ?? "5672");
export const rabbit_hostname = process.env["RABBIT_HOSTNAME"] ?? "localhost";
export const rabbit_vhost = process.env["RABBIT_VHOST"] ?? "/myvhost";
export const rabbit_exchange = process.env["RABBIT_EXCHANGE"] ?? "messaging_exchange";
export const rabbit_reqkey = process.env["RABBIT_REQKEY"] ?? "requests_key";
export const rabbit_readableQueue = process.env["RABBIT_READQUEUE"] ?? "tasks_queue";
