import { CellTower, IMSIRecord, Alert, MetadataResult, ScanStatus } from '@/types/signal';

// Regional operators by country code
const operatorsByRegion: Record<string, { mcc: string; mnc: string; name: string }[]> = {
  US: [
    { mcc: '310', mnc: '410', name: 'AT&T' },
    { mcc: '310', mnc: '260', name: 'T-Mobile' },
    { mcc: '311', mnc: '480', name: 'Verizon' },
    { mcc: '312', mnc: '530', name: 'US Cellular' },
  ],
  UK: [
    { mcc: '234', mnc: '10', name: 'O2' },
    { mcc: '234', mnc: '15', name: 'Vodafone' },
    { mcc: '234', mnc: '20', name: 'Three' },
    { mcc: '234', mnc: '30', name: 'EE' },
  ],
  DE: [
    { mcc: '262', mnc: '01', name: 'Telekom' },
    { mcc: '262', mnc: '02', name: 'Vodafone' },
    { mcc: '262', mnc: '03', name: 'O2' },
    { mcc: '262', mnc: '07', name: '1&1' },
  ],
  FR: [
    { mcc: '208', mnc: '01', name: 'Orange' },
    { mcc: '208', mnc: '10', name: 'SFR' },
    { mcc: '208', mnc: '15', name: 'Free' },
    { mcc: '208', mnc: '20', name: 'Bouygues' },
  ],
  IN: [
    { mcc: '404', mnc: '10', name: 'Airtel' },
    { mcc: '404', mnc: '86', name: 'Vodafone Idea' },
    { mcc: '405', mnc: '854', name: 'Jio' },
    { mcc: '404', mnc: '04', name: 'BSNL' },
  ],
  AU: [
    { mcc: '505', mnc: '01', name: 'Telstra' },
    { mcc: '505', mnc: '02', name: 'Optus' },
    { mcc: '505', mnc: '03', name: 'Vodafone' },
    { mcc: '505', mnc: '06', name: 'TPG' },
  ],
  BR: [
    { mcc: '724', mnc: '10', name: 'Vivo' },
    { mcc: '724', mnc: '02', name: 'TIM' },
    { mcc: '724', mnc: '05', name: 'Claro' },
    { mcc: '724', mnc: '31', name: 'Oi' },
  ],
  JP: [
    { mcc: '440', mnc: '10', name: 'NTT Docomo' },
    { mcc: '440', mnc: '20', name: 'SoftBank' },
    { mcc: '440', mnc: '50', name: 'KDDI au' },
    { mcc: '440', mnc: '51', name: 'Rakuten' },
  ],
  CA: [
    { mcc: '302', mnc: '220', name: 'Telus' },
    { mcc: '302', mnc: '720', name: 'Rogers' },
    { mcc: '302', mnc: '610', name: 'Bell' },
    { mcc: '302', mnc: '490', name: 'Freedom' },
  ],
  DEFAULT: [
    { mcc: '001', mnc: '01', name: 'Carrier Alpha' },
    { mcc: '001', mnc: '02', name: 'Carrier Beta' },
    { mcc: '001', mnc: '03', name: 'Carrier Gamma' },
    { mcc: '001', mnc: '04', name: 'Carrier Delta' },
  ],
};

// Get country code from coordinates (approximate)
export const getCountryFromCoords = (lat: number, lng: number): string => {
  // Simplified geo-detection based on bounding boxes
  if (lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66) return 'US';
  if (lat >= 49 && lat <= 60 && lng >= -141 && lng <= -52) return 'CA';
  if (lat >= 49 && lat <= 61 && lng >= -11 && lng <= 2) return 'UK';
  if (lat >= 47 && lat <= 55 && lng >= 6 && lng <= 15) return 'DE';
  if (lat >= 41 && lat <= 51 && lng >= -5 && lng <= 10) return 'FR';
  if (lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98) return 'IN';
  if (lat >= -44 && lat <= -10 && lng >= 112 && lng <= 154) return 'AU';
  if (lat >= -34 && lat <= 6 && lng >= -74 && lng <= -34) return 'BR';
  if (lat >= 24 && lat <= 46 && lng >= 122 && lng <= 154) return 'JP';
  return 'DEFAULT';
};

export const getOperatorsForLocation = (lat: number, lng: number) => {
  const country = getCountryFromCoords(lat, lng);
  return operatorsByRegion[country] || operatorsByRegion.DEFAULT;
};

// Legacy operators for backward compatibility
const operators = operatorsByRegion.US;

