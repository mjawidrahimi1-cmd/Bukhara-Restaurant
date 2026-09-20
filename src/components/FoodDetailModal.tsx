import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import {
  X,
  Star,
  Sparkles,
  Flame,
  Leaf,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Utensils,
  Clock,
} from 'lucide-react';

export const FoodDetailModal: React.FC = () => {
  const {
    selectedMenuItem,
    setSelectedMenuItem,
    language,
    t,
    addToCart,
    menuItems,
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  if (!selectedMenuItem) return null;

  const item = selectedMenuItem;

  const name =
    language === 'fa' ? item.nameFa : language === 'ps' ? item.namePs : item.nameEn;
  const desc =
    language === 'fa' ? item.descriptionFa : language === 'ps' ? item.descriptionPs : item.descriptionEn;
  const serving =
    language === 'fa' ? item.servingSizeFa : language === 'ps' ? item.servingSizePs : item.servingSizeEn;
  const ingredients =
    language === 'fa' ? item.ingredientsFa : language === 'ps' ? item.ingredientsPs : item.ingredientsEn;

  // Toggle addon
  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Calculate current total
  const addonsTotal = (item.addons || [])
    .filter((ad) => selectedAddonIds.includes(ad.id))
    .reduce((sum, ad) => sum + ad.price, 0);
  const totalPrice = (item.price + addonsTotal) * quantity;

  // Related dishes from same category
  const relatedDishes = menuItems
    .filter((m) => m.category === item.category && m.id !== item.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(item, quantity, undefined, selectedAddonIds, specialInstructions);
    setSelectedMenuItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedMenuItem(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#0c342b] text-white flex items-center justify-center transition-colors shadow-md"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
          <img
            src={item.image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {item.dietary.isChefChoice && (
              <span className="inline-flex items-center gap-1 bg-[#0c342b] text-[#c5a059] text-xs font-bold px-2.5 py-1 rounded-full border border-[#c5a059]/40 shadow">
                <Sparkles className="w-3 h-3" />
                <span>{t.chefsChoice}</span>
              </span>
            )}
            {item.dietary.isPopular && (
              <span className="inline-flex items-center gap-1 bg-[#c5a059] text-[#0c342b] text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <Star className="w-3 h-3 fill-[#0c342b]" />
                <span>{t.popular}</span>
              </span>
            )}
            {item.dietary.isSpicy && (
              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <Flame className="w-3 h-3" />
                <span>{t.spicy}</span>
              </span>
            )}
            {item.dietary.isVegetarian && (
              <span className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <Leaf className="w-3 h-3" />
                <span>{t.vegetarian}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#0c342b]">
              {name}
            </h2>
            <div className="text-xl font-bold text-[#0c342b]">
              <span className="text-[#c5a059] text-sm mr-1">{t.afn}</span>
              <span>{item.price.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-sm text-[#5f544e] leading-relaxed mb-6">
            {desc}
          </p>

          {/* Details Pill Info (Serving Size & Key Ingredients) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#faf8f5] p-4 rounded-xl border border-[#e8e2d9] mb-6">
            {serving && (
              <div>
                <span className="text-xs text-stone-500 uppercase font-semibold block mb-1">
                  {t.servingSize}
                </span>
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  {serving}
                </span>
              </div>
            )}
            {ingredients && ingredients.length > 0 && (
              <div>
                <span className="text-xs text-stone-500 uppercase font-semibold block mb-1">
                  {t.ingredients}
                </span>
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  {ingredients.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Addons Selection (if any) */}
          {item.addons && item.addons.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                {t.addons}
              </h4>
              <div className="space-y-2">
                {item.addons.map((ad) => {
                  const adName =
                    language === 'fa' ? ad.nameFa : language === 'ps' ? ad.namePs : ad.nameEn;
                  const isChecked = selectedAddonIds.includes(ad.id);

                  return (
                    <label
                      key={ad.id}
                      onClick={() => toggleAddon(ad.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#0c342b]'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-[#0c342b] border-[#0c342b]' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{adName}</span>
                      </div>
                      <span className="text-xs font-bold text-[#c5a059]">
                        +{ad.price} {t.afn}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Input */}
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              {t.specialInstructions}
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t.instructionsPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-[#c5a059] focus:outline-none text-xs text-stone-800 placeholder:text-stone-400"
            />
          </div>

          {/* Related Dishes */}
          {relatedDishes.length > 0 && (
            <div className="pt-4 border-t border-[#f0eae1]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                {t.relatedDishes}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedDishes.map((rd) => {
                  const rdName =
                    language === 'fa' ? rd.nameFa : language === 'ps' ? rd.namePs : rd.nameEn;
                  return (
                    <button
                      key={rd.id}
                      onClick={() => {
                        setSelectedMenuItem(rd);
                        setQuantity(1);
                        setSelectedAddonIds([]);
                        setSpecialInstructions('');
                      }}
                      className="group flex flex-col text-left text-xs bg-[#faf8f5] p-2 rounded-xl border border-[#e8e2d9] hover:border-[#c5a059] transition-all"
                    >
                      <img
                        src={rd.image}
                        alt={rdName}
                        className="w-full h-16 object-cover rounded-lg mb-1.5"
                      />
                      <span className="font-semibold text-stone-800 line-clamp-1 group-hover:text-[#c5a059]">
                        {rdName}
                      </span>
                      <span className="text-[#c5a059] font-bold">
                        {rd.price} {t.afn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Quantity Selector & Add to Order CTA) */}
        <div className="p-4 sm:p-6 bg-[#faf8f5] border-t border-[#e8e2d9] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-base text-stone-800 w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-600"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-sm tracking-wider uppercase transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {t.addToOrder} • {totalPrice.toLocaleString()} {t.afn}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
