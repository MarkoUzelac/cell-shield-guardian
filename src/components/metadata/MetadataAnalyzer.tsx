import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileImage, AlertTriangle, MapPin, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetadataResult } from '@/types/signal';
import { generateMockMetadata } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const MetadataAnalyzer = () => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MetadataResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock result (in real app, would call backend API with ExifTool)
    const mockResult = generateMockMetadata();
    mockResult.filename = selectedFile.name;
    mockResult.fileSize = selectedFile.size;
    mockResult.fileType = selectedFile.type;

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Area */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">{t('components.metadata.uploadTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-all',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/50',
              file && 'border-success bg-success/5'
            )}
          >
            {file ? (
              <div className="space-y-4">
                <FileImage className="w-12 h-12 mx-auto text-success" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={clearFile}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('components.metadata.remove')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className={cn(
                  'w-12 h-12 mx-auto transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                )} />
                <div>
                  <p className="font-medium text-foreground">
                    {t('components.metadata.dragDrop')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('components.metadata.orBrowse')}
                  </p>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {t('components.metadata.browseFiles')}
                  </label>
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>{t('components.metadata.supportedFormats')}</p>
            <p className="mt-1">
              {t('components.metadata.analysisDescription')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Area */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            {t('components.metadata.resultsTitle')}
            {result && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t('components.metadata.exportJson')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="mt-4 text-muted-foreground">{t('components.metadata.analyzing')}</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Privacy Risks */}
                {result.privacyRisks.length > 0 && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <span className="font-semibold text-destructive">
                        {t('components.metadata.privacyRisksDetected')}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {result.privacyRisks.map((risk, i) => (
                        <li key={i} className="text-sm text-destructive/80 flex items-start gap-2">
                          <span>•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* GPS Location */}
                {result.gpsLocation && (
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-warning" />
                      <span className="font-semibold text-warning">{t('components.metadata.gpsLocationFound')}</span>
                    </div>
                    <p className="font-mono text-sm text-foreground">
                      {result.gpsLocation.lat.toFixed(6)}, {result.gpsLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}

                {/* Metadata Table */}
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">{t('components.metadata.extractedMetadata')}</h4>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(result.metadata).map(([key, value], i) => (
                          <tr
                            key={key}
                            className={cn(
                              'border-b border-border/50 last:border-0',
                              i % 2 === 0 && 'bg-muted/20'
                            )}
                          >
                            <td className="px-3 py-2 text-muted-foreground font-medium">
                              {key}
                            </td>
                            <td className="px-3 py-2 font-mono text-foreground">
                              {String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              >
                <FileImage className="w-12 h-12 mb-4 opacity-50" />
                <p>{t('components.metadata.emptyState')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};
