import { backEndBaseURL } from "../constants/settings";

export enum ImageSource { PATIENT_AVATAR, REVIEW_BG }

export const GetFileUrl = (source: ImageSource, name: string) => {
  if (source === ImageSource.PATIENT_AVATAR) return `${backEndBaseURL}/api/Patient/ProfileImage/${name}`;
  if (source === ImageSource.REVIEW_BG) return `${backEndBaseURL}/api/Practitioner/ReviewBg/${name}`;
  return "";
};

export const DownloadDocument = (file: any, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(objectUrl);
  a.remove();
};

export const ImageFileOnly = "image/*";
export const VideoFileOnly = "video/mp4,video/x-m4v,video/*";
export const FileOnly = ".pdf, .doc, .docx, .xls, .xlsx, .mp4, .mov, .avi";

export const IsVideo = (fileName: string) => {
  const videoExtensions = /\.(mp4|avi|mov|mkv|wmv)$/i;
  return videoExtensions.test(fileName);
};

export const IsImage = (fileName: string) => {
  const videoExtensions = /\.(jpg|jpeg|svg|png)$/i;
  return videoExtensions.test(fileName);
};


export const BlobToBase64 = (blob: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // @ts-ignore
      resolve(reader.result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


