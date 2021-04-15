// @ts-nocheck
/**
 * AuthCodeListener is the base class from which
 * special CustomFileProtocol and HttpAuthCode inherit
 * their structure and members.
 */
export abstract class AuthCodeListener {
  private hostName: string;

  /**
   * Constructor
   * @param hostName - A string that represents the host name that should be listened on (i.e. 'msal' or '127.0.0.1')
   */
  constructor(hostName: string) {
    this.hostName = hostName;
  }

  /**
   * Host
   */
  public get host(): string {
    return this.hostName;
  }

  /**
   * start
   */
  public abstract start(): void;

  /**
   * close
   */
  public abstract close(): void;
}
