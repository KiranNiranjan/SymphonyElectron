import { app } from 'electron';

import log from '../logs';
import { LogLevels } from '../logs/interface';
import { readConfigFileSync } from './config';

/**
 * Sets chrome authentication flags in electron
 */
export default function setChromeFlags() {

    log.send(LogLevels.INFO, 'setting chrome flags!');

    // Read the config parameters synchronously
    const config = readConfigFileSync();

    // If we cannot find any config, just skip setting any flags
    if (config && config !== null && config.customFlags) {

        if (config.customFlags.authServerWhitelist && config.customFlags.authServerWhitelist !== '') {
            log.send(LogLevels.INFO, 'Setting auth server whitelist flag');
            app.commandLine.appendSwitch('auth-server-whitelist', config.customFlags.authServerWhitelist);
        }

        if (config.customFlags.authNegotiateDelegateWhitelist && config.customFlags.authNegotiateDelegateWhitelist !== '') {
            log.send(LogLevels.INFO, 'Setting auth negotiate delegate whitelist flag');
            app.commandLine.appendSwitch('auth-negotiate-delegate-whitelist', config.customFlags.authNegotiateDelegateWhitelist);
        }

        // ELECTRON-261: Windows 10 Screensharing issues. We set chrome flags
        // to disable gpu which fixes the black screen issue observed on
        // multiple monitors
        if (config.customFlags.disableGpu) {
            log.send(LogLevels.INFO, 'Setting disable gpu, gpu compositing and d3d11 flags to true');
            app.commandLine.appendSwitch('disable-gpu', 'true');
            app.commandLine.appendSwitch('disable-gpu-compositing', 'true');
            app.commandLine.appendSwitch('disable-d3d11', 'true');
        }
    }
    app.commandLine.appendSwitch('disable-background-timer-throttling', 'true');
}