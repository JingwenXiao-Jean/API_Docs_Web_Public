import React, { Component, useEffect, useState } from 'react';
import { observer } from "mobx-react";
import { Box } from '@mui/material';
import RootStore from '../stores/root-store';
import useStores from '../hooks/use-stores';
import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { t } from 'i18next';

export const DragToUpload = observer(({ onUpload, children, imageFileOnly = false, disabled = false, isNoneFile }:
  { onUpload: any, children: any, imageFileOnly?: boolean, disabled?: boolean, isNoneFile: boolean; }) => {
  const dropRef = React.createRef();
  const { contactStore, rootStore } = useStores();
  const [isDraggingIn, setIsDraggingIn] = useState<boolean>(false);

  useEffect(() => {
    let div: any = dropRef.current;
    if (div) {
      div.addEventListener('dragenter', handleDragIn);
      div.addEventListener('dragleave', handleDragOut);
      div.addEventListener('dragover', handleDrag);
      div.addEventListener('drop', handleDrop);
      return () => {
        div.removeEventListener('dragenter', handleDragIn);
        div.removeEventListener('dragleave', handleDragOut);
        div.removeEventListener('dragover', handleDrag);
        div.removeEventListener('drop', handleDrop);
      };
    }
  }, [disabled]);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDraggingIn(true);
  };

  const handleDragIn = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOut = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDraggingIn(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const allFilesAreImages = files.every((file: any) => file.type.startsWith('image/'));
        if (allFilesAreImages || !imageFileOnly) onUpload(files);
        else rootStore.notify(t('ONLY_IMAGE_FILES_ALLOWED'), "info");
        e.dataTransfer.clearData();
      }
    }
    setIsDraggingIn(false);
  };



  return (
    <Box ref={dropRef} sx={{ maxHeight: 300 }}
      className={`rounded bg-gray-200 border-4 p-2 overflow-auto modalScrollBar ${isDraggingIn ? "opacity-75 border-solid border-themeYellow text-themeYellow" : "border-dashed border-gray-400 text-gray-500"} transition-all duration-300`}>
      {isNoneFile ? <Box className="bg-gray-200 text-center p-4">
        <Box className={`${isDraggingIn ? "-mt-2 mb-2" : ""} transition-all`}>
          {disabled ? <HelpOutline fontSize="large" /> : <FileUploadOutlined fontSize="large" />}
        </Box>
        <p className="text-sm">{disabled ? "No Uploaded Files" : isDraggingIn ? "Release to Upload" : "Drag to Upload Files"}</p>
      </Box> : children}
    </Box >
  );
});

export default DragToUpload;
