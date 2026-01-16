'use client';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, RefreshCw, Save, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const initialForm = {
    slug: '',
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    imageUrl: '',
    iconType: 'default',
    features: ''
  };
  const [form, setForm] = useState(initialForm);

  // --- FETCH DATA ---
  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- HANDLERS ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      stock: Number(form.stock),
      images: [form.imageUrl],
      features: form.features.split(',').map(s => s.trim())
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/products/${form.slug}` : '/api/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if(res.ok) {
      alert(isEditing ? "Product Updated!" : "Product Created!");
      fetchProducts();
      resetForm();
    } else {
      alert("Error saving product");
    }
  };

  const handleEdit = (product: any) => {
    setIsEditing(true);
    setForm({
      slug: product.slug,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      imageUrl: product.images?.[0] || '',
      iconType: product.iconType || 'default',
      features: product.features?.join(', ') || ''
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (slug: string) => {
    if(!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProducts();
      if (form.slug === slug) resetForm(); // Clear form if deleting active item
    }
  };

  const handleSeed = async () => {
    if(!confirm("⚠️ WARNING: This will DELETE all current products and reset them to the defaults (Instagram, Snapchat, WhatsApp). Continue?")) return;
    setLoading(true);
    await fetch('/api/seed', { method: 'POST' });
    fetchProducts();
  };

  const resetForm = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
            <h1 className="text-xl font-bold tracking-tight">DAZTAO Admin</h1>
          </div>
          <button 
            onClick={handleSeed}
            className="text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3 h-3" /> RESET DATABASE
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: PRODUCT LIST (Inventory) --- */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-lg font-semibold text-zinc-400 uppercase tracking-wider text-xs">Inventory ({products.length})</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-xl"/>)}
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p: any) => (
                <div 
                  key={p._id} 
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isEditing && form.slug === p.slug 
                      ? "bg-zinc-800 border-purple-500 shadow-lg shadow-purple-500/10" 
                      : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
                      {p.images[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-200">{p.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded">/{p.slug}</span>
                        <span className={`text-xs font-bold ${p.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {p.stock} in stock
                        </span>
                        <span className="text-xs text-zinc-400">₹{p.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.slug)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT: EDITOR (Sticky Form) --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg flex items-center gap-2">
                {isEditing ? <Edit className="w-5 h-5 text-purple-500"/> : <Plus className="w-5 h-5 text-green-500"/>}
                {isEditing ? "Edit Product" : "Create Product"}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                  <X className="w-3 h-3"/> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Slug (URL ID)</label>
                  <input 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white outline-none transition"
                    placeholder="insta-keychain"
                    value={form.slug}
                    onChange={e => setForm({...form, slug: e.target.value})}
                    disabled={isEditing} // Cannot change slug while editing
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Icon Type</label>
                  <select 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white outline-none transition appearance-none"
                    value={form.iconType}
                    onChange={e => setForm({...form, iconType: e.target.value})}
                  >
                    <option value="default">Default</option>
                    <option value="instagram">Instagram</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="spotify">Spotify</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Title</label>
                <input 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white outline-none transition"
                  placeholder="Product Name"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Price (₹)</label>
                  <input type="number" className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none" 
                    value={form.price} onChange={e => setForm({...form, price: e.target.value})} required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Original</label>
                  <input type="number" className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none" 
                    value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">Stock</label>
                  <input type="number" className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none" 
                    value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Description</label>
                <textarea 
                  rows={3}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white outline-none transition resize-none"
                  placeholder="Product details..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Image URL</label>
                <input 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white outline-none transition"
                  placeholder="/images/..."
                  value={form.imageUrl}
                  onChange={e => setForm({...form, imageUrl: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500">Features (Comma Separated)</label>
                <textarea 
                  rows={2}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-white outline-none transition resize-none"
                  placeholder="Feature 1, Feature 2..."
                  value={form.features}
                  onChange={e => setForm({...form, features: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg mt-2 flex items-center justify-center gap-2 ${
                  isEditing 
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20" 
                    : "bg-white hover:bg-zinc-200 text-black shadow-zinc-900/20"
                }`}
              >
                {isEditing ? <Save className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                {isEditing ? "SAVE CHANGES" : "CREATE PRODUCT"}
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}