import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { getProductById } from '@/services/product.service';
import AddToCartButton from '@/components/cart/AddToCartButton';

type ProductDoc = {
  _id: unknown;
  name: string;
  price: number;
  shape: string;
  size: number;
  color: string;
  clarity: string;
  certification?: string;
  images: string[];
  stock: number;
  description?: string;
  category?: { name: string };
  subcategory?: { name: string };
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  await connectDB();
  const raw = await getProductById(params.id);
  if (!raw) notFound();

  const p = raw as unknown as ProductDoc;

  const specs = [
    { label: 'Shape',         value: p.shape.charAt(0).toUpperCase() + p.shape.slice(1) },
    { label: 'Carat',         value: `${p.size} ct` },
    { label: 'Color',         value: p.color },
    { label: 'Clarity',       value: p.clarity },
    { label: 'Certification', value: p.certification || 'none' },
    { label: 'Stock',         value: `${p.stock} available` },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
            {p.images[0] ? (
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl text-neutral-700">💎</div>
            )}
          </div>
          {p.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {p.images.slice(1).map((img, i) => (
                <div key={i} className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded overflow-hidden shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-neutral-500 text-sm mb-1">
              {p.category?.name}
              {p.subcategory?.name ? ` → ${p.subcategory.name}` : ''}
            </p>
            <h1 className="text-2xl font-bold text-white">{p.name}</h1>
          </div>

          <div className="text-3xl font-bold text-amber-400">
            ${p.price.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {specs.map(({ label, value }) => (
              <div key={label} className="card p-3">
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-sm font-medium text-neutral-200">{value}</div>
              </div>
            ))}
          </div>

          {p.description && (
            <p className="text-neutral-400 text-sm leading-relaxed">{p.description}</p>
          )}

          <AddToCartButton productId={String(p._id)} inStock={p.stock > 0} />
        </div>
      </div>
    </div>
  );
}
