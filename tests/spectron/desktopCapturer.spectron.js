const Application = require('./spectronSetup');
const path = require('path');

let app = new Application({});

describe('Tests for Desktop capturer', () => {

    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();

    beforeAll((done) => {
        return app.startApplication().then((startedApp) => {
            app = startedApp;
            done();
        }).catch((err) => {
            expect(err).toBeNull();
        });
    });

    afterAll((done) => {
        if (app && app.isRunning()) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            app.stop().then(() => {
                done();
            }).catch((err) => {
                done();
            });
            done();
        }
    });

    it('should launch the app and verify window count', (done) => {
        return app.client.waitUntilWindowLoaded().then(() => {
            return app.client.getWindowCount().then((count) => {
                expect(count === 1).toBeTruthy();
                done();
            }).catch((err) => {
                expect(err).toBeNull();
            });
        }).catch((err) => {
            expect(err).toBeNull();
        });
    });

    it('should load the demo page', () => {
        return app.client.url('file:///' + path.join(__dirname, '..', '..', 'demo/index.html'));
    });

    it('should open the screen picker window', (done) => {
        openScreenPickerWindow(app).then(() => {
            done();
        });
    });

    it('should if screen picker window exists', (done) => {
        app.client
            .windowByIndex(1)
            .getTitle()
            .then((title) => {
                expect(title).toBe('Screen Picker');
                done();
            });
    });

    it('should select entire screen and start share', () => {
        app.client.waitForExist('#share', 2000);
        app.client.keys('ArrowRight');
        app.client.moveToObject('#share', 10, 10);
        app.client.leftClick('#share', 10, 10);

        return app.client.windowByIndex(0);
    });

    it('should verify the window count', function () {
        return verifyWindowCount(app).then(count => {
            expect(count).toBe(1);
        });
    });

    it('should open and close the screen picker window using escape key', () => {
        return openScreenPickerWindow(app).then(() => {
            return app.client
                .windowByIndex(1)
                .then(() => {
                    app.client.keys('Escape');
                });
        });
    });

    it('should verify the window count', function () {
        return verifyWindowCount(app).then(count => {
            expect(count).toBe(1);
        });
    });

    it('should open and close the screen picker window using close button', () => {
        return openScreenPickerWindow(app).then(() => {
            return app.client
                .windowByIndex(1)
                .then(() => {
                    app.client.waitForExist('#x-button', 2000);
                    app.client.moveToObject('#x-button', 10, 10);
                    app.client.leftClick('#x-button', 10, 10);

                    return verifyWindowCount(app).then(count => {
                        expect(count).toBe(1);
                    });
                });
        });
    });

});

/**
 * Verify if the window count is correct
 * @param app
 */
function verifyWindowCount(app) {
    return new Promise(resolve => {
        return app.client
            .windowByIndex(0)
            .getWindowCount()
            .then((count) => {
                resolve(count);
            });
    });
}

/**
 * Opens up the screen picker window
 *
 * @param app
 * @return {Promise<any>}
 */
function openScreenPickerWindow(app) {
    return new Promise((resolve) => {
        return app.client.windowByIndex(0).then(() => {
            app.client.waitForExist('#get-sources', 2000);
            app.client.moveToObject('#get-sources', 10, 10);
            app.client.leftClick('#get-sources', 10, 10);
            setTimeout(() => {
                resolve()
            }, 2000);
        });
    })
}