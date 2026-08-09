import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';

export const DEFAULT_LANGUAGE = 'en';

/** Languages the UI ships with. Add new entries alongside a locale file. */
export const SUPPORTED_LANGUAGES = [{ code: 'en', label: 'English' }] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const resources = {
  en: { translation: en },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    // English is the only shipped language today; detection is wired so adding
    // a locale file is the only work needed to support another one.
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'csg.language',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
