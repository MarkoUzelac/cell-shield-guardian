/**
 * Croatian copy for shared triangulation components. Merged into `components.triangulation`.
 */
export const triangulation = {
  title: 'Triangulacija baznih stanica',
  description: 'Unesite identifikatore baznih stanica za procjenu lokacije pomoću baze podataka OpenCellID.',
  mccLabel: 'MCC (kod države)',
  mccPlaceholder: 'npr. 310',
  mncLabel: 'MNC (kod mreže)',
  mncPlaceholder: 'npr. 410',
  lacLabel: 'LAC (kod lokacijskog područja)',
  lacPlaceholder: 'npr. 12345',
  cellIdLabel: 'ID ćelije',
  cellIdPlaceholder: 'npr. 67890',
  lookupLocation: 'Pretraži lokaciju',
  aboutTitle: 'O pretrazi baznih stanica',
  aboutDescription: 'Ovo koristi bazu podataka OpenCellID za procjenu lokacija tornjeva. Točnost varira ovisno o regiji. Podatke o ćelijama možete dobiti putem inženjerskog načina rada vašeg uređaja ili snimljenih GSM podataka.',
} as const;
