import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_NAV_ITEMS } from '@/components/layout/navConfig';

/** Keys handled globally, documented in the shortcuts dialog. */
export interface ShortcutHandlers {
  onToggleHelp: () => void;
  onToggleSidebar?: () => void;
}

const isEditable = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable === true
  );
};

/**
 * Global keyboard shortcuts. Alt is used as the modifier so nothing collides
 * with assistive-technology pass-through keys or browser defaults.
 *
 *  Alt+1 … Alt+9  jump to the nth navigation destination
 *  Alt+S          collapse / expand the sidebar
 *  Shift+?        open this list
 */
export const useKeyboardShortcuts = ({ onToggleHelp, onToggleSidebar }: ShortcutHandlers) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isEditable(event.target) || event.metaKey || event.ctrlKey) return;

      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault();
        onToggleHelp();
        return;
      }

      if (!event.altKey) return;

      if (event.key.toLowerCase() === 's' && onToggleSidebar) {
        event.preventDefault();
        onToggleSidebar();
        return;
      }

      const index = Number.parseInt(event.key, 10);
      if (Number.isInteger(index) && index >= 1 && index <= ALL_NAV_ITEMS.length) {
        event.preventDefault();
        navigate(ALL_NAV_ITEMS[index - 1].to);
        // Move focus into the page so the next Tab continues from the content.
        window.setTimeout(() => document.getElementById('main-content')?.focus(), 80);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, onToggleHelp, onToggleSidebar]);
};
