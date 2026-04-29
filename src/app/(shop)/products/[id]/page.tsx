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
    { label: 'Carat Weight',  value: `${p.size} ct` },
    { label: 'Color Grade',   value: p.color },
    { label: 'Clarity',       value: p.clarity },
    { label: 'Certification', value: p.certification && p.certification !== 'none' ? p.certification : '—' },
    { label: 'Availability',  value: `${p.stock} in stock`, highlight: p.stock > 0 },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-[#a09a90] mb-8">
            <span>{p.category?.name ?? 'Diamonds'}</span>
            <span className="text-[#c8c2b8]">→</span>
            {p.subcategory?.name && (
              <>
                <span>{p.subcategory.name}</span>
                <span className="text-[#c8c2b8]">→</span>
              </>
            )}
            <span className="text-[#706a60]">{p.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* ── Images ── */}
            <div>
              <div className="relative aspect-square bg-[#f0ede6] border border-[#e2ddd5] overflow-hidden flex items-center justify-center">
                {p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <svg width="72" height="72" viewBox="0 0 88 88" fill="none">
                      <polygon points="44,8 76,24 76,64 44,80 12,64 12,24" stroke="#b09a70" strokeWidth="0.8" fill="rgba(180,155,90,0.06)"/>
                      <polygon points="44,8 60,24 44,36 28,24" stroke="#b09a70" strokeWidth="0.6" fill="rgba(180,155,90,0.05)"/>
                      <circle cx="44" cy="44" r="2.5" fill="rgba(200,175,110,0.5)"/>
                    </svg>
                  </div>
                )}

                {p.certification && p.certification !== 'none' && (
                  <div className="absolute top-3 left-3 bg-[#faf9f6] border border-[#c8b87a] text-[#8a6e2a] text-[9px] font-medium tracking-[0.18em] uppercase px-[10px] py-[4px]">
                    {p.certification} Certified
                  </div>
                )}

                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-[#faf9f6]/80 flex items-center justify-center">
                    <span className="border border-[#c8c2b8] text-[#a09a90] text-[9px] font-medium tracking-[0.2em] uppercase px-4 py-2">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {p.images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {p.images.slice(0, 5).map((img, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 bg-[#f0ede6] border border-[#e2ddd5] overflow-hidden cursor-pointer hover:border-[#b09a70] transition-colors"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="flex flex-col">

              {/* Category label */}
              <p className="text-[10px] tracking-[0.16em] uppercase text-[#b09a70] mb-2 font-['DM_Sans']">
                {p.category?.name}
                {p.subcategory?.name ? ` · ${p.subcategory.name}` : ''}
              </p>

              {/* Name */}
              <h1
                className="text-[36px] font-light leading-[1.15] text-[#1a1714] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {p.name}
              </h1>
              <p
                className="text-[15px] italic text-[#a09a90] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {p.color} Color · {p.clarity} Clarity · {p.size} ct
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 py-5 border-t border-b border-[#e2ddd5] mb-6">
                <span
                  className="text-[18px] font-normal text-[#8a6e2a] self-start mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  $
                </span>
                <span
                  className="text-[42px] font-light text-[#1a1714] leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {p.price.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#a09a90] ml-1 tracking-[0.04em]">
                  USD · Free insured shipping
                </span>
              </div>

              {/* Specs */}
              <table className="w-full border-collapse mb-6">
                <tbody>
                  {specs.map(({ label, value, highlight }) => (
                    <tr key={label} className="border-b border-[#ede9e1]">
                      <td className="py-[10px] text-[10px] tracking-[0.1em] uppercase text-[#a09a90] w-[45%]">
                        {label}
                      </td>
                      <td className={`py-[10px] text-[13px] font-medium text-right ${highlight ? 'text-[#6a9e6a]' : 'text-[#1a1714]'}`}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Description */}
              {p.description && (
                <p className="text-[13px] text-[#706a60] leading-[1.75] py-4 border-t border-[#ede9e1] mb-6">
                  {p.description}
                </p>
              )}

              {/* Ornament */}
              <p
                className="text-center text-[#d4cfc6] tracking-[0.3em] mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px' }}
              >
                · · ·
              </p>

              {/* Stock indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-[6px] h-[6px] rounded-full ${p.stock > 0 ? 'bg-[#6a9e6a]' : 'bg-[#c0392b]'}`} />
                <span className={`text-[11px] tracking-[0.08em] uppercase ${p.stock > 0 ? 'text-[#6a9e6a]' : 'text-[#c0392b]'}`}>
                  {p.stock > 0 ? 'In stock — ready to ship' : 'Currently unavailable'}
                </span>
              </div>

              {/* CTA */}
              <AddToCartButton productId={String(p._id)} inStock={p.stock > 0} />

              <button className="
                w-full mt-2 bg-transparent text-[#706a60]
                border border-[#d4cfc6] py-[13px] px-6
                text-[11px] font-normal tracking-[0.16em] uppercase
                hover:border-[#b09a70] hover:text-[#8a6e2a] transition-colors cursor-pointer
              ">
                Save to wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}