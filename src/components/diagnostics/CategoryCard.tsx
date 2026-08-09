import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiagnosticRow } from './DiagnosticRow';
import { StatusBadge } from './StatusBadge';
import { worstStatus } from '@/lib/diagnostics/engine';
import type { DiagnosticCategory, DiagnosticResult } from '@/lib/diagnostics/types';

interface CategoryCardProps {
  category: DiagnosticCategory;
  results: DiagnosticResult[];
  showTechnical: boolean;
}

export const CategoryCard = ({ category, results, showTechnical }: CategoryCardProps) => {
  const { t } = useTranslation();
  if (results.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-1 pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{t(`diagnostics.category.${category}`)}</CardTitle>
          <StatusBadge status={worstStatus(results)} />
        </div>
        <p className="text-xs text-muted-foreground">
          {t(`diagnostics.categoryDescription.${category}`)}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="border-t border-border/60">
          {results.map((result) => (
            <DiagnosticRow key={result.id} result={result} showTechnical={showTechnical} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
