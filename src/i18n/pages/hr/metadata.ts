/**
 * Croatian copy for the metadata page. Filled per page; merged into
 * `pages.metadata` by src/i18n/locales/hr.ts.
 */
export const metadata = {
  title: 'Analizator metapodataka',
  subtitle: 'Izdvajanje i analiza skrivenih metapodataka iz datoteka pomoću ExifTool-a',
  infoCards: {
    images: {
      title: 'Slike',
      description: 'JPEG, PNG, TIFF, RAW datoteke',
    },
    documents: {
      title: 'Dokumenti',
      description: 'PDF, DOC, XLS, PPT datoteke',
    },
    media: {
      title: 'Mediji',
      description: 'Audio, video i drugi formati',
    },
  },
  commonMetadata: {
    title: 'Uobičajeni metapodaci osjetljivi za privatnost',
    riskLabel: '{{risk}} rizik',
    riskLevels: {
      high: 'visok',
      medium: 'srednji',
      low: 'nizak',
    },
    items: {
      gpsCoordinates: {
        title: 'GPS koordinate',
        description: 'Točna lokacija na kojoj je fotografija/dokument nastao',
      },
      deviceSerialNumbers: {
        title: 'Serijski brojevi uređaja',
        description: 'Jedinstveni identifikatori koji povezuju s određenim uređajima',
      },
      timestamps: {
        title: 'Vremenske oznake',
        description: 'Vrijeme kreiranja, izmjene i pristupa',
      },
      authorInformation: {
        title: 'Podaci o autoru',
        description: 'Imena, korisnička imena ili podaci o računu',
      },
      softwareVersions: {
        title: 'Verzije softvera',
        description: 'Aplikacije i verzije OS-a korištene za izradu datoteke',
      },
      cameraSettings: {
        title: 'Postavke fotoaparata',
        description: 'Objektiv, otvor blende, ISO i žarišna duljina',
      },
      networkInfo: {
        title: 'Mrežni podaci',
        description: 'WiFi nazivi, IP adrese u nekim datotekama',
      },
      editingHistory: {
        title: 'Povijest uređivanja',
        description: 'Praćenje izmjena, povijest revizija',
      },
    },
  },
} as const;
