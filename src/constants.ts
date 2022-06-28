export const SEMANTICS: Record<string, string> = {
    "@monthly": "0 0 1 * *",
    "@weekly": "0 0 * * 0",
    "@daily": "0 0 * * *",
    "@hourly": "0 * * * *",
    "@minutely": "* * * * *",
    "@weekdays": "0 0 * * 1-5",
    "@weekends": "0 0 * * 0,6",
};

export const LOG_MAX_LENGTH = 100;
