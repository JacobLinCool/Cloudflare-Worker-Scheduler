export type Cron = [number, number, number, number, number];

export type Task = [
    /** Task Name */
    string,
    /** Cron Expression */
    string,
    /** Task Function */
    (
        cron: Cron,
    ) => void | Promise<void> | boolean | Promise<boolean> | string | Promise<string> | [boolean, string] | Promise<[boolean, string]>,
];
