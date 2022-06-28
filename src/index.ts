import { cron_match } from "./cron";
import router from "./router";
import { tasks } from "./tasks";
import { Cron } from "./types";
import { run } from "./runner";
import { LOG_MAX_LENGTH } from "./constants";

export default {
    async fetch(request: Request, environment: { kv: KVNamespace; KEY: string }, context: ExecutionContext): Promise<Response> {
        if (!environment.KEY) {
            environment.KEY = "";
            console.error("[DANGER] KEY is not set and fallback to empty string.");
        }

        try {
            return await router.handle(request, environment);
        } catch (err) {
            console.error(err);
            return new Response((<Error>err).message, { status: 500, headers: { "Content-Type": "text/plain" } });
        }
    },
    async scheduled(controller: ScheduledController, environment: { kv: KVNamespace }, context: ExecutionContext): Promise<void> {
        const DATE = new Date();
        const CRON: Cron = [DATE.getMinutes(), DATE.getHours(), DATE.getDate(), DATE.getMonth() + 1, DATE.getDay()];

        const runners: Promise<[string, boolean, string]>[] = [];
        for (const task of tasks) {
            if (cron_match(task[1], CRON)) {
                runners.push(run(task, CRON).then(([success, message]) => [task[0], success, message]));
            }
        }
        const results = await Promise.all(runners);

        if (results.length) {
            const logs = (await environment.kv.get<{ time: Cron; results: [string, boolean, string][] }[]>("schedule-logs", "json")) ?? [];
            logs.push({ time: CRON, results });
            if (logs.length > LOG_MAX_LENGTH) {
                logs.shift();
            }
            await environment.kv.put("schedule-logs", JSON.stringify(logs));
        }
    },
};
