/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Graph data about the user.
 */
// tslint:disable-next-line:interface-name
export interface UserInfo {
  businessPhones?: string[];
  displayName?: string;
  givenName?: string;
  id?: string;
  jobTitle?: string;
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
  userPrincipalName?: string;
}

/**
 * Mail data from MS Graph
 */
// tslint:disable-next-line:interface-name
export interface MailInfo {
  value?: any[];
}
