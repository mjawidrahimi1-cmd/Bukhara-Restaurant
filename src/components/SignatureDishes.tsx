import React from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { ShoppingBag, Eye, Star, Flame, Sparkles } from 'lucide-react';

export const SignatureDishes: React.FC = () => {
  const { menuItems, language, t, setSelectedMenuItem, addToCart } = useStore();

  // Highlight items with isPopular or isChefChoice or specific signature items
  const signatureItems = menuItems.filter(
    (item) => item.dietary.isPopular || item.dietary.isChefChoice
  ).slice(0, 6);

  const getItemName = (item: MenuItem) =>
    language === 'fa' ? item.nameFa : language === 'ps' ? item.namePs : item.nameEn;

  const getItemDesc = (item: MenuItem) =>
    language === 'fa' ? item.descriptionFa : language === 'ps' ? item.descriptionPs : item.descriptionEn;

  return (
    <section className="py-20 sm:py-28 bg-[#faf8f5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.signatureTitle}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.signatureSubtitle}
          </h2>
          <div className="w-20 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signatureItems.map((item) => {
            const name = getItemName(item);
            const desc = getItemDesc(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Image Container with Badges */}
                <div className="relative h-60 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {item.dietary.isChefChoice && (
                      <span className="inline-flex items-center gap-1 bg-[#0c342b] text-[#c5a059] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <Sparkles className="w-3 h-3" />
                        <span>{t.chefsChoice}</span>
                      </span>
                    )}
                    {item.dietary.isPopular && (
                      <span className="inline-flex items-center gap-1 bg-[#c5a059] text-[#0c342b] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <Star className="w-3 h-3 fill-[#0c342b]" />
                        <span>{t.popular}</span>
                      </span>
                    )}
                    {item.dietary.isSpicy && (
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <Flame className="w-3 h-3" />
                        <span>{t.spicy}</span>
                      </span>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 right-3 bg-[#0c342b]/95 backdrop-blur-sm text-[#fdfbf7] font-bold px-3 py-1 rounded-lg border border-[#c5a059]/40 text-sm shadow-md">
                    <span className="text-[#c5a059] text-xs mr-1">{t.afn}</span>
                    <span>{item.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-title text-xl font-bold text-[#0c342b] group-hover:text-[#c5a059] transition-colors line-clamp-1 mb-2">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5f544e] line-clamp-2 leading-relaxed mb-4">
                      {desc}
                    </p>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-[#f0eae1] flex items-center gap-2">
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-[#fdfbf7] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.orderNow}</span>
                    </button>

                    <button
                      onClick={() => setSelectedMenuItem(item)}
                      title={t.viewDetails}
                      className="p-2.5 rounded-xl border border-[#e4ded6] hover:border-[#c5a059] text-[#5f544e] hover:text-[#0c342b] hover:bg-[#faf8f5] transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Menu CTA Button */}
        <div className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#0c342b] text-[#0c342b] hover:bg-[#0c342b] hover:text-[#fdfbf7] text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            <span>{t.exploreMenu}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
