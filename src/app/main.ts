import * as AutoLaunch from 'auto-launch';
import * as electron from 'electron';
import { app, crashReporter } from 'electron';
import electronDownload from 'electron-dl';
import squirrelStartup from 'electron-squirrel-startup';
import * as path from 'path';
import shellPath from 'shell-path';
import * as url from 'url';

// Local Dependencies
import log from '../logs';
import { LogLevels } from '../logs/interface';
import { handleProtocolAction, processProtocolArgv } from '../protocol';
import getCmdLineArg from '../utils/getCmdLineArg';
import { isDevEnv, isMac } from '../utils/misc';
import {
    getConfigField,
    getGlobalConfigField,
    getUserConfigField,
    updateUserConfigOnLaunch,
} from './config';
import { CrashReporterInterface } from './interface';
import { setCheckboxValues } from './menus/menuTemplate';
import compareSemVersions from './utils/compareSemVersions';

// exit early for squirrel installer
if (squirrelStartup) return;

import './mainApiMgr';
import './memoryMonitor';
import setChromeFlags from './setChromeFlags';
import windowMgr from './windowMgr';

electronDownload();

// setting the env path child_process issue https://github.com/electron/electron/issues/7688
shellPath()
    .then((sPath: string) => {
        process.env.PATH = sPath;
    })
    .catch(() => {
        process.env.PATH = [
            './node_modules/.bin',
            '/usr/local/bin',
            process.env.PATH,
        ].join(':');
    });

// used to check if a url was opened when the app was already open
let isAppAlreadyOpen: boolean = false;
let symphonyAutoLauncher: AutoLaunch;

const allowMultiInstance = getCmdLineArg(process.argv, '--multiInstance', true) || isDevEnv;
// only allow a single instance of app.
const shouldQuit = app.makeSingleInstance((argv) => {
    // Someone tried to run a second instance, we should focus our window.
    const mainWin = windowMgr.getMainWindow();
    if (mainWin) {
        isAppAlreadyOpen = true;
        if (mainWin.isMinimized()) {
            mainWin.restore();
        }
        mainWin.focus();
    }
    processProtocolArgv(argv, isAppAlreadyOpen);
});

// quit if another instance is already running, ignore for dev env or if app was started with multiInstance flag
if (!allowMultiInstance && shouldQuit) {
    app.quit();
}

getConfigField('url')
    .then(initializeCrashReporter)
    .catch(app.quit);

async function initializeCrashReporter(podUrl: string): Promise<any> {
    getConfigField('crashReporter')
        .then((crashReporterConfig: CrashReporterInterface) => {
            crashReporter.start({
                companyName: crashReporterConfig.companyName,
                extra: {
                    podUrl,
                    process: 'main',
                },
                submitURL: crashReporterConfig.submitURL,
                uploadToServer: crashReporterConfig.uploadToServer,
            });
            log.send(LogLevels.INFO, 'initialized crash reporter on the main process!');
        })
        .catch((err: Error) => {
            log.send(LogLevels.ERROR, `Unable to initialize crash reporter in the main process. Error is -> ${err}`);
        });
}

if (isMac) {
    symphonyAutoLauncher = new AutoLaunch({
        mac: {
            useLaunchAgent: true,
        },
        name: 'Symphony',
        path: process.execPath,
    });
} else {
    symphonyAutoLauncher = new AutoLaunch({
        name: 'Symphony',
        path: process.execPath,
    });
}

// Set the chrome flags
setChromeFlags();

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', () => {
    checkFirstTimeLaunch()
        .then(readConfigThenOpenMainWindow);
});

/**
 * Is triggered when all the windows are closed
 * In which case we quit the app
 */
app.on('window-all-closed', () => {
    app.quit();
});

/**
 * Is triggered when the app is up & running
 */
app.on('activate', () => {
    if (windowMgr.isMainWindow(null)) {
        setupThenOpenMainWindow();
    } else {
        windowMgr.showMainWindow();
    }
});

// adds 'symphony' as a protocol
// in the system. plist file in macOS
// and registry keys in windows
app.setAsDefaultProtocolClient('symphony');

/**
 * This event is emitted only on macOS
 * at this moment, support for windows
 * is in pipeline (https://github.com/electron/electron/pull/8052)
 */
app.on('open-url', (event: Event, protocolURL: string) => {
    handleProtocolAction(protocolURL, isAppAlreadyOpen);
});

/**
 * Reads the config fields that are required for the menu items
 * then opens the main window
 *
 * This is a workaround for the issue where the menu template was returned
 * even before the config data was populated
 * https://perzoinc.atlassian.net/browse/ELECTRON-154
 */
