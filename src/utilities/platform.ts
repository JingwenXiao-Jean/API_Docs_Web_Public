export const isServer = typeof window === 'undefined';
export const isWeb = !isServer;
export const isNative = false;
export const isIOS = false;
export const isAndroid = false;