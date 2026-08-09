import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface TriangulationFormProps {
  onSubmit: (data: { mcc: string; mnc: string; lac: string; cellId: string }) => void;
  isLoading?: boolean;
}

export const TriangulationForm = ({ onSubmit, isLoading }: TriangulationFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    mcc: '',
    mnc: '',
    lac: '',
    cellId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {t('components.triangulation.title')}
        </CardTitle>
        <CardDescription>
          {t('components.triangulation.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mcc">{t('components.triangulation.mccLabel')}</Label>
              <Input
                id="mcc"
                placeholder={t('components.triangulation.mccPlaceholder')}
                value={formData.mcc}
                onChange={handleChange('mcc')}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mnc">{t('components.triangulation.mncLabel')}</Label>
              <Input
                id="mnc"
                placeholder={t('components.triangulation.mncPlaceholder')}
                value={formData.mnc}
                onChange={handleChange('mnc')}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lac">{t('components.triangulation.lacLabel')}</Label>
              <Input
                id="lac"
                placeholder={t('components.triangulation.lacPlaceholder')}
                value={formData.lac}
                onChange={handleChange('lac')}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cellId">{t('components.triangulation.cellIdLabel')}</Label>
              <Input
                id="cellId"
                placeholder={t('components.triangulation.cellIdPlaceholder')}
                value={formData.cellId}
                onChange={handleChange('cellId')}
                className="font-mono"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                {t('components.triangulation.lookupLocation')}
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">{t('components.triangulation.aboutTitle')}</p>
              <p>
                {t('components.triangulation.aboutDescription')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
