import { CellTower, IMSIRecord, Alert, MetadataResult, ScanStatus } from '@/types/signal';
import {
  DEFAULT_COUNTRY,
  getRandomOperator,
  generateIMSIForCountry,
  type CountryOperators,
} from './worldOperators';

const generateRandomTMSI = () => {
  return Math.random().toString(16).slice(2, 10).toUpperCase();
};

const generateRandomCellId = () => {
  return Math.floor(Math.random() * 65535).toString();
};

// Generate towers around user's actual location
export const generateCellTowersAroundLocation = (
  baseLat: number,
  baseLng: number,
  count: number = 10
): CellTower[] => {
  return Array.from({ length: count }, (_, i) => {
    const op = getRandomCroatianOperator();
    const isSuspicious = Math.random() > 0.85;
    // Spread towers within ~5km radius
    const latOffset = (Math.random() - 0.5) * 0.09;
    const lngOffset = (Math.random() - 0.5) * 0.09;
    
    return {
      id: `tower-${i}-${Date.now()}`,
      mcc: op.mcc,
      mnc: op.mnc,
      lac: Math.floor(Math.random() * 65535).toString(),
      cellId: generateRandomCellId(),
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset,
      signalStrength: -50 - Math.floor(Math.random() * 60),
      operator: op.name,
      technology: ['2G', '3G', '4G', '5G'][Math.floor(Math.random() * 4)] as CellTower['technology'],
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
      isSuspicious,
      suspiciousReason: isSuspicious 
        ? ['Unknown Cell ID', 'Signal strength anomaly', 'Forced 2G downgrade', 'Rapid LAC change'][Math.floor(Math.random() * 4)]
        : undefined,
    };
  });
};

// Legacy function - now uses Zagreb as default
export const generateMockCellTowers = (count: number = 10): CellTower[] => {
  // Default to Zagreb, Croatia
  return generateCellTowersAroundLocation(45.8150, 15.9819, count);
};

export const generateMockIMSIRecords = (count: number = 20): IMSIRecord[] => {
  return Array.from({ length: count }, (_, i) => {
    const op = getRandomCroatianOperator();
    const isSuspicious = Math.random() > 0.9;
    const alertTypes: IMSIRecord['alertType'][] = ['IMSI_CATCHER', 'RAPID_HANDOVER', 'SILENT_SMS', 'DOWNGRADE_ATTACK'];
    
    return {
      id: `imsi-${i}-${Date.now()}`,
      imsi: generateRandomIMSI(),
      tmsi: generateRandomTMSI(),
      mcc: op.mcc,
      mnc: op.mnc,
      operator: op.name,
      signalStrength: -50 - Math.floor(Math.random() * 60),
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      cellId: generateRandomCellId(),
      isSuspicious,
      alertType: isSuspicious ? alertTypes[Math.floor(Math.random() * alertTypes.length)] : undefined,
    };
  });
};

export const generateMockAlerts = (): Alert[] => {
  return [
    {
      id: 'alert-1',
      type: 'critical',
      title: 'Potential IMSI Catcher Detected',
      message: 'Unknown base station with unusually strong signal detected. Cell ID not in OpenCellID database.',
      timestamp: new Date(Date.now() - 300000),
      acknowledged: false,
      source: 'GSM Scanner',
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Rapid Tower Handover',
      message: 'Device changed towers 5 times in 30 seconds. This may indicate tracking or IMSI catcher activity.',
      timestamp: new Date(Date.now() - 600000),
      acknowledged: false,
      source: 'Handover Monitor',
    },
    {
      id: 'alert-3',
      type: 'warning',
      title: 'Forced 2G Downgrade',
      message: 'Connection forced to 2G despite 4G availability. Possible encryption downgrade attack.',
      timestamp: new Date(Date.now() - 900000),
      acknowledged: true,
      source: 'Protocol Analyzer',
    },
    {
      id: 'alert-4',
      type: 'info',
      title: 'New Cell Tower Detected',
      message: 'New legitimate tower added to local database. MCC: 219, MNC: 01, Cell ID: 45123.',
      timestamp: new Date(Date.now() - 1800000),
      acknowledged: true,
      source: 'Tower Monitor',
    },
  ];
};

export const generateMockMetadata = (): MetadataResult => {
  return {
    filename: 'IMG_20241215_143256.jpg',
    fileType: 'image/jpeg',
    fileSize: 4523897,
    extractedAt: new Date(),
    metadata: {
      'Make': 'Samsung',
      'Model': 'Galaxy S23 Ultra',
      'Software': 'Android 14',
      'DateTime': '2024:12:15 14:32:56',
      'ExposureTime': '1/125',
      'FNumber': '1.78',
      'ISO': 64,
      'FocalLength': '6.86mm',
      'GPSLatitude': '45.8150° N',
      'GPSLongitude': '15.9819° E',
      'GPSAltitude': '122m',
      'ImageWidth': 4032,
      'ImageHeight': 3024,
      'SerialNumber': 'R9XXXXXXXXXX',
    },
    gpsLocation: {
      lat: 45.8150,
      lng: 15.9819,
    },
    privacyRisks: [
      'GPS coordinates embedded - exact location exposed',
      'Device serial number visible',
      'Timestamp reveals when photo was taken',
      'Device model identifiable',
    ],
  };
};

export const generateMockScanStatus = (): ScanStatus => {
  return {
    isScanning: true,
    frequency: '935.2 MHz',
    samplesCollected: Math.floor(Math.random() * 100000),
    startTime: new Date(Date.now() - 3600000),
    deviceStatus: 'connected',
  };
};

// Real-time data simulation with alert callback for sounds
export const simulateRealtimeIMSI = (
  callback: (record: IMSIRecord) => void,
  onAlert?: (record: IMSIRecord) => void
) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      const records = generateMockIMSIRecords(1);
      const record = records[0];
      callback(record);
      
      // Trigger alert callback for suspicious records
      if (record.isSuspicious && onAlert) {
        onAlert(record);
      }
    }
  }, 2000);
  
  return () => clearInterval(interval);
};

export const simulateRealtimeAlert = (
  callback: (alert: Alert) => void,
  onSound?: (type: Alert['type']) => void
) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.95) {
      const alertTypes: Alert['type'][] = ['critical', 'warning', 'info'];
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      const alert: Alert = {
        id: `alert-${Date.now()}`,
        type,
        title: type === 'critical' 
          ? 'Potential IMSI Catcher Activity'
          : type === 'warning'
          ? 'Suspicious Network Behavior'
          : 'Network Update',
        message: 'Automated detection system flagged unusual activity.',
        timestamp: new Date(),
        acknowledged: false,
        source: 'Real-time Monitor',
      };
      
      callback(alert);
      
      // Trigger sound for critical/warning alerts
      if (onSound && type !== 'info') {
        onSound(type);
      }
    }
  }, 5000);
  
  return () => clearInterval(interval);
};
