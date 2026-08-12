import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  /** `compact` renders icon + code only, for tight bars. */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * Lets the visitor override the automatically detected language. The choice is
 * persisted by i18next's localStorage cache, so it survives reloads.
 */
export const LanguageSwitcher = ({ variant = 'full', className }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();
  const active = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="group"
      aria-label={t('common.language.label')}
    >
      {variant === 'full' && (
        <Languages className="mr-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = active === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            lang={lang.code}
            onClick={() => void i18n.changeLanguage(lang.code)}
            aria-pressed={isActive}
            aria-label={t('common.language.switchTo', { language: lang.label })}
            className={cn(
              'min-h-11 rounded-md border px-3 font-mono text-xs uppercase tracking-widest transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            )}
          >
            {variant === 'compact' ? lang.short : lang.label}
          </button>
        );
      })}
    </div>
  );
};
