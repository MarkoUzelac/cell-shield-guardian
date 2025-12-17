import { CellTower, IMSIRecord, Alert, MetadataResult, ScanStatus } from '@/types/signal';

// Generate realistic-looking mock data
const operators = [
  { mcc: '310', mnc: '410', name: 'AT&T' },
  { mcc: '310', mnc: '260', name: 'T-Mobile' },
  { mcc: '311', mnc: '480', name: 'Verizon' },
  { mcc: '310', mnc: '120', name: 'Sprint' },
];

const generateRandomIMSI = () => {
  const op = operators[Math.floor(Math.random() * operators.length)];
  return `${op.mcc}${op.mnc}${Math.random().toString().slice(2, 12)}`;
};

const generateRandomTMSI = () => {
  return Math.random().toString(16).slice(2, 10).toUpperCase();
};

const generateRandomCellId = () => {
  return Math.floor(Math.random() * 65535).toString();
};

export const generateMockCellTowers = (count: number = 10): CellTower[] => {
  const baseLat = 40.7128;
  const baseLng = -74.0060;
  
  return Array.from({ length: count }, (_, i) => {
    const op = operators[Math.floor(Math.random() * operators.length)];
    const isSuspicious = Math.random() > 0.85;
    
    return {
      id: `tower-${i}`,
      mcc: op.mcc,
      mnc: op.mnc,
      lac: Math.floor(Math.random() * 65535).toString(),
      cellId: generateRandomCellId(),
      lat: baseLat + (Math.random() - 0.5) * 0.1,
      lng: baseLng + (Math.random() - 0.5) * 0.1,
      signalStrength: -50 - Math.floor(Math.random() * 60),
      operator: op.name,
      technology: ['2G', '3G', '4G', '5G'][Math.floor(Math.random() * 4)] as CellTower['technology'],
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
      isSuspicious,
      suspiciousReason: isSuspicious 
        ? ['Unknown Cell ID', 'Signal strength anomaly', 'Forced 2G downgrade'][Math.floor(Math.random() * 3)]
        : undefined,
    };
  });
};

export const generateMockIMSIRecords = (count: number = 20): IMSIRecord[] => {
  return Array.from({ length: count }, (_, i) => {
    const op = operators[Math.floor(Math.random() * operators.length)];
    const isSuspicious = Math.random() > 0.9;
    const alertTypes: IMSIRecord['alertType'][] = ['IMSI_CATCHER', 'RAPID_HANDOVER', 'SILENT_SMS', 'DOWNGRADE_ATTACK'];
    
    return {
      id: `imsi-${i}`,
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
      message: 'New legitimate tower added to local database. MCC: 310, MNC: 410, Cell ID: 45123.',
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
      'Make': 'Apple',
      'Model': 'iPhone 14 Pro',
      'Software': 'iOS 17.1.2',
      'DateTime': '2024:12:15 14:32:56',
      'ExposureTime': '1/125',
      'FNumber': '1.78',
      'ISO': 64,
      'FocalLength': '6.86mm',
      'GPSLatitude': '40.7128° N',
      'GPSLongitude': '74.0060° W',
      'GPSAltitude': '42m',
      'ImageWidth': 4032,
      'ImageHeight': 3024,
      'SerialNumber': 'DNQXXXXXFRG',
    },
    gpsLocation: {
      lat: 40.7128,
      lng: -74.0060,
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

// Real-time data simulation
export const simulateRealtimeIMSI = (callback: (record: IMSIRecord) => void) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      const records = generateMockIMSIRecords(1);
      callback(records[0]);
    }
  }, 2000);
  
  return () => clearInterval(interval);
};

export const simulateRealtimeAlert = (callback: (alert: Alert) => void) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.95) {
      const alertTypes: Alert['type'][] = ['critical', 'warning', 'info'];
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      callback({
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
      });
    }
  }, 5000);
  
  return () => clearInterval(interval);
};
