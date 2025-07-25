import moment from "moment";
import { GetLocalStorage } from "./cryptography";
import { AUTimeFormat } from "./date";
import { GetLangKey, Language } from "./general";
import { t } from "i18next";

export enum ProfileTemplate {
  PURE_HARMONY = 1, HERB_ESSENCE = 2,
}

export enum TemplateModal {
  CLOSE, SLUG, TITLE, NAME, INTRODUCTION, AVATAR, SKILL, CLINIC, DESCRIPTION, STRENGTHS, SPECIALISE, COURSE, ARTICLE, REVIEW, REVIEW_BG
}

export enum ContentLimit {
  TITLE = 50,
  FIRST_NAME = 15,
  LAST_NAME = 15,
  SLUG = 35,
  INTRODUCTION = 180,
  SKILL = 15,
  DESCRIPTION = 250,
  STRENGTH_TITLE = 40,
  STRENGTH = 150,
  SPECIALISE_TITLE = 40,
  SPECIALITY = 150,
  COURSE_TITLE = 50,
  COURSE = 200,
  COURSE_LOCATION = 50,
  ARTICLE_TITLE = 60,
  ARTICLE = 200,
  PATIENT_NAME = 50,
  PATIENT_DESCRIPTION = 100,
  REVIEW = 400,
}

export enum ContentCountLimit {
  SKILL_KEY = 6,
  STRENGTH = 6,
  SPECIALITY = 6,
  COURSE = 6,
  REVIEW = 3,
  ARTICLE = 9,
}

export enum TitleOption {
  ACUPUNCTURIST,
  MASSEUR,
  CN_MEDICINE_PRACTITIONER,
}

export enum ProfilePlaceholder {
  TITLE = "EG_PROFESSOR_OF_TRADITIONAL_CHINESE_MEDICINE",
  INTRODUCTION = "PLEASE_BRIEFLY_INTRODUCE_YOURSELF",
  SKILL = "EG_HERBAL_MEDICINE",
  DESCRIPTION = "EG_TRADITIONAL_CHINESE_MEDICINE_(TCM)_IS_A_DISCIPLINE_THAT_UTILIZES_NATURAL_PRINCIPLES_COMBINED_WITH_VARIOUS_PHYSIOLOGICAL_AND_PATHOLOGICAL_CHANGES_IN_THE_BODY.",
}

export const TitleOptions: any[] = [
  { id: TitleOption.ACUPUNCTURIST, name: t('ACUPUNCTURIST') },
  { id: TitleOption.MASSEUR, name: t('MASSEUR') },
  { id: TitleOption.CN_MEDICINE_PRACTITIONER, name: t('CN_MEDICINE_PRACTITIONER') },
];

export const LANG_MULTIPLIER = 1;
export const GetCNStrLimit = (initialLimit: ContentLimit) => {
  let multiplier = GetLangKey() == Language.ZH_CN ? LANG_MULTIPLIER : 1;
  return initialLimit * multiplier;
};

export const GetCroppedImg = (imageSrc: string, croppedAreaPixels: any) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx: any = canvas.getContext('2d');

      const size = Math.max(croppedAreaPixels.width, croppedAreaPixels.height);
      canvas.width = size;
      canvas.height = size;

      // Clip into a circle
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        size,
        size
      );

      const base64Image = canvas.toDataURL('image/png');
      const base64WithoutPrefix = base64Image.replace(/^data:.*;base64,/, '');
      resolve(base64WithoutPrefix);
    };

    image.onerror = (error) => reject(error);
  });
};


export const GetEarlyStartTime = (clinic: any) => {
  const sortEarliestStartTime = clinic.workingTimes.filter((w: any) => w.isWorking).sort((a: any, b: any) => moment(a.startTime, "HH:mm:ss").isBefore(moment(b.startTime, "HH:mm:ss")) ? -1 : 1);
  return moment(sortEarliestStartTime[0]?.startTime, "HH:mm:ss").format(AUTimeFormat);
};

export const GetLatestEndTime = (clinic: any) => {
  const sortLatestEndTime = clinic.workingTimes.filter((w: any) => w.isWorking).sort((a: any, b: any) => moment(a.endTime, "HH:mm:ss").isBefore(moment(b.endTime, "HH:mm:ss")) ? 1 : -1);
  return moment(sortLatestEndTime[0]?.endTime, "HH:mm:ss").format(AUTimeFormat);
};
