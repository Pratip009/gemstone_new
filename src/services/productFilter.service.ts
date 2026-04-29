import { FilterQuery } from 'mongoose';
import { IProduct } from '@/models/Product';

// ─── Filter Query Params ──────────────────────────────────────────────────────
export interface ProductFilterParams {
  // Category
  category?: string;
  subcategory?: string;

  // Multi-select filters (comma-separated or array)
  shape?: string | string[];
  color?: string | string[];
  clarity?: string | string[];
  certification?: string | string[];

  // Range filters
  priceMin?: string | number;
  priceMax?: string | number;
  sizeMin?: string | number;
  sizeMax?: string | number;

  // Pagination
  page?: string | number;
  limit?: string | number;

  // Sorting
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'size_asc' | 'size_desc';

  // Search
  q?: string;

  // Stock
  inStock?: string | boolean;
}

export interface ParsedFilters {
  query: FilterQuery<IProduct>;
  sort: Record<string, 1 | -1>;
  page: number;
  limit: number;
  skip: number;
}

// ─── Helper: normalize to array ──────────────────────────────────────────────
function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  // Support comma-separated: "round,oval,princess"
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

// ─── Helper: parse numeric safely ────────────────────────────────────────────
function toNumber(val: string | number | undefined): number | undefined {
  if (val === undefined || val === '') return undefined;
  const n = Number(val);
  return isNaN(n) ? undefined : n;
}

// ─── Core Filter Builder ──────────────────────────────────────────────────────
/**
 * Builds a MongoDB FilterQuery from URL query params.
 *
 * Strategy:
 *  - Multi-select fields use $in → hits compound index efficiently
 *  - Range fields use $gte/$lte → hits range-capable indexes
 *  - All conditions are ANDed together
 *  - Only adds conditions for params that are actually provided
 *    (avoids unnecessary query clauses that would hurt index use)
 *
 * Index utilization order (MongoDB picks best):
 *  1. category + subcategory (compound) → most selective first
 *  2. shape + color + clarity (compound) → 3C combo
 *  3. price range → index on price
 *  4. size range → index on size
 */
export function buildProductFilterQuery(params: ProductFilterParams): ParsedFilters {
  const filter: FilterQuery<IProduct> = {};

  // Always filter active products
  filter.isActive = true;

  // ── Category ───────────────────────────────────────────────────────────────
  if (params.category) {
    filter.category = params.category; // ObjectId string — Mongoose coerces
  }

  if (params.subcategory) {
    filter.subcategory = params.subcategory;
  }

  // ── Multi-select filters using $in ─────────────────────────────────────────
  const shapes = toArray(params.shape);
  if (shapes.length > 0) {
    filter.shape = { $in: shapes };
  }

  const colors = toArray(params.color);
  if (colors.length > 0) {
    filter.color = { $in: colors };
  }

  const clarities = toArray(params.clarity);
  if (clarities.length > 0) {
    filter.clarity = { $in: clarities };
  }

  const certifications = toArray(params.certification);
  if (certifications.length > 0) {
    filter.certification = { $in: certifications };
  }

  // ── Range filters ──────────────────────────────────────────────────────────
  const priceMin = toNumber(params.priceMin);
  const priceMax = toNumber(params.priceMax);
  if (priceMin !== undefined || priceMax !== undefined) {
    filter.price = {};
    if (priceMin !== undefined) filter.price.$gte = priceMin;
    if (priceMax !== undefined) filter.price.$lte = priceMax;
  }

  const sizeMin = toNumber(params.sizeMin);
  const sizeMax = toNumber(params.sizeMax);
  if (sizeMin !== undefined || sizeMax !== undefined) {
    filter.size = {};
    if (sizeMin !== undefined) filter.size.$gte = sizeMin;
    if (sizeMax !== undefined) filter.size.$lte = sizeMax;
  }

  // ── Stock filter ───────────────────────────────────────────────────────────
  if (params.inStock === 'true' || params.inStock === true) {
    filter.stock = { $gt: 0 };
  }

  // ── Full-text search ───────────────────────────────────────────────────────
  if (params.q && params.q.trim()) {
    filter.$text = { $search: params.q.trim() };
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    size_asc: { size: 1 },
    size_desc: { size: -1 },
  };

  const sort = sortMap[params.sortBy || 'newest'] || { createdAt: -1 };

  // ── Pagination ─────────────────────────────────────────────────────────────
  const page = Math.max(1, toNumber(params.page) || 1);
  const limit = Math.min(100, Math.max(1, toNumber(params.limit) || 20));
  const skip = (page - 1) * limit;

  return { query: filter, sort, page, limit, skip };
}

// ─── Build filter facets for UI ───────────────────────────────────────────────
/**
 * Returns aggregation pipeline to get facet counts (for filter UI)
 * This lets the frontend show "Round (42)" etc.
 */
export function buildFacetsPipeline(baseFilter: FilterQuery<IProduct>) {
  return [
    { $match: baseFilter },
    {
      $facet: {
        shapes: [{ $group: { _id: '$shape', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
        colors: [{ $group: { _id: '$color', count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
        clarities: [{ $group: { _id: '$clarity', count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
        certifications: [
          { $group: { _id: '$certification', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        priceRange: [
          {
            $group: {
              _id: null,
              min: { $min: '$price' },
              max: { $max: '$price' },
            },
          },
        ],
        sizeRange: [
          {
            $group: {
              _id: null,
              min: { $min: '$size' },
              max: { $max: '$size' },
            },
          },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];
}
