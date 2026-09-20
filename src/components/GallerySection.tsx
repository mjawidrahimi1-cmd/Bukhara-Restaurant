import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GalleryItem } from '../types';
import { Sparkles, Maximize2, Camera } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, language, t, setSelectedGalleryImage } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: t.catAll },
    { id: 'food', label: t.catFood },
    { id: 'interior', label: t.catInterior },
    { id: 'cuisine', label: t.catCuisine },
    { id: 'events', label: t.catEvents },
    { id: 'dining', label: t.catDining },
  ];

  const filteredGallery =
    selectedCategory === 'all'
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#faf8f5] relative border-t border-[#e8e2d9] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0c342b]/10 text-[#0c342b] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{t.galleryTitle}</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.gallerySubtitle}
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
                selectedCategory === tab.id
                  ? 'bg-[#0c342b] text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredGallery.map((item: GalleryItem) => {
            const title =
              language === 'fa'
                ? item.titleFa
                : language === 'ps'
                ? item.titlePs
                : item.titleEn;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedGalleryImage(item)}
                className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-stone-900 border border-stone-200"
              >
                <img
                  src={item.image}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Corner Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-[#0c342b]/80 backdrop-blur-sm text-[#c5a059] border border-[#c5a059]/40 text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Caption & Expand Icon */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex items-end justify-between gap-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-white leading-snug group-hover:text-[#c5a059] transition-colors">
                      {title}
                    </h3>
                    <span className="text-[11px] text-stone-300 flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-3 h-3 text-[#c5a059]" />
                      <span>Click to view full photo</span>
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-[#c5a059] text-[#0c342b] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Maximize2 className="w-4 h-4" />
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
