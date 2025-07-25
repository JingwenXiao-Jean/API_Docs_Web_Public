import "./src/styles/global.css";
import "./src/styles/output.css";
import './src/localization/i18n';
import React, { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
import NotificationProvider from './src/components/root/notification';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { I18nextProvider, useTranslation } from 'react-i18next';
import { isWeb } from './src/utilities/platform';
import { StyledNotiStackContent, THEME_GREEN } from './src/constants/style';
import { blue, red, lightGreen, orange } from '@mui/material/colors';
import { CheckCircle, Error, AutoAwesome, NotificationsActive } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: THEME_GREEN,
    },
  },
});

const LocalizationProvider = ({ children }) => {
  const { i18n } = useTranslation();


// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isWeb && localStorage.LANG) i18n.changeLanguage(localStorage.LANG);
    else {
      i18n.changeLanguage('en-AU');
      localStorage.LANG = 'en-AU';
    }
  }, []);

  return (<I18nextProvider i18n={i18n}>{children}</I18nextProvider>);
};

export const wrapRootElement = ({ element, props }) => {
  return (
    <SnackbarProvider iconVariant={{
      success: <CheckCircle color={lightGreen[500]} sx={{ mr: 1 }} />,
      error: <Error color={red[500]} sx={{ mr: 1 }} />,
      warning: <NotificationsActive color={orange[500]} sx={{ mr: 1 }} />,
      info: <AutoAwesome color={blue[500]} sx={{ mr: 1 }} />,
    }} Components={{
      success: StyledNotiStackContent,
      error: StyledNotiStackContent,
      warning: StyledNotiStackContent,
      info: StyledNotiStackContent,
    }}>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider>{element}</LocalizationProvider>
        </ThemeProvider>
      </NotificationProvider>
    </SnackbarProvider>
  );
};