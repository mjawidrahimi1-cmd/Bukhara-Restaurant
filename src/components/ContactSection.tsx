import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteSettings, branches, language, t, showToast, setSelectedBranch, openWhatsApp } = useStore();

  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [branchPreference, setBranchPreference] = useState(branches[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitted(true);
    showToast(t.messageSent, 'success');

    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setPhoneOrEmail('');
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#0c342b] text-[#fdfbf7] relative overflow-hidden scroll-mt-16">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bukhara-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.contactTitle}</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#fdfbf7]">
            {t.contactSubtitle}
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a059] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Direct Contact & Branch Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#08201a]/85 border border-[#c5a059]/30 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
              <h3 className="font-serif-title text-2xl font-bold text-[#fdfbf7] mb-6 flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-[#c5a059]" />
                <span>Kabul Headquarters</span>
              </h3>

              <div className="space-y-5 text-sm">
                {/* Phone Call */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-medium">Direct Telephone (24/7)</span>
                    <a
                      href={`tel:${siteSettings.mainPhone}`}
                      className="text-base font-bold text-[#fdfbf7] hover:text-[#c5a059] transition-colors"
                    >
                      {siteSettings.mainPhone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Chat */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-medium">Direct WhatsApp Orders</span>
                    <button
                      onClick={() => openWhatsApp(siteSettings.mainWhatsapp)}
                      className="text-base font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{siteSettings.mainWhatsapp}</span>
                      <span className="text-xs font-normal underline">(Chat Now)</span>
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-medium">Email Inquiries</span>
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="text-sm font-semibold text-stone-200 hover:text-[#c5a059] transition-colors"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-medium">Service Hours</span>
                    <p className="text-sm font-bold text-amber-300">
                      Open 24 Hours • 7 Days a Week
                    </p>
                    <span className="text-xs text-stone-400">Dine-in, Takeaway & Express Kabul Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Branch Location Cards */}
            <div className="bg-[#08201a]/85 border border-[#c5a059]/30 rounded-3xl p-6 backdrop-blur-sm shadow-xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">
                Our Kabul Locations
              </h4>
              <div className="space-y-3">
                {branches.map((b) => {
                  const bName = language === 'fa' ? b.nameFa : language === 'ps' ? b.namePs : b.nameEn;
                  const bAddr = language === 'fa' ? b.addressFa : language === 'ps' ? b.addressPs : b.addressEn;
                  return (
                    <div key={b.id} className="flex items-start gap-3 text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                      <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                      <div className="flex-1 cursor-pointer" onClick={() => setSelectedBranch(b)}>
                        <span className="font-bold text-white hover:text-[#c5a059] transition-colors block">{bName}</span>
                        <span className="text-stone-300">{bAddr}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedBranch(b)}
                          className="text-[11px] font-bold text-[#fdfbf7] bg-white/10 hover:bg-[#c5a059] hover:text-[#0c342b] px-2 py-0.5 rounded transition-all"
                        >
                          Details
                        </button>
                        <a
                          href={`https://www.google.com/maps?q=${b.coordinates.lat},${b.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#c5a059] hover:underline"
                        >
                          Map
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#08201a]/95 border border-[#c5a059]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#fdfbf7] mb-2">
                Send Us a Direct Message
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mb-8">
                Fill in the form below and our Kabul guest relations management will reply promptly.
              </p>

              {isSubmitted ? (
                <div className="text-center py-12 bg-[#0c342b]/60 rounded-2xl border border-[#c5a059]/50 animate-fadeIn">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-serif-title text-xl font-bold text-white mb-2">
                    {t.messageSent}
                  </h4>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto">
                    We appreciate you reaching out to Bukhara Restaurant Kabul. A representative will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                        {t.yourName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ahmad Wali"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white/10 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                        Phone or Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={phoneOrEmail}
                        onChange={(e) => setPhoneOrEmail(e.target.value)}
                        placeholder="+93 78 123 4567 or email"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white/10 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                        Preferred Branch
                      </label>
                      <select
                        value={branchPreference}
                        onChange={(e) => setBranchPreference(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c342b] border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-[#c5a059]"
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {language === 'fa' ? b.nameFa : language === 'ps' ? b.namePs : b.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                        {t.subject}
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Banquet, feedback, catering..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white/10 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                      {t.message} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message, inquiries, or special dining requests here..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-[#c5a059] focus:bg-white/10 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#c5a059] text-[#0c342b] hover:bg-[#e5c578] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.sendMessage}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
