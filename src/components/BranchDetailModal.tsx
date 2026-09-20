import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle,
  Calendar,
} from 'lucide-react';

export const BranchDetailModal: React.FC = () => {
  const {
    selectedBranch,
    setSelectedBranch,
    language,
    t,
    setActiveBranchId,
    setIsReservationOpen,
  } = useStore();

  if (!selectedBranch) return null;

  const b = selectedBranch;

  const name =
    language === 'fa' ? b.nameFa : language === 'ps' ? b.namePs : b.nameEn;
  const address =
    language === 'fa' ? b.addressFa : language === 'ps' ? b.addressPs : b.addressEn;
  const hours =
    language === 'fa' ? b.openingHoursFa : language === 'ps' ? b.openingHoursPs : b.openingHoursEn;
  const features =
    language === 'fa' ? b.featuresFa : language === 'ps' ? b.featuresPs : b.featuresEn;

  const handleBookTable = () => {
    setActiveBranchId(b.id);
    setSelectedBranch(null);
    setIsReservationOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedBranch(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#0c342b] text-white flex items-center justify-center transition-colors shadow-md"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Preview Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
          <img
            src={b.photos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059] text-[#0c342b] text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{hours}</span>
            </span>
            <h2 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#fdfbf7]">
              {name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
              <span>{address}</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Gallery Thumbnails */}
          {b.photos && b.photos.length > 1 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Atmosphere & Spaces
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {b.photos.map((imgUrl: string, i: number) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`${name} photo ${i + 1}`}
                    className="w-full h-24 sm:h-28 object-cover rounded-xl border border-stone-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Branch Amenities & Capacity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-700 bg-[#faf8f5] p-2.5 rounded-xl border border-[#e8e2d9]">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Map */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Location Map & Parking Access
            </h4>
            <div className="h-56 rounded-2xl overflow-hidden border border-stone-200">
              <iframe
                title={`Map of ${name}`}
                src={b.mapEmbedUrl}
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#faf8f5] border-t border-[#e8e2d9] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${b.phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{b.phone}</span>
            </a>
            <a
              href={`https://wa.me/${b.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            onClick={handleBookTable}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c5a059] text-[#0c342b] hover:bg-[#e5c578] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Table Here</span>
          </button>
        </div>
      </div>
    </div>
  );
};
