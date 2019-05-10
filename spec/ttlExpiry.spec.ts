import { checkIfBuildExpired } from "../src/app/ttl-handler";

describe('ttl handler', () => {

    beforeEach(() => {
        jest.resetModules();
    });

    it('should show dialog if build is expired', () => {
        jest.mock('../src/app/constants.json', () => ({
            ttlExpiryTime: Date.now() - (60 * 1000)
        }));
        expect(checkIfBuildExpired()).toBeTruthy();
    });

    it('should not show dialog if build is not expired', () => {
        jest.mock('../src/app/constants.json', () => ({
            ttlExpiryTime: -1
        }));

        expect(checkIfBuildExpired()).toBeFalsy();
    });

});
