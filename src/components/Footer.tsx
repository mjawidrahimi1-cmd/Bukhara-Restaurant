import React from 'react';
import { useStore } from '../context/StoreContext';
import { BUKHARA_LOGO_URL } from '../types';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  Star,
  ChevronRight,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    t,
    branches,
    setIsReservationOpen,
    setIsAdminOpen,
    setIsPrintMenuOpen,
    openWhatsApp,
  } = useStore();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#061814] text-[#fdfbf7] pt-16 pb-12 border-t border-[#c5a059]/30 relative overflow-hidden">
      {/* Subtle Bukhara watermark pattern */}
      <div className="absolute inset-0 bukhara-pattern opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Restaurant Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-[#c5a059] flex items-center justify-center p-0.5 shadow-md shadow-black/40 overflow-hidden shrink-0">
                <img
                  src={BUKHARA_LOGO_URL}
                  alt="Bukhara Restaurant Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="font-serif-title text-2xl font-bold tracking-wide text-[#fdfbf7] block leading-none">
                  BUKHARA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#c5a059] uppercase block mt-1 font-semibold">
                  RESTAURANT • KABUL
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Authentic Afghan dining, charcoal grills, slow-simmered Kabuli Pulao, and timeless hospitality. Welcoming guests 24 hours a day across Kabul.
            </p>

            {/* Badges */}
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c342b] border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Open 24 Hours</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.9 Google Rating</span>
              </span>
            </div>
          </div>

          {/* Col 2: Kabul Branches & Hotlines */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif-title text-base font-bold text-[#c5a059] tracking-wider uppercase">
              Kabul Locations
            </h4>

            <div className="space-y-3">
              {branches.map((b) => (
                <div key={b.id} className="text-xs space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between font-bold text-stone-200">
                    <span>{b.nameEn}</span>
                    <span className="text-[10px] text-[#c5a059]">24/7</span>
                  </div>
                  <p className="text-stone-400 flex items-start gap-1.5 leading-snug">
                    <MapPin className="w-3 h-3 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{b.addressEn}</span>
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <a href={`tel:${b.phone}`} className="text-[#c5a059] hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{b.phone}</span>
                    </a>
                    <button
                      onClick={() => openWhatsApp(b.whatsapp)}
                      className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-title text-base font-bold text-[#c5a059] tracking-wider uppercase">
              {t.explore}
            </h4>

            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#home" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.home}</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.about}</span>
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.menu}</span>
                </a>
              </li>
              <li>
                <a href="#catering" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.catering}</span>
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.gallery}</span>
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.blog}</span>
                </a>
              </li>
              <li>
                <a href="#branches" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.branches}</span>
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.testimonialsTitle}</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.contact}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Dining Services & Admin */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-title text-base font-bold text-[#c5a059] tracking-wider uppercase">
              Dining Services
            </h4>

            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => setIsReservationOpen(true)}
                  className="hover:text-[#c5a059] transition-colors flex items-center gap-1 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.bookTable}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrintMenuOpen(true)}
                  className="hover:text-[#c5a059] transition-colors flex items-center gap-1 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-[#c5a059]" />
                  <span>{t.printMenu}</span>
                </button>
              </li>
              <li className="pt-3 border-t border-white/10">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 text-stone-400 hover:text-[#c5a059] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.adminDashboard}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Contact */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="text-center sm:text-left">
            © {currentYear} Bukhara Restaurant (رستورانت بخارا). All rights reserved. Kabul, Afghanistan.
          </p>

          <div className="flex items-center gap-4">
            <a href="mailto:info@bukhararestaurant.af" className="hover:text-[#c5a059] transition-colors flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>info@bukhararestaurant.af</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
