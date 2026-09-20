import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BUKHARA_LOGO_URL } from '../types';
import {
  X,
  MessageSquare,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  Building2,
  Send,
} from 'lucide-react';

export const WhatsAppModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    branches,
    siteSettings,
    activeBranchId,
    showToast,
    language,
  } = useStore();

  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBranchId || branches[0]?.id || '');
  const [selectedTopic, setSelectedTopic] = useState<string>('order');
  const [copied, setCopied] = useState(false);

  if (!isWhatsAppModalOpen) return null;

  const currentBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const rawNumber = currentBranch?.whatsapp || siteSettings.mainWhatsapp;
  const cleanNumber = rawNumber.replace(/\D/g, '');

  const topics = [
    { id: 'order', labelEn: 'Express Food Delivery', labelFa: 'سفارش آنلاین و ارسال غذا', labelPs: 'د خوړو رسول', msg: 'Hello Bukhara Restaurant Kabul, I would like to place an order for delivery/takeaway.' },
    { id: 'table', labelEn: 'Table & VIP Lounge Booking', labelFa: 'رزرو میز و سالون VIP', labelPs: 'د مېز او سالون ریزرو', msg: 'Hello Bukhara Restaurant, I would like to reserve a table/family lounge booth.' },
    { id: 'catering', labelEn: 'Wedding & Event Catering', labelFa: 'تشریفات و محافل عروسی', labelPs: 'د ودونو او مېلمستیاوو کیټرینګ', msg: 'Hello Bukhara Restaurant, I would like to inquire about catering services in Kabul.' },
    { id: 'general', labelEn: 'General Question', labelFa: 'پرسش و معلومات عمومی', labelPs: 'عمومي پوښتنې', msg: 'Hello Bukhara Restaurant, I have a quick question regarding your service.' },
  ];

  const activeTopicObj = topics.find((t) => t.id === selectedTopic) || topics[0];
  const messageText = activeTopicObj.msg;
  const encodedText = encodeURIComponent(messageText);

  const directApiUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
  const webWhatsAppUrl = `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    showToast(`WhatsApp number ${rawNumber} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenDirect = () => {
    window.open(directApiUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWeb = () => {
    window.open(webWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={() => setIsWhatsAppModalOpen(false)}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-500/30 my-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-[#0c342b] text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#c5a059] p-0.5 text-[#0c342b] flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0 overflow-hidden">
                <img
                  src={BUKHARA_LOGO_URL}
                  alt="Bukhara Restaurant"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#fdfbf7]">
                  WhatsApp Direct Chat
                </h3>
                <span className="text-xs text-emerald-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Bukhara Restaurant Kabul • Online 24/7
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
              aria-label="Close WhatsApp dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Branch Switcher */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Select Kabul Branch to Message</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {branches.map((b) => {
                const isSelected = b.id === selectedBranchId;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs font-semibold ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block truncate">{b.nameEn.split('–')[1]?.trim() || b.nameEn}</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{b.whatsapp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Pre-Set Message Topic */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>What would you like to inquire about?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    selectedTopic === t.id
                      ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {language === 'fa' ? t.labelFa : language === 'ps' ? t.labelPs : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Actions Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold text-stone-400 block">
                  Selected WhatsApp Number
                </span>
                <span className="text-base font-mono font-bold text-[#0c342b]">
                  {rawNumber}
                </span>
              </div>
              <button
                onClick={handleCopyNumber}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-[#0c342b] text-stone-700 text-xs font-medium shadow-sm transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copied ? 'Copied!' : 'Copy Number'}</span>
              </button>
            </div>

            {/* Launch Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleOpenDirect}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Open WhatsApp App</span>
              </button>

              <button
                onClick={handleOpenWeb}
                className="w-full py-3 px-4 rounded-xl bg-[#0c342b] hover:bg-[#164a3e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#c5a059]" />
                <span>WhatsApp Web</span>
              </button>
            </div>

            {/* Fallback Direct Phone Call */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Reply • 24 Hours Open</span>
              </span>
              <a
                href={`tel:${currentBranch.phone}`}
                className="font-bold text-[#0c342b] hover:text-[#c5a059] flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Call Directly Instead</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
