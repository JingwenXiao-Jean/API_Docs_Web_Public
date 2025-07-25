import { IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react"
import { Fragment, useEffect, useState } from "react";
import useStores from "../../hooks/use-stores"
import CloseIcon from '@mui/icons-material/Close';
import { observer } from "mobx-react";
import { AIControlProvider } from "../../hooks/ai-control-context";

const NotificationContext = React.createContext(null);
const NotificationProvider = observer(({ children }: any) => {
  const { rootStore } = useStores();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const mounted = React.useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);
  // @ts-ignore
  const action = key => (
    <Fragment>
      <IconButton sx={{ color: 'white' }} onClick={() => { closeSnackbar(key) }}>
        <CloseIcon color="inherit" />
      </IconButton>
    </Fragment>
  );
  useEffect(() => {
    if (rootStore.notification) {
      if ('message' in rootStore.notification && rootStore.notification.message != '') {
        enqueueSnackbar(rootStore.notification.message, {
          // @ts-ignore
          ...rootStore.notification.options,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          action
        });
      }
    }
    rootStore.notification.message = "";
  }, [rootStore.notification.message]);

  return (
    <AIControlProvider>
      <NotificationContext.Provider value={null}>
        {children}
      </NotificationContext.Provider>
    </AIControlProvider>
  );

});

export default NotificationProvider;
