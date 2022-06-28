/**
 * You can add tasks to the `tasks` array.
 */
import { Cron, Task } from "./types";

export const tasks: Task[] = [
    [
        "ping-repl",
        "0/5 * * * *",
        async function (cron: Cron): Promise<[boolean, string]> {
            const res = await fetch("https://Mobile-APP-Server.jacoblincool.repl.co/all");
            if (res.ok) {
                return [true, `Server is UP (${res.status})`];
            }
            return [false, `Server is DOWN (${res.status})`];
        },
    ],
];
