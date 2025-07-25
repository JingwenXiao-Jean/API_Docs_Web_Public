import { Box, Fade, Modal } from "@mui/material";
import { observer } from "mobx-react";
import * as React from "react";
import VmIconButton from "./shared-icon-button";
import { Close } from "@mui/icons-material";
import { t } from 'i18next';

const VmModal = observer(({ minWidth, width = "auto", open, onClose, height = 'auto', minHeight, children, title, removeContentPadding = false, enableBgOnClose = true }: {
  minWidth?: string | number, width?: string | number, open: boolean, onClose?: () => void, height?: 'auto' | '70vh' | '80vh' | '90vh' | '95vh', minHeight?: number | 'auto' | '70vh' | '80vh' | '90vh', children: any, title?: string, removeContentPadding?: boolean, enableBgOnClose?: boolean;
}) => {
  const MODAL_STYLE = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width ? width : '70%',
    borderRadius: 6,
    boxShadow: 24,
    minHeight: minHeight ?? 'auto',
    transition: 'width 0.5s ease-in-out',
    bgcolor: 'white',
    minWidth: minWidth ?? 100
  };

  return (
    <Box>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={enableBgOnClose ? onClose : () => { }}
        closeAfterTransition
        disableEnforceFocus
      >
        <Fade in={open}>
          <Box sx={MODAL_STYLE}>
            <Box className={`modalScrollBar overflow-auto py-4 ${removeContentPadding ? "" : "px-6"}`} sx={{ height, maxHeight: '90vh' }}>
              <Box className={`flex justify-between items-center mb-4 ${removeContentPadding ? "px-6" : ""}`}>
                <p className="text-lg font-bold">{title}</p>
                <VmIconButton tooltip={t('CLOSE')} onClick={onClose}><Close /></VmIconButton>
              </Box>
              <Box className={removeContentPadding ? "" : ""}>{children}</Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
});

export default VmModal;
