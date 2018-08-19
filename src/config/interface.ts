/**
 * Interface for config file
 */

export interface ConfigInterface {
    url: string;
    minimizeOnClose: boolean;
    launchOnStartup: boolean;
    alwaysOnTop: boolean;
    bringToFront: boolean;
    whitelistUrl: string;
    isCustomTitleBar: boolean;
    memoryRefresh: boolean;
    devToolsEnabled: boolean;
    ctWhitelist: string[];
    notificationSettings: NotificationSettingInterface;
    permissions: PermissionInterface;
    customFlags: CustomFlagInterface;
    crashReporter: CrashReporterInterface;
}

export interface PermissionInterface {
    media: boolean;
    geolocation: boolean;
    notifications: boolean;
    midiSysex: boolean;
    pointerLock: boolean;
    fullscreen: boolean;
    openExternal: boolean;
}

export interface CustomFlagInterface {
    authServerWhitelist: string;
    authNegotiateDelegateWhitelist: string;
    disableGpu: boolean;
}

export interface CrashReporterInterface {
    submitURL: string;
    companyName: string;
    uploadToServer: boolean;
}

export interface NotificationSettingInterface {
    position: string;
    display: string;
}
