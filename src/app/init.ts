import { app, crashReporter } from 'electron';
import * as path from 'path';

import { isDevEnv, isNodeEnv } from '../common/env';
import { logger } from '../common/logger';
import { getCommandLineArgs } from '../common/utils';
import { appStats } from './stats';

// Handle custom user data path from process.argv
const userDataPathArg: string | null = getCommandLineArgs(
  process.argv,
  '--userDataPath=',
  false,
);
const userDataPath =
  userDataPathArg &&
  userDataPathArg.substring(userDataPathArg.indexOf('=') + 1);

// tslint:disable-next-line:no-var-requires
if (require('electron-squirrel-startup')) { // @ts-ignore
    return;
}

// force sandbox: true for all BrowserWindow instances.
if (!isNodeEnv) {
  app.enableSandbox();
}

// Set user data path before app ready event
if (isDevEnv) {
  const devDataPath = path.join(app.getPath('appData'), 'Symphony-dev');
  logger.info(`init: Setting user data path to`, devDataPath);
  app.setPath('userData', devDataPath);
}

if (userDataPath) {
  logger.info(`init: Setting user data path to`, userDataPath);
  app.setPath('userData', userDataPath);
}

logger.info(`init: Fetch user data path`, app.getPath('userData'));

logger.info(`Crashes directory: ${app.getPath('crashDumps')}`);
crashReporter.start({
  submitURL: '',
  uploadToServer: false,
  ignoreSystemCrashHandler: false,
});
logger.info(`Crash Reporter started`);

// Log app statistics
appStats.logStats();

// tslint:disable-next-line
require('./main');
