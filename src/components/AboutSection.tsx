import React from 'react';
import { useStore } from '../context/StoreContext';
import { BUKHARA_LOGO_URL } from '../types';
import { Users, Briefcase, Award, Clock, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t, setIsReservationOpen } = useStore();

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#faf8f5] relative overflow-hidden">
      {/* Decorative Afghan geometric subtle side watermark */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#0c342b]">
          <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition with Layered Frames */}
          <div className="lg:col-span-6 relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#c5a059]/30 bg-[#08201a]">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                alt="Bukhara Restaurant Dining Room"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08201a]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
                  Bukhara Kabul
                </span>
                <p className="text-sm font-serif-title italic text-[#e4ded6] mt-1">
                  Where traditional Afghan hospitality meets modern luxury.
                </p>
              </div>
            </div>

            {/* Floating Decorative Experience Card with Official Logo */}
            <div className="absolute -bottom-8 -right-4 sm:-bottom-6 sm:right-6 bg-[#0c342b] text-[#fdfbf7] p-3.5 sm:p-5 rounded-2xl border border-[#c5a059]/40 shadow-2xl max-w-[280px] hidden sm:flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#c5a059] p-0.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src={BUKHARA_LOGO_URL}
                  alt="Bukhara Restaurant Emblem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[#c5a059] mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Heritage Dining</span>
                </div>
                <p className="text-[11px] text-[#e4ded6] leading-snug">
                  Slow-simmered sella rice, mountain embers, and timeless Kabul hospitality.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 text-[#c5a059] text-xs font-bold tracking-widest uppercase mb-3">
              <span className="w-8 h-[1px] bg-[#c5a059]" />
              <span>{t.storyTitle}</span>
            </div>

            {/* Headline */}
            <h2 className="font-serif-title text-2xl sm:text-4xl lg:text-5xl font-bold text-[#0c342b] leading-tight mb-6">
              {t.storyHeadline}
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-[#443831] text-base sm:text-lg leading-relaxed mb-8">
              <p>{t.storyP1}</p>
              <p>{t.storyP2}</p>
            </div>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#c5a059]/20 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0c342b]/10 text-[#0c342b] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-[#0c342b]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1c140e]">{t.familyDining}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0c342b]/10 text-[#0c342b] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-[#0c342b]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1c140e]">{t.businessDining}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0c342b]/10 text-[#0c342b] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-[#0c342b]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1c140e]">{t.masterChefs}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0c342b]/10 text-[#0c342b] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#0c342b]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#1c140e]">{t.openRoundClock}</span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <button
                onClick={() => setIsReservationOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0c342b] text-[#fdfbf7] hover:bg-[#134e42] text-xs font-bold tracking-wider uppercase transition-colors shadow-md"
              >
                <span>{t.bookTable}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
