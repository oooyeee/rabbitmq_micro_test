import { plog, pcolors } from "./prettyLog";

export async function trycatch(fn: () => Promise<void> | void) {
    try {
        await fn();
    } catch (err: Error | any) {
        plog("Error -> " + ((typeof err?.message === "string") ? err.message : ""), pcolors.magenta);
        console.log(err);
    }
}