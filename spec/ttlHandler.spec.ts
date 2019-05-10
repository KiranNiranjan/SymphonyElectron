import { checkIfBuildExpired } from "../src/app/ttl-handler";

describe('ttl handler', () => {

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return true build is expired', () => {
        jest.mock('../src/app/constants.json', () => ({
            ttlExpiryTime: Date.now() - (60 * 1000)
        }));
        expect(checkIfBuildExpired()).toBeTruthy();
    });

    it('should return false build is valid', () => {
        jest.mock('../src/app/constants.json', () => ({
            ttlExpiryTime: -1
        }));

        expect(checkIfBuildExpired()).toBeFalsy();
    });

});
