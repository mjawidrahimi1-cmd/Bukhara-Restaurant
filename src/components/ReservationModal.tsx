import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Calendar,
  Clock,
  Users,
  Building,
  Sparkles,
  CheckCircle,
  Phone,
  MessageSquare,
} from 'lucide-react';

export const ReservationModal: React.FC = () => {
  const {
    isReservationOpen,
    setIsReservationOpen,
    placeReservation,
    branches,
    activeBranchId,
    t,
    language,
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState(activeBranchId);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(4);
  const [occasion, setOccasion] = useState(t.occasionFamily);
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedReservationCode, setConfirmedReservationCode] = useState<string | null>(null);

  if (!isReservationOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = placeReservation({
      name,
      phone,
      email: email || 'guest@bukhararestaurant.af',
      branchId,
      date,
      time,
      guests,
      occasion,
      specialRequest: specialRequest || undefined,
    });
    setConfirmedReservationCode(res.id);
  };

  const resetAndClose = () => {
    setConfirmedReservationCode(null);
    setIsReservationOpen(false);
  };

  const selectedBranch = branches.find((b) => b.id === branchId) || branches[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 my-8">
        {/* Header */}
        <div className="p-6 bg-[#0c342b] text-[#fdfbf7] flex items-center justify-between border-b border-[#c5a059]/30">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold">
              Bukhara Kabul
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold">
              {t.bookTableTitle}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {confirmedReservationCode ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#0c342b]/10 text-[#0c342b] flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-10 h-10 text-[#c5a059]" />
              </div>

              <h4 className="font-serif-title text-2xl font-bold text-[#0c342b]">
                {t.resSuccessTitle}
              </h4>

              <div className="inline-block px-5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#c5a059]/50 text-[#0c342b] font-mono text-lg font-extrabold tracking-wider">
                {confirmedReservationCode}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                {t.resSuccessMsg}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${selectedBranch.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0c342b] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedBranch.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${selectedBranch.whatsapp.replace('+', '')}?text=Hello%20Bukhara%20Restaurant,%20I%20reserved%20a%20table%20with%20code%20${confirmedReservationCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Confirm</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={resetAndClose}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                {t.bookTableSubtitle}
              </p>

              {/* Branch Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  {t.reservationBranch}
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 bg-stone-50 focus:outline-none focus:border-[#c5a059]"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {language === 'fa' ? b.nameFa : language === 'ps' ? b.namePs : b.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">{t.fullName} *</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Sulaiman Rahimi"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">{t.phone} *</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+93 78 944 4222"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Date, Time & Number of Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">{t.resDate} *</span>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">{t.resTime} *</span>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059] bg-white"
                  >
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="18:30">06:30 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:30">09:30 PM (Late Dinner)</option>
                    <option value="23:00">11:00 PM (Night Service)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">{t.resGuests} *</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  {t.resOccasion}
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value={t.occasionFamily}>{t.occasionFamily}</option>
                  <option value={t.occasionBusiness}>{t.occasionBusiness}</option>
                  <option value={t.occasionBirthday}>{t.occasionBirthday}</option>
                  <option value={t.occasionAnniversary}>{t.occasionAnniversary}</option>
                  <option value={t.occasionPrivate}>{t.occasionPrivate}</option>
                  <option value={t.occasionOther}>{t.occasionOther}</option>
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1">
                  {t.specialRequests}
                </label>
                <textarea
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="E.g., Private family booth, high chair for infant, corner table..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-4"
              >
                <Calendar className="w-4 h-4 text-[#c5a059]" />
                <span>{t.submitReservation}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
