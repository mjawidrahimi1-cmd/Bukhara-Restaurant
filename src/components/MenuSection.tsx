import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  Sparkles,
  Leaf,
  ShoppingBag,
  Eye,
  Printer,
} from 'lucide-react';

export const MenuSection: React.FC = () => {
  const {
    menuItems,
    categories,
    language,
    t,
    addToCart,
    setSelectedMenuItem,
    setIsPrintMenuOpen,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const getItemName = (item: MenuItem) =>
    language === 'fa' ? item.nameFa : language === 'ps' ? item.namePs : item.nameEn;

  const getItemDesc = (item: MenuItem) =>
    language === 'fa' ? item.descriptionFa : language === 'ps' ? item.descriptionPs : item.descriptionEn;

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter === 'popular' && !item.dietary.isPopular) return false;
      if (dietaryFilter === 'chef' && !item.dietary.isChefChoice) return false;
      if (dietaryFilter === 'spicy' && !item.dietary.isSpicy) return false;
      if (dietaryFilter === 'veg' && !item.dietary.isVegetarian) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameEn = item.nameEn.toLowerCase();
        const nameFa = item.nameFa.toLowerCase();
        const namePs = item.namePs.toLowerCase();
        const descEn = item.descriptionEn.toLowerCase();
        const ingredients = (item.ingredientsEn || []).join(' ').toLowerCase();

        return (
          nameEn.includes(query) ||
          nameFa.includes(query) ||
          namePs.includes(query) ||
          descEn.includes(query) ||
          ingredients.includes(query)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <section id="menu" className="py-20 sm:py-28 bg-[#f5f1eb] relative border-t border-[#e2dad0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.menuTitle}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.menuSubtitle}
          </h2>
          <div className="w-20 h-[2px] bg-[#c5a059] mx-auto mt-4" />

          {/* Quick Shortcut for Print Menu */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIsPrintMenuOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#0c342b] border border-[#d3c7b7] hover:border-[#c5a059] text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{t.printMenu}</span>
            </button>
          </div>
        </div>

        {/* Search, Filter Bar & Sort Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#e8e2d9] mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#c5a059] focus:outline-none text-sm placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dietary Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'all'
                    ? 'bg-[#0c342b] text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.allCategories}
              </button>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'popular' ? 'all' : 'popular')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'popular'
                    ? 'bg-[#c5a059] text-[#0c342b] font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Star className="w-3 h-3" />
                <span>{t.popular}</span>
              </button>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'chef' ? 'all' : 'chef')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'chef'
                    ? 'bg-[#0c342b] text-[#c5a059] font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{t.chefsChoice}</span>
              </button>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'spicy' ? 'all' : 'spicy')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'spicy'
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>{t.spicy}</span>
              </button>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Leaf className="w-3 h-3" />
                <span>{t.vegetarian}</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full md:w-auto px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 focus:outline-none focus:border-[#c5a059] bg-stone-50"
              >
                <option value="default">{t.sortBy} Default</option>
                <option value="price-asc">{t.priceLowToHigh}</option>
                <option value="price-desc">{t.priceHighToLow}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#0c342b] text-[#fdfbf7] shadow-md'
                : 'bg-white text-[#5f544e] hover:bg-[#faf8f5] border border-[#e8e2d9]'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => {
            const catName =
              language === 'fa' ? cat.nameFa : language === 'ps' ? cat.namePs : cat.nameEn;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0c342b] text-[#fdfbf7] shadow-md border-transparent'
                    : 'bg-white text-[#5f544e] hover:bg-[#faf8f5] border border-[#e8e2d9]'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e2d9] p-8">
            <p className="text-[#5f544e] text-base mb-4">{t.noResults}</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
              }}
              className="px-5 py-2 rounded-xl bg-[#0c342b] text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const name = getItemName(item);
            const desc = getItemDesc(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {item.dietary.isChefChoice && (
                      <span className="inline-flex items-center gap-1 bg-[#0c342b] text-[#c5a059] text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{t.chefsChoice}</span>
                      </span>
                    )}
                    {item.dietary.isPopular && (
                      <span className="inline-flex items-center gap-1 bg-[#c5a059] text-[#0c342b] text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        <Star className="w-2.5 h-2.5 fill-[#0c342b]" />
                        <span>{t.popular}</span>
                      </span>
                    )}
                    {item.dietary.isSpicy && (
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        <Flame className="w-2.5 h-2.5" />
                        <span>{t.spicy}</span>
                      </span>
                    )}
                    {item.dietary.isVegetarian && (
                      <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        <Leaf className="w-2.5 h-2.5" />
                        <span>{t.vegetarian}</span>
                      </span>
                    )}
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3 bg-[#0c342b]/95 backdrop-blur-sm text-[#fdfbf7] font-bold px-2.5 py-1 rounded-lg border border-[#c5a059]/40 text-xs shadow-md">
                    <span className="text-[#c5a059] text-[10px] mr-1">{t.afn}</span>
                    <span>{item.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-title text-lg font-bold text-[#0c342b] group-hover:text-[#c5a059] transition-colors line-clamp-1 mb-1.5">
                      {name}
                    </h3>
                    <p className="text-xs text-[#5f544e] line-clamp-2 leading-relaxed mb-3">
                      {desc}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 border-t border-[#f0eae1] flex items-center gap-2">
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-[#fdfbf7] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToOrder}</span>
                    </button>

                    <button
                      onClick={() => setSelectedMenuItem(item)}
                      title={t.viewDetails}
                      className="p-2 rounded-xl border border-[#e4ded6] hover:border-[#c5a059] text-[#5f544e] hover:text-[#0c342b] hover:bg-[#faf8f5] transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
