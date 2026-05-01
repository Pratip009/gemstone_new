'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Plus, Tag, Layers, CheckCircle2, AlertCircle, ChevronRight, Hash } from 'lucide-react';

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
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchAll = async () => {
    const [c, s] = await Promise.all([
      apiFetch('/api/admin/categories'),
      apiFetch('/api/admin/subcategories'),
    ]);
    setCategories(c.data || []);
    setSubcategories(s.data || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const flash = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: catName, description: catDesc }),
      });
      flash('Category created successfully', 'success');
      setCatName(''); setCatDesc('');
      fetchAll();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Failed to create category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/admin/subcategories', {
        method: 'POST',
        body: JSON.stringify({ name: subName, categoryId: subCat }),
      });
      flash('Subcategory created successfully', 'success');
      setSubName(''); setSubCat('');
      fetchAll();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Failed to create subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">

      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="font-['Cormorant_Garamond',serif] text-[2.1rem] font-medium text-[#1a1714] leading-none mb-1">
          Categories
        </h1>
        <p className="text-[0.83rem] text-[#a09a90]">
          Organise your catalogue with categories and subcategories.
        </p>
      </div>

      {/* ── Toast ── */}
      {msg && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium border transition-all duration-300
          ${msg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'}`}
        >
          {msg.type === 'success'
            ? <CheckCircle2 size={16} strokeWidth={2} />
            : <AlertCircle size={16} strokeWidth={2} />}
          {msg.text}
        </div>
      )}

      {/* ── Forms row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

        {/* New Category */}
        <form onSubmit={createCategory} className="bg-white border border-[#ede9e1] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
              <Tag size={15} strokeWidth={1.6} className="text-[#c9a84c]" />
            </div>
            <div>
              <h2 className="text-[0.88rem] font-semibold text-[#1a1714]">New Category</h2>
              <p className="text-[0.72rem] text-[#a09a90]">Top-level product grouping</p>
            </div>
          </div>

          <div className="h-px bg-[#f0ece4]" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold tracking-[0.07em] uppercase text-[#a09a90]">
                Name
              </label>
              <input
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ddd5] bg-[#faf9f6] text-[0.85rem] text-[#1a1714] placeholder:text-[#c8c2b8] focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
                placeholder="e.g. Diamonds"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold tracking-[0.07em] uppercase text-[#a09a90]">
                Description{' '}
                <span className="normal-case tracking-normal font-normal text-[#c8c2b8]">(optional)</span>
              </label>
              <input
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ddd5] bg-[#faf9f6] text-[0.85rem] text-[#1a1714] placeholder:text-[#c8c2b8] focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
                placeholder="Short description"
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1a1714] text-white text-[0.82rem] font-semibold tracking-wide hover:bg-[#2a2420] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 mt-auto"
          >
            <Plus size={15} strokeWidth={2.2} />
            Create Category
          </button>
        </form>

        {/* New Subcategory */}
        <form onSubmit={createSubcategory} className="bg-white border border-[#ede9e1] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7ab0c9]/10 border border-[#7ab0c9]/20 flex items-center justify-center flex-shrink-0">
              <Layers size={15} strokeWidth={1.6} className="text-[#7ab0c9]" />
            </div>
            <div>
              <h2 className="text-[0.88rem] font-semibold text-[#1a1714]">New Subcategory</h2>
              <p className="text-[0.72rem] text-[#a09a90]">Nested under a parent category</p>
            </div>
          </div>

          <div className="h-px bg-[#f0ece4]" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold tracking-[0.07em] uppercase text-[#a09a90]">
                Name
              </label>
              <input
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ddd5] bg-[#faf9f6] text-[0.85rem] text-[#1a1714] placeholder:text-[#c8c2b8] focus:outline-none focus:border-[#7ab0c9] focus:ring-2 focus:ring-[#7ab0c9]/10 transition-all"
                placeholder="e.g. Loose Diamonds"
                value={subName}
                onChange={e => setSubName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold tracking-[0.07em] uppercase text-[#a09a90]">
                Parent Category
              </label>
              <select
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2ddd5] bg-[#faf9f6] text-[0.85rem] text-[#1a1714] focus:outline-none focus:border-[#7ab0c9] focus:ring-2 focus:ring-[#7ab0c9]/10 transition-all appearance-none cursor-pointer"
                value={subCat}
                onChange={e => setSubCat(e.target.value)}
                required
              >
                <option value="">Select a category…</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1a1714] text-white text-[0.82rem] font-semibold tracking-wide hover:bg-[#2a2420] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 mt-auto"
          >
            <Plus size={15} strokeWidth={2.2} />
            Create Subcategory
          </button>
        </form>
      </div>

      {/* ── Lists ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Categories list */}
        <div className="bg-white border border-[#ede9e1] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ece4]">
            <div className="flex items-center gap-2">
              <Tag size={14} strokeWidth={1.6} className="text-[#c9a84c]" />
              <span className="text-[0.78rem] font-semibold tracking-[0.07em] uppercase text-[#6b6560]">
                Categories
              </span>
            </div>
            <span className="text-[0.7rem] font-semibold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </div>

          <div className="divide-y divide-[#f6f3ee]">
            {categories.length === 0 ? (
              <div className="px-5 py-10 text-center text-[0.78rem] text-[#c8c2b8]">
                No categories yet
              </div>
            ) : (
              categories.map(c => (
                <div
                  key={c._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#faf9f6] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/60 flex-shrink-0" />
                    <span className="text-[0.85rem] font-medium text-[#1a1714]">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Hash size={10} className="text-[#a09a90]" />
                    <span className="font-mono text-[0.68rem] text-[#a09a90]">{c.slug}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subcategories list */}
        <div className="bg-white border border-[#ede9e1] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ece4]">
            <div className="flex items-center gap-2">
              <Layers size={14} strokeWidth={1.6} className="text-[#7ab0c9]" />
              <span className="text-[0.78rem] font-semibold tracking-[0.07em] uppercase text-[#6b6560]">
                Subcategories
              </span>
            </div>
            <span className="text-[0.7rem] font-semibold text-[#7ab0c9] bg-[#7ab0c9]/10 px-2 py-0.5 rounded-full">
              {subcategories.length}
            </span>
          </div>

          <div className="divide-y divide-[#f6f3ee]">
            {subcategories.length === 0 ? (
              <div className="px-5 py-10 text-center text-[0.78rem] text-[#c8c2b8]">
                No subcategories yet
              </div>
            ) : (
              subcategories.map(s => (
                <div
                  key={s._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#faf9f6] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7ab0c9]/60 flex-shrink-0" />
                    <span className="text-[0.85rem] font-medium text-[#1a1714]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[0.72rem] text-[#a09a90]">
                    <span className="hidden group-hover:inline font-mono text-[0.65rem] text-[#c8c2b8]">
                      {s.slug}
                    </span>
                    <ChevronRight size={10} className="text-[#d4cfc6]" />
                    <span className="font-medium text-[#6b6560]">{s.category?.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}