import moment from "moment";
import { isWeb } from "./platform";
import { USER_INFO } from "../constants/storage-keys";
import { GetLocalStorage } from "./cryptography";
import { Gender } from "../constants/options";
import { UserInfo } from "../stores/user-store";
import { IsZero } from "./field-validation";


export const IsDesktop = isWeb ? window.innerWidth > 1536 : false;
export const IsMiniDesktop = isWeb ? window.innerWidth >= 768 : false;

export enum Language { ENGLISH = 'en-AU', ZH_CN = 'zh-CN' };
export const LangList = [Language.ENGLISH, Language.ZH_CN];
export const GetLangLabel = (lang: Language) => {
  switch (lang) {
    case Language.ENGLISH: return "EN";
    case Language.ZH_CN: return "中文";
  }
};
export const GetLangKey = () => {
  if (isWeb && localStorage.LANG) return localStorage.LANG;
  return Language.ENGLISH;
};

export const IsAuthed = () => {
  return isWeb && localStorage.USER_TOKEN != null && localStorage.USER_INFO != null;
};

export const GetUserProfile = () => {
  let userInfo: UserInfo = {
    id: 0,
    username: "",
    firstName: "",
    lastName: "",
    templateId: 0,
    gender: Gender.Male,
    email: "",
    availableClinics: [],
    currentClinicId: 0,
    isPublished: false,
  };
  if (isWeb && localStorage.USER_INFO) userInfo = GetLocalStorage(USER_INFO);
  return userInfo;
};

export const IsLocked = () => {
  const userInfo = GetUserProfile();
  return !userInfo || IsZero(userInfo.availableClinics?.length ?? 0) || IsZero(userInfo.currentClinicId);
};


export const GetErrorInfo = (err: any) => {//err is err:obj
  console.log(err);
  if (err.message === "ERR_CANCELED") {
    // DO NOTHING, THIS IS A CANCELLED REQUEST
    return "";
  } else if ((err.message).includes("Network error!")) {
    return "Failed to connect to server.";
  } else if (err.name === "AxiosError") {
    if (err.response.status === 404) return "404 Resource Not Found";
    else if (err.response.status === 400) return "Invalid request format";
  } else if (err.name === "TypeError") {
    return `Error: ${err.message}`;
  }
  else if (!err.response || !err.response.data.message) return "Unknown error for iPM Server. Please contact the administrator.";
  let input = err.response.data.message;
  const regex = /Error:/g;
  let match: RegExpExecArray | null;
  let lastMatchIndex = -1;
  while ((match = regex.exec(input)) !== null) {
    lastMatchIndex = match.index;
  }
  if (lastMatchIndex !== -1) {
    return input.substring(lastMatchIndex + "Error:".length).trim();
  }
  return "Unknown error for VAI Server. Please contact the administrator.";
};

export const OnProcessObjList = (index: number, sourceList: any[], req?: any): any[] => {
  let finalList = [...sourceList];
  if (index < 0) finalList.push(req);
  else finalList.splice(index, 1);
  return finalList;

};
export enum APILanguage { en = "en", cn = "cn" }

export const ProtectedUrls: string[] = ["/appointment", "/configuration", "/prescription"];