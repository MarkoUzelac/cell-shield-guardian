import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Keeps `<html lang>` in sync with the active language so screen readers pick
 * the right pronunciation rules after a language switch.
 */
export const HtmlLangSync = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.resolvedLanguage ?? i18n.language;
    if (lang) document.documentElement.lang = lang;
  }, [i18n.resolvedLanguage, i18n.language]);

  return null;
};
