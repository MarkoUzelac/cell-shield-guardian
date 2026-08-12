import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { hr } from './locales/hr';
import { countryDetector } from './regionDetector';

export const DEFAULT_LANGUAGE = 'en';

/** Languages the UI ships with. Add new entries alongside a locale file. */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hr', label: 'Hrvatski', short: 'HR' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const resources = {
  en: { translation: en },
  hr: { translation: hr },
} as const;

const detector = new LanguageDetector();
detector.addDetector(countryDetector);

void i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    detection: {
      // An explicit choice always wins; after that we adapt to the visitor's
      // country (resolved offline from their time zone), then to the browser
      // UI language.
      order: ['querystring', 'localStorage', 'country', 'navigator', 'htmlTag'],
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
