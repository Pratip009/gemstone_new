'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-amber-400 font-bold text-lg tracking-tight">
          💎 GemStone
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/products" className="text-neutral-400 hover:text-white transition-colors">
            Shop
          </Link>

          {user ? (
            <>
              <Link href="/cart" className="text-neutral-400 hover:text-white transition-colors">
                Cart
              </Link>
              <Link href="/orders" className="text-neutral-400 hover:text-white transition-colors">
                Orders
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
                <span className="text-neutral-500 text-xs">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-red-400 text-xs transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Login
              </Link>
              <Link href="/signup" className="btn-primary text-xs px-3 py-1.5">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
