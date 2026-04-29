import { Readable } from 'stream';
import { SHAPES, COLORS, CLARITIES, CERTIFICATIONS } from '@/models/Product';

export interface ParsedProductRow {
  name?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  shape?: string;
  size?: number;
  color?: string;
  clarity?: string;
  certification?: string;
  images?: string[];
  stock?: number;
  description?: string;
  [key: string]: unknown;
}

export interface ParseResult {
  rows: ParsedProductRow[];
  parseErrors: Array<{ row: number; error: string }>;
}

// ─── Normalize a raw row from CSV/Excel ───────────────────────────────────────
function normalizeRow(raw: Record<string, unknown>, index: number): { data: ParsedProductRow; error?: string } {
  try {
    const get = (key: string): string => {
      const val = raw[key] ?? raw[key.toLowerCase()] ?? raw[key.toUpperCase()] ?? '';
      return String(val).trim();
    };

    const name = get('name');
    if (!name) return { data: {}, error: 'Missing required field: name' };

    const priceRaw = parseFloat(get('price'));
    if (isNaN(priceRaw) || priceRaw < 0)
      return { data: {}, error: 'Invalid price' };

    const sizeRaw = parseFloat(get('size'));
    if (isNaN(sizeRaw) || sizeRaw <= 0)
      return { data: {}, error: 'Invalid size (carat weight)' };

    const stockRaw = parseInt(get('stock'), 10);
    const stock = isNaN(stockRaw) ? 0 : stockRaw;

    const shape = get('shape').toLowerCase();
    if (!SHAPES.includes(shape as never))
      return { data: {}, error: `Invalid shape: "${shape}". Valid: ${SHAPES.join(', ')}` };

    const color = get('color').toUpperCase();
    if (!COLORS.includes(color as never))
      return { data: {}, error: `Invalid color: "${color}"` };

    const clarity = get('clarity').toUpperCase();
    if (!CLARITIES.includes(clarity as never))
      return { data: {}, error: `Invalid clarity: "${clarity}"` };

    const certRaw = get('certification').toUpperCase() || 'none';
    const certification = CERTIFICATIONS.includes(certRaw as never) ? certRaw : 'none';

    const imagesRaw = get('images');
    const images = imagesRaw
      ? imagesRaw.split('|').map((s) => s.trim()).filter(Boolean)
      : [];

    return {
      data: {
        name,
        category: get('category') || undefined,
        subcategory: get('subcategory') || undefined,
        price: priceRaw,
        shape,
        size: sizeRaw,
        color,
        clarity,
        certification,
        images,
        stock,
        description: get('description') || undefined,
      },
    };
  } catch (err) {
    return { data: {}, error: `Row ${index} parse error: ${err instanceof Error ? err.message : 'Unknown'}` };
  }
}

// ─── Parse CSV Buffer ─────────────────────────────────────────────────────────
export async function parseCSV(buffer: Buffer): Promise<ParseResult> {
  // Dynamic import to avoid issues with edge runtime
  const csvParser = (await import('csv-parser')).default;

  return new Promise((resolve) => {
    const rows: ParsedProductRow[] = [];
    const parseErrors: Array<{ row: number; error: string }> = [];
    let rowIndex = 1;

    const stream = Readable.from(buffer);
    stream
      .pipe(csvParser())
      .on('data', (raw: Record<string, unknown>) => {
        rowIndex++;
        const { data, error } = normalizeRow(raw, rowIndex);
        if (error) {
          parseErrors.push({ row: rowIndex, error });
        } else {
          rows.push(data);
        }
      })
      .on('end', () => resolve({ rows, parseErrors }))
      .on('error', (err) => {
        parseErrors.push({ row: 0, error: `CSV parse error: ${err.message}` });
        resolve({ rows, parseErrors });
      });
  });
}

// ─── Parse Excel Buffer ───────────────────────────────────────────────────────
export async function parseExcel(buffer: Buffer): Promise<ParseResult> {
  const XLSX = await import('xlsx');
  const rows: ParsedProductRow[] = [];
  const parseErrors: Array<{ row: number; error: string }> = [];

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { rows: [], parseErrors: [{ row: 0, error: 'No sheets found in Excel file' }] };
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  rawRows.forEach((raw, i) => {
    const rowIndex = i + 2; // 1-indexed + header row
    const { data, error } = normalizeRow(raw, rowIndex);
    if (error) {
      parseErrors.push({ row: rowIndex, error });
    } else {
      rows.push(data);
    }
  });

  return { rows, parseErrors };
}

// ─── Auto-detect and parse ────────────────────────────────────────────────────
export async function parseUploadedFile(
  buffer: Buffer,
  filename: string
): Promise<ParseResult> {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return parseCSV(buffer);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(buffer);
  throw new Error(`Unsupported file type: .${ext}. Use .csv or .xlsx`);
}

// ─── Generate CSV template ────────────────────────────────────────────────────
export function generateCSVTemplate(): string {
  const headers = [
    'name', 'category', 'subcategory', 'price', 'shape', 'size',
    'color', 'clarity', 'certification', 'stock', 'images', 'description',
  ];
  const example = [
    'Round Diamond 1ct', 'diamonds', 'loose-diamonds', '4500', 'round',
    '1.0', 'D', 'VS1', 'GIA', '5',
    'https://example.com/img1.jpg|https://example.com/img2.jpg',
    'Excellent cut round diamond',
  ];
  return [headers.join(','), example.join(',')].join('\n');
}