// Generate realistic IMSI: MCC (3 digits) + MNC (2-3 digits) + MSIN (9-10 digits)
const generateRealisticIMSI = (mcc: string, mnc: string) => {
  // MSIN is typically 9-10 digits, contains subscriber info
  const msinLength = mnc.length === 2 ? 10 : 9;
  const msin = Array.from({ length: msinLength }, () => Math.floor(Math.random() * 10)).join('');
  return `${mcc}${mnc.padStart(2, '0')}${msin}`;
};

// Generate realistic TMSI: 32-bit hex value (8 hex chars)
const generateRealisticTMSI = () => {
  // TMSI is a temporary 32-bit identifier assigned by the network
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
};

// Generate realistic Cell ID: typically 16-bit (0-65535) for GSM, 28-bit for LTE
const generateRealisticCellId = (isLTE: boolean = false) => {
  const max = isLTE ? 268435455 : 65535; // 28-bit vs 16-bit
  return Math.floor(Math.random() * max).toString();
};

// Generate realistic LAC (Location Area Code): 16-bit value
const generateRealisticLAC = () => {
  return Math.floor(Math.random() * 65535).toString();
};

export const generateMockCellTowers = (
  count: number = 10,
  baseLat: number = 40.7128,
  baseLng: number = -74.006
): CellTower[] => {
  const regionOperators = getOperatorsForLocation(baseLat, baseLng);
  
  return Array.from({ length: count }, (_, i) => {
    const op = regionOperators[Math.floor(Math.random() * regionOperators.length)];
    const isSuspicious = Math.random() > 0.85;
    
    return {
      id: `tower-${i}`,
      mcc: op.mcc,
      mnc: op.mnc,
      lac: generateRealisticLAC(),
      cellId: generateRealisticCellId(Math.random() > 0.4),
      lat: baseLat + (Math.random() - 0.5) * 0.08,
      lng: baseLng + (Math.random() - 0.5) * 0.08,
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

export const generateMockIMSIRecords = (
  count: number = 20,
  baseLat: number = 40.7128,
  baseLng: number = -74.006
): IMSIRecord[] => {
  const regionOperators = getOperatorsForLocation(baseLat, baseLng);
  
  return Array.from({ length: count }, (_, i) => {
    const op = regionOperators[Math.floor(Math.random() * regionOperators.length)];
    const isSuspicious = Math.random() > 0.9;
    const alertTypes: IMSIRecord['alertType'][] = ['IMSI_CATCHER', 'RAPID_HANDOVER', 'SILENT_SMS', 'DOWNGRADE_ATTACK'];
    const isLTE = Math.random() > 0.4; // 60% LTE traffic
    
    return {
      id: `imsi-${Date.now()}-${i}`,
      imsi: generateRealisticIMSI(op.mcc, op.mnc),
      tmsi: generateRealisticTMSI(),
      mcc: op.mcc,
      mnc: op.mnc,
      operator: op.name,
      signalStrength: -50 - Math.floor(Math.random() * 60),
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      cellId: generateRealisticCellId(isLTE),
      isSuspicious,
      alertType: isSuspicious ? alertTypes[Math.floor(Math.random() * alertTypes.length)] : undefined,
    };
  });
};

// Generate a single new IMSI record for real-time simulation
export const generateSingleIMSIRecord = (
  baseLat: number = 40.7128,
  baseLng: number = -74.006
): IMSIRecord => {
  const regionOperators = getOperatorsForLocation(baseLat, baseLng);
  const op = regionOperators[Math.floor(Math.random() * regionOperators.length)];
  const isSuspicious = Math.random() > 0.92;
  const alertTypes: IMSIRecord['alertType'][] = ['IMSI_CATCHER', 'RAPID_HANDOVER', 'SILENT_SMS', 'DOWNGRADE_ATTACK'];
  const isLTE = Math.random() > 0.4;
  
  return {
    id: `imsi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    imsi: generateRealisticIMSI(op.mcc, op.mnc),
    tmsi: generateRealisticTMSI(),
    mcc: op.mcc,
    mnc: op.mnc,
    operator: op.name,
    signalStrength: -50 - Math.floor(Math.random() * 60),
    timestamp: new Date(),
    cellId: generateRealisticCellId(isLTE),
    isSuspicious,
    alertType: isSuspicious ? alertTypes[Math.floor(Math.random() * alertTypes.length)] : undefined,
  };
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

// Real-time data simulation with location awareness
export const simulateRealtimeIMSI = (
  callback: (record: IMSIRecord) => void,
  lat: number = 40.7128,
  lng: number = -74.006
) => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      const record = generateSingleIMSIRecord(lat, lng);
      callback(record);
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
