'use client';
import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'size_asc', label: 'Carat: Small to Large' },
  { value: 'size_desc', label: 'Carat: Large to Small' },
];

export default function SortBar({
  total,
  currentSort,
  query,
}: {
  total: number;
  currentSort?: string;
  query?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', value);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-800">
      <p className="text-neutral-500 text-sm">
        {query ? (
          <>Results for <span className="text-white">"{query}"</span> — </>
        ) : null}
        <span className="text-white font-medium">{total.toLocaleString()}</span> products
      </p>
      <select
        value={currentSort || 'newest'}
        onChange={(e) => handleSort(e.target.value)}
        className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-amber-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
