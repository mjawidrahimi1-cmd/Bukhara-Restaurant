import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Users,
  Briefcase,
  Gift,
  Phone,
  MessageSquare,
  CheckCircle,
  CalendarCheck,
} from 'lucide-react';

export const CateringSection: React.FC = () => {
  const { t, branches, activeBranchId } = useStore();
  const branch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [eventType, setEventType] = useState('Family Banquet');
  const [guestCount, setGuestCount] = useState('50');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="catering" className="py-20 sm:py-28 bg-[#faf8f5] relative border-t border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.cateringTitle}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.cateringSubtitle}
          </h2>
          <div className="w-20 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        {/* 2-Column Content: Event Options & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Cards */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-stone-700 text-base leading-relaxed mb-6">
              {t.cateringDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#e8e2d9] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0c342b]/10 flex items-center justify-center text-[#0c342b] mb-3">
                    <Users className="w-5 h-5 text-[#0c342b]" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#0c342b] mb-1">
                    {t.privateDining}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Exclusive salons with authentic carpeted and table seating for private family and business gatherings.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#e8e2d9] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0c342b]/10 flex items-center justify-center text-[#0c342b] mb-3">
                    <Briefcase className="w-5 h-5 text-[#0c342b]" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#0c342b] mb-1">
                    {t.corporateCatering}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Hot buffet setups, individual executive meal boxes, and full service for conferences and delegations.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#e8e2d9] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0c342b]/10 flex items-center justify-center text-[#0c342b] mb-3">
                    <Gift className="w-5 h-5 text-[#0c342b]" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#0c342b] mb-1">
                    {t.weddingCatering}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Unrivaled authentic Afghan wedding banquets featuring whole roast lamb, Kabuli Pulao deghs, and royal desserts.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#e8e2d9] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0c342b]/10 flex items-center justify-center text-[#0c342b] mb-3">
                    <CalendarCheck className="w-5 h-5 text-[#0c342b]" />
                  </div>
                  <h4 className="font-serif-title font-bold text-base text-[#0c342b] mb-1">
                    {t.familyEvent}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Tailored live BBQ stations, tandoori naan masters on site, and dedicated waitstaff delivered across Kabul.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${branch.phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Banquet Manager</span>
              </a>

              <a
                href={`https://wa.me/${branch.whatsapp.replace('+', '')}?text=Hello%20Bukhara%20Restaurant,%20I%20am%20inquiring%20about%20catering%20and%20private%20dining.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold uppercase transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Right Inquiry Form Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#c5a059]/40 shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif-title text-2xl font-bold text-[#0c342b]">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Thank you, <strong>{inquiryName}</strong>. Our Bukhara Events & Catering coordinator will reach out to <strong>{inquiryPhone}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-[#0c342b] text-white text-xs font-bold uppercase"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold block">
                  Quick Catering Inquiry
                </span>
                <h3 className="font-serif-title text-xl font-bold text-[#0c342b]">
                  Request an Event Quote
                </h3>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Your Name *</span>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="E.g., Dr. Mohammad Dawood"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-stone-500 block mb-1">Telephone / WhatsApp *</span>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+93 78 944 4222"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">Event Type</span>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#c5a059] bg-white"
                    >
                      <option value="Family Banquet">Family Banquet</option>
                      <option value="Corporate Lunch">Corporate Lunch</option>
                      <option value="Wedding / Engagement">Wedding / Engagement</option>
                      <option value="Home VIP Catering">Home VIP Catering</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-500 block mb-1">Estimated Guests</span>
                    <input
                      type="text"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      placeholder="e.g. 30 - 200"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2"
                >
                  Send Catering Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
