import { AlertTriangle, Shield, Github, BookOpen, ExternalLink } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Header
        title={t('pages.about.header.title')}
        subtitle={t('pages.about.header.subtitle')}
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Disclaimer */}
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {t('pages.about.disclaimer.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground">
              <Trans i18nKey="pages.about.disclaimer.intro" components={{ strong: <strong /> }} />
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t('pages.about.disclaimer.purposes.item1')}</li>
              <li>{t('pages.about.disclaimer.purposes.item2')}</li>
              <li>{t('pages.about.disclaimer.purposes.item3')}</li>
              <li>{t('pages.about.disclaimer.purposes.item4')}</li>
            </ul>
            <div className="p-4 bg-background/50 rounded-lg border border-destructive/20">
              <p className="font-medium text-destructive mb-2">
                {t('pages.about.disclaimer.mustNotTitle')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>{t('pages.about.disclaimer.prohibited.item1')}</li>
                <li>{t('pages.about.disclaimer.prohibited.item2')}</li>
                <li>{t('pages.about.disclaimer.prohibited.item3')}</li>
                <li>{t('pages.about.disclaimer.prohibited.item4')}</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              <Trans i18nKey="pages.about.disclaimer.responsibility" components={{ strong: <strong /> }} />
            </p>
          </CardContent>
        </Card>

        {/* About the Project */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {t('pages.about.aboutProject.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              {t('pages.about.aboutProject.intro')}
            </p>
            <h4 className="font-medium text-foreground">{t('pages.about.aboutProject.keyFeaturesTitle')}</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>{t('pages.about.aboutProject.features.imsiCatcher.label')}</strong>{' '}
                {t('pages.about.aboutProject.features.imsiCatcher.description')}
              </li>
              <li>
                <strong>{t('pages.about.aboutProject.features.cellTower.label')}</strong>{' '}
                {t('pages.about.aboutProject.features.cellTower.description')}
              </li>
              <li>
                <strong>{t('pages.about.aboutProject.features.metadata.label')}</strong>{' '}
                {t('pages.about.aboutProject.features.metadata.description')}
              </li>
              <li>
                <strong>{t('pages.about.aboutProject.features.alertSystem.label')}</strong>{' '}
                {t('pages.about.aboutProject.features.alertSystem.description')}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical Requirements */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>{t('pages.about.technicalRequirements.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">{t('pages.about.technicalRequirements.hardware.title')}</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t('pages.about.technicalRequirements.hardware.item1')}</li>
                  <li>• {t('pages.about.technicalRequirements.hardware.item2')}</li>
                  <li>• {t('pages.about.technicalRequirements.hardware.item3')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">{t('pages.about.technicalRequirements.software.title')}</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {t('pages.about.technicalRequirements.software.item1')}</li>
                  <li>• {t('pages.about.technicalRequirements.software.item2')}</li>
                  <li>• {t('pages.about.technicalRequirements.software.item3')}</li>
                  <li>• {t('pages.about.technicalRequirements.software.item4')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>{t('pages.about.resources.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{t('pages.about.resources.sourceCode.title')}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('pages.about.resources.sourceCode.description')}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <a
                  href="https://opencellid.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{t('pages.about.resources.openCellId.title')}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('pages.about.resources.openCellId.description')}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <a
                  href="https://osmocom.org/projects/gr-gsm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{t('pages.about.resources.grGsm.title')}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('pages.about.resources.grGsm.description')}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-4" asChild>
                <a
                  href="https://exiftool.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{t('pages.about.resources.exifTool.title')}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('pages.about.resources.exifTool.description')}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>{t('pages.about.version.line1')}</p>
          <p className="mt-1">
            {t('pages.about.version.line2')}
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
