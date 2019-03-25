import { EventEmitter } from 'events';
import * as path from 'path';
import { isWindowsOS } from '../../src/common/env';
const ipcEmitter = new EventEmitter();

const mockIdleTime: number = 15;
const appName: string = 'Symphony';
const executableName: string = '/Symphony.exe';
const isReady: boolean = true;
const version: string = '4.0.0';
interface IApp {
    getAppPath(): string;
    getPath(type: string): string;
    getName(): string;
    isReady(): boolean;
    getVersion(): string;
    on(): void;
    setPath(value: string, path: string): void;
}
interface IIpcMain {
    on(event: any, cb: any): void;
    send(event: any, cb: any): void;
}
interface IIpcRenderer {
    sendSync(event: any, cb: any): any;
    on(eventName: any, cb: any): void;
    send(event: any, cb: any): void;
    removeListener(eventName: any, cb: any): void;
}
interface IPowerMonitor {
    querySystemIdleTime(): void;
}

const pathToConfigDir = (): string => {
    if (isWindowsOS) {
        return path.join(__dirname, '/../..') as string;
    } else {
        return path.join(__dirname, '/..') as string;
    }
};

// electron app mock...
export const app: IApp = {
    getAppPath: pathToConfigDir,
    getPath: (type) => {
        if (type === 'exe') {
            return path.join(pathToConfigDir(), executableName);
        }
        if (type === 'userData') {
            return path.join(pathToConfigDir(), '/../config');
        }
        return pathToConfigDir();
    },
    getName: () => appName,
    isReady: () => isReady,
    getVersion: () => version,
    on: () => jest.fn(),
    setPath: () => jest.fn(),
};

// simple ipc mocks for render and main process ipc using
// nodes' EventEmitter
export const ipcMain: IIpcMain = {
    on: (event, cb) => {
        ipcEmitter.on(event, cb);
    },
    send: (event, args) => {
        const senderEvent = {
            sender: {
                send: (eventSend, arg) => {
                    ipcEmitter.emit(eventSend, arg);
                },
            },
        };
        ipcEmitter.emit(event, senderEvent, args);
    },
};

export const powerMonitor: IPowerMonitor = {
    querySystemIdleTime: jest.fn().mockImplementation((cb) => cb(mockIdleTime)),
};

export const ipcRenderer: IIpcRenderer = {
    sendSync: (event, args) => {
        const listeners = ipcEmitter.listeners(event);
        if (listeners.length > 0) {
            const listener = listeners[0];
            const eventArg = {};
            listener(eventArg, args);
            return eventArg;
        }
        return null;
    },
    send: (event, args) => {
        const senderEvent = {
            sender: {
                send: (eventSend, arg) => {
                    ipcEmitter.emit(eventSend, arg);
                },
            },
        };
        ipcEmitter.emit(event, senderEvent, args);
    },
    on: (eventName, cb) => {
        ipcEmitter.on(eventName, cb);
    },
    removeListener: (eventName, cb) => {
        ipcEmitter.removeListener(eventName, cb);
    },
};

export const shell = {
    openExternal: jest.fn(),
};

// tslint:disable-next-line:variable-name
export const Menu = {
    buildFromTemplate: jest.fn(),
    setApplicationMenu: jest.fn(),
};

export const crashReporter = {
    start: jest.fn(),
};

const getCurrentWindow = jest.fn(() => {
    return {
        isFullScreen: jest.fn(() => {
            return false;
        }),
        isMaximized: jest.fn(() => {
            return false;
        }),
        on: jest.fn(),
        removeListener: jest.fn(),
        isDestroyed: jest.fn(() => {
            return false;
        }),
        close: jest.fn(),
        maximize: jest.fn(),
        minimize: jest.fn(),
        unmaximize: jest.fn(),
        setFullScreen: jest.fn(),
    };
});

export const dialog = {
    showMessageBox: jest.fn(),
};

// tslint:disable-next-line:variable-name
export const BrowserWindow = {
    getFocusedWindow: jest.fn(() => {
        return {
            isDestroyed: jest.fn(() => false),
        };
    }),
};

export const session = {
    defaultSession: {
        clearCache: jest.fn(),
    },
};

export const remote = {
    app,
    getCurrentWindow,
};
