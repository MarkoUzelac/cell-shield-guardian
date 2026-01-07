// Croatian Mobile Network Operators (MCC: 219)
export const CROATIAN_OPERATORS = [
  { 
    mcc: '219', 
    mnc: '01', 
    name: 'HT Hrvatska', 
    fullName: 'Hrvatski Telekom',
    color: '#E91E63',
    website: 'https://www.hrvatskitelekom.hr'
  },
  { 
    mcc: '219', 
    mnc: '10', 
    name: 'A1 Hrvatska', 
    fullName: 'A1 Hrvatska d.o.o.',
    color: '#E60000',
    website: 'https://www.a1.hr'
  },
  { 
    mcc: '219', 
    mnc: '02', 
    name: 'Telemach', 
    fullName: 'Telemach Hrvatska d.o.o.',
    color: '#00A651',
    website: 'https://www.telemach.hr'
  },
] as const;

// Croatian LTE/5G Frequency Bands
export const CROATIAN_FREQUENCY_BANDS = [
  { band: 'LTE B1', frequency: '2100 MHz', technology: '4G', operators: ['HT', 'A1', 'Telemach'] },
  { band: 'LTE B3', frequency: '1800 MHz', technology: '4G', operators: ['HT', 'A1', 'Telemach'] },
  { band: 'LTE B7', frequency: '2600 MHz', technology: '4G', operators: ['HT', 'A1'] },
  { band: 'LTE B8', frequency: '900 MHz', technology: '4G', operators: ['HT', 'A1'] },
  { band: 'LTE B20', frequency: '800 MHz', technology: '4G', operators: ['HT', 'A1', 'Telemach'] },
  { band: 'n78', frequency: '3500 MHz', technology: '5G', operators: ['HT', 'A1', 'Telemach'] },
  { band: 'n1', frequency: '2100 MHz', technology: '5G', operators: ['HT', 'A1'] },
  { band: 'n28', frequency: '700 MHz', technology: '5G', operators: ['HT'] },
];

// Major Croatian cities with coordinates
export const CROATIAN_CITIES = {
  zagreb: { lat: 45.8150, lng: 15.9819, name: 'Zagreb' },
  split: { lat: 43.5081, lng: 16.4402, name: 'Split' },
  rijeka: { lat: 45.3271, lng: 14.4422, name: 'Rijeka' },
  osijek: { lat: 45.5550, lng: 18.6955, name: 'Osijek' },
  zadar: { lat: 44.1194, lng: 15.2314, name: 'Zadar' },
  pula: { lat: 44.8666, lng: 13.8496, name: 'Pula' },
  dubrovnik: { lat: 42.6507, lng: 18.0944, name: 'Dubrovnik' },
};

// Helper to get operator by MNC
export const getOperatorByMnc = (mnc: string) => {
  return CROATIAN_OPERATORS.find(op => op.mnc === mnc);
};

// Helper to get random Croatian operator
export const getRandomCroatianOperator = () => {
  return CROATIAN_OPERATORS[Math.floor(Math.random() * CROATIAN_OPERATORS.length)];
};

// Generate Croatian MCC prefix for IMSI
export const generateCroatianIMSI = () => {
  const op = getRandomCroatianOperator();
  return `${op.mcc}${op.mnc}${Math.random().toString().slice(2, 12)}`;
};
