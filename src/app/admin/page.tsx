import Link from 'next/link';

export default function AdminDashboard() {
  const links = [
    { href: '/admin/products',   label: 'Products',    icon: '💎', desc: 'Add, edit, manage products' },
    { href: '/admin/upload',     label: 'Bulk Upload', icon: '📁', desc: 'Import products via CSV/Excel' },
    { href: '/admin/categories', label: 'Categories',  icon: '🗂️', desc: 'Manage categories & subcategories' },
    { href: '/admin/orders',     label: 'Orders',      icon: '📦', desc: 'View and update order statuses' },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-8">Manage your store</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="card p-5 hover:border-neutral-600 transition-colors group">
            <div className="text-3xl mb-3">{link.icon}</div>
            <h2 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{link.label}</h2>
            <p className="text-neutral-500 text-xs mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
