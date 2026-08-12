/**
 * Croatian copy for the demo page. Filled per page; merged into
 * `pages.demo` by src/i18n/locales/hr.ts.
 */
export const demo = {
  header: {
    title: 'Simulacija mobilne mreže (Demo)',
    subtitle: 'Sintetički podaci — ne potječu s vašeg uređaja',
  },
  banner: {
    title: 'Simulirani podaci — ništa ovdje nije stvarno',
    body: 'Web preglednici ne mogu čitati IMSI, IMEI, identitet bazne stanice, stanje enkripcije ili basebrand podatke. Svaki signal, toranj i upozorenje na ovoj stranici generirani su lokalno kako bi prikazali što bi mogla pokazati izvorna Android pratilačka aplikacija. Za mjerenja s vašeg stvarnog uređaja koristite {{link}}.',
    linkText: 'nadzornu ploču za dijagnostiku uživo',
  },
  premiumBanner: {
    title: 'Nadogradi na Pro',
    subtitle: 'Podaci o tornjevima u stvarnom vremenu i napredna upozorenja',
    price: '9,99 €/mj.',
  },
  stats: {
    signals: 'Signali',
    signalsSubtitle: 'Zadnji sat',
    suspicious: 'Sumnjivo',
    suspiciousSubtitle: 'Pažnja',
    critical: 'Kritično',
    criticalSubtitle: 'Nepotvrđeno',
    status: 'Status',
    statusValue: 'Aktivno',
    statusSubtitle: 'Zaštićeno',
  },
  scanControl: {
    title: 'Upravljanje skeniranjem',
    frequency: 'Frekvencija:',
    status: 'Status:',
    scanning: 'Skeniranje',
    idle: 'Mirovanje',
    location: 'Lokacija:',
    defaultLocation: 'Hrvatska',
    stop: 'Zaustavi',
    start: 'Pokreni',
  },
  recentAlerts: {
    title: 'Nedavna upozorenja',
  },
  frequencyBands: {
    title: 'Hrvatski LTE/5G opsezi',
  },
} as const;
