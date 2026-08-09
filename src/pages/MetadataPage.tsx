import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { MetadataAnalyzer } from '@/components/metadata/MetadataAnalyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch, Image, FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const MetadataPage = () => {
  const { t } = useTranslation();

  const metadataItems = [
    {
      key: 'gpsCoordinates',
      risk: 'high',
    },
    {
      key: 'deviceSerialNumbers',
      risk: 'high',
    },
    {
      key: 'timestamps',
      risk: 'medium',
    },
    {
      key: 'authorInformation',
      risk: 'medium',
    },
    {
      key: 'softwareVersions',
      risk: 'low',
    },
    {
      key: 'cameraSettings',
      risk: 'low',
    },
    {
      key: 'networkInfo',
      risk: 'high',
    },
    {
      key: 'editingHistory',
      risk: 'medium',
    },
  ] as const;

  return (
    <MainLayout>
      <Header
        title={t('pages.metadata.title')}
        subtitle={t('pages.metadata.subtitle')}
      />

      <div className="p-6 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border card-hover">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{t('pages.metadata.infoCards.images.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.metadata.infoCards.images.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-hover">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{t('pages.metadata.infoCards.documents.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.metadata.infoCards.documents.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-hover">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                <File className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{t('pages.metadata.infoCards.media.title')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.metadata.infoCards.media.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analyzer Component */}
        <MetadataAnalyzer />

        {/* Common Metadata Types */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-primary" />
              {t('pages.metadata.commonMetadata.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metadataItems.map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">
                      {t(`pages.metadata.commonMetadata.items.${item.key}.title`)}
                    </h4>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        item.risk === 'high' && 'bg-destructive/20 text-destructive',
                        item.risk === 'medium' && 'bg-warning/20 text-warning',
                        item.risk === 'low' && 'bg-muted text-muted-foreground',
                      )}
                    >
                      {t('pages.metadata.commonMetadata.riskLabel', {
                        risk: t(`pages.metadata.commonMetadata.riskLevels.${item.risk}`),
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t(`pages.metadata.commonMetadata.items.${item.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MetadataPage;
