import { useTranslation } from 'react-i18next';
import type { DiagnosticResult } from '@/lib/diagnostics/types';

/**
 * Resolves the user-facing copy of a diagnostic through the translation layer.
 *
 * Copy is authored in English inside the engine and used as the fallback, so a
 * new check is never blank. Locales override it per check id, and — when the
 * check reports an outcome-specific wording — per variant:
 *
 *   diagnostics.checks.<id>.<variant>.<field>   (preferred)
 *   diagnostics.checks.<id>.<field>             (fallback)
 *
 * `result.params` is passed straight to i18next, so translators can place
 * numbers, names and counts anywhere in the sentence and rely on real
 * pluralisation (`count`) and locale-aware number formatting
 * (`{{ms, number}}`) instead of English string concatenation.
 */
export function useDiagnosticText(result: DiagnosticResult) {
  const { t } = useTranslation();

  const base = `diagnostics.checks.${result.id}`;
  const keys = (field: string) =>
    result.variant ? [`${base}.${result.variant}.${field}`, `${base}.${field}`] : `${base}.${field}`;

  const params = result.params ?? {};

  const label = t(`${base}.label`, { defaultValue: result.label, ...params });

  const fallbackValue = result.unit ? `${result.value} ${result.unit}` : result.value;
  const value = t(keys('value'), { defaultValue: fallbackValue, ...params });

  const explanation = t(keys('explanation'), {
    defaultValue: result.explanation,
    ...params,
  });

  const recommendation = result.recommendation
    ? t(keys('recommendation'), { defaultValue: result.recommendation, ...params })
    : undefined;

  return { label, value, explanation, recommendation };
}
