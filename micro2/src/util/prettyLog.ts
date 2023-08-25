export const pcolors = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    "Dark Gray": "\x1B[90m",
    "Light Gray": "\x1B[37m",

    reset: "\x1b[0m"
}


function paint(text: string, color = pcolors.white, defaultColorAfter = pcolors.reset) {
    return color + text + defaultColorAfter
}


function getDateColored(color?: string) {
    return paint(new Date().toLocaleTimeString("en-GB"), color ?? pcolors["Dark Gray"])
}

function getTextTimestamped(text: string, color?: string) {
    return "[" + getDateColored() + "] ::: " + paint(text, color ?? "");
}

export function plog(text: string, color?: string) {
    console.log(getTextTimestamped(text, color));
}