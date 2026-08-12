import {
  Activity,
  AlertTriangle,
  FileSearch,
  Info,
  ListChecks,
  Map,
  Settings,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  icon: LucideIcon;
  labelKey: string;
  shortLabelKey: string;
  descriptionKey: string;
}

export interface NavGroup {
  id: 'measure' | 'analyse' | 'learn';
  titleKey: string;
  items: NavItem[];
}

/**
 * Single source of truth for navigation, shared by the desktop sidebar and the
 * mobile sheet so the two can never drift apart. Grouped by what the visitor is
 * trying to do rather than by internal feature name.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'measure',
    titleKey: 'nav.groups.measure',
    items: [
      {
        to: '/',
        icon: Activity,
        labelKey: 'nav.homeLong',
        shortLabelKey: 'nav.homeShort',
        descriptionKey: 'nav.homeDescription',
      },
      {
        to: '/capabilities',
        icon: ListChecks,
        labelKey: 'nav.capabilities',
        shortLabelKey: 'nav.capabilities',
        descriptionKey: 'nav.capabilitiesDescription',
      },
      {
        to: '/network',
        icon: Wifi,
        labelKey: 'nav.network',
        shortLabelKey: 'nav.networkShort',
        descriptionKey: 'nav.networkDescription',
      },
    ],
  },
  {
    id: 'analyse',
    titleKey: 'nav.groups.analyse',
    items: [
      {
        to: '/map',
        icon: Map,
        labelKey: 'nav.map',
        shortLabelKey: 'nav.mapShort',
        descriptionKey: 'nav.mapDescription',
      },
      {
        to: '/alerts',
        icon: AlertTriangle,
        labelKey: 'nav.alerts',
        shortLabelKey: 'nav.alertsShort',
        descriptionKey: 'nav.alertsDescription',
      },
      {
        to: '/metadata',
        icon: FileSearch,
        labelKey: 'nav.metadata',
        shortLabelKey: 'nav.metadata',
        descriptionKey: 'nav.metadataDescription',
      },
    ],
  },
  {
    id: 'learn',
    titleKey: 'nav.groups.learn',
    items: [
      {
        to: '/protection',
        icon: ShieldCheck,
        labelKey: 'nav.protection',
        shortLabelKey: 'nav.protection',
        descriptionKey: 'nav.protectionDescription',
      },
      {
        to: '/settings',
        icon: Settings,
        labelKey: 'nav.settings',
        shortLabelKey: 'nav.settings',
        descriptionKey: 'nav.settingsDescription',
      },
      {
        to: '/about',
        icon: Info,
        labelKey: 'nav.about',
        shortLabelKey: 'nav.about',
        descriptionKey: 'nav.aboutDescription',
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

/** The four destinations pinned to the mobile bottom bar. */
export const PRIMARY_MOBILE_ITEMS: NavItem[] = [
  ALL_NAV_ITEMS[0],
  ALL_NAV_ITEMS[2],
  ALL_NAV_ITEMS[3],
  ALL_NAV_ITEMS[4],
];
