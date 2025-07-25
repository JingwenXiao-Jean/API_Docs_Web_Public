import { OverridableComponent } from "@mui/material/OverridableComponent";
import useStores from "../hooks/use-stores";
import { SvgIconTypeMap } from "@mui/material";

export const PAGE_SIZE = 10;

export const IsInvalid = -1;

export const DESKTOP_SIZE = 1536;

export const DEFAULT_COLOUR_INDICATOR = "#9ca3af";

export interface VmList { totalCount: number, items: any[]; };

export interface VmOption { id: number, label: string | number, value?: any; };
export interface VmTab { key: string | number, label: string | number; badgeCount?: number; };

export enum ColorScheme { INITIAL, ERROR, WARNING, SUCCESS, INFO, DISABLED, DARK };

export const LATEST_AREA_VER = 2;
// ================ VM Dynamic Fields ================ 
export enum FieldType { TEXT, RICH_TEXT, NUMBER, TEXT_AREA, DATE, DATE_TIME, TIME, SELECT, CHECKBOX, RADIO, EMPTY };

export interface VmDynamicField {
  id?: number,
  fieldType: FieldType,
  name?: string,
  placeHolder?: string,
  value?: string,
  colSpan?: number,
  rows?: number,
  // selections only for select & radio buttons
  selections?: VmOption[],
  selectionsCols?: number,
  error?: boolean,
  autoWidth?: boolean,
  disabled?: boolean,
  minRows?: number,
  onlyShow?: boolean,
  startAdornment?: any,
}
// ================ End VM Dynamic Fields ================ 
// ================  VM Smart Table ================ 
export interface VmTBody {
  type: VmTBodyType,
  sortKey?: string,
  colorScheme?: ColorScheme,
  isEnable?: boolean,
  fields: string[] | VmTableButton[] | {
    compareBy: any,
    compareTo: any,
    operator: "||" | ">" | ">=" | "<" | "<=" | "==" | "&&",

    true: string[] | VmTableButton[] | {
      compareBy: any,
      compareTo: any,
      operator: "||" | ">" | ">=" | "<" | "<=" | "==" | "&&",
      true: string[],
      false: string[],
      enableIndicator: boolean,
    };
    false: string[] | VmTableButton[] | {
      compareBy: any,
      compareTo: any,
      operator: "||" | ">" | ">=" | "<" | "<=" | "==" | "&&",
      true: string[],
      false: string[],
      enableIndicator: boolean,
    };
  } | {
    fields: string[],
    onClick: (req: any, event: any) => any,
  } | {
    render: (item: any) => any,
    sortBy?: (item: any) => any,
  };
};
export enum VmTBodyType {
  NO,
  TEXT,
  NUMBER,
  COMPLEX,
  DESCRIPTION,
  CURRENCY,
  DATE,
  DATE_TIME,
  MONTH_YEAR,
  TIME,
  BUTTON,
  TEXT_LINK,
  TEXT_BUTTON,
  STATUS,
  CONDITION,
  URGENT,
  PRIORITY,
  IMAGES,
  CHIP_LIST,
  MULTILINE,
  CASE_DATE_TIME,
  CUSTOM
};
export interface VmTableSearch { searchFields: string[], title: string, placeHolder?: string; }
export interface VmTableButton {
  label: string,
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> | any,
  onClick: (req: any, event: any) => any,
  colorScheme?: ColorScheme,
};
// ================ End VM Smart Table ================ 

export const States = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "WA", "VIC"];
/**
 * Attachment Type
 * Use this type when uploading files
 * Therefore backend know which type of file is uploading
 */
export enum AttachmentType {
  AVATAR = 5,
  REVIEW_BG = 6,
}

export enum Gender { Male, Female, All };
/**
 * Clinic Status
 * Use this type to identify the status of a clinic
 */
export enum ClinicStatus {
  APPROVED = "A",
  PENDING = "P",
  REJECTED = "R",
}

export enum ClinicServiceType {
	MASSAGE = 1,
	ACUPUNCTURE = 2,
	CHINESE_MEDICINE = 3,
}

export enum BookingStatus {
  PENDING = "P",
  ONGOING = "O",
  CANCELLED = "C",
}
