import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ALL_NAV_ITEMS } from '@/components/layout/navConfig';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Keys = ({ keys }: { keys: string[] }) => (
  <span className="flex shrink-0 items-center gap-1">
    {keys.map((key) => (
      <kbd
        key={key}
        className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] uppercase text-foreground"
      >
        {key}
      </kbd>
    ))}
  </span>
);

/** Reference list opened with Shift+? — Radix handles focus trap and Escape. */
export const KeyboardShortcutsDialog = ({ open, onOpenChange }: KeyboardShortcutsDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display uppercase">{t('a11y.shortcuts.title')}</DialogTitle>
          <DialogDescription>{t('a11y.shortcuts.description')}</DialogDescription>
        </DialogHeader>

        <ul className="space-y-1.5">
          <li className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2">
            <span className="text-sm text-foreground">{t('a11y.shortcuts.help')}</span>
            <Keys keys={['Shift', '?']} />
          </li>
          <li className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2">
            <span className="text-sm text-foreground">{t('a11y.shortcuts.sidebar')}</span>
            <Keys keys={['Alt', 'S']} />
          </li>
          {ALL_NAV_ITEMS.map((item, index) => (
            <li
              key={item.to}
              className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2"
            >
              <span className="truncate text-sm text-foreground">{t(item.labelKey)}</span>
              <Keys keys={['Alt', String(index + 1)]} />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
