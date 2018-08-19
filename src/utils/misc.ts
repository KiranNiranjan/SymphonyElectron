import * as os from 'os';

export const isDevEnv = process.env.ELECTRON_DEV ?
    process.env.ELECTRON_DEV.trim().toLowerCase() === 'true' : false;

export const isMac = (process.platform === 'darwin');
export const isWindowsOS = (process.platform === 'win32');

export const isNodeEnv = !!process.env.NODE_ENV;

export function isWindows10() {
    const [ major ] = os.release().split('.').map((part) => parseInt(part, 10));
    return isWindowsOS && major >= 10;
}
