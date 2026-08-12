// Croatian locale.
//
// The per-section Croatian files (src/i18n/components/hr-*.ts and
// src/i18n/pages/hr/*.ts) are translated, but the aggregator still falls back
// to the English tree so no key can ever resolve as missing while the last
// sections (protection, settings) are being translated. Swap this to a full
// deep-merge once those land.
import { en } from './en';

export const hr = en;
