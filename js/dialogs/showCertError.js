'use strict';

const electron = require('electron');

const log = require('../log.js');
const logLevels = require('../enums/logLevels.js');

/**
 * If certificate error occurs allow user to deny or allow particular certificate
 * error.  If user selects 'Ignore All', then all subsequent certificate errors
 * will ignored during this session.
 *
 * Note: the dialog is synchronous so further processing is blocked until
 * user provides a response.
 */
electron.app.on('certificate-error', function(event, webContents, url, error,
    certificate, callback) {
    log.send(logLevels.INFO, 'Certificate error: ' + error + ' for url: ' + url);
    event.preventDefault();
    callback(true);
});
