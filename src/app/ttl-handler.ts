import { logger } from '../common/logger';

/**
 * Checks to see if the build is expired against a TTL expiry time
 */
export const checkIfBuildExpired = (): boolean => {
    logger.info(`Checking for build expiry`);

    const json = require('./constants.json');
    const ttlExpiryTime = json.ttlExpiryTime;

    if (ttlExpiryTime <= -1) {
        logger.info(`Expiry not applicable for this build`);
        return false;
    }

    const currentDate: Date = new Date();
    const expiryDate: Date = new Date(ttlExpiryTime);
    logger.info(`Current Time: ${currentDate.getTime()}\nExpiry Time: ${expiryDate.getTime()}`);

    return currentDate.getTime() > expiryDate.getTime();
};
