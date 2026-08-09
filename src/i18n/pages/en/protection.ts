/**
 * English copy for the protection page. Filled per page; merged into
 * `pages.protection` by src/i18n/locales/en.ts.
 */
export const protection = {
  headerTitle: 'Protection Guide',
  headerSubtitle: 'Threat detection & countermeasures',
  overview: {
    title: 'SIGINT Defense Overview',
    description:
      'This guide covers real-world surveillance threats targeting mobile devices and provides actionable countermeasures. Each section includes detection indicators, protection steps, and recommended tools.',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    info: 'Info',
  },
  severityBadge: {
    critical: 'CRITICAL',
    high: 'HIGH',
    medium: 'MEDIUM',
    info: 'INFO',
  },
  quickActions: {
    title: 'Immediate Actions If You Suspect Surveillance',
    steps: [
      'Enable airplane mode immediately',
      'Move to a different physical location',
      'Check for forced 2G downgrade in network settings',
      'Scan for unknown Bluetooth/tracking devices nearby',
      'Use the Signal Guardian map to check for suspicious towers',
    ],
  },
  sectionLabels: {
    warningSigns: 'Warning Signs',
    protectionSteps: 'Protection Steps',
    recommendedTools: 'Recommended Tools',
  },
  sections: {
    'imsi-catcher': {
      title: 'IMSI Catcher / Stingray Detection',
      threat:
        'IMSI catchers (Stingrays) are rogue base stations that impersonate legitimate cell towers to intercept communications, track location, and capture IMSI/TMSI identifiers from nearby phones.',
      signs: [
        'Sudden forced downgrade from 4G/5G to 2G in an area with strong 4G coverage',
        'Rapid and unexplained cell tower switching while stationary',
        'Phone shows full signal bars but calls drop or fail',
        'Battery drains abnormally fast (phone transmitting at max power)',
        'Unknown or unregistered Cell ID appears in tower logs',
        'Multiple devices in the same area experience simultaneous 2G downgrades',
        'SMS messages fail or are delayed without explanation',
      ],
      protection: [
        "Disable 2G/3G in phone settings (Android: Settings → Network → Preferred type → LTE/5G only)",
        'Use Signal, WhatsApp, or other E2E encrypted messaging apps instead of SMS',
        'Enable airplane mode in sensitive locations, then use WiFi with VPN',
        "Monitor your Cell ID changes using this app's tower map",
        'If you detect forced 2G downgrade, move to a different location immediately',
        'Use a Faraday bag when not using your phone in high-risk areas',
        'Report suspected IMSI catchers to your national telecom regulator',
      ],
      tools: [
        'Signal Guardian (this app) — monitor tower IDs and detect anomalies',
        'SnoopSnitch (Android) — detects SS7 attacks and IMSI catchers',
        'AIMSICD (Android) — IMSI catcher detection app',
        'Cell Spy Catcher (Android) — monitors base station changes',
        'RTL-SDR + gr-gsm — passive GSM monitoring hardware',
      ],
    },
    'silent-sms': {
      title: 'Silent SMS (Stealth Ping) Detection',
      threat:
        'Silent SMS (Type 0 SMS) are invisible text messages sent to your phone to determine your location by triggering a network response without any visible notification. Law enforcement and malicious actors use these for real-time tracking.',
      signs: [
        'Unexplained brief signal loss followed by immediate reconnection',
        'Phone wakes from sleep without any visible notification',
        'Unusual data traffic spikes in network monitor',
        'Phone modem briefly activates without user action',
        'Increased battery drain during idle periods',
      ],
      protection: [
        'Use SnoopSnitch or similar apps to detect Type 0 SMS',
        'Monitor baseband activity for unexplained network registrations',
        'Use airplane mode when not actively using cellular service',
        'Consider using a phone with baseband firewall capability',
        'Use VoIP/WiFi calling instead of cellular when possible',
      ],
      tools: [
        'SnoopSnitch — detects silent SMS on rooted Android devices',
        'Android HiddenMenu (*#*#4636#*#*) — view phone radio information',
        'Network Signal Info Pro — detailed cell tower monitoring',
      ],
    },
    'location-tracking': {
      title: 'Location Tracking & Surveillance',
      threat:
        'Your location can be tracked through cell tower triangulation, GPS, WiFi positioning, Bluetooth beacons, and even ultrasonic cross-device tracking. Multiple methods are often combined for high-precision tracking.',
      signs: [
        'Apps requesting location permission without clear reason',
        'GPS icon appears when no navigation/maps app is active',
        'Unknown Bluetooth devices repeatedly connecting or pairing',
        'WiFi scanning active even when WiFi is "off"',
        'Ads showing products from stores you visited physically',
        'Someone seems to know your movements without being told',
      ],
      protection: [
        'Review and revoke unnecessary location permissions for all apps',
        'Disable WiFi and Bluetooth scanning (Android: Location → Scanning)',
        'Use a GPS spoofing app for testing (developer mode only)',
        'Disable Google Timeline / Apple Significant Locations',
        'Check for unknown AirTags/Tile trackers using Apple Find My or Google Unknown Tracker Alerts',
        'Use Faraday bag when traveling to sensitive locations',
        'Regularly audit paired Bluetooth devices and remove unknown ones',
        'Disable "Find My Device" if you suspect your account is compromised',
      ],
      tools: [
        'Apple Tracker Detect (Android) — finds unknown AirTags',
        'Google Unknown Tracker Alerts — built into Android',
        'Bluetooth Scanner apps — detect unknown BLE devices',
        'Signal Guardian tower map — monitor cell tower changes',
      ],
    },
    'wifi-attacks': {
      title: 'WiFi Attacks & Evil Twin Detection',
      threat:
        'Attackers can create fake WiFi hotspots that mimic legitimate networks (Evil Twin attacks) to intercept your traffic, steal credentials, and inject malware.',
      signs: [
        'Multiple WiFi networks with the same name (SSID)',
        'Known WiFi network suddenly requires re-authentication',
        'Certificate warnings when connecting to trusted networks',
        'Unusually strong WiFi signal from unknown access point',
        'Internet is slow despite strong WiFi signal',
        'HTTPS sites showing as HTTP or certificate errors',
      ],
      protection: [
        'Always use VPN on public WiFi networks',
        'Verify WiFi network names with the venue staff',
        'Disable auto-connect to open/known networks',
        'Use cellular data instead of public WiFi for sensitive tasks',
        'Check for HTTPS and valid certificates before entering credentials',
        'Forget public WiFi networks after use',
        'Use WPA3 for home networks when available',
      ],
      tools: [
        'Wireshark — network traffic analysis (advanced)',
        'Fing — network scanner to detect rogue devices',
        'NetSpot — WiFi analysis and rogue AP detection',
      ],
    },
    'physical-trackers': {
      title: 'Physical Tracking Devices',
      threat:
        'Small GPS/Bluetooth tracking devices (AirTags, Tile, GPS trackers) can be hidden in vehicles, bags, or personal items to track your physical location.',
      signs: [
        '"AirTag Found Moving With You" alert on iPhone',
        'Unknown Bluetooth devices appearing consistently in scanner',
        'Small unfamiliar devices found in vehicle wheel wells, bumpers, or undercarriage',
        'Unknown devices attached to bag linings or coat pockets',
        'Chirping sound from hidden AirTag (plays after separation)',
      ],
      protection: [
        'Regularly scan for unknown Bluetooth devices near you',
        'Physically inspect vehicle exterior (wheel wells, bumpers, undercarriage)',
        'Check bags, luggage, and personal items for unfamiliar objects',
        "Use Apple Tracker Detect (Android) or iPhone's built-in scanner",
        'If found: do NOT destroy it — document, photograph, then contact police',
        'Consider RF detector for comprehensive sweep of vehicle/home',
        'For high-risk individuals: professional TSCM (bug sweep) services',
      ],
      tools: [
        'Apple Tracker Detect (Android app)',
        'RF Signal Detector (hardware, ~$30-200)',
        'Non-linear junction detector (professional grade)',
        'Flashlight + mirror for visual inspection under vehicles',
      ],
    },
    'phone-security': {
      title: 'Phone Security Hardening',
      threat:
        'Your phone itself can be compromised through malware, spyware, SS7 network attacks, or physical access. A compromised phone gives an attacker access to everything — calls, messages, location, camera, and microphone.',
      signs: [
        'Phone overheating when idle',
        'Unusual data usage or battery drain',
        "Apps you didn't install appearing",
        'Phone settings changing without your action',
        'Strange sounds during calls (clicking, static)',
        'Phone takes long to shut down (flushing data)',
      ],
      protection: [
        'Keep OS and all apps updated to latest versions',
        'Only install apps from official stores (Google Play/App Store)',
        'Enable 2FA on all accounts (use authenticator app, not SMS)',
        'Use strong unique passwords with a password manager',
        'Enable full-disk encryption (default on modern phones)',
        'Review app permissions monthly — remove unnecessary access',
        'Disable USB debugging when not needed',
        'Use biometric + PIN lock (not pattern)',
        'Enable remote wipe capability',
        'Consider using a separate phone for sensitive communications',
      ],
      tools: [
        'Malwarebytes Mobile — malware scanner',
        'Bitdefender Mobile Security — comprehensive protection',
        'Haven (Guardian Project) — room surveillance detector',
        'Signal — encrypted messaging & calls',
        'ProtonMail/Tutanota — encrypted email',
      ],
    },
  },
  emergency: {
    title: 'Emergency Resources',
    hakom: {
      name: 'HAKOM (Croatia)',
      description: 'Croatian Regulatory Authority for Network Industries',
      contact: 'hakom.hr',
    },
    eff: {
      name: 'EFF (International)',
      description: 'Electronic Frontier Foundation — digital rights',
      contact: 'eff.org/pages/cell-site-simulators',
    },
    aclu: {
      name: 'ACLU Stingray Info',
      description: 'Legal guidance on cell-site simulators',
      contact: 'aclu.org/issues/privacy-technology/surveillance-technologies/stingray-tracking-devices',
    },
    police: {
      name: 'Local Police',
      description: 'If you find a physical tracking device, contact authorities',
      contact: 'Emergency: 112 (EU) / 911 (US)',
    },
  },
} as const;
