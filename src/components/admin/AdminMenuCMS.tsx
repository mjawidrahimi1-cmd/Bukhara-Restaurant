import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MenuItem, MenuCategory } from '../../types';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Search,
  Flame,
  Leaf,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
  Layers,
  Sparkles,
  X,
  Clock3,
} from 'lucide-react';

const SUGGESTED_DISH_IMAGES = [
  { label: 'Kabuli Pulao', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { label: 'Charcoal Kebabs', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mantu Dumplings', url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fresh Roghani Naan', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lamb Karahi', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sheer Yakh / Dessert', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
];

export const AdminMenuCMS: React.FC = () => {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    showToast,
    setSelectedMenuItem,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Dish Modal
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameFa, setNewCatNameFa] = useState('');
  const [newCatNamePs, setNewCatNamePs] = useState('');

  // Dish Form state
  const [nameEn, setNameEn] = useState('');
  const [nameFa, setNameFa] = useState('');
  const [namePs, setNamePs] = useState('');
  const [price, setPrice] = useState(390);
  const [category, setCategory] = useState(categories[0]?.id || 'rice');
  const [descEn, setDescEn] = useState('');
  const [descFa, setDescFa] = useState('');
  const [descPs, setDescPs] = useState('');
  const [imageUrl, setImageUrl] = useState(SUGGESTED_DISH_IMAGES[0].url);
  const [isSpicy, setIsSpicy] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isChefChoice, setIsChefChoice] = useState(false);

  // Delete Dish
  const [deletingDishId, setDeletingDishId] = useState<string | null>(null);

  const filteredDishes = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (stockFilter === 'in_stock' && !item.available) return false;
    if (stockFilter === 'out_of_stock' && item.available) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.nameEn.toLowerCase().includes(q) ||
        item.nameFa.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleAvailability = (item: MenuItem) => {
    const updated = { ...item, available: !item.available };
    updateMenuItem(updated);
    showToast(`${item.nameEn} marked as ${updated.available ? 'In Stock' : '86 (Sold Out)'}`, 'info');
  };

  const handleOpenNewDishModal = () => {
    setEditingDish(null);
    setNameEn('');
    setNameFa('');
    setNamePs('');
    setPrice(390);
    setCategory(categories[0]?.id || 'rice');
    setDescEn('');
    setDescFa('');
    setDescPs('');
    setImageUrl(SUGGESTED_DISH_IMAGES[0].url);
    setIsSpicy(false);
    setIsVegetarian(false);
    setIsPopular(false);
    setIsChefChoice(false);
    setIsDishModalOpen(true);
  };

  const handleOpenEditDishModal = (item: MenuItem) => {
    setEditingDish(item);
    setNameEn(item.nameEn);
    setNameFa(item.nameFa);
    setNamePs(item.namePs);
    setPrice(item.price);
    setCategory(item.category);
    setDescEn(item.descriptionEn);
    setDescFa(item.descriptionFa);
    setDescPs(item.descriptionPs);
    setImageUrl(item.image);
    setIsSpicy(!!item.dietary?.isSpicy);
    setIsVegetarian(!!item.dietary?.isVegetarian);
    setIsPopular(!!item.dietary?.isPopular);
    setIsChefChoice(!!item.dietary?.isChefChoice);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim()) {
      showToast('Please enter a dish name in English', 'error');
      return;
    }

    if (editingDish) {
      const updated: MenuItem = {
        ...editingDish,
        nameEn,
        nameFa: nameFa || nameEn,
        namePs: namePs || nameEn,
        price: Number(price),
        category,
        descriptionEn: descEn || nameEn,
        descriptionFa: descFa || descEn || nameEn,
        descriptionPs: descPs || descEn || nameEn,
        image: imageUrl,
        dietary: {
          ...editingDish.dietary,
          isSpicy,
          isVegetarian,
          isPopular,
          isChefChoice,
        },
      };
      updateMenuItem(updated);
    } else {
      const newDish: MenuItem = {
        id: `item-${Date.now()}`,
        slug: nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `dish-${Date.now()}`,
        nameEn,
        nameFa: nameFa || nameEn,
        namePs: namePs || nameEn,
        price: Number(price),
        category,
        descriptionEn: descEn || nameEn,
        descriptionFa: descFa || descEn || nameEn,
        descriptionPs: descPs || descEn || nameEn,
        image: imageUrl,
        available: true,
        dietary: {
          isSpicy,
          isVegetarian,
          isPopular,
          isChefChoice,
        },
      };
      addMenuItem(newDish);
    }

    setIsDishModalOpen(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameEn.trim()) return;

    const slug = newCatNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: MenuCategory = {
      id: `cat-${slug}-${Date.now()}`,
      slug,
      nameEn: newCatNameEn,
      nameFa: newCatNameFa || newCatNameEn,
      namePs: newCatNamePs || newCatNameEn,
      iconName: 'Utensils',
    };
    addCategory(newCategory);
    setNewCatNameEn('');
    setNewCatNameFa('');
    setNewCatNamePs('');
    setIsCategoryModalOpen(false);
  };

  const confirmDeleteDish = () => {
    if (deletingDishId) {
      deleteMenuItem(deletingDishId);
      setDeletingDishId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0c342b]/10 border border-[#0c342b]/20 flex items-center justify-center shrink-0">
            <Utensils className="w-6 h-6 text-[#0c342b]" />
          </div>
          <div>
            <h3 className="font-serif-title text-xl font-bold text-stone-900">
              Menu &amp; Dish Catalog CMS
            </h3>
            <p className="text-xs text-stone-500">
              Manage menu items, live stock status (86), pricing in AFN, culinary descriptions, categories, and dietary badges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#c5a059]" />
            <span>Categories ({categories.length})</span>
          </button>
          <button
            onClick={handleOpenNewDishModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes by name (EN/FA/PS), ingredients, or price..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        {/* Stock Filter */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              stockFilter === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            All ({menuItems.length})
          </button>
          <button
            onClick={() => setStockFilter('in_stock')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              stockFilter === 'in_stock' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-600'
            }`}
          >
            In Stock ({menuItems.filter((i) => i.available).length})
          </button>
          <button
            onClick={() => setStockFilter('out_of_stock')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              stockFilter === 'out_of_stock' ? 'bg-red-600 text-white shadow-sm' : 'text-stone-600'
            }`}
          >
            86 Out ({menuItems.filter((i) => !i.available).length})
          </button>
        </div>

        {/* Category Pills */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ? 'bg-[#0c342b] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id ? 'bg-[#0c342b] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Table / Grid */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Dish Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-center">Status / 86</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredDishes.map((item) => {
                const catObj = categories.find((c) => c.id === item.category);
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Details with thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                          <img
                            src={item.image}
                            alt={item.nameEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = SUGGESTED_DISH_IMAGES[0].url;
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-serif-title text-sm font-bold text-stone-900">
                            {item.nameEn}
                          </div>
                          <div className="text-[11px] text-stone-500" dir="rtl">
                            {item.nameFa}
                          </div>
                          <div className="text-[11px] text-stone-400 line-clamp-1 max-w-xs mt-0.5">
                            {item.descriptionEn}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {catObj?.nameEn || item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#0c342b]">
                      {item.price.toLocaleString()} AFN
                    </td>

                    {/* 86 Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          item.available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-red-100 hover:text-red-800'
                            : 'bg-red-100 text-red-800 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-600' : 'bg-red-600'}`}
                        />
                        <span>{item.available ? 'In Stock' : '86 (Sold Out)'}</span>
                      </button>
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {item.dietary?.isSpicy && (
                          <span className="p-1 rounded bg-red-50 text-red-600" title="Spicy">
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.dietary?.isVegetarian && (
                          <span className="p-1 rounded bg-green-50 text-green-600" title="Vegetarian">
                            <Leaf className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.dietary?.isPopular && (
                          <span className="p-1 rounded bg-amber-50 text-amber-600" title="Popular Item">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                        )}
                        {item.dietary?.isChefChoice && (
                          <span className="p-1 rounded bg-purple-50 text-purple-600" title="Chef Special">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedMenuItem(item)}
                          title="View dish popup"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditDishModal(item)}
                          title="Edit dish"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingDishId(item.id)}
                          title="Delete dish"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDishes.length === 0 && (
          <div className="p-12 text-center">
            <Utensils className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-800">No dishes match your filter</h4>
            <p className="text-xs text-stone-500 mt-1">Try resetting search or category filters.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2.5">
                <Utensils className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-lg font-bold">
                  {editingDish ? `Edit Dish: ${editingDish.nameEn}` : 'Add New Menu Item'}
                </h3>
              </div>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Dish Name (EN, FA, PS) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Dish Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Bukhara Royal Chopan Kebab"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#c5a059]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    نام غذا (فارسی / دری)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameFa}
                    onChange={(e) => setNameFa(e.target.value)}
                    placeholder="کباب چوپان شاهی بخارا..."
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    د خوراک نوم (پښتو)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={namePs}
                    onChange={(e) => setNamePs(e.target.value)}
                    placeholder="د بخارا شاهي چوپان کباب..."
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Price (AFN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Menu Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn} ({c.nameFa})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL with live preview */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Dish Image URL
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-xs"
                    required
                  />
                  <div className="w-12 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-stone-400">Presets:</span>
                  {SUGGESTED_DISH_IMAGES.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-[#c5a059]/20 text-stone-600"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  placeholder="Ingredients, marinade, preparation..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              {/* Dietary Badges */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Dietary Badges &amp; Highlights
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSpicy}
                      onChange={(e) => setIsSpicy(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVegetarian}
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Popular</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChefChoice}
                      onChange={(e) => setIsChefChoice(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Chef's Choice</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingDish ? 'Save Changes' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300">
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-base font-bold">Manage Menu Categories</h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Existing Categories List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <span className="text-[11px] font-bold text-stone-400 uppercase">Existing Categories:</span>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-stone-800">{c.nameEn}</span>
                      <span className="text-[10px] text-stone-400 block" dir="rtl">{c.nameFa}</span>
                    </div>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteCategory(c.id)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="pt-3 border-t border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-700 block">Add New Category</span>
                <input
                  type="text"
                  value={newCatNameEn}
                  onChange={(e) => setNewCatNameEn(e.target.value)}
                  placeholder="Category Name in English (e.g. Seafood)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
                <input
                  type="text"
                  dir="rtl"
                  value={newCatNameFa}
                  onChange={(e) => setNewCatNameFa(e.target.value)}
                  placeholder="نام بخش به دری (مثال: غذاهای دریایی)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider"
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dish Confirmation */}
      {deletingDishId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-lg font-bold text-stone-900 mb-1">Delete Dish?</h4>
            <p className="text-xs text-stone-500 mb-6">
              Are you sure you want to remove this dish from the menu? It will no longer be visible to customers.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingDishId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteDish}
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
