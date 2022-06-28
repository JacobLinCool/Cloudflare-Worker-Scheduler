import { Task, Cron } from "./types";

export async function run(task: Task, now: Cron): Promise<[boolean, string]> {
    let [success, message] = [false, ""];

    try {
        const result = await task[2](now);
        if (typeof result === "undefined") {
            success = true;
        } else if (typeof result === "boolean") {
            success = result;
        } else if (typeof result === "string") {
            success = true;
            message = result;
        } else if (typeof result === "object" && result instanceof Array) {
            success = result[0];
            message = result[1];
        } else {
            throw new Error("[runner] Invalid return type!");
        }
    } catch (err) {
        return [false, (err as Error).message];
    }

    return [success, message];
}
