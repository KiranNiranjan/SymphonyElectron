/**
 * Interface for logs
 */
export interface LogInterface {
    transports: TransportInterface;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
}

interface FileInterface {
    file: string;
    level: string;
    format: string;
    maxSize: number;
    appName: string;
}

interface TransportInterface {
    file: FileInterface;
}

export enum LogLevels {
    ERROR,
    CONFLICT,
    WARN,
    ACTION,
    INFO,
    DEBUG,
}