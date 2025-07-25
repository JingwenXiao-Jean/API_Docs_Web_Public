import { Box, CircularProgress, Skeleton } from "@mui/material";
import { observer } from "mobx-react-lite";
import * as React from "react";
import useStores from "../hooks/use-stores";
import { IsEmptyStr } from "../utilities/field-validation";
import { ITEM_PERFECT_INLINED, THEME_GREEN } from "../constants/style";
import { MasksOutlined } from "@mui/icons-material";

const FullScreenSpinner = observer(({ children, color, isTransparent }: any) => {
  return (
    <Box className="h-screen relative">
      <Box className="fixed top-0 right-0 left-0 bottom-0 z-[9999] bg-white">
        <Box className="relative w-full h-screen">
          <Box className="absolute top-1/2 left-1/2 translate-x-neg-1/2 translate-y-neg-1/2 text-themeEmerald">
            <CircularProgress size={90} color="inherit" />
          </Box>
          <Box className="text-6xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center text-themeEmerald -mt-1">
            <MasksOutlined fontSize="inherit" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default FullScreenSpinner;
