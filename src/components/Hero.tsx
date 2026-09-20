import React from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, Utensils, Calendar, ShoppingBag, Star, Clock, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, setIsReservationOpen, siteSettings, language } = useStore();

  const handleExploreMenu = () => {
    const el = document.querySelector('#menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentHeadline =
    (language === 'fa'
      ? siteSettings.heroContent?.headlineFa
      : language === 'ps'
      ? siteSettings.heroContent?.headlinePs
      : siteSettings.heroContent?.headlineEn) || t.heroTitle;

  const currentSubtitle =
    (language === 'fa'
      ? siteSettings.heroContent?.subheadlineFa
      : language === 'ps'
      ? siteSettings.heroContent?.subheadlinePs
      : siteSettings.heroContent?.subheadlineEn) || t.heroSubtitle;

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#08201a]">
      {/* Background Image Layer with Cinematic Darkness & Ambient Lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
          alt="Bukhara Restaurant Dining & Charcoal Grills"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out brightness-[0.38] contrast-[1.12]"
        />
        {/* Subtle geometric Bukhara pattern overlay */}
        <div className="absolute inset-0 bukhara-pattern opacity-10 pointer-events-none" />

        {/* Sophisticated radial golden ambient light gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08201a] via-transparent to-[#08201a]/80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#c5a059]/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Top Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c342b]/90 border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.open24Hours}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c342b]/90 border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.kabulAfghanistan}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/50 text-[#fdfbf7] text-xs font-semibold tracking-wider backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>4.9 Google Rating</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#fdfbf7] max-w-4xl leading-[1.15] mb-6 drop-shadow-lg">
          {currentHeadline}
        </h1>

        {/* Golden Motif Divider */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xs my-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
          <span className="w-2.5 h-2.5 rotate-45 border border-[#c5a059] bg-[#0c342b]" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
        </div>

        {/* Subtitle */}
        <p className="text-[#e4ded6] text-base sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed mt-3 mb-10 text-balance">
          {currentSubtitle}
        </p>

        {/* 3 Prominent CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* CTA 1: Explore Menu */}
          <button
            onClick={handleExploreMenu}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#c5a059] text-[#0c342b] hover:bg-[#e5c578] font-bold text-sm tracking-wider uppercase shadow-lg shadow-black/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Utensils className="w-4 h-4" />
            <span>{t.exploreMenu}</span>
          </button>

          {/* CTA 2: Book A Table */}
          <button
            onClick={() => setIsReservationOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-[#c5a059] text-[#fdfbf7] hover:bg-[#c5a059] hover:text-[#0c342b] font-bold text-sm tracking-wider uppercase backdrop-blur-sm shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <Calendar className="w-4 h-4" />
            <span>{t.bookTable}</span>
          </button>

          {/* CTA 3: Order Online */}
          <button
            onClick={handleExploreMenu}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0c342b]/80 border border-[#c5a059]/40 text-[#fdfbf7] hover:bg-[#0c342b] hover:border-[#c5a059] font-bold text-sm tracking-wider uppercase backdrop-blur-sm shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
            <span>{t.orderOnline}</span>
          </button>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="mt-14 sm:mt-16 flex flex-col items-center animate-bounce opacity-70 hover:opacity-100 transition-opacity">
          <a
            href="#info-bar"
            aria-label={t.scrollDown}
            className="text-xs text-[#c5a059] uppercase tracking-widest font-medium flex flex-col items-center gap-1"
          >
            <span>{t.scrollDown}</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
