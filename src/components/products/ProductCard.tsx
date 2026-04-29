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
  const tags = [
    product.shape.charAt(0).toUpperCase() + product.shape.slice(1),
    `${product.size}ct`,
    product.color,
    product.clarity,
  ];

  return (
    <Link href={`/products/${product._id}`} className="group block w-[260px] h-[370px]">
      <div
        className="
          relative h-full flex flex-col overflow-hidden
          border border-[rgba(180,150,80,0.35)] rounded-[2px]
          transition-all duration-400
          hover:border-[rgba(212,180,90,0.65)] hover:-translate-y-[3px]
        "
        style={{ background: 'linear-gradient(160deg, #0d1117 0%, #111827 60%, #0a0f1a 100%)' }}
      >
        {/* Top gold rule */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,180,90,0.7), rgba(255,230,120,0.9), rgba(212,180,90,0.7), transparent)' }}
        />

        {/* Bottom gold rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,180,90,0.4), transparent)' }}
        />

        {/* Hover shimmer sweep */}
        <div
          className="absolute top-0 bottom-0 w-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,235,150,0.06), transparent)',
            animation: 'shimmerSweep 3s ease-in-out infinite',
          }}
        />

        {/* Image */}
        <div
          className="flex-none h-[188px] flex items-center justify-center overflow-hidden relative"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a2240 0%, #0b0e18 70%)' }}
        >
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-600 mix-blend-lighten opacity-[0.88] group-hover:scale-105"
            />
          ) : (
            // Diamond facet placeholder SVG
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none"
              style={{ filter: 'drop-shadow(0 0 14px rgba(180,210,255,0.18)) drop-shadow(0 0 6px rgba(212,180,90,0.12))' }}
            >
              <polygon points="44,6 78,26 78,62 44,82 10,62 10,26" fill="rgba(160,200,255,0.07)" stroke="rgba(180,210,255,0.35)" strokeWidth="0.75"/>
              <polygon points="44,6 62,26 44,38 26,26" fill="rgba(212,180,90,0.08)" stroke="rgba(212,180,90,0.3)" strokeWidth="0.6"/>
              <polygon points="44,38 62,26 78,62 44,82" fill="rgba(160,200,255,0.05)" stroke="rgba(160,200,255,0.2)" strokeWidth="0.5"/>
              <polygon points="44,38 26,26 10,62 44,82" fill="rgba(130,180,255,0.07)" stroke="rgba(130,180,255,0.18)" strokeWidth="0.5"/>
              <line x1="44" y1="6" x2="44" y2="82" stroke="rgba(212,180,90,0.12)" strokeWidth="0.4"/>
              <circle cx="44" cy="44" r="2" fill="rgba(255,240,200,0.4)"/>
            </svg>
          )}

          {product.certification && product.certification !== 'none' && (
            <div
              className="absolute top-[11px] left-[11px] z-[5] text-[7.5px] font-semibold tracking-[0.2em] uppercase px-2 py-[3px] rounded-[1px]"
              style={{
                background: 'rgba(10,10,16,0.88)',
                border: '0.5px solid rgba(212,180,90,0.55)',
                color: '#d4b45a',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {product.certification}
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 z-[6] flex items-center justify-center" style={{ background: 'rgba(5,7,12,0.72)' }}>
              <span
                className="text-[8px] font-semibold tracking-[0.22em] uppercase px-[14px] py-[5px]"
                style={{
                  border: '0.5px solid rgba(180,150,80,0.5)',
                  color: 'rgba(212,180,90,0.7)',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col justify-between px-4 pt-[14px] pb-4">
          <div>
            <h3
              className="text-[16px] font-normal leading-snug tracking-[0.02em] mb-[10px]"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#f0e8d0' }}
            >
              {product.name}
              <br />
              <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'rgba(212,180,90,0.55)' }}>
                {product.shape.charAt(0).toUpperCase() + product.shape.slice(1)} · {product.size}ct
              </span>
            </h3>

            <div className="flex flex-wrap gap-[5px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[7px] font-medium tracking-[0.16em] uppercase px-[7px] py-[3px] rounded-[1px]"
                  style={{
                    color: 'rgba(212,180,90,0.75)',
                    border: '0.5px solid rgba(212,180,90,0.22)',
                    background: 'rgba(212,180,90,0.05)',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div
              className="h-px mb-3"
              style={{ background: 'linear-gradient(90deg, rgba(212,180,90,0.08), rgba(212,180,90,0.3), rgba(212,180,90,0.08))' }}
            />
            <div className="flex items-end justify-between">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: '#f0e8d0', lineHeight: 1 }}>
                <sup style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(212,180,90,0.6)', verticalAlign: 'super', marginRight: '1px' }}>$</sup>
                {product.price.toLocaleString()}
              </span>
              <span
                className={`text-[7.5px] font-medium tracking-[0.14em] uppercase ${product.stock > 0 ? 'text-[#7ab88a]' : 'text-[rgba(200,80,70,0.75)]'}`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {product.stock > 0 ? `${product.stock} available` : 'Sold out'}
              </span>
            </div>
          </div>
        </div>

        {/* Corner diamond ornament */}
        <svg className="absolute bottom-[10px] right-3 w-[18px] h-[18px] opacity-[0.18]" viewBox="0 0 18 18" fill="none">
          <path d="M9 1L17 5V13L9 17L1 13V5Z" stroke="#d4b45a" strokeWidth="0.75"/>
          <path d="M9 1L13 5L9 9L5 5Z" stroke="#d4b45a" strokeWidth="0.5"/>
        </svg>
      </div>
    </Link>
  );
}