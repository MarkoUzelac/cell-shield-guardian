import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ALL_NAV_ITEMS } from '@/components/layout/navConfig';

/**
 * Screen readers do not announce client-side route changes on their own, so we
 * push the new page name into a polite live region after every navigation.
 */
export const RouteAnnouncer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const item = ALL_NAV_ITEMS.find((navItem) => navItem.to === location.pathname);
    const name = item ? t(item.labelKey) : document.title;
    // Defer so the live region is registered before the text lands in it.
    const id = window.setTimeout(() => setMessage(t('a11y.navigatedTo', { page: name })), 120);
    return () => window.clearTimeout(id);
  }, [location.pathname, t]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
};
