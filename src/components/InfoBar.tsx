import React from 'react';
import { useStore } from '../context/StoreContext';
import { Clock, MapPin, Phone, MessageSquare, Navigation, Calendar, ShoppingBag } from 'lucide-react';

export const InfoBar: React.FC = () => {
  const {
    t,
    branches,
    activeBranchId,
    setActiveBranchId,
    setIsReservationOpen,
    openWhatsApp,
    language,
  } = useStore();

  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const branchName =
    language === 'fa' ? currentBranch.nameFa : language === 'ps' ? currentBranch.namePs : currentBranch.nameEn;

  const handleOrderClick = () => {
    const el = document.querySelector('#menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="info-bar" className="bg-[#0c342b] border-y border-[#c5a059]/30 text-[#fdfbf7] py-4 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Branch Selector Dropdown & Status */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full lg:w-auto">
          {/* 24 Hours Indicator */}
          <div className="flex items-center gap-2 bg-[#08201a] px-3.5 py-1.5 rounded-full border border-[#c5a059]/40 text-xs font-semibold text-[#c5a059]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Clock className="w-3.5 h-3.5" />
            <span>{t.open24Hours}</span>
          </div>

          {/* Dynamic Branch Dropdown */}
          <div className="flex items-center gap-2 bg-[#08201a] px-3 py-1 rounded-full border border-[#c5a059]/40 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="bg-transparent text-[#fdfbf7] font-medium focus:outline-none cursor-pointer py-1 pr-1"
              aria-label={t.selectBranch}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#0c342b] text-[#fdfbf7]">
                  {language === 'fa' ? b.nameFa : language === 'ps' ? b.namePs : b.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Branch Contact & Directions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium">
          {/* Phone Number with Click to Call */}
          <a
            href={`tel:${currentBranch.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08201a] hover:bg-[#c5a059] text-[#e4ded6] hover:text-[#0c342b] border border-[#c5a059]/30 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#c5a059] group-hover:text-[#0c342b]" />
            <span className="tracking-wider">{currentBranch.phone}</span>
          </a>

          {/* WhatsApp Direct */}
          <button
            onClick={() => openWhatsApp(currentBranch.whatsapp)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08201a] hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Google Maps Directions */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${currentBranch.coordinates.lat},${currentBranch.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08201a] hover:bg-[#c5a059] text-[#e4ded6] hover:text-[#0c342b] border border-[#c5a059]/30 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{t.getDirections}</span>
          </a>
        </div>

        {/* Fast Action Quick Triggers */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => setIsReservationOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-transparent hover:bg-[#c5a059] border border-[#c5a059] text-[#fdfbf7] hover:text-[#0c342b] text-xs font-semibold tracking-wider transition-all"
          >
            <Calendar className="w-3 h-3 text-[#c5a059]" />
            <span>{t.bookTable}</span>
          </button>
          <button
            onClick={handleOrderClick}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c5a059] hover:bg-[#e5c578] text-[#0c342b] text-xs font-bold tracking-wider transition-all shadow-sm"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{t.orderOnline}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
