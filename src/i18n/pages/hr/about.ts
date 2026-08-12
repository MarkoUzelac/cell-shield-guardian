/**
 * Croatian copy for the about page. Filled per page; merged into
 * `pages.about` by src/i18n/locales/hr.ts.
 */
export const about = {
  header: {
    title: 'O aplikaciji',
    subtitle: 'Privacy Signal Monitor - edukativni sigurnosni alat',
  },
  disclaimer: {
    title: 'Važna pravna napomena',
    intro:
      '<strong>Privacy Signal Monitor</strong> namijenjen je isključivo za <strong>edukativne, istraživačke i obrambene svrhe zaštite privatnosti</strong>. Ovaj alat pomaže korisnicima da:',
    purposes: {
      item1: 'Otkriju prate li ih preko mobilnih mreža',
      item2: 'Nauče o rizicima i ranjivostima mobilne privatnosti',
      item3: 'Nadziru vlastite uređaje i lokalne GSM signale',
      item4: 'Analiziraju javno dostupne ili sami prikupljene podatke',
    },
    mustNotTitle: '⚠️ Ovaj alat se NE SMIJE koristiti za:',
    prohibited: {
      item1: 'Praćenje ili nadzor drugih osoba bez pristanka',
      item2: 'Aktivno presretanje ili ometanje signala',
      item3: 'Bilo kakvu aktivnost koja krši lokalne telekomunikacijske propise',
      item4: 'Neovlašten pristup mobilnim mrežama',
    },
    responsibility:
      '<strong>Korisnici su isključivo odgovorni</strong> za osiguravanje da korištenje ovog softvera bude u skladu sa svim primjenjivim lokalnim, državnim i saveznim zakonima. Razvojni tim ne preuzima nikakvu odgovornost za zlouporabu.',
  },
  aboutProject: {
    title: 'O ovom projektu',
    intro:
      'Privacy Signal Monitor je open-source nadzorna ploča koja objedinjuje više alata za privatnost i sigurnost u jedinstveno sučelje. Nastala je kako bi pomogla osobama svjesnima privatnosti da razumiju i zaštite se od prijetnji mobilnog nadzora.',
    keyFeaturesTitle: 'Ključne značajke:',
    features: {
      imsiCatcher: {
        label: 'Detekcija IMSI hvatača:',
        description: 'Pasivno praćenje GSM signala radi otkrivanja lažnih baznih stanica',
      },
      cellTower: {
        label: 'Triangulacija baznih stanica:',
        description: 'Mapiranje baznih stanica i procjena lokacija pomoću OpenCellID',
      },
      metadata: {
        label: 'Analiza metapodataka:',
        description: 'Izdvajanje skrivenih podataka iz datoteka pomoću integracije s ExifTool-om',
      },
      alertSystem: {
        label: 'Sustav upozorenja:',
        description: 'Obavijesti u stvarnom vremenu o sumnjivoj mrežnoj aktivnosti',
      },
    },
  },
  technicalRequirements: {
    title: 'Tehnički zahtjevi',
    hardware: {
      title: 'Hardver',
      item1: 'RTL-SDR USB uređaj (preporučena v3)',
      item2: 'Prikladna antena za GSM frekvencije',
      item3: 'Linux računalo (Ubuntu 20.04+)',
    },
    software: {
      title: 'Softver',
      item1: 'Python 3.8+',
      item2: 'gr-gsm, rtl-sdr, kalibrate-rtl',
      item3: 'ExifTool',
      item4: 'Flask backend (opcionalno)',
    },
  },
  resources: {
    title: 'Resursi i dokumentacija',
    sourceCode: {
      title: 'Izvorni kod',
      description: 'Pogledajte na GitHubu',
    },
    openCellId: {
      title: 'OpenCellID',
      description: 'Baza podataka baznih stanica',
    },
    grGsm: {
      title: 'gr-gsm',
      description: 'GSM prijemni blokovi',
    },
    exifTool: {
      title: 'ExifTool',
      description: 'Izdvajanje metapodataka',
    },
  },
  version: {
    line1: 'Privacy Signal Monitor v1.0.0',
    line2: 'Izrađeno pomoću React, TypeScript i Tailwind CSS',
  },
} as const;
