import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    shape: string | string[];
    size: number;
    color: string | string[];
    clarity: string | string[];
    certification?: string | string[];
    images: string[];
    stock: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function first(val: string | string[]): string {
  return Array.isArray(val) ? (val[0] ?? '') : (val ?? '');
}

function display(val: string | string[]): string {
  return Array.isArray(val) ? val.join(', ') : (val ?? '');
}

function capitalize(val: string | string[]): string {
  const s = first(val);
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function certDisplay(val?: string | string[]): string {
  if (!val) return '';
  const arr = Array.isArray(val) ? val : [val];
  return arr.filter((c) => c !== 'none').join(' · ');
}

// ─── Gem SVG placeholder ───────────────────────────────────────────────────────
function GemPlaceholder({ shape }: { shape: string }) {
  const s = shape.toLowerCase();

  if (s === 'round' || s === 'brilliant') {
    return (
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
        <polygon points="48,4 88,24 88,72 48,92 8,72 8,24"
          fill="rgba(180,210,255,0.10)" stroke="rgba(180,210,255,0.40)" strokeWidth="0.8" />
        <polygon points="48,4 68,24 48,36 28,24"
          fill="rgba(220,235,255,0.14)" stroke="rgba(180,210,255,0.35)" strokeWidth="0.6" />
        <polygon points="68,24 88,24 88,58 48,36"
          fill="rgba(140,185,255,0.09)" stroke="rgba(160,200,255,0.28)" strokeWidth="0.5" />
        <polygon points="88,58 88,72 48,92 48,36"
          fill="rgba(110,165,255,0.11)" stroke="rgba(150,195,255,0.25)" strokeWidth="0.5" />
        <polygon points="28,24 8,24 8,58 48,36"
          fill="rgba(160,200,255,0.09)" stroke="rgba(170,205,255,0.28)" strokeWidth="0.5" />
        <polygon points="8,58 8,72 48,92 48,36"
          fill="rgba(130,180,255,0.10)" stroke="rgba(160,200,255,0.22)" strokeWidth="0.5" />
        <ellipse cx="40" cy="18" rx="5" ry="3" fill="rgba(255,255,255,0.45)" transform="rotate(-20 40 18)" />
        <circle cx="48" cy="48" r="1.5" fill="rgba(220,235,255,0.5)" />
      </svg>
    );
  }

  if (s === 'pear') {
    return (
      <svg width="80" height="96" viewBox="0 0 80 96" fill="none">
        <path d="M40,4 C62,4 76,20 76,40 C76,62 60,86 40,92 C20,86 4,62 4,40 C4,20 18,4 40,4 Z"
          fill="rgba(180,210,255,0.10)" stroke="rgba(180,210,255,0.40)" strokeWidth="0.8" />
        <path d="M40,4 C55,4 68,14 40,40 C12,14 25,4 40,4 Z"
          fill="rgba(220,235,255,0.14)" stroke="rgba(180,210,255,0.30)" strokeWidth="0.6" />
        <line x1="40" y1="4" x2="40" y2="92" stroke="rgba(180,210,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="34" cy="16" rx="4" ry="2.5" fill="rgba(255,255,255,0.42)" transform="rotate(-20 34 16)" />
      </svg>
    );
  }

  if (s === 'cushion') {
    return (
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
        <rect x="8" y="8" width="80" height="80" rx="18"
          fill="rgba(180,210,255,0.10)" stroke="rgba(180,210,255,0.38)" strokeWidth="0.8" />
        <polygon points="48,8 88,8 88,48"
          fill="rgba(220,235,255,0.10)" stroke="rgba(180,210,255,0.22)" strokeWidth="0.5" />
        <polygon points="48,8 8,8 8,48"
          fill="rgba(200,220,255,0.08)" stroke="rgba(170,205,255,0.20)" strokeWidth="0.5" />
        <polygon points="48,88 88,88 88,48"
          fill="rgba(150,190,255,0.09)" stroke="rgba(160,200,255,0.20)" strokeWidth="0.5" />
        <polygon points="48,88 8,88 8,48"
          fill="rgba(160,200,255,0.08)" stroke="rgba(155,195,255,0.18)" strokeWidth="0.5" />
        <rect x="20" y="20" width="56" height="56" rx="10"
          fill="none" stroke="rgba(180,210,255,0.20)" strokeWidth="0.5" />
        <ellipse cx="38" cy="26" rx="5" ry="3" fill="rgba(255,255,255,0.42)" transform="rotate(-15 38 26)" />
      </svg>
    );
  }

  // Fallback: emerald/radiant/princess
  return (
    <svg width="96" height="84" viewBox="0 0 96 84" fill="none">
      <rect x="14" y="6" width="68" height="72" rx="3"
        fill="rgba(180,210,255,0.10)" stroke="rgba(180,210,255,0.38)" strokeWidth="0.8" />
      <polygon points="14,6 82,6 70,20 26,20"
        fill="rgba(220,235,255,0.12)" stroke="rgba(180,210,255,0.28)" strokeWidth="0.5" />
      <polygon points="14,78 82,78 70,64 26,64"
        fill="rgba(150,190,255,0.10)" stroke="rgba(160,200,255,0.22)" strokeWidth="0.5" />
      <rect x="26" y="20" width="44" height="44" rx="2"
        fill="none" stroke="rgba(180,210,255,0.18)" strokeWidth="0.5" />
      <ellipse cx="38" cy="14" rx="5" ry="2.5" fill="rgba(255,255,255,0.42)" transform="rotate(-10 38 14)" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductCard({ product }: ProductCardProps) {
  const shapeLabel  = capitalize(product.shape);
  const certLabel   = certDisplay(product.certification);
  const isAvailable = product.stock > 0;

  const tags = [
    shapeLabel,
    `${product.size}ct`,
    display(product.color),
    display(product.clarity),
  ].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@400;500;600&display=swap');

        .pc-root {
          font-family: 'Montserrat', sans-serif;
          width: 260px;
          height: 390px;
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .pc-card {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 3px;
          border: 0.5px solid rgba(180, 150, 80, 0.28);
          background: linear-gradient(158deg, #0c1018 0%, #101520 55%, #090d16 100%);
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          cursor: pointer;
        }

        .pc-root:hover .pc-card {
          transform: translateY(-4px);
          border-color: rgba(212, 180, 90, 0.55);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55), 0 0 0 0.5px rgba(212,180,90,0.18) inset;
        }

        /* Top rule */
        .pc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(212,180,90,0.5) 30%, rgba(255,235,130,0.85) 50%, rgba(212,180,90,0.5) 70%, transparent 100%);
          z-index: 5;
        }

        /* Shimmer sweep on hover */
        .pc-card::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 60px;
          left: -60px;
          background: linear-gradient(90deg, transparent, rgba(255,240,160,0.055), transparent);
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
          z-index: 6;
          animation: none;
        }

        .pc-root:hover .pc-card::after {
          opacity: 1;
          animation: pcSweep 2.4s ease-in-out infinite;
        }

        @keyframes pcSweep {
          0%   { left: -60px; }
          100% { left: 110%; }
        }

        /* ── Image zone ── */
        .pc-image-zone {
          flex: none;
          height: 196px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 38%, #182038 0%, #0a0d18 72%);
        }

        .pc-image-zone img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          mix-blend-mode: lighten;
          opacity: 0.88;
          transition: transform 0.55s ease;
        }

        .pc-root:hover .pc-image-zone img {
          transform: scale(1.06);
        }

        /* ── Cert badge ── */
        .pc-cert {
          position: absolute;
          top: 11px; left: 11px;
          z-index: 4;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
          background: rgba(8, 10, 18, 0.90);
          border: 0.5px solid rgba(212, 180, 90, 0.55);
          color: #d4b45a;
        }

        /* ── Stock badge ── */
        .pc-stock-badge {
          position: absolute;
          top: 11px; right: 11px;
          z-index: 4;
          font-size: 7.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
          background: rgba(8, 10, 18, 0.90);
          border: 0.5px solid rgba(122, 184, 138, 0.5);
          color: #7ab88a;
        }

        /* ── Sold out overlay ── */
        .pc-sold-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: rgba(5, 7, 14, 0.68);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pc-sold-label {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 5px 14px;
          border: 0.5px solid rgba(180, 150, 80, 0.45);
          color: rgba(212, 180, 90, 0.65);
        }

        /* ── Body ── */
        .pc-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px 16px 15px;
        }

        .pc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.35;
          letter-spacing: 0.015em;
          color: #f0e8d0;
          margin: 0 0 4px;
        }

        .pc-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12.5px;
          font-style: italic;
          color: rgba(212, 180, 90, 0.52);
          display: block;
          margin-top: 3px;
        }

        /* ── Tags ── */
        .pc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }

        .pc-tag {
          font-size: 7px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 2px;
          color: rgba(212, 180, 90, 0.72);
          border: 0.5px solid rgba(212, 180, 90, 0.20);
          background: rgba(212, 180, 90, 0.04);
        }

        /* ── Divider ── */
        .pc-divider {
          height: 0.5px;
          margin: 12px 0 10px;
          background: linear-gradient(90deg, rgba(212,180,90,0.06), rgba(212,180,90,0.28), rgba(212,180,90,0.06));
        }

        /* ── Price row ── */
        .pc-price-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .pc-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 23px;
          font-weight: 300;
          color: #f0e8d0;
          line-height: 1;
          display: flex;
          align-items: flex-start;
          gap: 1px;
        }

        .pc-currency {
          font-size: 11px;
          font-weight: 400;
          color: rgba(212, 180, 90, 0.58);
          margin-top: 3px;
          font-family: 'Montserrat', sans-serif;
        }

        .pc-avail-in  { font-size: 7.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #7ab88a; }
        .pc-avail-out { font-size: 7.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(200, 80, 70, 0.78); }

        /* ── Corner ornament ── */
        .pc-ornament {
          position: absolute;
          bottom: 10px; right: 12px;
          width: 16px; height: 16px;
          opacity: 0.15;
          pointer-events: none;
        }
      `}</style>

      <Link href={`/products/${product._id}`} className="pc-root">
        <div className="pc-card">

          {/* Image zone */}
          <div className="pc-image-zone">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} />
            ) : (
              <GemPlaceholder shape={first(product.shape)} />
            )}

            {certLabel && <div className="pc-cert">{certLabel}</div>}

            {isAvailable && product.stock <= 3 && (
              <div className="pc-stock-badge">{product.stock} left</div>
            )}

            {!isAvailable && (
              <div className="pc-sold-overlay">
                <span className="pc-sold-label">Unavailable</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="pc-body">
            <div>
              <h3 className="pc-name">
                {product.name}
                <span className="pc-sub">{shapeLabel} · {product.size}ct</span>
              </h3>

              <div className="pc-tags">
                {tags.map((tag) => (
                  <span key={tag} className="pc-tag">{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="pc-divider" />
              <div className="pc-price-row">
                <span className="pc-price">
                  <span className="pc-currency">$</span>
                  {product.price.toLocaleString()}
                </span>
                <span className={isAvailable ? 'pc-avail-in' : 'pc-avail-out'}>
                  {isAvailable ? `${product.stock} available` : 'Sold out'}
                </span>
              </div>
            </div>
          </div>

          {/* Corner diamond ornament */}
          <svg className="pc-ornament" viewBox="0 0 18 18" fill="none">
            <path d="M9 1L17 5V13L9 17L1 13V5Z" stroke="#d4b45a" strokeWidth="0.75" />
            <path d="M9 1L13 5L9 9L5 5Z" stroke="#d4b45a" strokeWidth="0.5" />
          </svg>

        </div>
      </Link>
    </>
  );
}