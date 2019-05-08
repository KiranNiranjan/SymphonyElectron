import * as electron from 'electron';
import { i18n } from '../common/i18n';
import { logger } from '../common/logger';
import { windowExists } from './window-utils';

const ttlExpiryTime = -1;

/**
 * Checks to see if the build is expired against a TTL expiry time
 */
export const checkIfBuildExpired = (browserWindow: electron.BrowserWindow) => {
    logger.info(`Checking for build expiry`);

    if (ttlExpiryTime <= -1) {
        logger.info(`Expiry not applicable for this build`);
        return;
    }

    const currentDate: Date = new Date();
    const expiryDate: Date = new Date(ttlExpiryTime);
    logger.info(`Current Time: ${currentDate.getTime()}\nExpiry Time: ${expiryDate.getTime()}`);

    if (currentDate.getTime() > expiryDate.getTime()) {
        logger.info(`Build expired, will show a message and ask the user to quit!`);

        if (!browserWindow || !windowExists(browserWindow)) {
            return;
        }

        const response = (resp: number) => {
            if (resp === 0) {
                electron.app.exit();
            }
        };

        const options = {
            type: 'error',
            title: i18n.t('Build expired')(),
            message: i18n.t('Sorry, this is a test build and it has expired. Please contact your administrator to get a production build.')(),
            buttons: [ i18n.t('Quit')()],
            cancelId: 0,
        };

        electron.dialog.showMessageBox(browserWindow, options, response);
    }
};
