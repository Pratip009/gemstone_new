import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { listProducts, getProductFacets } from '@/services/product.service';
import { errorResponse } from '@/lib/api-response';
import { ProductFilterParams } from '@/services/productFilter.service';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sp = req.nextUrl.searchParams;

    const params: ProductFilterParams = {
      category:      sp.get('category')      || undefined,
      subcategory:   sp.get('subcategory')   || undefined,
      shape:         sp.get('shape')         || undefined,
      color:         sp.get('color')         || undefined,
      clarity:       sp.get('clarity')       || undefined,
      certification: sp.get('certification') || undefined,
      priceMin:      sp.get('priceMin')      || undefined,
      priceMax:      sp.get('priceMax')      || undefined,
      sizeMin:       sp.get('sizeMin')       || undefined,
      sizeMax:       sp.get('sizeMax')       || undefined,
      inStock:       sp.get('inStock')       || undefined,
      q:             sp.get('q')             || undefined,
      sortBy:       (sp.get('sortBy') as ProductFilterParams['sortBy']) || 'newest',
      page:          sp.get('page')          || 1,
      limit:         sp.get('limit')         || 20,
    };

    const includeFacets = sp.get('facets') === 'true';

    const [{ products, total, page, limit }, facets] = await Promise.all([
      listProducts(params),
      includeFacets ? getProductFacets(params) : Promise.resolve(null),
    ]);

    const totalPages = Math.ceil(total / limit);

    return Response.json({
      success: true,
      data: products,
      pagination: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      ...(facets ? { facets } : {}),
    });
  } catch (err) {
    console.error('[GET /api/products]', err);
    return errorResponse('Failed to fetch products', 500);
  }
}
