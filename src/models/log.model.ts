export interface Log{
    message: string;
    type: LogType;
    timestamp: string;
    actor?: string;
    family?: string;
}

export enum LogType{
    INFO = "INFO",
    ERROR = "ERROR",
}