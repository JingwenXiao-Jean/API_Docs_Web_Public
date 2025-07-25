import CryptoJS from 'crypto-js';
import { isWeb } from './platform';

const encryptionKey = '1FLIcNLkrzJN4k5x5rDFclhvLoJR0EyM';

export const SetLocalStorage = (key: string, data: any) => {
  if (isWeb) {
    // const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
    const encryptedData = JSON.stringify(data);
    localStorage.setItem(key, encryptedData);
  }
};

export const GetLocalStorage = (key: string) => {
  if (isWeb) {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      // const decryptedData = CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(CryptoJS.enc.Utf8);
      return JSON.parse(encryptedData);
      // return JSON.parse(decryptedData);
    }
    return null;
  }
};