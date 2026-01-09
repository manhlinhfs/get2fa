import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languagedetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV, // Enable debug in development

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Optional: detect specific patterns if needed, but defaults are usually fine
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // cache user language on keys
    },
  });

export default i18n;
