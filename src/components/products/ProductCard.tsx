import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    shape: string;
    size: number;
    color: string;
    clarity: string;
    certification?: string;
    images: string[];
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="card overflow-hidden hover:border-neutral-600 transition-colors">
        {/* Image */}
        <div className="aspect-square bg-neutral-800 relative overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-700">
              💎
            </div>
          )}
          {product.certification && product.certification !== 'none' && (
            <div className="absolute top-2 left-2 bg-amber-500/90 text-black text-xs font-bold px-1.5 py-0.5 rounded">
              {product.certification}
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-red-400 font-semibold text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-medium text-neutral-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex flex-wrap gap-1">
            {[
              product.shape.charAt(0).toUpperCase() + product.shape.slice(1),
              `${product.size}ct`,
              `Color ${product.color}`,
              product.clarity,
            ].map((tag) => (
              <span key={tag} className="text-xs bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-amber-400 font-bold text-base">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-neutral-600 text-xs">
              {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
