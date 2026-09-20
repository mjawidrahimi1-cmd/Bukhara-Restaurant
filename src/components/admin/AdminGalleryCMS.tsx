import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { GalleryItem } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  Filter,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const SUGGESTED_GALLERY_IMAGES = [
  {
    label: 'Charcoal Grill Skewers',
    category: 'food' as const,
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Charcoal Sizzling Seekh Kebabs',
  },
  {
    label: 'Royal Dining Hall',
    category: 'interior' as const,
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Bukhara Golden Banquet Hall',
  },
  {
    label: 'Traditional Bukhara Tandoor',
    category: 'cuisine' as const,
    url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Hand-Pleated Roghani Naan Baking',
  },
  {
    label: 'VIP Private Majlis',
    category: 'events' as const,
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'VIP Family Dastarkhan Salon',
  },
  {
    label: 'Heritage Tea & Saffron',
    category: 'dining' as const,
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Samovar Saffron Cardamom Green Tea',
  },
  {
    label: 'Master Culinary Team',
    category: 'team' as const,
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    titleEn: 'Executive Afghan Chefs & Tandoor Masters',
  },
];

export const AdminGalleryCMS: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, showToast, setSelectedGalleryImage } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleFa, setTitleFa] = useState('');
  const [titlePs, setTitlePs] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('food');
  const [imageUrl, setImageUrl] = useState(SUGGESTED_GALLERY_IMAGES[0].url);

  // Delete modal
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const categoriesList: { id: GalleryItem['category'] | 'all'; label: string }[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'food', label: 'Food & Kebabs' },
    { id: 'interior', label: 'Interiors & Architecture' },
    { id: 'cuisine', label: 'Kitchen & Tandoor' },
    { id: 'dining', label: 'Dining Experience' },
    { id: 'events', label: 'VIP Events' },
    { id: 'team', label: 'Culinary Team' },
  ];

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.titleEn.toLowerCase().includes(q) ||
        item.titleFa.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenNewModal = () => {
    setEditingItem(null);
    setTitleEn('');
    setTitleFa('');
    setTitlePs('');
    setCategory('food');
    setImageUrl(SUGGESTED_GALLERY_IMAGES[0].url);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitleEn(item.titleEn);
    setTitleFa(item.titleFa);
    setTitlePs(item.titlePs);
    setCategory(item.category);
    setImageUrl(item.image);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      showToast('Please provide an image URL', 'error');
      return;
    }

    if (!titleEn.trim()) {
      showToast('Please provide an English title / caption', 'error');
      return;
    }

    if (editingItem) {
      const updated: GalleryItem = {
        ...editingItem,
        titleEn,
        titleFa: titleFa || titleEn,
        titlePs: titlePs || titleEn,
        category,
        image: imageUrl,
      };
      updateGalleryItem(updated);
    } else {
      const newItem: GalleryItem = {
        id: `gallery-${Date.now()}`,
        titleEn,
        titleFa: titleFa || titleEn,
        titlePs: titlePs || titleEn,
        category,
        image: imageUrl,
      };
      addGalleryItem(newItem);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletingItemId) {
      deleteGalleryItem(deletingItemId);
      setDeletingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0c342b]/10 border border-[#0c342b]/20 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 text-[#0c342b]" />
          </div>
          <div>
            <h3 className="font-serif-title text-xl font-bold text-stone-900">
              Visual Gallery CMS
            </h3>
            <p className="text-xs text-stone-500">
              Manage high-definition restaurant photos, dining halls, charcoal grills, and VIP family spaces displayed on the storefront gallery.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Image to Gallery</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by caption or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0c342b] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="relative aspect-square overflow-hidden bg-stone-100">
              <img
                src={item.image}
                alt={item.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Category Badge */}
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#0c342b]/90 backdrop-blur-md text-[#c5a059] text-[10px] font-bold uppercase tracking-wider">
                {item.category}
              </span>

              {/* Quick Preview Button */}
              <button
                onClick={() => setSelectedGalleryImage(item)}
                title="Preview image"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
              >
                <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors">
                  <Eye className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* Caption & Actions */}
            <div className="p-3">
              <h5 className="font-serif-title text-xs font-bold text-stone-900 truncate mb-1">
                {item.titleEn}
              </h5>
              <div className="text-[10px] text-stone-500 truncate" dir="rtl">
                {item.titleFa}
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  title="Edit image details"
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingItemId(item.id)}
                  title="Delete image"
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGallery.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-stone-800 mb-1">No gallery items found</h4>
          <p className="text-xs text-stone-500 mb-4">Add your first high-definition photo to the Bukhara showcase.</p>
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 rounded-xl bg-[#0c342b] text-white text-xs font-bold uppercase tracking-wider"
          >
            Add Image Now
          </button>
        </div>
      )}

      {/* Add / Edit Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-lg font-bold">
                  {editingItem ? 'Edit Gallery Photo' : 'Add Image to Gallery'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image URL with live preview */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                  required
                />

                {/* Instant Preview Box */}
                {imageUrl && (
                  <div className="mt-3 relative h-44 rounded-xl overflow-hidden border border-stone-300 bg-stone-100">
                    <img
                      src={imageUrl}
                      alt="Live Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px]">
                      Live Preview
                    </div>
                  </div>
                )}

                {/* Curated Presets */}
                <div className="mt-3">
                  <span className="text-[11px] text-stone-400 block mb-1.5">Choose from Curated Bukhara Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_GALLERY_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          if (!titleEn) setTitleEn(preset.titleEn);
                          setCategory(preset.category);
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#c5a059]/20 hover:text-[#0c342b] text-stone-600 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059] bg-white cursor-pointer"
                >
                  <option value="food">Food &amp; Charcoal Kebabs</option>
                  <option value="interior">Interiors &amp; Golden Dining Halls</option>
                  <option value="cuisine">Kitchen &amp; Clay Tandoor Baking</option>
                  <option value="dining">Dining Experience &amp; Tea Ritual</option>
                  <option value="events">VIP Family Halls &amp; Majlis</option>
                  <option value="team">Culinary Team &amp; Chefs</option>
                </select>
              </div>

              {/* English, Dari, Pashto Titles */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Photo Title / Caption (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Sizzling Bukhara Chopan Kebab Skewers"
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      عنوان عکس (فارسی / دری)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={titleFa}
                      onChange={(e) => setTitleFa(e.target.value)}
                      placeholder="سیخ‌های کباب چوپان بخارا..."
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      د انځور سرلیک (پښتو)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={titlePs}
                      onChange={(e) => setTitlePs(e.target.value)}
                      placeholder="د بخارا خوندور کبابونه..."
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingItem ? 'Save Changes' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-lg font-bold text-stone-900 mb-1">Delete Image?</h4>
            <p className="text-xs text-stone-500 mb-6">
              Remove this photo from the restaurant gallery? It will no longer appear on the website.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingItemId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
