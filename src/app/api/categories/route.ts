import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { listCategories, listSubcategories } from '@/services/category.service';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET /api/categories — public, for shop navigation
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const withSubs = req.nextUrl.searchParams.get('withSubcategories') === 'true';

    const categories = await listCategories();

    if (withSubs) {
      // Attach subcategories to each category
      const subcategories = await listSubcategories();
      const enriched = categories.map((cat) => ({
        ...cat,
        subcategories: subcategories.filter(
          (s) => s.category?.toString() === (cat as Record<string, unknown>)._id?.toString()
        ),
      }));
      return successResponse(enriched);
    }

    return successResponse(categories);
  } catch {
    return errorResponse('Failed to fetch categories', 500);
  }
}
