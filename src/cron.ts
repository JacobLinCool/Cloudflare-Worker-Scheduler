import { Cron } from "./types";
import { SEMANTICS } from "./constants";

export function cron_match(target: string, current: Cron): boolean {
    if (target in SEMANTICS) {
        target = SEMANTICS[target];
    }

    const expr = target.split(" ");

    for (let i = 0; i < 5; i++) {
        if (!check(expr[i], current[i])) {
            return false;
        }
    }

    return true;
}

function check(value: string, current: number): boolean {
    const bucket = [value];

    if (value.includes(",")) {
        bucket.splice(0, 1, ...value.split(","));
    }

    for (const v of bucket) {
        if (v.includes("-")) {
            const [start, end] = value.split("-");

            if (Number(start) <= current && current <= Number(end)) {
                return true;
            }
        }
    }

    for (const v of bucket) {
        if (v === "*") {
            return true;
        }
    }

    for (const v of bucket) {
        if (v.includes("/")) {
            const [start, step] = value.split("/");
            const start_num = Number(start);
            const step_num = Number(step);

            if (start_num <= current && current % step_num === 0) {
                return true;
            }
        }
    }

    for (const v of bucket) {
        if (Number(v) === current) {
            return true;
        }
    }

    return false;
}
