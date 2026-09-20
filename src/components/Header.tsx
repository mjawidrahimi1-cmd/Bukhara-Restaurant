import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Language, BUKHARA_LOGO_URL } from '../types';
import {
  Phone,
  MessageSquare,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    cartCount,
    setIsCartOpen,
    setIsReservationOpen,
    openWhatsApp,
    siteSettings,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const announcementText =
    language === 'fa'
      ? siteSettings.announcementBar.textFa
      : language === 'ps'
      ? siteSettings.announcementBar.textPs
      : siteSettings.announcementBar.textEn;

  const navLinks = [
    { label: t.home, href: '#home' },
    { label: t.about, href: '#about' },
    { label: t.menu, href: '#menu' },
    { label: t.offers, href: '#offers' },
    { label: t.catering, href: '#catering' },
    { label: t.gallery, href: '#gallery' },
    { label: t.blog, href: '#blog' },
    { label: t.branches, href: '#branches' },
    { label: t.contact, href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      {siteSettings.announcementBar.enabled && (
        <div className="bg-[#08201a] text-[#c5a059] border-b border-[#c5a059]/20 text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          <span>{announcementText}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c342b]/95 backdrop-blur-md shadow-xl py-3 border-b border-[#c5a059]/30'
            : 'bg-gradient-to-b from-[#08201a]/95 via-[#08201a]/80 to-transparent py-4 border-b border-[#c5a059]/15'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
          >
            {/* Official Bukhara Restaurant Logo */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#c5a059] bg-white p-0.5 shadow-md shadow-black/40 group-hover:border-[#e5c578] transition-all flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={BUKHARA_LOGO_URL}
                alt="Bukhara Restaurant Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-wider text-[#fdfbf7] group-hover:text-[#c5a059] transition-colors leading-none">
                {t.brandName}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#c5a059] font-medium mt-1">
                Kabul • Afghanistan
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#e4ded6]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-[#c5a059] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Contact Phone & WhatsApp */}
            <a
              href={`tel:${siteSettings.mainPhone}`}
              title={t.callUs}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-[#08201a]/70 hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0c342b] border border-[#c5a059]/30 transition-all"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => openWhatsApp(siteSettings.mainWhatsapp)}
              title={t.chatWhatsapp}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-[#08201a]/70 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#08201a]/90 rounded-full border border-[#c5a059]/40 p-0.5 text-xs font-medium">
              {(['en', 'fa', 'ps'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-full transition-all ${
                    language === lang
                      ? 'bg-[#c5a059] text-[#0c342b] font-bold shadow-sm'
                      : 'text-[#e4ded6] hover:text-[#c5a059]'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'fa' ? 'دری' : 'پښتو'}
                </button>
              ))}
            </div>

            {/* Cart Basket Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#c5a059]/20 hover:bg-[#c5a059] text-[#c5a059] hover:text-[#0c342b] border border-[#c5a059]/50 transition-all"
              aria-label={t.cart}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-[#0c342b] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Book A Table Desktop Button */}
            <button
              onClick={() => setIsReservationOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#c5a059] text-[#fdfbf7] hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-semibold tracking-wider uppercase transition-all duration-200"
            >
              <Calendar className="w-3.5 h-3.5 text-[#c5a059] group-hover:text-[#0c342b]" />
              <span>{t.bookTable}</span>
            </button>

            {/* Order Online Desktop Button */}
            <button
              onClick={() => {
                const menuEl = document.querySelector('#menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden lg:inline-flex items-center px-4 py-2 rounded-full bg-[#c5a059] text-[#0c342b] hover:bg-[#e5c578] text-xs font-bold tracking-wider uppercase shadow-md transition-all duration-200"
            >
              {t.orderOnline}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#08201a]/80 text-[#c5a059] border border-[#c5a059]/30"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#0c342b] border-b border-[#c5a059]/30 px-6 py-6 shadow-2xl transition-all animate-fadeIn">
            <div className="flex flex-col gap-4 text-base font-medium text-[#fdfbf7]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="py-2 border-b border-[#c5a059]/15 hover:text-[#c5a059] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                </a>
              ))}
              <div className="pt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsReservationOpen(true);
                  }}
                  className="w-full py-3 rounded-lg border border-[#c5a059] text-[#fdfbf7] hover:bg-[#c5a059] hover:text-[#0c342b] text-sm font-semibold tracking-wider text-center"
                >
                  {t.bookTable}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const menuEl = document.querySelector('#menu');
                    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 rounded-lg bg-[#c5a059] text-[#0c342b] text-sm font-bold tracking-wider text-center"
                >
                  {t.orderOnline}
                </button>
              </div>

              <div className="pt-4 flex items-center justify-around border-t border-[#c5a059]/20 text-xs text-[#c5a059]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWhatsApp(siteSettings.mainWhatsapp);
                  }}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{t.chatWhatsapp}</span>
                </button>
                <a
                  href={`tel:${siteSettings.mainPhone}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#c5a059]" />
                  <span>{t.callUs}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
