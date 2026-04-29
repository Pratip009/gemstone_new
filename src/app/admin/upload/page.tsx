'use client';
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface UploadResult {
  inserted: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export default function AdminUploadPage() {
  const { token } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setError(''); setResult(null); setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/bulk-upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    const res = await fetch('/api/admin/bulk-upload', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products-template.csv';
    a.click();
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin" className="text-neutral-500 text-sm hover:text-white">← Admin</Link>
      <h1 className="text-2xl font-bold mt-1 mb-2">Bulk Upload</h1>
      <p className="text-neutral-500 text-sm mb-6">Import products from CSV or Excel file</p>

      <div className="card p-6 space-y-5">
        {/* Template download */}
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-300 mb-2">
            📋 Download the CSV template first to see the required format.
          </p>
          <button onClick={downloadTemplate} className="btn-secondary text-xs px-3 py-1.5">
            Download Template
          </button>
        </div>

        {/* File columns reference */}
        <div>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2">Required Columns</p>
          <div className="flex flex-wrap gap-1.5">
            {['name', 'category (slug)', 'price', 'shape', 'size', 'color', 'clarity'].map(col => (
              <span key={col} className="text-xs bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded border border-amber-800/50">
                {col}
              </span>
            ))}
            {['subcategory', 'certification', 'stock', 'images (pipe-sep)', 'description'].map(col => (
              <span key={col} className="text-xs bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded">
                {col}
              </span>
            ))}
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Images: pipe-separated URLs  |  Category: use slug (e.g., "diamonds")
          </p>
        </div>

        {/* File input */}
        <div>
          <label className="label">Select File (.csv or .xlsx)</label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              file ? 'border-amber-500/50 bg-amber-500/5' : 'border-neutral-700 hover:border-neutral-500'
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div>
                <p className="text-amber-400 font-medium">{file.name}</p>
                <p className="text-neutral-500 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-neutral-500">
                <p>Click to select file</p>
                <p className="text-xs mt-1">Max 10MB</p>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary w-full py-2.5 disabled:opacity-50"
        >
          {uploading ? 'Uploading & Processing…' : 'Upload & Import'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="card p-5 mt-6">
          <h2 className="font-semibold mb-3">Upload Results</h2>
          <div className="flex gap-6 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{result.inserted}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Inserted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{result.failed}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Failed</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Errors</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {result.errors.map((e, i) => (
                  <div key={i} className="text-xs bg-red-900/20 border border-red-900/50 rounded px-3 py-2 text-red-300">
                    Row {e.row}: {e.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
