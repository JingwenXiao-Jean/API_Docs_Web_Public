import { t } from "i18next";
import moment from "moment";

// Time
export const CNDateTimeFormat = "YYYY-MM-DD HH:mm";
export const CNDateFormat = "YYYY-MM-DD";
export const CNTimeFormat = "HH:mm";
export const AUDateTimeFormat = "DD/MM/YYYY hh:mm A";
export const AUTimeFormat = "hh:mm A";
export const AUDateFormat = "DD/MM/YYYY";
export const AUDTimeFormat = "hh:mm A";
export const AUStrDateTimeFormat = "DD MMM YYYY HH:mm A";
export const AUStrFullDateTimeFormat = "ddd, DD MMM YYYY HH:mm A";
export const AUStrDateFormat = "DD MMM YYYY";
export const AUStrDateNonYearFormat = "ddd, DD MMM";
export const AUStrDateTimeNonYearFormat = "DD MMM HH:mm A";

export const ProcessTimeStr = (time: string) => {
  return `${moment(time).isSame(moment(), 'day') ? `Today ${moment(time).format(AUDTimeFormat)}` : moment(time).format(AUDateTimeFormat)}`;
};

export enum WeekDay {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}
export const WeekDays: { id: WeekDay, name: string; }[] | any[] = [
  { id: WeekDay.MONDAY, name: t('MONDAY') },
  { id: WeekDay.TUESDAY, name: t('TUESDAY') },
  { id: WeekDay.WEDNESDAY, name: t('WEDNESDAY') },
  { id: WeekDay.THURSDAY, name: t('THURSDAY') },
  { id: WeekDay.FRIDAY, name: t('FRIDAY') },
  { id: WeekDay.SATURDAY, name: t('SATURDAY') },
  { id: WeekDay.SUNDAY, name: t('SUNDAY') },
];

export const GetDay = (day: WeekDay) => {
  switch (day) {
    case WeekDay.MONDAY: return t('MONDAY');
    case WeekDay.TUESDAY: return t('TUESDAY');
    case WeekDay.WEDNESDAY: return t('WEDNESDAY');
    case WeekDay.THURSDAY: return t('THURSDAY');
    case WeekDay.FRIDAY: return t('FRIDAY');
    case WeekDay.SATURDAY: return t('SATURDAY');
    case WeekDay.SUNDAY: return t('SUNDAY');
  }
};