import { useTranslation } from 'react-i18next';

/**
 * First focusable element on the page. Visually hidden until focused, then it
 * jumps keyboard and screen-reader users straight past the shell navigation.
 */
export const SkipLink = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only rounded-md border border-primary bg-background px-4 py-3 font-mono text-sm uppercase tracking-widest text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {t('a11y.skipToContent')}
    </a>
  );
};
