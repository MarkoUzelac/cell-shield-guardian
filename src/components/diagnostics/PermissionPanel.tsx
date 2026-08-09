import { useTranslation } from 'react-i18next';
import { KeyRound, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CapabilityBadge } from '@/components/diagnostics/CapabilityBadge';
import {
  PERMISSION_PROBES,
  capabilityForState,
  type PermissionProbeId,
  type PermissionStates,
} from '@/lib/diagnostics/permissions';

interface PermissionPanelProps {
  states: PermissionStates;
  onRequest: (id: PermissionProbeId) => void;
  onRefresh: () => void;
  busy?: boolean;
}

/**
 * Lets the user run a real permission check for each gated capability. The
 * browser's own prompt is triggered by the click, and the matrix updates as
 * soon as the answer (or a later change in browser settings) arrives.
 */
export const PermissionPanel = ({
  states,
  onRequest,
  onRefresh,
  busy = false,
}: PermissionPanelProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <KeyRound className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <h2 className="eyebrow text-xs text-muted-foreground">
              {t('pages.capabilities.permissions.title')}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11 shrink-0"
            onClick={onRefresh}
            disabled={busy}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {t('pages.capabilities.permissions.refresh')}
          </Button>
        </div>

        <p className="border-b border-border/60 px-3 py-3 text-xs leading-relaxed text-muted-foreground">
          {t('pages.capabilities.permissions.intro')}
        </p>

        <ul>
          {PERMISSION_PROBES.map((probe) => {
            const state = states[probe.id];
            const requesting = state === 'requesting';
            const actionable = state === 'prompt' || state === 'error';
            return (
              <li
                key={probe.id}
                className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 px-3 py-3 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {t(`pages.capabilities.permissions.probe.${probe.id}.label`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`pages.capabilities.permissions.state.${state}`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`pages.capabilities.permissions.probe.${probe.id}.description`)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <CapabilityBadge capability={capabilityForState(state)} />
                  {actionable && (
                    <Button
                      size="sm"
                      className="min-h-11"
                      onClick={() => onRequest(probe.id)}
                      disabled={requesting}
                    >
                      {t('pages.capabilities.permissions.check')}
                    </Button>
                  )}
                  {requesting && (
                    <Loader2
                      className="h-4 w-4 animate-spin text-primary"
                      aria-label={t('pages.capabilities.permissions.state.requesting')}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="border-t border-border/60 px-3 py-3 text-xs leading-relaxed text-muted-foreground">
          {t('pages.capabilities.permissions.footer')}
        </p>
      </CardContent>
    </Card>
  );
};
