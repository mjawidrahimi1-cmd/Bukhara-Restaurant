import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, Phone, MapPin, Clock } from 'lucide-react';

export const PrintMenuModal: React.FC = () => {
  const {
    isPrintMenuOpen,
    setIsPrintMenuOpen,
    menuItems,
    categories,
    branches,
    language,
    t,
  } = useStore();

  if (!isPrintMenuOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-300 my-4">
        {/* Modal Controls Top Bar (Hidden during print) */}
        <div className="no-print p-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#c5a059]" />
            <span className="font-serif-title text-base sm:text-lg font-bold">
              {t.printMenu} - Bukhara Restaurant Kabul
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c5a059] text-[#0c342b] font-bold text-xs uppercase tracking-wider hover:bg-[#e5c578] shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Now</span>
            </button>
            <button
              onClick={() => setIsPrintMenuOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 sm:p-12 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-4 bg-white text-stone-900 font-sans">
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-[#0c342b] mb-8">
            <div className="inline-block border-b-2 border-[#c5a059] pb-1 mb-2">
              <h1 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-tight text-[#0c342b] uppercase">
                Bukhara Restaurant
              </h1>
            </div>
            <p className="font-serif-title italic text-sm text-stone-600 mb-3">
              Traditional Afghan Cuisine • Open 24 Hours • Kabul, Afghanistan
            </p>

            {/* Branch Hotlines in Header */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-700">
              {branches.map((b) => (
                <div key={b.id} className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#0c342b]" />
                  <span>{b.nameEn}: {b.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grouped Menu Categories */}
          <div className="space-y-8">
            {categories.map((cat) => {
              const items = menuItems.filter((m) => m.category === cat.id);
              if (items.length === 0) return null;

              const catName =
                language === 'fa' ? cat.nameFa : language === 'ps' ? cat.namePs : cat.nameEn;

              return (
                <div key={cat.id} className="break-inside-avoid">
                  {/* Category Title */}
                  <div className="flex items-center justify-between border-b border-[#0c342b]/30 pb-1.5 mb-4">
                    <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#0c342b] uppercase tracking-wide">
                      {catName}
                    </h2>
                    <span className="text-xs text-[#c5a059] font-bold">AFN</span>
                  </div>

                  {/* Items List in 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {items.map((it) => {
                      const itName =
                        language === 'fa' ? it.nameFa : language === 'ps' ? it.namePs : it.nameEn;
                      const itDesc =
                        language === 'fa' ? it.descriptionFa : language === 'ps' ? it.descriptionPs : it.descriptionEn;

                      return (
                        <div key={it.id} className="border-b border-dashed border-stone-200 pb-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-serif-title font-bold text-sm text-stone-900">
                              {itName}
                            </span>
                            <span className="font-bold text-sm text-[#0c342b] whitespace-nowrap">
                              {it.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {itDesc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-4 border-t border-stone-300 text-center text-[11px] text-stone-500">
            <p>Prices are in Afghan Afghanis (AFN). All taxes included. Fresh tandoori naan and chatni served complimentary with dine-in platters.</p>
            <p className="mt-1 font-semibold text-[#0c342b]">www.bukhararestaurant.af • Kabul, Afghanistan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
