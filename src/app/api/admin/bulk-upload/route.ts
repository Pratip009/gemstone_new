import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { parseUploadedFile, generateCSVTemplate } from '@/services/fileParser.service';
import { bulkCreateProducts } from '@/services/product.service';
import { withAdmin } from '@/middleware/auth.middleware';
import { successResponse, errorResponse } from '@/lib/api-response';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return errorResponse('No file uploaded', 400);

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) return errorResponse('File too large (max 10MB)', 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const { rows, parseErrors } = await parseUploadedFile(buffer, file.name);

    if (rows.length === 0) {
      return errorResponse('No valid rows found', 400, { parseErrors });
    }

    // Build unique slug sets
    const categorySlugs = Array.from(new Set(rows.map((r) => r.category).filter((v): v is string => Boolean(v))));
    const subcategorySlugs = Array.from(new Set(rows.map((r) => r.subcategory).filter((v): v is string => Boolean(v))));

    const [categories, subcategories] = await Promise.all([
      Category.find({ slug: { $in: categorySlugs } }).lean() as unknown as Array<{ _id: { toString(): string }; slug: string }>,
      Subcategory.find({ slug: { $in: subcategorySlugs } }).lean() as unknown as Array<{ _id: { toString(): string }; slug: string }>,
    ]);

    const categoryMap = new Map(categories.map((c) => [c.slug, c._id.toString()]));
    const subcategoryMap = new Map(subcategories.map((s) => [s.slug, s._id.toString()]));

    const resolvedRows: Record<string, unknown>[] = [];
    const resolutionErrors: Array<{ row: number; error: string }> = [];

    rows.forEach((row, i) => {
      const rowNum = i + 2;
      const categoryId = categoryMap.get(row.category as string);
      if (!categoryId) {
        resolutionErrors.push({ row: rowNum, error: `Category not found: "${row.category}"` });
        return;
      }

      const resolvedRow: Record<string, unknown> = { ...row, category: categoryId };

      if (row.subcategory) {
        const subcategoryId = subcategoryMap.get(row.subcategory as string);
        if (!subcategoryId) {
          resolutionErrors.push({ row: rowNum, error: `Subcategory not found: "${row.subcategory}"` });
          return;
        }
        resolvedRow.subcategory = subcategoryId;
      } else {
        delete resolvedRow.subcategory;
      }

      resolvedRows.push(resolvedRow);
    });

    if (resolvedRows.length === 0) {
      return errorResponse('No rows could be resolved', 400, { parseErrors, resolutionErrors });
    }

    const result = await bulkCreateProducts(resolvedRows);

    return successResponse({
      message: `Processed ${rows.length} rows`,
      inserted: result.inserted,
      failed: result.failed + resolutionErrors.length,
      errors: [...parseErrors, ...resolutionErrors, ...result.errors],
    });
  } catch (err) {
    console.error('[POST /api/admin/bulk-upload]', err);
    return errorResponse(err instanceof Error ? err.message : 'Bulk upload failed', 500);
  }
});

export const GET = withAdmin(async () => {
  const csv = generateCSVTemplate();
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="products-template.csv"',
    },
  });
});
