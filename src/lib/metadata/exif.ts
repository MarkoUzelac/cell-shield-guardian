/**
 * Real, in-browser metadata extraction.
 *
 * The file never leaves the device: it is read with `FileReader` and parsed
 * here. Only fields that are genuinely present in the file are reported —
 * nothing is inferred or invented, and a file with no embedded metadata
 * honestly comes back with an empty table.
 *
 * Scope: JPEG/TIFF EXIF (including GPS IFD) plus the file attributes every
 * browser exposes. PDFs and Office documents need a parser that cannot run
 * meaningfully in a page of this size, so they report file-level data only.
 */

import type { MetadataResult } from '@/types/signal';

type Primitive = string | number | boolean;

/** EXIF tags worth surfacing, keyed by tag id. */
const EXIF_TAGS: Record<number, string> = {
  0x010f: 'Make',
  0x0110: 'Model',
  0x0112: 'Orientation',
  0x0131: 'Software',
  0x0132: 'DateTime',
  0x013b: 'Artist',
  0x8298: 'Copyright',
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x8827: 'ISOSpeedRatings',
  0x9003: 'DateTimeOriginal',
  0x9004: 'DateTimeDigitized',
  0x920a: 'FocalLength',
  0xa002: 'PixelXDimension',
  0xa003: 'PixelYDimension',
  0xa430: 'CameraOwnerName',
  0xa431: 'BodySerialNumber',
  0xa433: 'LensMake',
  0xa434: 'LensModel',
  0xa435: 'LensSerialNumber',
};

const GPS_TAGS: Record<number, string> = {
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0012: 'GPSMapDatum',
  0x001d: 'GPSDateStamp',
};

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

const readValue = (
  view: DataView,
  offset: number,
  type: number,
  count: number,
  tiffStart: number,
  little: boolean,
): Primitive | number[] | null => {
  const size = TYPE_SIZE[type];
  if (!size) return null;
  const total = size * count;
  const valueOffset = total > 4 ? tiffStart + view.getUint32(offset + 8, little) : offset + 8;
  if (valueOffset + total > view.byteLength) return null;

  if (type === 2) {
    let out = '';
    for (let i = 0; i < count; i += 1) {
      const code = view.getUint8(valueOffset + i);
      if (code === 0) break;
      out += String.fromCharCode(code);
    }
    return out.trim();
  }

  const numbers: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const at = valueOffset + i * size;
    if (type === 1 || type === 7) numbers.push(view.getUint8(at));
    else if (type === 3) numbers.push(view.getUint16(at, little));
    else if (type === 4) numbers.push(view.getUint32(at, little));
    else if (type === 9) numbers.push(view.getInt32(at, little));
    else if (type === 5 || type === 10) {
      const numerator = type === 5 ? view.getUint32(at, little) : view.getInt32(at, little);
      const denominator = type === 5 ? view.getUint32(at + 4, little) : view.getInt32(at + 4, little);
      numbers.push(denominator === 0 ? 0 : numerator / denominator);
    }
  }
  if (numbers.length === 0) return null;
  return numbers.length === 1 ? numbers[0] : numbers;
};

interface Ifd {
  entries: Record<string, Primitive | number[]>;
  exifPointer: number | null;
  gpsPointer: number | null;
}

const readIfd = (
  view: DataView,
  start: number,
  tiffStart: number,
  little: boolean,
  names: Record<number, string>,
): Ifd => {
  const result: Ifd = { entries: {}, exifPointer: null, gpsPointer: null };
  if (start + 2 > view.byteLength) return result;
  const count = view.getUint16(start, little);

  for (let i = 0; i < count; i += 1) {
    const offset = start + 2 + i * 12;
    if (offset + 12 > view.byteLength) break;
    const tag = view.getUint16(offset, little);
    const type = view.getUint16(offset + 2, little);
    const length = view.getUint32(offset + 4, little);

    if (tag === 0x8769) {
      result.exifPointer = tiffStart + view.getUint32(offset + 8, little);
      continue;
    }
    if (tag === 0x8825) {
      result.gpsPointer = tiffStart + view.getUint32(offset + 8, little);
      continue;
    }

    const name = names[tag];
    if (!name) continue;
    const value = readValue(view, offset, type, length, tiffStart, little);
    if (value !== null && value !== '') result.entries[name] = value;
  }

  return result;
};

const toDecimal = (parts: unknown, ref: unknown): number | null => {
  if (!Array.isArray(parts) || parts.length < 3) return null;
  const [deg, min, sec] = parts as number[];
  const decimal = deg + min / 60 + sec / 3600;
  const negative = ref === 'S' || ref === 'W';
  return negative ? -decimal : decimal;
};

