import { Box, IconButton, SxProps, Tooltip } from "@mui/material";
import { observer } from "mobx-react";
import * as React from "react";
import { ColorScheme, VmTab } from "../constants/options";
import { ICON_RED, THEME_GREEN, THEME_YELLOW } from "../constants/style";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const VmIconButton = observer(({ children, tooltip, colorScheme = ColorScheme.INITIAL, buttonType, sx, disabled, onClick }: {
  children?: any, tooltip: string, colorScheme?: ColorScheme, onClick?: (e?: any) => any,
  buttonType?: "edit" | "edit-off" | "save" | "add" | "delete" | "view" | "cancel", disabled?: boolean, sx?: SxProps;
}) => {

  return (
    <IconButton disabled={disabled == true} sx={{
      color: colorScheme === ColorScheme.ERROR ? ICON_RED :
        colorScheme === ColorScheme.WARNING ? THEME_YELLOW :
          colorScheme === ColorScheme.SUCCESS ? "#22c55e" :
            colorScheme === ColorScheme.INFO ? "#3a89ff" : "gray", ...sx
    }} onClick={onClick ? onClick : () => { }} >
      <Tooltip title={tooltip} arrow>
        {buttonType ? (buttonType === "add" ? <AddCircleOutlineOutlinedIcon />
          : buttonType === "delete" ? <DeleteIcon />
            : buttonType === "cancel" ? <CancelOutlinedIcon />
              : buttonType === "save" ? <SaveIcon />
                : buttonType === "edit" ? <EditIcon />
                  : buttonType === "edit-off" ? <EditOffIcon />
                    : <RemoveRedEyeOutlinedIcon />) : children}
      </Tooltip>
    </IconButton >
  );
});

export default VmIconButton;
