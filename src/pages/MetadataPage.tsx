import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { MetadataAnalyzer } from '@/components/metadata/MetadataAnalyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch, Image, FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';

const MetadataPage = () => {
  return (
    <MainLayout>
      <Header
        title="Metadata Analyzer"
        subtitle="Extract and analyze hidden metadata from files using ExifTool"
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
                <h3 className="font-medium text-foreground">Images</h3>
                <p className="text-sm text-muted-foreground">
                  JPEG, PNG, TIFF, RAW files
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
                <h3 className="font-medium text-foreground">Documents</h3>
                <p className="text-sm text-muted-foreground">
                  PDF, DOC, XLS, PPT files
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
                <h3 className="font-medium text-foreground">Media</h3>
                <p className="text-sm text-muted-foreground">
                  Audio, video, and other formats
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
              Common Privacy-Sensitive Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'GPS Coordinates',
                  description: 'Exact location where photo/document was created',
                  risk: 'high',
                },
                {
                  title: 'Device Serial Numbers',
                  description: 'Unique identifiers linking to specific devices',
                  risk: 'high',
                },
                {
                  title: 'Timestamps',
                  description: 'Creation, modification, and access times',
                  risk: 'medium',
                },
                {
                  title: 'Author Information',
                  description: 'Names, usernames, or account details',
                  risk: 'medium',
                },
                {
                  title: 'Software Versions',
                  description: 'Apps and OS versions used to create file',
                  risk: 'low',
                },
                {
                  title: 'Camera Settings',
                  description: 'Lens, aperture, ISO, and focal length',
                  risk: 'low',
                },
                {
                  title: 'Network Info',
                  description: 'WiFi names, IP addresses in some files',
                  risk: 'high',
                },
                {
                  title: 'Editing History',
                  description: 'Track changes, revision history',
                  risk: 'medium',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">
                      {item.title}
                    </h4>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        item.risk === 'high' && 'bg-destructive/20 text-destructive',
                        item.risk === 'medium' && 'bg-warning/20 text-warning',
                        item.risk === 'low' && 'bg-muted text-muted-foreground',
                      )}
                    >
                      {item.risk} risk
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
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
