'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';

interface Category { _id: string; name: string; slug: string; }
interface Subcategory { _id: string; name: string; slug: string; category: { name: string } }

export default function AdminCategoriesPage() {
  const { apiFetch } = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [subName, setSubName] = useState('');
  const [subCat, setSubCat] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAll = async () => {
    const [c, s] = await Promise.all([
      apiFetch('/api/admin/categories'),
      apiFetch('/api/admin/subcategories'),
    ]);
    setCategories(c.data || []);
    setSubcategories(s.data || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await apiFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: catName, description: catDesc }),
      });
      setMsg('Category created!');
      setCatName(''); setCatDesc('');
      fetchAll();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await apiFetch('/api/admin/subcategories', {
        method: 'POST',
        body: JSON.stringify({ name: subName, categoryId: subCat }),
      });
      setMsg('Subcategory created!');
      setSubName(''); setSubCat('');
      fetchAll();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link href="/admin" className="text-neutral-500 text-sm hover:text-white">← Admin</Link>
      <h1 className="text-2xl font-bold mt-1 mb-6">Categories</h1>

      {msg && <p className="text-green-400 text-sm mb-4">{msg}</p>}

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Create Category */}
        <form onSubmit={createCategory} className="card p-5 space-y-3">
          <h2 className="font-semibold text-neutral-200">New Category</h2>
          <div>
            <label className="label">Name</label>
            <input className="input" value={catName} onChange={e => setCatName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">Create</button>
        </form>

        {/* Create Subcategory */}
        <form onSubmit={createSubcategory} className="card p-5 space-y-3">
          <h2 className="font-semibold text-neutral-200">New Subcategory</h2>
          <div>
            <label className="label">Name</label>
            <input className="input" value={subName} onChange={e => setSubName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Parent Category</label>
            <select className="input" value={subCat} onChange={e => setSubCat(e.target.value)} required>
              <option value="">Select…</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading || categories.length === 0} className="btn-primary w-full">
            Create
          </button>
        </form>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Categories ({categories.length})</h3>
          <div className="space-y-2">
            {categories.map(c => (
              <div key={c._id} className="card px-3 py-2 text-sm">
                <span className="text-neutral-100">{c.name}</span>
                <span className="text-neutral-600 ml-2 text-xs font-mono">/{c.slug}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Subcategories ({subcategories.length})</h3>
          <div className="space-y-2">
            {subcategories.map(s => (
              <div key={s._id} className="card px-3 py-2 text-sm">
                <span className="text-neutral-100">{s.name}</span>
                <span className="text-neutral-600 ml-2 text-xs">in {s.category?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
