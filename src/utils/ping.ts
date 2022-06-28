import { Cron } from "../types";

export function ping(url: string, timeout = 5000, options: Record<string, unknown> = {}): (cron: Cron) => Promise<[boolean, string]> {
    return async () => {
        const start = Date.now();
        const res = await fetch(url, { signal: AbortSignal.timeout(timeout), ...options });
        const end = Date.now();

        return [res.ok, `${res.status} (${end - start}ms)`];
    };
}
