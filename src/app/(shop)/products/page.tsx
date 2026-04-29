import { Suspense } from 'react';
import { connectDB } from '@/lib/db';
import { listProducts, getProductFacets } from '@/services/product.service';
import { ProductFilterParams } from '@/services/productFilter.service';
import ProductCard from '@/components/products/ProductCard';
import FilterSidebar from '@/components/filters/FilterSidebar';
import SortBar from '@/components/products/SortBar';
import Pagination from '@/components/ui/Pagination';

interface PageProps {
  searchParams: Record<string, string>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  await connectDB();

  const params: ProductFilterParams = {
    category: searchParams.category,
    subcategory: searchParams.subcategory,
    shape: searchParams.shape,
    color: searchParams.color,
    clarity: searchParams.clarity,
    certification: searchParams.certification,
    priceMin: searchParams.priceMin,
    priceMax: searchParams.priceMax,
    sizeMin: searchParams.sizeMin,
    sizeMax: searchParams.sizeMax,
    inStock: searchParams.inStock,
    q: searchParams.q,
    sortBy: searchParams.sortBy as ProductFilterParams['sortBy'],
    page: searchParams.page || 1,
    limit: 24,
  };

  const [{ products, total, page, limit }, facets] = await Promise.all([
    listProducts(params),
    getProductFacets(params),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex gap-8">
      <FilterSidebar facets={facets} />

      <div className="flex-1 min-w-0">
        <SortBar total={total} currentSort={searchParams.sortBy} query={searchParams.q} />

        {products.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <div className="text-4xl mb-4">🔍</div>
            <p>No products match your filters.</p>
            <p className="text-sm mt-1">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {products.map((p: Record<string, unknown>) => (
                <ProductCard key={String(p._id)} product={p as Parameters<typeof ProductCard>[0]['product']} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={searchParams}
            />
          </>
        )}
      </div>
    </div>
  );
}
