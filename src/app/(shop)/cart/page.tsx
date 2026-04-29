'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  product: { _id: string; name: string; images: string[]; price: number; stock: number };
  quantity: number;
  price: number;
}

interface Totals {
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export default function CartPage() {
  const { apiFetch } = useApi();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Client-side auth guard — redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/cart');
    }
  }, [authLoading, user, router]);

  const fetchCart = async () => {
    try {
      const data = await apiFetch('/api/cart');
      setItems(data.data.cart?.items || []);
      setTotals(data.data.totals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchCart();
    }
  }, [authLoading, user]);

  const updateQty = async (productId: string, quantity: number) => {
    try {
      await apiFetch('/api/cart', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });
      fetchCart();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const remove = async (productId: string) => {
    try {
      await apiFetch(`/api/cart?productId=${productId}`, { method: 'DELETE' });
      fetchCart();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  // Show nothing while auth is loading to prevent flash
  if (authLoading) {
    return <div className="text-neutral-500 py-20 text-center">Loading…</div>;
  }

  // Don't render if not logged in (redirect is in progress)
  if (!user) return null;

  if (loading) {
    return <div className="text-neutral-500 py-20 text-center">Loading cart…</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchCart} className="btn-primary">Try Again</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🛒</div>
        <p className="text-neutral-400 mb-4">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cart ({items.length} items)</h1>
      <div className="flex gap-8">
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.product._id} className="card p-4 flex gap-4 items-center">
              <div className="w-16 h-16 bg-neutral-800 rounded overflow-hidden shrink-0">
                {item.product.images[0] ? (
                  <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white line-clamp-1">{item.product.name}</p>
                <p className="text-amber-400 font-bold mt-0.5">${item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center border border-neutral-700 rounded">
                <button
                  onClick={() => updateQty(item.product._id, item.quantity - 1)}
                  className="px-2.5 py-1 text-neutral-400 hover:text-white"
                >−</button>
                <span className="px-3 py-1 text-sm border-x border-neutral-700">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.product._id, item.quantity + 1)}
                  className="px-2.5 py-1 text-neutral-400 hover:text-white"
                >+</button>
              </div>
              <p className="text-white font-bold w-20 text-right">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => remove(item.product._id)}
                className="text-neutral-600 hover:text-red-400 text-lg ml-2"
              >×</button>
            </div>
          ))}
        </div>

        {totals && (
          <div className="w-64 shrink-0">
            <div className="card p-5 space-y-3 sticky top-20">
              <h2 className="font-semibold text-neutral-200">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={`$${totals.subtotal.toLocaleString()}`} />
                <Row label="Tax (8%)" value={`$${totals.tax.toFixed(2)}`} />
                <Row label="Shipping" value={totals.shippingCost === 0 ? 'Free' : `$${totals.shippingCost}`} />
                <div className="border-t border-neutral-700 pt-2">
                  <Row label="Total" value={`$${totals.total.toLocaleString()}`} bold />
                </div>
              </div>
              <Link href="/checkout" className="btn-primary block text-center w-full mt-4 py-2.5">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold text-white text-base' : 'text-neutral-400'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}