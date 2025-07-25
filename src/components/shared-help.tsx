import { observer } from "mobx-react";
import React from "react";
import { ColorScheme } from "../constants/options";
import { Box, Popover } from "@mui/material";
import VmIconButton from "./shared-icon-button";
import { Info } from '@mui/icons-material';
import { ITEM_PERFECT_INLINED } from "../constants/style";

const VmHelp = observer(({ children, helpIcon, hintText = "See help", popoverTransformOrigin = { vertical: 'top', horizontal: 'left' } }: { children?: any, helpIcon?: any, hintText?: string, popoverOrigin?: any, popoverTransformOrigin?: any }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <VmIconButton tooltip={hintText} onClick={(e: any) => setAnchorEl(e.currentTarget)}>
        {helpIcon ? helpIcon : <Info />}
      </VmIconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={popoverTransformOrigin}
      >
        <Box className="p-4" sx={{ maxWidth: 400 }}>
          {/* <Box sx={ITEM_PERFECT_INLINED} className="text-themeGreen mb-2">
            <span className=""><Info color="inherit" /></span>
            <p className="ml-1">Info</p>
          </Box> */}
          <Box>{children}</Box>
        </Box>
      </Popover>
    </>
  );
});

export default VmHelp;