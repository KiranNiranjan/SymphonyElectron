// @ts-nocheck
// tslint:disable-next-line:no-implicit-dependencies
import * as axios from 'axios';
import { MailInfo, UserInfo } from './GraphReponseTypes';

/**
 * Class that handles Bearer requests for data using Fetch.
 */
export class FetchManager {
  /**
   * Makes an Authorization "Bearer"  request with the given accessToken to the given endpoint.
   * @param endpoint
   * @param accessToken
   */
  public async callEndpointWithToken(
    endpoint: string,
    accessToken: string,
  ): Promise<UserInfo | MailInfo> {
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log('Request made at: ' + new Date().toString());
    const response = await axios.default.get(endpoint, options);

    return (await response.data) as UserInfo | MailInfo;
  }
}
