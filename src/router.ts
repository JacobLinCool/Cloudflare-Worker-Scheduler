/**
 * @file router.ts
 * This file contains the route logic for the application.
 * The exported `router` will be used by the `fetch` function in `index.ts`.
 */

import { Router } from "itty-router";
import append from "./headers";
import { tasks } from "./tasks";
import { run } from "./runner";

const router = Router<Request>();

router.get("/list", async (req, env: { kv: KVNamespace; KEY: string }) => {
    if (typeof req.query?.key === "string" && req.query.key === env.KEY) {
        const list = tasks.reduce<Record<string, string>>((acc, [name, cron]) => {
            acc[name] = cron;
            return acc;
        }, {});

        return new Response(JSON.stringify(list, null, 4), { status: 200, headers: append(new Headers(), "json") });
    } else {
        return new Response("key is required.", { status: 401, headers: append(new Headers(), "text") });
    }
});

router.get("/log", async (req, env: { kv: KVNamespace; KEY: string }) => {
    if (typeof req.query?.key === "string" && req.query.key === env.KEY) {
        return new Response(JSON.stringify((await env.kv.get("schedule-logs", "json")) || [], null, 4), {
            status: 200,
            headers: append(new Headers(), "json"),
        });
    } else {
        return new Response("key is required.", { status: 401, headers: append(new Headers(), "text") });
    }
});

router.get("/trigger", async (req, env: { kv: KVNamespace; KEY: string }) => {
    if (typeof req.query?.task === "string" && typeof req.query?.key === "string" && req.query.key === env.KEY) {
        const task = tasks.find(([name]) => name === req.query?.task);
        if (task) {
            const [success, message] = await run(task, [-1, -1, -1, -1, -1]);
            return new Response(JSON.stringify({ success, message }, null, 4), { status: 200, headers: append(new Headers(), "text") });
        } else {
            return new Response("task is not found.", { status: 401, headers: append(new Headers(), "text") });
        }
    } else {
        return new Response("task and key is required.", { status: 401, headers: append(new Headers(), "text") });
    }
});

router.get("*", async () => {
    return new Response("Not Found.", { status: 404, headers: append(new Headers(), "text") });
});

export default router;