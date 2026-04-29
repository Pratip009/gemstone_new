import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-xs text-neutral-600">
        <Link href="/" className="hover:text-neutral-400">Home</Link>
        <span>/</span>
        <Link href="/admin" className="hover:text-neutral-400">Admin</Link>
      </div>
      {children}
    </div>
  );
}
