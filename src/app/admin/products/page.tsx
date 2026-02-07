'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, Edit, Plus, RefreshCw, Save, X, 
  Image as ImageIcon, Video, Search, 
  MoreHorizontal, ChevronRight, DollarSign, 
  Tag, Layers, Barcode, Eye, ArrowLeft, ArrowRight,
  Star, Lock, Check, AlertCircle, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
type MediaType = 'image' | 'video';

interface MediaItem {
  id: string; // Added ID for stable reordering
  url: string;
  type: MediaType;
}

interface Product {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  media: MediaItem[];
  features: string[];
  tags: string[];
}

const initialProduct: Product = {
  slug: '',
  title: '',
  description: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  sku: '',
  category: 'Uncategorized',
  status: 'draft',
  media: [],
  features: [],
  tags: []
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>(initialProduct);
  const [search, setSearch] = useState('');

  // --- DATA FETCHING ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?t=' + Date.now());
      const data = await res.json();
      
      // Normalize legacy data
      const normalizedData = data.map((p: any) => {
        let normalizedMedia: MediaItem[] = [];

        if (p.media && p.media.length > 0) {
          normalizedMedia = p.media.map((m: any) => ({ ...m, id: m.id || Math.random().toString(36).substr(2, 9) }));
        } else if (p.images && p.images.length > 0) {
          normalizedMedia = p.images.map((url: string) => ({ 
            url, type: 'image', id: Math.random().toString(36).substr(2, 9) 
          }));
        } else if (p.imageUrl) {
          normalizedMedia = [{ 
            url: p.imageUrl, type: 'image', id: Math.random().toString(36).substr(2, 9) 
          }];
        }

        return {
          ...p,
          media: normalizedMedia,
          status: p.status || 'active',
          sku: p.sku || '',
          category: p.category || 'Uncategorized',
          tags: p.tags || []
        };
      });

      setProducts(normalizedData);
    } catch (err) {
      console.error("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- LOGIC: AUTO SLUG ---
  useEffect(() => {
    // Only auto-generate slug if we are creating a NEW product
    if (!editingId && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
        .replace(/(^-|-$)+/g, ''); // Remove leading/trailing dashes
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, editingId]);

  // --- ACTIONS ---
  const openEditor = (product?: Product) => {
    if (product) {
      setFormData(product);
      setEditingId(product._id || null);
    } else {
      setFormData(initialProduct);
      setEditingId(null);
    }
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) return alert("Title is required");

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/products/${formData.slug}` : '/api/products';

    // Backend compatibility payload
    const payload = {
      ...formData,
      images: formData.media.map(m => m.url), 
      imageUrl: formData.media[0]?.url || ''
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchProducts();
        setIsEditorOpen(false);
      } else {
        alert("Failed to save. Check console.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-indigo-500/30">
      
      {/* HEADER */}
      <header className="border-b border-zinc-800/60 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">Catalog</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchProducts} className="p-2 text-zinc-400 hover:text-white transition"><RefreshCw className="w-5 h-5"/></button>
            <button 
              onClick={() => openEditor()}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4"/> Create Item
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1800px] mx-auto p-6">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition"/>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug or SKU..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-zinc-900 outline-none transition"
            />
          </div>
          <div className="flex gap-2">
             <div className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400">
                Total: <span className="text-white ml-1">{filteredProducts.length}</span>
             </div>
          </div>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 gap-1">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            <div className="col-span-5">Product Details</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {loading ? (
             <div className="py-20 text-center text-zinc-500 text-sm">Syncing inventory...</div>
          ) : filteredProducts.map((p) => (
            <motion.div 
              layout
              key={p._id} 
              className="group grid grid-cols-12 gap-4 px-6 py-4 items-center bg-zinc-900/20 border border-zinc-800/50 rounded-xl hover:bg-zinc-900/60 hover:border-zinc-700 transition-all cursor-default"
            >
              {/* Product Info */}
              <div className="col-span-5 flex items-center gap-4">
                <div className="relative w-14 h-14 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/50 flex-shrink-0">
                  {p.media[0] ? (
                    p.media[0].type === 'video' ? <video src={p.media[0].url} className="w-full h-full object-cover" muted /> : <img src={p.media[0].url} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center text-zinc-600"><ImageIcon className="w-5 h-5"/></div>}
                  {p.media.length > 1 && (
                    <div className="absolute bottom-0 right-0 bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">+{p.media.length - 1}</div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-zinc-100 text-sm mb-0.5">{p.title}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500 bg-zinc-950 px-1.5 rounded border border-zinc-800">{p.sku || 'NO-SKU'}</span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-[150px]">/{p.slug}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <StatusBadge status={p.status} />
              </div>

              {/* Stock */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 5 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <span className={`text-sm font-medium ${p.stock === 0 ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    {p.stock} units
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 font-mono text-sm text-zinc-300">
                ₹{p.price.toLocaleString()}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditor(p)} className="p-2 hover:bg-white hover:text-black rounded-lg text-zinc-400 transition"><Edit className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(p.slug)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-zinc-400 transition"><Trash2 className="w-4 h-4"/></button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- EDITOR DRAWER --- */}
      <AnimatePresence>
        {isEditorOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditorOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"/>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#0a0a0a] border-l border-zinc-800 shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-[#0a0a0a]">
                <div>
                  <h2 className="text-lg font-bold text-white">{editingId ? "Edit Product" : "New Product"}</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">{editingId ? `ID: ${editingId}` : 'Create a new item in your catalog'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition"><X className="w-5 h-5"/></button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* 1. Identity */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Layers className="w-3 h-3"/> Product Identity</h3>
                    <div className="flex gap-2">
                       {['active', 'draft', 'archived'].map(s => (
                         <button 
                           key={s}
                           onClick={() => setFormData({...formData, status: s as any})}
                           className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition border ${
                             formData.status === s 
                               ? 'bg-white text-black border-white' 
                               : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'
                           }`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Product Title</label>
                      <input className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Minimalist Leather Wallet"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 flex items-center gap-1"><Lock className="w-3 h-3"/> Slug (Auto-Generated)</label>
                      <div className="relative">
                        <input className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500 font-mono focus:border-zinc-700 outline-none transition" 
                          value={formData.slug} readOnly
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400">Description</label>
                      <textarea className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition h-32 resize-none" 
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the product..."
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-zinc-800/50"/>

                {/* 2. Media Manager (The Star) */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-3 h-3"/> Media Gallery</h3>
                  <MediaManager media={formData.media} onChange={newMedia => setFormData({...formData, media: newMedia})} />
                </section>

                <hr className="border-zinc-800/50"/>

                {/* 3. Details */}
                <section className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><DollarSign className="w-3 h-3"/> Pricing</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-zinc-500">Price (₹)</label>
                        <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" 
                          value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-500">Original Price</label>
                        <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:border-zinc-600 outline-none" 
                          value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Barcode className="w-3 h-3"/> Inventory</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-zinc-500">SKU</label>
                        <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase focus:border-indigo-500 outline-none" 
                          value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-500">Stock</label>
                        <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" 
                          value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-zinc-800/50"/>

                {/* 4. Metadata */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Tag className="w-3 h-3"/> Metadata</h3>
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Category</label>
                    <input className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none mb-4" 
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                    
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Features (Comma separated)</label>
                    <textarea className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none h-20 resize-none" 
                      value={formData.features.join(', ')} onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>
                </section>

              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-zinc-800 bg-[#0a0a0a] flex justify-end gap-3">
                <button onClick={() => setIsEditorOpen(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Discard</button>
                <button onClick={handleSave} className="px-8 py-2.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2">
                  <Save className="w-4 h-4"/> Save Changes
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- COMPONENT: PRO MEDIA MANAGER ---
function MediaManager({ media, onChange }: { media: MediaItem[], onChange: (m: MediaItem[]) => void }) {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<MediaType>('image');

  const addMedia = () => {
    if (!url) return;
    // Add new items to the END
    onChange([...media, { url, type, id: Math.random().toString(36).substr(2, 9) }]);
    setUrl('');
  };

  const removeMedia = (index: number) => {
    onChange(media.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === media.length - 1) return;
    
    const newMedia = [...media];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    // Swap
    [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
    onChange(newMedia);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const item = media[index];
    const rest = media.filter((_, i) => i !== index);
    onChange([item, ...rest]); // Move to front
  };

  return (
    <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800">
      
      {/* Input */}
      <div className="flex gap-2 mb-6">
        <select value={type} onChange={e => setType(e.target.value as MediaType)} className="bg-black border border-zinc-800 rounded-lg px-3 text-xs text-white focus:border-indigo-500 outline-none h-10">
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <div className="flex-1 relative">
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste image/video URL..." className="w-full h-10 bg-black border border-zinc-800 rounded-lg px-4 text-sm text-white focus:border-indigo-500 outline-none transition"/>
        </div>
        <button onClick={addMedia} className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 rounded-lg text-sm font-bold h-10 transition">Add</button>
      </div>

      {/* Grid */}
      {media.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-800/50 rounded-xl p-10 text-center">
          <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto mb-3"/>
          <p className="text-zinc-500 text-sm">Gallery is empty. Add media via URL.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {media.map((item, i) => (
            <div key={item.id} className="relative group aspect-[4/3] bg-black rounded-xl border border-zinc-800 overflow-hidden shadow-sm">
              
              {/* Number Badge */}
              <div className="absolute top-2 left-2 z-10 flex gap-2">
                 <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-md shadow-sm ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-black/60 text-zinc-300'}`}>
                   {i === 0 ? 'Cover' : `#${i + 1}`}
                 </div>
                 {item.type === 'video' && <div className="bg-black/60 px-1.5 py-1 rounded text-zinc-300"><Video className="w-3 h-3"/></div>}
              </div>

              {/* Preview */}
              {item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900"><Video className="w-8 h-8 text-zinc-600"/></div>
              ) : (
                <img src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500" />
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-center items-center gap-2 backdrop-blur-[2px]">
                {i !== 0 && (
                  <button onClick={() => setAsCover(i)} className="bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold hover:scale-105 transition shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3"/> Set as Cover
                  </button>
                )}
                
                <div className="flex gap-2 mt-1">
                  {i > 0 && (
                    <button onClick={() => moveItem(i, 'left')} className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700"><ArrowLeft className="w-3 h-3"/></button>
                  )}
                  {i < media.length - 1 && (
                    <button onClick={() => moveItem(i, 'right')} className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700"><ArrowRight className="w-3 h-3"/></button>
                  )}
                  <button onClick={() => removeMedia(i)} className="p-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 className="w-3 h-3"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- HELPER ---
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    archived: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border tracking-wider ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}