/** Locates the TIFF header inside a JPEG APP1 segment. */
const findExifStart = (view: DataView): number | null => {
  if (view.byteLength < 4) return null;
  // Raw TIFF file.
  const first = view.getUint16(0, false);
  if (first === 0x4949 || first === 0x4d4d) return 0;
  if (first !== 0xffd8) return null;

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = view.getUint8(offset + 1);
    const length = view.getUint16(offset + 2, false);
    if (marker === 0xe1) {
      const header = offset + 4;
      let magic = '';
      for (let i = 0; i < 4; i += 1) magic += String.fromCharCode(view.getUint8(header + i));
      if (magic === 'Exif') return header + 6;
    }
    if (marker === 0xda) break;
    offset += 2 + length;
  }
  return null;
};

export interface ParsedMetadata {
  metadata: Record<string, Primitive>;
  gpsLocation?: { lat: number; lng: number };
}

export const parseExif = (buffer: ArrayBuffer): ParsedMetadata => {
  const view = new DataView(buffer);
  const tiffStart = findExifStart(view);
  if (tiffStart === null || tiffStart + 8 > view.byteLength) return { metadata: {} };

  const little = view.getUint16(tiffStart, false) === 0x4949;
  const ifd0Offset = tiffStart + view.getUint32(tiffStart + 4, little);
  const ifd0 = readIfd(view, ifd0Offset, tiffStart, little, EXIF_TAGS);

  const collected: Record<string, Primitive | number[]> = { ...ifd0.entries };

  if (ifd0.exifPointer !== null) {
    Object.assign(
      collected,
      readIfd(view, ifd0.exifPointer, tiffStart, little, EXIF_TAGS).entries,
    );
  }

  let gpsLocation: { lat: number; lng: number } | undefined;
  if (ifd0.gpsPointer !== null) {
    const gps = readIfd(view, ifd0.gpsPointer, tiffStart, little, GPS_TAGS).entries;
    const lat = toDecimal(gps.GPSLatitude, gps.GPSLatitudeRef);
    const lng = toDecimal(gps.GPSLongitude, gps.GPSLongitudeRef);
    if (lat !== null && lng !== null) gpsLocation = { lat, lng };
    Object.assign(collected, gps);
  }

  const metadata: Record<string, Primitive> = {};
  Object.entries(collected).forEach(([key, value]) => {
    metadata[key] = Array.isArray(value)
      ? value.map((n) => (Number.isInteger(n) ? n : Number(n.toFixed(4)))).join(', ')
      : value;
  });

  return { metadata, gpsLocation };
};

/** Risks are only listed when the corresponding field is actually present. */
const collectRisks = (
  metadata: Record<string, Primitive>,
  gps: { lat: number; lng: number } | undefined,
  riskCopy: Record<string, string>,
): string[] => {
  const risks: string[] = [];
  if (gps) risks.push(riskCopy.gps);
  if (metadata.BodySerialNumber || metadata.LensSerialNumber) risks.push(riskCopy.serial);
  if (metadata.Artist || metadata.CameraOwnerName || metadata.Copyright) risks.push(riskCopy.author);
  if (metadata.Make || metadata.Model) risks.push(riskCopy.device);
  if (metadata.Software) risks.push(riskCopy.software);
  if (metadata.DateTimeOriginal || metadata.DateTime) risks.push(riskCopy.timestamp);
  return risks;
};

/**
 * Reads a file entirely on-device and returns what was actually found in it.
 */
export const analyzeFile = async (
  file: File,
  riskCopy: Record<string, string>,
): Promise<MetadataResult> => {
  let parsed: ParsedMetadata = { metadata: {} };
  try {
    // EXIF lives at the head of the file; 512 KB is far more than enough.
    const slice = file.slice(0, 512 * 1024);
    parsed = parseExif(await slice.arrayBuffer());
  } catch {
    parsed = { metadata: {} };
  }

  const metadata: Record<string, Primitive> = {
    FileName: file.name,
    FileType: file.type || 'unknown',
    FileSize: `${file.size} bytes`,
    LastModified: new Date(file.lastModified).toISOString(),
    ...parsed.metadata,
  };

  return {
    filename: file.name,
    fileType: file.type || 'unknown',
    fileSize: file.size,
    extractedAt: new Date(),
    metadata,
    gpsLocation: parsed.gpsLocation,
    privacyRisks: collectRisks(parsed.metadata, parsed.gpsLocation, riskCopy),
  };
};
