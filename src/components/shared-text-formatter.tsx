import { Box } from "@mui/material";
import * as React from "react";

const TextFormatter = ({ children, className, isFontLight = false, isFontSm }: { children: any, className?: string, isFontLight?: boolean, isFontSm?: boolean; }) => {
  return (
    <Box className={className} sx={{ wordWrap: "break-word" }}>
      {children?.split('\n').map((line: any, i: number) => (<>
        <p className={`${isFontLight ? "font-light" : "font-normal"} ${isFontSm ? "text-sm" : ""}`}>{line}</p>
        {i < children.split('\n').length - 1 && <Box sx={{ lineHeight: .5 }}><br /></Box>}
      </>))}
    </Box>
  );
};

export default TextFormatter;
