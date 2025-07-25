import { Box, CircularProgress, Fade, Modal, Popover } from "@mui/material";
import { observer } from "mobx-react";
import * as React from "react";
import { ITEM_PERFECT_INLINED, THEME_GRAY } from "../constants/style";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VmButton from "./shared-button";
import VmSpinner from "./shared-spinner";
import { ColorScheme } from "../constants/options";
import { IsEmptyStr } from "../utilities/field-validation";
import { Error } from "@mui/icons-material";
import { t } from 'i18next';

export const VmFullScreenDialog = observer(({ open, onClose, width, title, children, confirmTitle = "Continue", onClickConfirm, loading = false, disabled = false, cancelConfirmTitle, onClickCancel, reverseButtonScheme = false }: {
  open: boolean, onClose: () => any, width?: string | number, title: string, children: any, confirmTitle?: string, onClickConfirm: () => any, loading?: boolean, disabled?: boolean,
  cancelConfirmTitle?: string, onClickCancel?: () => any, reverseButtonScheme?: boolean;
}) => {
  const MODAL_STYLE = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width ? width : "40%",
    bgcolor: THEME_GRAY,
    borderRadius: 5,
    boxShadow: 24,
    // bgcolor: 'white',
  };

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={MODAL_STYLE}>
            <Box className="modalScrollBar overflow-auto">
              <Box className="flex items-center font-bold p-4 mb-2">
                <span className="text-themeYellow"><Error /></span>
                <p className="ml-2 -mb-[2px]">{title}</p>
              </Box>
              <Box className="text-sm text-gray-600 px-6">{children}</Box>
              {loading == true ? <VmSpinner />
                : <Box className="flex items-center justify-end mt-4 border-t border-t-gray-200 p-4 gap-2">
                  <button className='bg-transparent text-gray-800 border border-gray-800 text-sm rounded py-2 px-4 transition-all'
                    onClick={onClickCancel ?? onClose}>{cancelConfirmTitle ?? t('CANCEL')}</button>
                  <button disabled={disabled} className={`bg-gray-800 border border-gray-800 text-sm rounded text-white py-2 px-4 hover:bg-transparent hover:text-gray-800 transition-all ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={onClickConfirm}>{t('CONTINUE')}</button>
                </Box>}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
});

export const VmSmallDialog = observer(({ onClose, anchorEl, title, children, confirmTitle = "CONTINUE", onClickConfirm, loading, buttonHidden = false, disabled = false, width }: {
  onClose: (e: any) => any, anchorEl: any, title: string, children: any, confirmTitle?: string, onClickConfirm: () => any, loading?: boolean, buttonHidden?: boolean, disabled?: boolean, width?: string | number;
}) => {
  const openConfirm = Boolean(anchorEl);

  const calculateArrowLeft = (anchorEl: HTMLElement | null, popoverWidth: number): number => {
    if (!anchorEl) return 0;

    const anchorRect = anchorEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth; // Width of the viewport
    const anchorCenter = anchorRect.left + anchorRect.width / 2; // Center of the anchor

    // Calculate the Popover's left position
    const popoverLeft = Math.max(
      0, // Prevent Popover from going outside the left viewport boundary
      Math.min(
        anchorCenter - popoverWidth / 2, // Center the Popover
        viewportWidth - popoverWidth // Prevent Popover from going outside the right viewport boundary
      )
    );

    // Calculate the arrow's position relative to the Popover
    const arrowLeft = anchorCenter - popoverLeft;

    return arrowLeft;
  };
  return (
    <Popover
      open={openConfirm}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{
        elevation: 1,
        sx: {
          overflow: 'visible',
          borderRadius: 3,
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          // mt: 1,
          width: width ?? 400,
          position: "relative",
          // "&:before": {
          //   content: '""',
          //   display: "block",
          //   position: "absolute",
          //   top: -5, // Position the arrow slightly above the Popover
          //   left: `${calculateArrowLeft(anchorEl, 400)}px`, // Dynamically calculate the arrow position
          //   width: 10,
          //   height: 10,
          //   bgcolor: "background.paper",
          //   transform: "translateX(-50%) rotate(45deg)", // Center the arrow and rotate it
          //   zIndex: 1,
          //   borderLeft: "1px solid #e0e0e0",
          //   borderTop: "1px solid #e0e0e0",
          // },
        },
      }}>
      {/* > */}
      <Box className="modalScrollBar overflow-auto p-4">
        {!IsEmptyStr(title) && <Box className="flex items-center mb-4 text-themeBlack font-bold">
          <span className="text-themeYellow"><Error /></span>
          <p className="ml-1 -mb-[2px]">{title}</p>
        </Box>}
        <Box className="text-gray-500 text-sm">{children}</Box>
      </Box>
      {buttonHidden == false && <>
        {loading == true ? <VmSpinner />
          : <Box className="flex items-center justify-end gap-2 border-t p-4">
            <VmButton onClick={onClose} colorScheme={ColorScheme.DARK} variant="outlined" className="rounded-lg">{t('CANCEL')}</VmButton>
            <VmButton disabled={disabled} onClick={onClickConfirm} className="rounded-lg" colorScheme={ColorScheme.DARK} loading={loading}>{confirmTitle}</VmButton>
          </Box>}
      </>}
    </Popover>
  );
});
