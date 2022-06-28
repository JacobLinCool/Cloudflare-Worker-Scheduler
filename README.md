# Cloudflare Worker Scheduler

More cron jobs? No problem!

## How to use

1. Fork the repository.
2. Edit `src/tasks.ts`.
```ts
export const tasks: Task[] = [
    [
        "my-task-1",
        "0/5 * * * *",
        async function (cron: Cron): Promise<[boolean, string]> {
            const value = Math.random();
            const success = value > 0.5;
            return [success, `The value is ${value}.`];
        },
    ],
    [
        "ping Google",
        "@minutely",
        async function (cron: Cron): Promise<[boolean, string]> {
            const start = Date.now();
            const res = await fetch("https://www.google.com");
            const end = Date.now();

            return [res.ok, `${res.status} (${end - start}ms)`];
        },
    ],
];
```
3. Publish to Cloudflare Worker.

You may want to set environment variable `KEY` if you don't want other people to manually trigger your cron job.

## Endpoints

There are some endpoints for you to checkout the log and manually trigger the task.

### `/list?key=YOUR_KEY`

List all tasks with their cron settings.

### `/log?key=YOUR_KEY`

Checkout the log of the last `LOG_MAX_LENGTH` executed tasks.

> `LOG_MAX_LENGTH` is set to `100` by default and can be changed in `src/constants.ts`.

### `/trigger?key=YOUR_KEY&task=TASK_NAME`

Manually trigger a task.

> The result will not be logged because this method will respond with the result of the task directly.
