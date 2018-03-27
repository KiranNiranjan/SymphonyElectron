const Application = require('spectron').Application;
const path = require('path');
const fs = require('fs');
const { isMac, isWindowsOS } = require('../../js/utils/misc');
const ncp = require('ncp').ncp;
const constants = require('./spectronConstants.js');

class App {

    constructor(options) {

        this.options = options;

        if (!this.options.path) {
            this.options.path = App.getAppPath();
        }

        if (isWindowsOS) {
            App.copyLibraries(constants.SEARCH_LIBRARY_PATH_WIN);
        }

        this.app = new Application(this.options);
    }

    startApplication() {
        return this.app.start().then((app) => {
            return app;
        }).catch((err) => {
            throw new Error("Unable to start application " + err);
        });
    }

    /**
     * Returns the application name
     * @return {string}
     */
    static getName() {
        return 'Symphony';
    }

    static getAppPath() {
        if (isMac) {
            return constants.SYMPHONY_APP_PATH_MAC
        } else {
            return constants.SYMPHONY_APP_PATH_WIN
        }
    }

    static getTimeOut() {
        return 90000
    }

    static readConfig(configPath) {

        const configFilePath = configPath + constants.SYMPHONY_CONFIG_FILE_NAME;

        if (!fs.existsSync(configFilePath)) {
            return new Promise(function (resolve, reject) {
                fs.readFile(configFilePath, 'utf-8', function (err, data) {
                    if (err) {
                        throw new Error(`Unable to read user config file at ${configFilePath}  ${err}`);
                    }
                    let parsedData;
                    try {
                        parsedData = JSON.parse(data);
                    } catch (err) {
                        return reject(err);
                    }
                    return resolve(parsedData);
                });
            });
        }

        return new Promise(function (resolve, reject) {
            fs.readFile(configFilePath, 'utf-8', function (err, data) {
                if (err) {
                    throw new Error(`Unable to read user config file at ${configFilePath}  ${err}`);
                }
                let parsedData;
                try {
                    parsedData = JSON.parse(data);
                } catch (err) {
                    reject(err);
                }
                resolve(parsedData);
            });
        });
    }

    static copyLibraries(libraryPath) {
        return new Promise((resolve) => {
            return ncp('library', libraryPath, function (err) {
                if (err) {
                    throw new Error("Unable to copy Swift search Libraries " + err);
                }
                return resolve();
            });
        });
    }

}

module.exports = App;
