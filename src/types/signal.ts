export interface CellTower {
  id: string;
  mcc: string;
  mnc: string;
  lac: string;
  cellId: string;
  lat: number;
  lng: number;
  signalStrength: number;
  operator: string;
  technology: '2G' | '3G' | '4G' | '5G';
  lastSeen: Date;
  isSuspicious: boolean;
  suspiciousReason?: string;
}

export interface IMSIRecord {
  id: string;
  imsi: string;
  tmsi?: string;
  mcc: string;
  mnc: string;
  operator: string;
  signalStrength: number;
  timestamp: Date;
  cellId: string;
  isSuspicious: boolean;
  alertType?: 'IMSI_CATCHER' | 'RAPID_HANDOVER' | 'SILENT_SMS' | 'DOWNGRADE_ATTACK';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
}

export interface MetadataResult {
  filename: string;
  fileType: string;
  fileSize: number;
  extractedAt: Date;
  metadata: Record<string, string | number | boolean>;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  privacyRisks: string[];
}

export interface ScanStatus {
  isScanning: boolean;
  frequency: string;
  samplesCollected: number;
  startTime?: Date;
  deviceStatus: 'connected' | 'disconnected' | 'error';
}

export interface TriangulationResult {
  estimatedLat: number;
  estimatedLng: number;
  accuracy: number;
  towers: CellTower[];
  timestamp: Date;
}
