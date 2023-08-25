
export default function parseString<T>(str: string): T | undefined {
    try {
        return JSON.parse(str)
    } catch (err) {
        return undefined
    }
}