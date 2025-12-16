import { AlertTriangle, Shield, Github, BookOpen, ExternalLink } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <MainLayout>
      <Header
        title="About"
        subtitle="Privacy Signal Monitor - Educational security tool"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Disclaimer */}
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Important Legal Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground">
              <strong>Privacy Signal Monitor</strong> is designed exclusively for{' '}
              <strong>educational, research, and defensive privacy protection</strong>{' '}
              purposes. This tool is intended to help users:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Detect if they are being tracked via mobile networks</li>
              <li>Learn about mobile privacy risks and vulnerabilities</li>
              <li>Monitor their own devices and local GSM signals</li>
              <li>Analyze publicly available or self-captured data</li>
            </ul>
            <div className="p-4 bg-background/50 rounded-lg border border-destructive/20">
              <p className="font-medium text-destructive mb-2">
                ⚠️ This tool must NOT be used for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Tracking or monitoring other people without consent</li>
                <li>Active signal interception or jamming</li>
                <li>Any activity that violates local telecommunications laws</li>
                <li>Unauthorized access to mobile networks</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              <strong>Users are solely responsible</strong> for ensuring their use of
              this software complies with all applicable local, state, and federal
              laws. The developers assume no liability for misuse.
            </p>
          </CardContent>
        </Card>

        {/* About the Project */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              About This Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Privacy Signal Monitor is an open-source dashboard that combines
              multiple privacy and security tools into a unified interface. It was
              created to help privacy-conscious individuals understand and protect
              themselves from mobile surveillance threats.
            </p>
            <h4 className="font-medium text-foreground">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>IMSI Catcher Detection:</strong> Passive monitoring of GSM
                signals to detect fake base stations
              </li>
              <li>
                <strong>Cell Tower Triangulation:</strong> Map cell towers and
                estimate locations using OpenCellID
              </li>
              <li>
                <strong>Metadata Analysis:</strong> Extract hidden data from files
                using ExifTool integration
              </li>
              <li>
                <strong>Alert System:</strong> Real-time notifications for suspicious
                network activity
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical Requirements */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Technical Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Hardware</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• RTL-SDR USB Dongle (v3 recommended)</li>
                  <li>• Suitable antenna for GSM frequencies</li>
                  <li>• Linux computer (Ubuntu 20.04+)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Software</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Python 3.8+</li>
                  <li>• gr-gsm, rtl-sdr, kalibrate-rtl</li>
                  <li>• ExifTool</li>
                  <li>• Flask backend (optional)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Resources & Documentation</CardTitle>
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
                    <div className="font-medium">Source Code</div>
                    <div className="text-xs text-muted-foreground">
                      View on GitHub
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
                    <div className="font-medium">OpenCellID</div>
                    <div className="text-xs text-muted-foreground">
                      Cell tower database
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
                    <div className="font-medium">gr-gsm</div>
                    <div className="text-xs text-muted-foreground">
                      GSM receiver blocks
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
                    <div className="font-medium">ExifTool</div>
                    <div className="text-xs text-muted-foreground">
                      Metadata extraction
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
          <p>Privacy Signal Monitor v1.0.0</p>
          <p className="mt-1">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
