'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { SHAPES, COLORS, CLARITIES, CERTIFICATIONS } from '@/models/Product';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  shape: string;
  size: number;
  color: string;
  clarity: string;
  stock: number;
  isActive: boolean;
}

const EMPTY_FORM = {
  name: '', category: '', subcategory: '', price: '', shape: 'round',
  size: '', color: 'D', clarity: 'VS1', certification: 'none',
  stock: '', images: '', description: '',
};

export default function AdminProductsPage() {
  const { apiFetch } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const [pData, cData] = await Promise.all([
      apiFetch('/api/admin/products'),
      apiFetch('/api/admin/categories'),
    ]);
    setProducts(pData.data || []);
    setCategories(cData.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await apiFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          size: Number(form.size),
          stock: Number(form.stock),
          images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        }),
      });
      setSuccess('Product created!');
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-neutral-500 text-sm hover:text-white">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1">Products</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 grid grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold text-neutral-200">New Product</h2>

          <div className="col-span-2">
            <label className="label">Name *</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <label className="label">Category *</label>
            <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
              <option value="">Select…</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Price (USD) *</label>
            <input type="number" className="input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required min="0" step="0.01" />
          </div>
          <div>
            <label className="label">Shape *</label>
            <select className="input" value={form.shape} onChange={e => setForm({...form, shape: e.target.value})}>
              {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Size (Carat) *</label>
            <input type="number" className="input" value={form.size} onChange={e => setForm({...form, size: e.target.value})} required min="0.01" step="0.01" />
          </div>
          <div>
            <label className="label">Color *</label>
            <select className="input" value={form.color} onChange={e => setForm({...form, color: e.target.value})}>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Clarity *</label>
            <select className="input" value={form.clarity} onChange={e => setForm({...form, clarity: e.target.value})}>
              {CLARITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Certification</label>
            <select className="input" value={form.certification} onChange={e => setForm({...form, certification: e.target.value})}>
              {CERTIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Stock *</label>
            <input type="number" className="input" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required min="0" />
          </div>
          <div className="col-span-2">
            <label className="label">Image URLs (one per line)</label>
            <textarea className="input h-20 resize-none" value={form.images} onChange={e => setForm({...form, images: e.target.value})} placeholder="https://..." />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea className="input h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          {error && <p className="col-span-2 text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="col-span-2 btn-primary py-2.5">
            {loading ? 'Saving…' : 'Create Product'}
          </button>
        </form>
      )}

      {/* Products table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-800">
            <tr className="text-neutral-500 text-xs uppercase tracking-wider">
              {['Name', 'Price', 'Shape', 'Color', 'Clarity', 'Stock', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-neutral-100 max-w-xs truncate">{p.name}</td>
                <td className="px-4 py-3 text-amber-400">${p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-neutral-400">{p.shape}</td>
                <td className="px-4 py-3 text-neutral-400">{p.color}</td>
                <td className="px-4 py-3 text-neutral-400">{p.clarity}</td>
                <td className="px-4 py-3 text-neutral-400">{p.stock}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.isActive ? 'bg-green-900/50 text-green-400' : 'bg-neutral-800 text-neutral-500'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(p._id)} className="text-neutral-600 hover:text-red-400 text-xs transition-colors">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-neutral-600">No products yet</div>
        )}
      </div>
    </div>
  );
}
