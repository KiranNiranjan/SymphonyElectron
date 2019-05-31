import { app } from 'electron';

import { buildNumber, clientVersion, version } from '../../package.json';
import { isDevEnv, isMac } from '../common/env';
import { logger } from '../common/logger';
import { getCommandLineArgs } from '../common/utils';
import { cleanUpAppCache, createAppCacheFile } from './app-cache-handler';
import { autoLaunchInstance } from './auto-launch-controller';
import { setChromeFlags } from './chrome-flags';
import { config } from './config-handler';
import './dialog-handler';
import './main-api-handler';
import { protocolHandler } from './protocol-handler';
import { ICustomBrowserWindow, windowHandler } from './window-handler';

const allowMultiInstance: string | boolean = getCommandLineArgs(process.argv, '--multiInstance', true) || isDevEnv;

// on windows, we create the protocol handler via the installer
// because electron leaves registry traces upon uninstallation
if (isMac) {
    // Sets application version info that will be displayed in about app panel
    app.setAboutPanelOptions({ applicationVersion: `${clientVersion}-${version}`, version: buildNumber });
}

// Electron sets the default protocol
app.setAsDefaultProtocolClient('symphony');

/**
 * Main function that init the application
 */
const startApplication = async () => {
    await app.whenReady();
    logger.info(`main: app is ready, performing initial checks`);
    createAppCacheFile();
    windowHandler.createApplication();
    logger.info(`main: created application`);

    if (config.isFirstTimeLaunch()) {
        logger.info(`main: This is a first time launch! will update config and handle auto launch`);
        await config.setUpFirstTimeLaunch();
        await autoLaunchInstance.handleAutoLaunch();
    }

    setChromeFlags();
};

// Handle multiple/single instances
if (!allowMultiInstance) {
    logger.info('main: Multiple instances are not allowed, requesting lock', { allowMultiInstance });
    const gotTheLock = app.requestSingleInstanceLock();

    // quit if another instance is already running, ignore for dev env or if app was started with multiInstance flag
    if (!gotTheLock) {
        logger.info(`main: got the lock hence closing the new instance`, { gotTheLock });
        app.quit();
    } else {
        logger.info(`main: Creating the first instance of the application`);
        app.on('second-instance', (_event, argv) => {
            // Someone tried to run a second instance, we should focus our window.
            logger.info(`main: We've got a second instance of the app, will check if it's allowed and exit if not`);
            const mainWindow = windowHandler.getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                if (isMac) {
                    logger.info(`main: We are on mac, so, showing the existing window`);
                    return mainWindow.show();
                }
                if (mainWindow.isMinimized()) {
                    logger.info(`main: our main window is minimised, will restore it!`);
                    mainWindow.restore();
                }
                mainWindow.focus();
                protocolHandler.processArgv(argv);
            }
        });
        startApplication();
    }
} else {
    logger.info(`main: multi instance allowed, creating second instance`, { allowMultiInstance });
    startApplication();
}

/**
 * Is triggered when all the windows are closed
 * In which case we quit the app
 */
app.on('window-all-closed', () => {
    logger.info(`main: all windows are closed, quitting the app!`);
    app.quit();
});

/**
 * Creates a new empty cache file when the app is quit
 */
app.on('quit',  () => {
    logger.info(`main: quitting the app!`);
    cleanUpAppCache();
});

/**
 * Cleans up reference before quiting
 */
app.on('before-quit', () => windowHandler.willQuitApp = true);

/**
 * Is triggered when the application is launched
 * or clicking the application's dock or taskbar icon
 *
 * This event is emitted only on macOS at this moment
 */
app.on('activate', () => {
    const mainWindow: ICustomBrowserWindow | null = windowHandler.getMainWindow();
    if (!mainWindow || mainWindow.isDestroyed()) {
        logger.info(`main: main window not existing or destroyed, creating a new instance of the main window!`);
        startApplication();
        return;
    }
    logger.info(`main: activating & showing main window now!`);
    mainWindow.show();
});

/**
 * Validates and Sends protocol action
 *
 * This event is emitted only on macOS at this moment
 */
app.on('open-url', (_event, url) => {
    logger.info(`main: we got a protocol request with url ${url}! processing the request!`);
    protocolHandler.sendProtocol(url);
});
