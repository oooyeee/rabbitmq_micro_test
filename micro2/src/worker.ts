import type { JobsOUT } from "./types/Jobs"

function getrand(): number {
    return Math.floor(Math.random() * 101);
}

async function emulateShortJob(message: JobsOUT): Promise<JobsOUT> {
    return new Promise((resolve) => {
        let timeout = setTimeout(() => {
            clearTimeout(timeout)
            resolve({ ...message, ...{ status: "finished", data: `random data: ${getrand()}`, timestamp: Date.now() } })
        }, 1000)
    })
}

async function emulateLongJob(message: JobsOUT): Promise<JobsOUT> {
    return new Promise((resolve) => {
        let timeout = setTimeout(() => {
            clearTimeout(timeout);
            resolve({ ...message, ...{ status: "finished", data: `random data: ${getrand()}`, timestamp: Date.now() } })
        }, 12000)
    })
}

export default async function emulateJob(message: JobsOUT): Promise<JobsOUT> {
    if (getrand() > 50) {
        return emulateLongJob(message)
    } else {
        return emulateShortJob(message)
    }
}