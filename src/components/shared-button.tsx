import { observer } from "mobx-react";
import React from "react";
import { ColorScheme } from "../constants/options";
import { Box, CircularProgress } from "@mui/material";
import { t } from 'i18next';


const VmButton = observer(({
  className = "", children, disabled = false, disabledHover = false, rounded = "lg", style = {}, onClick, colorScheme = ColorScheme.INITIAL, variant = "filled", loading = false, small = false }: {
    className?: string,
    children: any,
    rounded?: "none" | "md" | "lg" | "xl";
    disabled?: boolean,
    disabledHover?: boolean,
    style?: any,
    onClick?: (e: any) => any | any,
    colorScheme?: ColorScheme,
    loading?: boolean,
    small?: boolean,
    variant?: "outlined" | "filled";
  }) => {

  const bgFilledStyle = `${disabled ? "opacity-25 cursor-not-allowed" : ""}  
    ${colorScheme === ColorScheme.DISABLED ? 'bg-gray-400 text-white border-gray-400' :
      colorScheme === ColorScheme.INITIAL ? 'bg-themeGreen text-white border-themeGreen' :
        colorScheme === ColorScheme.ERROR ? "bg-red-500 text-white border-red-500" :
          colorScheme === ColorScheme.DARK ? "bg-themeBlack text-white border-themeBlack" :
            colorScheme === ColorScheme.SUCCESS ? "bg-green-500 text-white border-green-500" : "bg-orange-400 text-white border-orange-400"}`;

  const bgOutlinedStyle = `${disabled ? "opacity-25 cursor-not-allowed" : ""} 
    ${colorScheme === ColorScheme.DISABLED ? 'bg-gray-400 text-white border-gray-400' :
      colorScheme === ColorScheme.INITIAL ? 'bg-transparent text-themeGreen border-themeGreen' :
        colorScheme === ColorScheme.ERROR ? "bg-transparent text-red-500 border-red-500" :
          colorScheme === ColorScheme.DARK ? "bg-transparent text-themeBlack border-themeBlack" :
            colorScheme === ColorScheme.SUCCESS ? "bg-transparent text-green-500 border-green-500" : "bg-transparent text-orange-400 border-orange-400"}`;

  return (
    <>
      {loading ?
        <button
          type="button"
          disabled={true}
          style={style}
          className={`${bgOutlinedStyle} ${small ? "py-1 px-2" : "py-2 px-4"} border-2 text-sm rounded hover:border-themeBlack hover:bg-transparent hover:text-themeBlack transition ease-in-out ${className}`}>
          <Box className={`${small ? "text-xs" : ""} flex items-center`}>
            <CircularProgress color="inherit" size={"1rem"} />
            <p className="ml-2">{t('LOADING')}...</p>
          </Box>
        </button>
        : variant === "outlined" ?
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={`${bgOutlinedStyle} ${small ? "py-1 px-2" : "py-2 px-4"} border-2 text-sm rounded
            ${!disabledHover && "hover:border-themeBlack hover:bg-transparent hover:text-themeBlack"} transition ease-in-out ${className}`}>
            <Box className={`${small ? "text-xs" : ""} justify-center flex items-center`}>{children}</Box>
          </button>
          : <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={`${bgFilledStyle} ${small ? "py-1 px-2" : "py-2 px-4"} border-2 text-sm rounded
            ${!disabledHover && "hover:border-themeBlack hover:bg-transparent hover:text-themeBlack"} transition ease-in-out ${className}`}>
            <Box className={`${small ? "text-sm" : ""} justify-center flex items-center`}>{children}</Box>
          </button>}
    </>
  );
});
export default VmButton;