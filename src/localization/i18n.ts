// i18n-web.ts
// This i18n file created because I failed to conditionally initiate i18n configuration based on different platforms.
// To be specific, the problems occurs on native side.
//
// In Expo, we have to apply the language detector to i18n instance. But before that, we have to import
// expo-localization.
//
// While expo-localization is weird. If you import it, whatever you use it or not, the code runs. Apparently, we would
// not use the locale object from expo-localization in web. But putting this code in the Platform.OS !== web statement,
// it would run under web environment anyway. It crashes the web application.
//
// Don't try dynamic import provided by NextJS either. It's only for the component.
// Don't try original dynamic import. It's async. You have to enable top-level await option. I haven't tested this.

// @author xyd

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en-AU';
import zh from './zh-CN';
// import tw from './zh-TW';

const isServer = typeof window === 'undefined';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-AU': en,
      'zh-CN': zh,
      // 'zh-TW': tw,
    },
    // have a common namespace used around the full app
    // ns: ['translation'],
    // defaultNS: 'translation',
    fallbackLng: 'en-AU',
    debug: false,
    preload: isServer && ['en-AU', 'zh-CN'], // array of languages to preload. Important on serverside to assert translations are loaded before rendering views.
    // cache: {
    //   enabled: true,
    // },
    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
    initImmediate: false,
    // saveMissing: true,
    // missingKeyHandler: (lng, ns, key, fallbackValue) => {
    //   return key;
    // },
  });

export default i18n;
