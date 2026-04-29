import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center gap-8">
      <div>
        <h1 className="text-5xl font-bold text-amber-400 mb-3">GemStone Shop</h1>
        <p className="text-neutral-400 text-lg max-w-md">
          Premium diamonds and gemstones. Certified. Authenticated. Delivered.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/products" className="btn-primary text-base px-6 py-3">
          Browse Collection
        </Link>
        <Link href="/signup" className="btn-secondary text-base px-6 py-3">
          Create Account
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-8 mt-8 text-center">
        {[
          { label: 'GIA Certified', icon: '🏅' },
          { label: 'Free Shipping $500+', icon: '📦' },
          { label: 'Secure Checkout', icon: '🔒' },
        ].map((f) => (
          <div key={f.label} className="text-neutral-500 text-sm">
            <div className="text-2xl mb-1">{f.icon}</div>
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
}
