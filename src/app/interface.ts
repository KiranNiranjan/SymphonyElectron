/**
 * Interface for App
 */

export interface CrashReporterDataInterface {
    submitURL: string;
    companyName: string;
    uploadToServer: boolean;
    extra: CrashReporterExtraInterface | undefined;
}

export interface CrashReporterInterface {
    initCrashReporterRenderer(browserWindow: Electron.BrowserWindow, extra: CrashReporterExtraInterface): void | undefined;
    initCrashReporterMain(extra: CrashReporterExtraInterface): void | undefined;
}

export interface CrashReporterExtraInterface {
    process: string;
    podUrl: string;
}