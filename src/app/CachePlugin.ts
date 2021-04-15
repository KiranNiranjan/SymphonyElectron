// @ts-nocheck
import * as fs from 'fs';

import { CACHE_LOCATION } from './Constants';

const beforeCacheAccess = async (cacheContext) => {
  return new Promise<void>(async (resolve, reject) => {
    if (fs.existsSync(CACHE_LOCATION)) {
      fs.readFile(CACHE_LOCATION, 'utf-8', (err, data) => {
        if (err) {
          reject();
        } else {
          cacheContext.tokenCache.deserialize(data);
          resolve();
        }
      });
    } else {
      fs.writeFile(
        CACHE_LOCATION,
        cacheContext.tokenCache.serialize(),
        (err) => {
          if (err) {
            reject();
          }
        },
      );
    }
  });
};

const afterCacheAccess = async (cacheContext) => {
  if (cacheContext.cacheHasChanged) {
    await fs.writeFile(
      CACHE_LOCATION,
      cacheContext.tokenCache.serialize(),
      (err) => {
        if (err) {
          // tslint:disable-next-line:no-console
          console.log(err);
        }
      },
    );
  }
};

export const cachePlugin = {
  beforeCacheAccess,
  afterCacheAccess,
};