async function readConfigThenOpenMainWindow(): Promise<any> {
    setCheckboxValues()
        .then(setupThenOpenMainWindow)
        .catch(setupThenOpenMainWindow);
}

/**
 * Sets up the app (to handle various things like config changes, protocol handling etc.)
 * and opens the main window
 */
function setupThenOpenMainWindow(): void {

    processProtocolArgv(process.argv, isAppAlreadyOpen);

    isAppAlreadyOpen = true;
    getUrlAndCreateMainWindow();

    // Allows a developer to set custom user data path from command line when
    // launching the app. Mostly used for running automation tests with
    // multiple instances
    const customDataArg = getCmdLineArg(process.argv, '--userDataPath=', false);
    const customDataFolder = customDataArg && customDataArg.substring(customDataArg.indexOf('=') + 1);

    if (customDataArg && customDataFolder) {
        app.setPath('userData', customDataFolder);
    }

    // Event that fixes the remote desktop issue in Windows
    // by repositioning the browser window
    electron.screen.on('display-removed', windowMgr.verifyDisplays);

}

async function checkFirstTimeLaunch(): Promise<any> {

    return new Promise((resolve) => {

        getUserConfigField('version')
            .then((configVersion: string) => {
                const appVersionString = app.getVersion().toString();
                const execPath = path.dirname(app.getPath('exe'));
                const shouldUpdateUserConfig = execPath.indexOf('AppData/Local/Programs') !== -1 || isMac;

                if (!(configVersion
                    && typeof configVersion === 'string'
                    && (compareSemVersions.check(appVersionString, configVersion) !== 1)) && shouldUpdateUserConfig) {
                    return setupFirstTimeLaunch();
                }
                return resolve();
            })
            .catch(() => {
                return setupFirstTimeLaunch();
            });
        return resolve();
    });

}

/**
 * Setup and update user config
 * on first time launch or if the latest app version
 *
 * @return {Promise}
 */
async function setupFirstTimeLaunch(): Promise<any> {
    return new Promise((resolve) => {
        log.send(LogLevels.INFO, 'setting first time launch config');
        getGlobalConfigField('launchOnStartup')
            .then(setStartup)
            .then(updateUserConfigOnLaunch)
            .then(() => {
                log.send(LogLevels.INFO, 'first time launch config changes succeeded -> ');
                return resolve();
            })
            .catch((err: Error) => {
                log.send(LogLevels.ERROR, `first time launch config changes failed -> ${err}`);
                return resolve();
            });
    });
}

/**
 * Sets Symphony on startup
 * @param lStartup
 * @returns {Promise}
 */
async function setStartup(lStartup: boolean): Promise<any> {
    log.send(LogLevels.INFO, `launch on startup parameter value is ${lStartup}`);
    return new Promise((resolve) => {
        const launchOnStartup = (String(lStartup) === 'true');
        log.send(LogLevels.INFO, `launchOnStartup value is ${launchOnStartup}`);

        if (launchOnStartup) {
            log.send(LogLevels.INFO, `enabling launch on startup`);
            symphonyAutoLauncher.enable()
                .then(() => log.send(LogLevels.INFO, `enabling launch on startup`))
                .catch((err: Error) => log.send(LogLevels.ERROR, `enabling launch on startup failed with error -> ${err}`));
            return resolve();
        }

        symphonyAutoLauncher.disable()
            .then(() => log.send(LogLevels.INFO, `disabling launch on startup`))
            .catch((err: Error) => log.send(LogLevels.ERROR, `disabling launch on startup failed with error -> ${err}`));

        return resolve();
    });
}

/**
 * Checks for the url argument, processes it
 * and creates the main window
 */
function getUrlAndCreateMainWindow(): void {
    // allow passing url argument
    const argvURL = getCmdLineArg(process.argv, '--url=', false);
    if (argvURL) {
        windowMgr.createMainWindow(argvURL.substr(6));
        return;
    }

    getConfigField('url')
        .then(createWin)
        .catch((err: Error) => {
            log.send(LogLevels.ERROR, `unable to create main window -> ${err}`);
            app.quit();
        });
}

/**
 * Creates a window
 * @param urlFromConfig
 */
function createWin(urlFromConfig: string): void {
    // add https protocol if none found.
    const parsedUrl = url.parse(urlFromConfig);

    if (!parsedUrl.protocol || parsedUrl.protocol !== 'https') {
        parsedUrl.protocol = 'https:';
        parsedUrl.slashes = true;
    }
    const formatedURL = url.format(parsedUrl);

    windowMgr.createMainWindow(formatedURL);
}
