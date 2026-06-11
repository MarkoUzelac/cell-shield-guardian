// ============================================================
// World Mobile Network Operators Database
// Operators are resolved from the user's actual country (MCC)
// so the app always shows the correct local carriers — whether
// the user is in Croatia, Belgium, Germany, or anywhere else.
// Source: ITU MCC/MNC assignments + public operator registries.
// ============================================================

export interface Operator {
  mcc: string;
  mnc: string;
  name: string;
  fullName: string;
  color: string;
  website?: string;
}

export interface CountryOperators {
  /** ISO 3166-1 alpha-2 country code */
  iso: string;
  /** Country display name */
  country: string;
  /** Mobile Country Code */
  mcc: string;
  operators: Operator[];
}

// Operators grouped by ISO country code.
export const WORLD_OPERATORS: Record<string, CountryOperators> = {
  HR: {
    iso: 'HR', country: 'Croatia', mcc: '219',
    operators: [
      { mcc: '219', mnc: '01', name: 'HT Hrvatska', fullName: 'Hrvatski Telekom', color: '#E91E63', website: 'https://www.hrvatskitelekom.hr' },
      { mcc: '219', mnc: '10', name: 'A1 Hrvatska', fullName: 'A1 Hrvatska d.o.o.', color: '#E60000', website: 'https://www.a1.hr' },
      { mcc: '219', mnc: '02', name: 'Telemach', fullName: 'Telemach Hrvatska d.o.o.', color: '#00A651', website: 'https://www.telemach.hr' },
    ],
  },
  BE: {
    iso: 'BE', country: 'Belgium', mcc: '206',
    operators: [
      { mcc: '206', mnc: '01', name: 'Proximus', fullName: 'Proximus PLC', color: '#5A2D81', website: 'https://www.proximus.be' },
      { mcc: '206', mnc: '10', name: 'Orange', fullName: 'Orange Belgium', color: '#FF7900', website: 'https://www.orange.be' },
      { mcc: '206', mnc: '20', name: 'BASE', fullName: 'Telenet Group (BASE)', color: '#00AEEF', website: 'https://www.base.be' },
    ],
  },
  DE: {
    iso: 'DE', country: 'Germany', mcc: '262',
    operators: [
      { mcc: '262', mnc: '01', name: 'Telekom', fullName: 'Deutsche Telekom', color: '#E20074', website: 'https://www.telekom.de' },
      { mcc: '262', mnc: '02', name: 'Vodafone', fullName: 'Vodafone Germany', color: '#E60000', website: 'https://www.vodafone.de' },
      { mcc: '262', mnc: '03', name: 'O2', fullName: 'Telefónica Germany (O2)', color: '#0090D0', website: 'https://www.o2online.de' },
    ],
  },
  AT: {
    iso: 'AT', country: 'Austria', mcc: '232',
    operators: [
      { mcc: '232', mnc: '01', name: 'A1', fullName: 'A1 Telekom Austria', color: '#E2001A', website: 'https://www.a1.net' },
      { mcc: '232', mnc: '03', name: 'Magenta', fullName: 'Magenta Telekom', color: '#E20074', website: 'https://www.magenta.at' },
      { mcc: '232', mnc: '05', name: 'Drei', fullName: 'Hutchison Drei Austria', color: '#000000', website: 'https://www.drei.at' },
    ],
  },
  FR: {
    iso: 'FR', country: 'France', mcc: '208',
    operators: [
      { mcc: '208', mnc: '01', name: 'Orange', fullName: 'Orange France', color: '#FF7900', website: 'https://www.orange.fr' },
      { mcc: '208', mnc: '10', name: 'SFR', fullName: 'Société Française du Radiotéléphone', color: '#E2001A', website: 'https://www.sfr.fr' },
      { mcc: '208', mnc: '20', name: 'Bouygues', fullName: 'Bouygues Telecom', color: '#0096D6', website: 'https://www.bouyguestelecom.fr' },
      { mcc: '208', mnc: '15', name: 'Free', fullName: 'Free Mobile', color: '#CD1F2D', website: 'https://mobile.free.fr' },
    ],
  },
  IT: {
    iso: 'IT', country: 'Italy', mcc: '222',
    operators: [
      { mcc: '222', mnc: '01', name: 'TIM', fullName: 'Telecom Italia Mobile', color: '#003DA5', website: 'https://www.tim.it' },
      { mcc: '222', mnc: '10', name: 'Vodafone', fullName: 'Vodafone Italy', color: '#E60000', website: 'https://www.vodafone.it' },
      { mcc: '222', mnc: '88', name: 'WindTre', fullName: 'WindTre S.p.A.', color: '#FF6600', website: 'https://www.windtre.it' },
      { mcc: '222', mnc: '50', name: 'Iliad', fullName: 'Iliad Italia', color: '#CD1F2D', website: 'https://www.iliad.it' },
    ],
  },
  ES: {
    iso: 'ES', country: 'Spain', mcc: '214',
    operators: [
      { mcc: '214', mnc: '07', name: 'Movistar', fullName: 'Telefónica Móviles España', color: '#019DF4', website: 'https://www.movistar.es' },
      { mcc: '214', mnc: '01', name: 'Vodafone', fullName: 'Vodafone Spain', color: '#E60000', website: 'https://www.vodafone.es' },
      { mcc: '214', mnc: '03', name: 'Orange', fullName: 'Orange España', color: '#FF7900', website: 'https://www.orange.es' },
      { mcc: '214', mnc: '04', name: 'Yoigo', fullName: 'Xfera Móviles (Yoigo)', color: '#7AB800', website: 'https://www.yoigo.com' },
    ],
  },
  NL: {
    iso: 'NL', country: 'Netherlands', mcc: '204',
    operators: [
      { mcc: '204', mnc: '08', name: 'KPN', fullName: 'KPN B.V.', color: '#00B140', website: 'https://www.kpn.com' },
      { mcc: '204', mnc: '04', name: 'Vodafone', fullName: 'VodafoneZiggo', color: '#E60000', website: 'https://www.vodafone.nl' },
      { mcc: '204', mnc: '16', name: 'T-Mobile', fullName: 'T-Mobile Netherlands (Odido)', color: '#E20074', website: 'https://www.odido.nl' },
    ],
  },
  GB: {
    iso: 'GB', country: 'United Kingdom', mcc: '234',
    operators: [
      { mcc: '234', mnc: '10', name: 'O2', fullName: 'Telefónica UK (O2)', color: '#0090D0', website: 'https://www.o2.co.uk' },
      { mcc: '234', mnc: '15', name: 'Vodafone', fullName: 'Vodafone UK', color: '#E60000', website: 'https://www.vodafone.co.uk' },
      { mcc: '234', mnc: '20', name: 'Three', fullName: 'Hutchison 3G UK', color: '#000000', website: 'https://www.three.co.uk' },
      { mcc: '234', mnc: '30', name: 'EE', fullName: 'EE Limited', color: '#00B5B0', website: 'https://www.ee.co.uk' },
    ],
  },
  IE: {
    iso: 'IE', country: 'Ireland', mcc: '272',
    operators: [
      { mcc: '272', mnc: '01', name: 'Vodafone', fullName: 'Vodafone Ireland', color: '#E60000', website: 'https://www.vodafone.ie' },
      { mcc: '272', mnc: '02', name: 'Three', fullName: 'Three Ireland', color: '#000000', website: 'https://www.three.ie' },
      { mcc: '272', mnc: '03', name: 'Eir', fullName: 'Eir Mobile', color: '#8DC63F', website: 'https://www.eir.ie' },
    ],
  },
  CH: {
    iso: 'CH', country: 'Switzerland', mcc: '228',
    operators: [
      { mcc: '228', mnc: '01', name: 'Swisscom', fullName: 'Swisscom AG', color: '#003DA5', website: 'https://www.swisscom.ch' },
      { mcc: '228', mnc: '02', name: 'Sunrise', fullName: 'Sunrise GmbH', color: '#E2001A', website: 'https://www.sunrise.ch' },
      { mcc: '228', mnc: '03', name: 'Salt', fullName: 'Salt Mobile SA', color: '#000000', website: 'https://www.salt.ch' },
    ],
  },
  PT: {
    iso: 'PT', country: 'Portugal', mcc: '268',
    operators: [
      { mcc: '268', mnc: '06', name: 'Vodafone', fullName: 'Vodafone Portugal', color: '#E60000', website: 'https://www.vodafone.pt' },
      { mcc: '268', mnc: '01', name: 'MEO', fullName: 'MEO (Altice Portugal)', color: '#00A0E1', website: 'https://www.meo.pt' },
      { mcc: '268', mnc: '03', name: 'NOS', fullName: 'NOS Comunicações', color: '#88C540', website: 'https://www.nos.pt' },
    ],
  },
  PL: {
    iso: 'PL', country: 'Poland', mcc: '260',
    operators: [
      { mcc: '260', mnc: '01', name: 'Plus', fullName: 'Polkomtel (Plus)', color: '#00A651', website: 'https://www.plus.pl' },
      { mcc: '260', mnc: '02', name: 'T-Mobile', fullName: 'T-Mobile Polska', color: '#E20074', website: 'https://www.t-mobile.pl' },
      { mcc: '260', mnc: '03', name: 'Orange', fullName: 'Orange Polska', color: '#FF7900', website: 'https://www.orange.pl' },
      { mcc: '260', mnc: '06', name: 'Play', fullName: 'P4 (Play)', color: '#6E2585', website: 'https://www.play.pl' },
    ],
  },
  CZ: {
    iso: 'CZ', country: 'Czechia', mcc: '230',
    operators: [
      { mcc: '230', mnc: '01', name: 'T-Mobile', fullName: 'T-Mobile Czech Republic', color: '#E20074', website: 'https://www.t-mobile.cz' },
      { mcc: '230', mnc: '02', name: 'O2', fullName: 'O2 Czech Republic', color: '#0090D0', website: 'https://www.o2.cz' },
      { mcc: '230', mnc: '03', name: 'Vodafone', fullName: 'Vodafone Czech Republic', color: '#E60000', website: 'https://www.vodafone.cz' },
    ],
  },
  SK: {
    iso: 'SK', country: 'Slovakia', mcc: '231',
    operators: [
      { mcc: '231', mnc: '01', name: 'Orange', fullName: 'Orange Slovensko', color: '#FF7900', website: 'https://www.orange.sk' },
      { mcc: '231', mnc: '02', name: 'Telekom', fullName: 'Slovak Telekom', color: '#E20074', website: 'https://www.telekom.sk' },
      { mcc: '231', mnc: '06', name: 'O2', fullName: 'O2 Slovakia', color: '#0090D0', website: 'https://www.o2.sk' },
    ],
  },
  SI: {
    iso: 'SI', country: 'Slovenia', mcc: '293',
    operators: [
      { mcc: '293', mnc: '41', name: 'Mobitel', fullName: 'Telekom Slovenije', color: '#E2001A', website: 'https://www.telekom.si' },
      { mcc: '293', mnc: '40', name: 'A1', fullName: 'A1 Slovenija', color: '#E60000', website: 'https://www.a1.si' },
      { mcc: '293', mnc: '70', name: 'Telemach', fullName: 'Telemach Slovenija', color: '#00A651', website: 'https://www.telemach.si' },
    ],
  },
  HU: {
    iso: 'HU', country: 'Hungary', mcc: '216',
    operators: [
      { mcc: '216', mnc: '30', name: 'Telekom', fullName: 'Magyar Telekom', color: '#E20074', website: 'https://www.telekom.hu' },
      { mcc: '216', mnc: '01', name: 'Yettel', fullName: 'Yettel Hungary', color: '#0096D6', website: 'https://www.yettel.hu' },
      { mcc: '216', mnc: '70', name: 'Vodafone', fullName: 'Vodafone Hungary', color: '#E60000', website: 'https://www.vodafone.hu' },
    ],
  },
  RS: {
    iso: 'RS', country: 'Serbia', mcc: '220',
    operators: [
      { mcc: '220', mnc: '01', name: 'Telekom Srbija', fullName: 'Telekom Srbija (mts)', color: '#E2001A', website: 'https://www.mts.rs' },
      { mcc: '220', mnc: '05', name: 'A1', fullName: 'A1 Srbija', color: '#E60000', website: 'https://www.a1.rs' },
      { mcc: '220', mnc: '03', name: 'Yettel', fullName: 'Yettel Serbia', color: '#0096D6', website: 'https://www.yettel.rs' },
    ],
  },
  BA: {
    iso: 'BA', country: 'Bosnia and Herzegovina', mcc: '218',
    operators: [
      { mcc: '218', mnc: '90', name: 'BH Telecom', fullName: 'BH Telecom', color: '#003DA5', website: 'https://www.bhtelecom.ba' },
      { mcc: '218', mnc: '03', name: 'HT Eronet', fullName: 'HT Eronet', color: '#E2001A', website: 'https://www.hteronet.ba' },
      { mcc: '218', mnc: '05', name: 'm:tel', fullName: 'Mtel a.d.', color: '#00A651', website: 'https://www.mtel.ba' },
    ],
  },
  GR: {
    iso: 'GR', country: 'Greece', mcc: '202',
    operators: [
      { mcc: '202', mnc: '01', name: 'Cosmote', fullName: 'Cosmote (OTE)', color: '#7AB800', website: 'https://www.cosmote.gr' },
      { mcc: '202', mnc: '05', name: 'Vodafone', fullName: 'Vodafone Greece', color: '#E60000', website: 'https://www.vodafone.gr' },
      { mcc: '202', mnc: '10', name: 'Nova', fullName: 'Nova (Wind Hellas)', color: '#6E2585', website: 'https://www.nova.gr' },
    ],
  },
  SE: {
    iso: 'SE', country: 'Sweden', mcc: '240',
    operators: [
      { mcc: '240', mnc: '01', name: 'Telia', fullName: 'Telia Sverige', color: '#990AE3', website: 'https://www.telia.se' },
      { mcc: '240', mnc: '07', name: 'Tele2', fullName: 'Tele2 Sverige', color: '#000000', website: 'https://www.tele2.se' },
      { mcc: '240', mnc: '08', name: 'Telenor', fullName: 'Telenor Sverige', color: '#0096D6', website: 'https://www.telenor.se' },
      { mcc: '240', mnc: '02', name: 'Tre', fullName: 'Hi3G Access (Tre)', color: '#000000', website: 'https://www.tre.se' },
    ],
  },
  NO: {
    iso: 'NO', country: 'Norway', mcc: '242',
    operators: [
      { mcc: '242', mnc: '01', name: 'Telenor', fullName: 'Telenor Norge', color: '#0096D6', website: 'https://www.telenor.no' },
      { mcc: '242', mnc: '02', name: 'Telia', fullName: 'Telia Norge', color: '#990AE3', website: 'https://www.telia.no' },
      { mcc: '242', mnc: '09', name: 'Ice', fullName: 'Ice Communication Norge', color: '#00B5E2', website: 'https://www.ice.no' },
    ],
  },
  DK: {
    iso: 'DK', country: 'Denmark', mcc: '238',
    operators: [
      { mcc: '238', mnc: '01', name: 'TDC', fullName: 'TDC (Nuuday)', color: '#003DA5', website: 'https://www.yousee.dk' },
      { mcc: '238', mnc: '02', name: 'Telenor', fullName: 'Telenor Denmark', color: '#0096D6', website: 'https://www.telenor.dk' },
      { mcc: '238', mnc: '20', name: 'Telia', fullName: 'Telia Denmark', color: '#990AE3', website: 'https://www.telia.dk' },
      { mcc: '238', mnc: '06', name: '3', fullName: 'Hi3G Denmark', color: '#000000', website: 'https://www.3.dk' },
    ],
  },
  FI: {
    iso: 'FI', country: 'Finland', mcc: '244',
    operators: [
      { mcc: '244', mnc: '91', name: 'Telia', fullName: 'Telia Finland', color: '#990AE3', website: 'https://www.telia.fi' },
      { mcc: '244', mnc: '05', name: 'Elisa', fullName: 'Elisa Oyj', color: '#E2001A', website: 'https://www.elisa.fi' },
      { mcc: '244', mnc: '03', name: 'DNA', fullName: 'DNA Oyj', color: '#F36F21', website: 'https://www.dna.fi' },
    ],
  },
  US: {
    iso: 'US', country: 'United States', mcc: '310',
    operators: [
      { mcc: '310', mnc: '260', name: 'T-Mobile', fullName: 'T-Mobile US', color: '#E20074', website: 'https://www.t-mobile.com' },
      { mcc: '310', mnc: '410', name: 'AT&T', fullName: 'AT&T Mobility', color: '#00A8E0', website: 'https://www.att.com' },
      { mcc: '311', mnc: '480', name: 'Verizon', fullName: 'Verizon Wireless', color: '#CD040B', website: 'https://www.verizon.com' },
    ],
  },
  CA: {
    iso: 'CA', country: 'Canada', mcc: '302',
    operators: [
      { mcc: '302', mnc: '720', name: 'Rogers', fullName: 'Rogers Communications', color: '#DA291C', website: 'https://www.rogers.com' },
      { mcc: '302', mnc: '610', name: 'Bell', fullName: 'Bell Mobility', color: '#0066B3', website: 'https://www.bell.ca' },
      { mcc: '302', mnc: '220', name: 'Telus', fullName: 'Telus Mobility', color: '#4B286D', website: 'https://www.telus.com' },
    ],
  },
};

// Fallback when the user's country cannot be resolved.
export const DEFAULT_COUNTRY = WORLD_OPERATORS.HR;

/** Look up operators for an ISO alpha-2 country code (case-insensitive). */
export const getOperatorsByIso = (iso?: string | null): CountryOperators => {
  if (!iso) return DEFAULT_COUNTRY;
  return WORLD_OPERATORS[iso.toUpperCase()] ?? DEFAULT_COUNTRY;
};

/** Look up operators for an MCC. */
export const getOperatorsByMcc = (mcc?: string | null): CountryOperators => {
  if (!mcc) return DEFAULT_COUNTRY;
  const match = Object.values(WORLD_OPERATORS).find(c => c.mcc === mcc);
  return match ?? DEFAULT_COUNTRY;
};

/** Pick a random operator from a country. */
export const getRandomOperator = (country: CountryOperators): Operator => {
  return country.operators[Math.floor(Math.random() * country.operators.length)];
};

/** Generate a realistic IMSI for a given country operator. */
export const generateIMSIForCountry = (country: CountryOperators): string => {
  const op = getRandomOperator(country);
  return `${op.mcc}${op.mnc}${Math.random().toString().slice(2, 12)}`;
};
