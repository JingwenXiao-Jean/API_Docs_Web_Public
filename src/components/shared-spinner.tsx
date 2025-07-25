import * as React from "react";
import useStores from "../hooks/use-stores";
import { Box, CircularProgress } from "@mui/material";
import { ITEM_PERFECT_INLINED, THEME_GREEN } from "../constants/style";

const VmSpinner = ({ children, size }: { children?: any, size?: number }) => {
  return (
    <Box className="text-themeGolden text-center my-6">
      <CircularProgress size={size ?? 24} sx={{ color: THEME_GREEN }} />
      {children && <Box sx={ITEM_PERFECT_INLINED} className="justify-center text-sm mt-3">
        <p style={{ marginRight: 2 }}>{children}</p>
        <p className="dot animate-blink" style={{ marginRight: 1 }}>.</p>
        <p className="dot animate-blink" style={{ animationDelay: '0.2s', marginRight: 1 }}>.</p>
        <p className="dot animate-blink" style={{ animationDelay: '0.4s' }}>.</p>
      </Box>}
    </Box>
  );
};

export default VmSpinner;
