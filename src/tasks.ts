/**
 * You can add tasks to the `tasks` array.
 */
import { Cron, Task } from "./types";
import { ping } from "./utils/ping";

export const tasks: Task[] = [
    ["ping Google", "0/5 * * * *", ping("https://www.google.com")],
    ["ping GitHub", "0/5 * * * *", ping("https://github.com")],
    ["ping Twitter", "0/5 * * * *", ping("https://twitter.com")],
    ["ping Facebook", "0/5 * * * *", ping("https://www.facebook.com")],
    ["ping Instagram", "1/5 * * * *", ping("https://www.instagram.com")],
    ["ping LinkedIn", "1/5 * * * *", ping("https://www.linkedin.com")],
    ["ping StackOverflow", "1/5 * * * *", ping("https://stackoverflow.com")],
    ["ping my repl", "1/5 * * * *", ping("https://Mobile-APP-Server.jacoblincool.repl.co/all")],
    [
        "alive",
        "0 * * * *",
        async function (cron: Cron): Promise<string> {
            return `I am still alive at [${cron.join(", ")}]`;
        },
    ],
];
