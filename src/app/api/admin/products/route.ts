import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { createProduct, listProducts, updateProduct, deleteProduct } from '@/services/product.service';
import { withAdmin } from '@/middleware/auth.middleware';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';
import { SHAPES, COLORS, CLARITIES, CERTIFICATIONS } from '@/models/Product';

const productSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  price: z.number().positive(),
  shape: z.enum(SHAPES),
  size: z.number().positive(),
  color: z.enum(COLORS),
  clarity: z.enum(CLARITIES),
  certification: z.enum(CERTIFICATIONS).optional(),
  images: z.array(z.string().url()).default([]),
  stock: z.number().int().min(0),
  description: z.string().max(2000).optional(),
  isActive: z.boolean().default(true),
});

// POST /api/admin/products — create product
export const POST = withAdmin(async (req) => {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 400, parsed.error.flatten().fieldErrors);
    }

    const product = await createProduct(parsed.data as never);
    return successResponse(product, 201);
  } catch (err) {
    console.error('[POST /api/admin/products]', err);
    return errorResponse(err instanceof Error ? err.message : 'Failed to create product', 500);
  }
});

// GET /api/admin/products — list all products (including inactive)
export const GET = withAdmin(async (req) => {
  try {
    await connectDB();
    const sp = req.nextUrl.searchParams;
    const page = Number(sp.get('page') || 1);
    const limit = Number(sp.get('limit') || 20);

    // Admin can see inactive products too — we override isActive filter
    const { products, total } = await listProducts({ page, limit });
    return Response.json({ success: true, data: products, total, page, limit });
  } catch (err) {
    return errorResponse('Failed to fetch products', 500);
  }
});
