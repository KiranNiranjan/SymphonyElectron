import { crashReporter } from 'electron';

import { getMultipleConfigField } from '../config';
import { ConfigInterface } from '../config/interface';
import log from '../logs';
import { LogLevels } from '../logs/interface';
import { CrashReporterDataInterface, CrashReporterExtraInterface, CrashReporterInterface } from './interface';

const configFields = [ 'url', 'crashReporter' ];

export class CrashReporter implements CrashReporterInterface {
    private readonly extra: CrashReporterExtraInterface | undefined;
    private crashReporterData: CrashReporterDataInterface | undefined;

    constructor(extra?: CrashReporterExtraInterface) {
        this.extra = extra;

        getMultipleConfigField(configFields)
            .then((data: ConfigInterface) => {

                if (!data && !data!.crashReporter && !data!.crashReporter.companyName) {
                    log.send(LogLevels.ERROR, `Unable to initialize crash reporter failed to as company name is empty`);
                    return;
                }
                this.crashReporterData = {
                    companyName: data.crashReporter.companyName,
                    extra: Object.assign(
                        { podUrl: data.url },
                        extra,
                    ),
                    submitURL: data.crashReporter.submitURL,
                    uploadToServer: data.crashReporter.uploadToServer,
                };
            })
            .catch((err: Error) => {
                log.send(LogLevels.ERROR, `Unable to initialize crash reporter failed to read config file. Error is ->  ${err}`);
            });
    }

    /**
     * Method to initialize crash reporter for main process
     * @param extras
     */
    public initCrashReporterMain(extras: CrashReporterExtraInterface): void {
        if (!this.crashReporterData) return;

        try {
            this.crashReporterData.extra = this.getCrashReporterConfig(extras);
            crashReporter.start(this.crashReporterData);
        } catch (err) {
            log.send(LogLevels.ERROR, 'Failed to start crash reporter main process. Error is ->  ' + err);
        }
    }

    /**
     * Method to initialize crash reporter for renderer process
     *
     * @param browserWindow {Electron.BrowserWindow}
     * @param extras {Object}
     */
    public initCrashReporterRenderer(browserWindow: Electron.BrowserWindow, extras: CrashReporterExtraInterface) {
        if (!this.crashReporterData) return;

        if (browserWindow && browserWindow.webContents && !browserWindow.isDestroyed()) {
            this.crashReporterData.extra = this.getCrashReporterConfig(extras);
            browserWindow.webContents.send('register-crash-reporter', this.crashReporterData);
        }
    }

    /**
     * Method that returns all the required field for crash reporter
     *
     */
    private getCrashReporterConfig(extras: CrashReporterExtraInterface): CrashReporterExtraInterface | undefined {
        if (this.crashReporterData && this.crashReporterData.companyName) {
            return this.crashReporterData.extra = Object.assign(this.extra, extras);
        }
        return;
    }
}

const crashReporterInstance = new CrashReporter();

const crashReporterImpl = {
    initCrashReporterMain: crashReporterInstance.initCrashReporterMain.bind(crashReporterInstance),
    initCrashReporterRenderer: crashReporterInstance.initCrashReporterRenderer.bind(crashReporterInstance),
};

export default crashReporterImpl;