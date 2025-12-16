import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TriangulationFormProps {
  onSubmit: (data: { mcc: string; mnc: string; lac: string; cellId: string }) => void;
  isLoading?: boolean;
}

export const TriangulationForm = ({ onSubmit, isLoading }: TriangulationFormProps) => {
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
          Cell Tower Triangulation
        </CardTitle>
        <CardDescription>
          Enter cell tower identifiers to estimate location using OpenCellID database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mcc">MCC (Country Code)</Label>
              <Input
                id="mcc"
                placeholder="e.g. 310"
                value={formData.mcc}
                onChange={handleChange('mcc')}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mnc">MNC (Network Code)</Label>
              <Input
                id="mnc"
                placeholder="e.g. 410"
                value={formData.mnc}
                onChange={handleChange('mnc')}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lac">LAC (Location Area Code)</Label>
              <Input
                id="lac"
                placeholder="e.g. 12345"
                value={formData.lac}
                onChange={handleChange('lac')}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cellId">Cell ID</Label>
              <Input
                id="cellId"
                placeholder="e.g. 67890"
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
                Lookup Location
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">About Cell Tower Lookup</p>
              <p>
                This uses the OpenCellID database to estimate tower locations. 
                Accuracy varies by region. You can obtain cell info from your 
                device's engineering mode or captured GSM data.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
