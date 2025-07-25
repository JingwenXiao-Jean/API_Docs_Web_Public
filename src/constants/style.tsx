import { styled } from "@mui/material";
import { green, red, orange, cyan, lightGreen, deepOrange } from "@mui/material/colors";
import { MaterialDesignContent } from "notistack";

// Styles used by native base
export const THEME_BLACK = '#374151';
export const THEME_DARK_GREEN = '#305c2f';
export const THEME_GREEN = '#4a9149';
export const THEME_YELLOW = '#faa000';
export const THEME_DARK_YELLOW = '#935e00';
export const THEME_GOLDEN = '#ffd89a';

export const PENDING_ORANGE = '#faa000';
export const PENDING_ORANGE_LIGHT = '#fffbf4';
export const THEME_GRAY = '#f3f4f6';
export const THEME_BLUE = '#21a2ff';
export const HEADING = "font-bold text-xl 2xl:text-2xl";
export const SECT_HEADING = "font-medium text-xl 2xl:text-2xl text-themeGreen";
export const SECT_SUBHEADING = "text-base 2xl:text-lg font-medium text-themeGreen";
export const BG_TABLE_HEAD = "sticky top-0 z-10 bg-themeGreen  rounded-lg";
export const BG_TABLE_HEAD_GRAY = "sticky top-0 z-10 bg-themeGreen text-white rounded-lg";
export const ICON_RED = '#ff6a6a';
export const ITEM_PERFECT_INLINED = { display: 'flex', alignItems: 'center', flexWrap: 'wrap' };
export const PADDING_HORIZONTAL = "px-2 lg:px-36 2xl:px-60";

export const TBODY_FIRST_COL_STYLE = "px-2 py-3 border-b text-sm 2xl:text-base";
export const TBODY_COL_STYLE = "px-2 py-3 border-b text-sm 2xl:text-base";

export const REQUIRED_ACTION = "bg-orange-100 text-orange-500";
export const ERROR = "bg-red-100 text-red-500";
export const SUCCESS = "bg-green-100 text-green-500";
export const INFO = "bg-sky-100 text-sky-500";

/**
 * For Notistack
 */

export const StyledNotiStackContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
      backgroundColor: lightGreen[100],
      border: `1px solid ${lightGreen[500]}`,
      color: THEME_BLACK,
      borderRadius: 20,
      boxShadow: 'unset',
      '& .MuiSvgIcon-root': { color: lightGreen[500] },
      padding: '2px 10px',
    },
    '&.notistack-MuiContent-error': {
      backgroundColor: red[100],
      border: `1px solid ${red[500]}`,
      color: THEME_BLACK,
      borderRadius: 20,
      boxShadow: 'unset',
      '& .MuiSvgIcon-root': { color: red[500] },
      padding: '2px 10px',
    },
    '&.notistack-MuiContent-warning': {
      background: orange[100],
      border: `1px solid ${orange[500]}`,
      color: THEME_BLACK,
      borderRadius: 20,
      boxShadow: 'unset',
      '& .MuiSvgIcon-root': { color: orange[500] },
      padding: '2px 10px',
    },
    '&.notistack-MuiContent-info': {
      backgroundColor: cyan[100],
      border: `1px solid ${cyan[500]}`,
      color: THEME_BLACK,
      borderRadius: 20,
      boxShadow: 'unset',
      '& .MuiSvgIcon-root': { color: cyan[500] },
      padding: '2px 10px',
    },
  }));
  

export const FIELD_BG_WHITE = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white', // Set the background color to white
    }
};

export const SELECT_BG_WHITE = {
    '& .MuiInputBase-root': {
        backgroundColor: 'white', // Set the background color to white
    },
};

export const FIELD_STYLE = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
            borderWidth: 2,
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'white',
        backgroundColor: 'white'
    },
    'input': {
        '&::placeholder': {
            color: 'white'
        }
    }
};