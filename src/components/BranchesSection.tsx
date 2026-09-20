import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Branch } from '../types';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Navigation,
  CheckCircle,
  Calendar,
  Eye,
} from 'lucide-react';

export const BranchesSection: React.FC = () => {
  const {
    branches,
    language,
    t,
    setSelectedBranch,
    setIsReservationOpen,
    setActiveBranchId,
    openWhatsApp,
  } = useStore();

  const [activeTabBranchId, setActiveTabBranchId] = useState<string>(branches[0]?.id || '');

  const activeBranch = branches.find((b) => b.id === activeTabBranchId) || branches[0];

  const getBranchName = (b: Branch) =>
    language === 'fa' ? b.nameFa : language === 'ps' ? b.namePs : b.nameEn;

  const getBranchAddress = (b: Branch) =>
    language === 'fa' ? b.addressFa : language === 'ps' ? b.addressPs : b.addressEn;

  const getBranchHours = (b: Branch) =>
    language === 'fa' ? b.openingHoursFa : language === 'ps' ? b.openingHoursPs : b.openingHoursEn;

  const getBranchFeatures = (b: Branch) =>
    language === 'fa' ? b.featuresFa : language === 'ps' ? b.featuresPs : b.featuresEn;

  return (
    <section id="branches" className="py-20 sm:py-28 bg-[#faf8f5] relative border-t border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.branchesTitle}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.branchesSubtitle}
          </h2>
          <div className="w-20 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {branches.map((b) => {
            const isSelected = b.id === activeBranch.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveTabBranchId(b.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0c342b] text-[#fdfbf7] shadow-lg shadow-[#0c342b]/20 border border-[#0c342b]'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#c5a059]' : 'text-stone-400'}`} />
                <span>{getBranchName(b)}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Branch Active Detail Showcase */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#e8e2d9] shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left / Info Side */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Branch Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c342b]/10 text-[#0c342b] text-xs font-bold uppercase tracking-wider mb-4">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{getBranchHours(activeBranch)}</span>
              </div>

              {/* Title & Address */}
              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#0c342b] mb-3">
                {getBranchName(activeBranch)}
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed flex items-start gap-2 mb-6">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <span>{getBranchAddress(activeBranch)}</span>
              </p>

              {/* Branch Features / Services */}
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Branch Amenities & Services:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {getBranchFeatures(activeBranch).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Interactive Actions */}
            <div className="pt-6 border-t border-[#f0eae1] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Call Now */}
                <a
                  href={`tel:${activeBranch.phone}`}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Branch</span>
                </a>

                {/* WhatsApp */}
                <button
                  onClick={() => openWhatsApp(activeBranch.whatsapp, `Hello Bukhara Restaurant ${activeBranch.nameEn}`)}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {/* Get Directions */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeBranch.coordinates.lat},${activeBranch.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 hover:border-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Directions</span>
                </a>
              </div>

              {/* Secondary CTA: Book Table at this specific branch */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveBranchId(activeBranch.id);
                    setIsReservationOpen(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#0c342b] text-[#0c342b] hover:bg-[#0c342b] hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve a Table Here</span>
                </button>

                <button
                  onClick={() => setSelectedBranch(activeBranch)}
                  className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right / Map Embed Side */}
          <div className="lg:col-span-6 relative min-h-[360px] sm:min-h-[440px] bg-stone-100 border-t lg:border-t-0 lg:border-l border-[#e8e2d9]">
            <iframe
              title={`Map of ${activeBranch.nameEn}`}
              src={activeBranch.mapEmbedUrl}
              className="w-full h-full min-h-[360px] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200 shadow-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800">
                GPS: {activeBranch.coordinates.lat}, {activeBranch.coordinates.lng}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeBranch.coordinates.lat},${activeBranch.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0c342b] font-bold hover:text-[#c5a059] flex items-center gap-1"
              >
                <span>{t.getDirections}</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
