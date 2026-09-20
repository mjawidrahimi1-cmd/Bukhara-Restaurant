import React from 'react';
import { useStore } from '../context/StoreContext';
import { SpecialOffer } from '../types';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';

export const OffersSection: React.FC = () => {
  const { offers, language, t, applyPromoCode, setIsCartOpen } = useStore();

  const handleClaimOffer = (slug: string) => {
    // If user clicks, apply demo discount or scroll to menu
    applyPromoCode('BUKHARA10');
    setIsCartOpen(true);
  };

  return (
    <section id="offers" className="py-20 bg-[#0c342b] text-[#fdfbf7] relative overflow-hidden">
      {/* Ambient background pattern */}
      <div className="absolute inset-0 bukhara-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.offersTitle}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#fdfbf7]">
            {t.offersSubtitle}
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {offers.map((offer: SpecialOffer) => {
            const title =
              language === 'fa' ? offer.titleFa : language === 'ps' ? offer.titlePs : offer.titleEn;
            const desc =
              language === 'fa' ? offer.descriptionFa : language === 'ps' ? offer.descriptionPs : offer.descriptionEn;
            const badge =
              language === 'fa' ? offer.badgeFa : language === 'ps' ? offer.badgePs : offer.badgeEn;
            const valid =
              language === 'fa' ? offer.validDatesFa : language === 'ps' ? offer.validDatesPs : offer.validDatesEn;

            return (
              <div
                key={offer.id}
                className="bg-[#08201a]/80 border border-[#c5a059]/30 hover:border-[#c5a059] rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 group"
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-1 rounded-full border border-[#c5a059]/30">
                      <Sparkles className="w-3 h-3" />
                      <span>{badge}</span>
                    </span>

                    <div className="text-right">
                      <span className="text-xs line-through text-stone-400 mr-2">
                        {offer.originalPrice} AFN
                      </span>
                      <span className="text-sm font-bold text-[#c5a059]">
                        {offer.discountedPrice} AFN
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-title text-xl font-bold text-[#fdfbf7] group-hover:text-[#c5a059] transition-colors mb-2">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <Clock className="w-3 h-3 text-[#c5a059]" />
                    <span>{t.validUntil} {valid}</span>
                  </div>

                  <button
                    onClick={() => handleClaimOffer(offer.slug)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c5a059] text-[#0c342b] hover:bg-[#e5c578] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    <span>{t.claimOffer}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
