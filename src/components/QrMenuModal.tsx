import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, QrCode, Download, Copy, Check, Printer } from 'lucide-react';

export const QrMenuModal: React.FC = () => {
  const {
    isQrMenuOpen,
    setIsQrMenuOpen,
    branches,
    activeBranchId,
    t,
    setIsPrintMenuOpen,
  } = useStore();

  const [tableNumber, setTableNumber] = useState<string>('01');
  const [copied, setCopied] = useState(false);

  if (!isQrMenuOpen) return null;

  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const menuUrl = `${window.location.origin}/#menu?table=${tableNumber}&branch=${currentBranch.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPrint = () => {
    setIsQrMenuOpen(false);
    setIsPrintMenuOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/40 my-8 text-center">
        {/* Header */}
        <div className="p-5 bg-[#0c342b] text-[#fdfbf7] flex items-center justify-between border-b border-[#c5a059]/30">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-serif-title text-xl font-bold">{t.qrMenu}</h3>
          </div>
          <button
            onClick={() => setIsQrMenuOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs text-stone-600">
            Scan with your mobile camera at Bukhara Restaurant to browse our interactive digital menu, customize Afghan delicacies, and order directly to your dining table.
          </p>

          {/* Table Number Selector */}
          <div className="inline-flex items-center gap-2 bg-[#faf8f5] px-4 py-2 rounded-xl border border-[#e8e2d9] text-xs">
            <span className="font-semibold text-stone-700">Table Number:</span>
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2 py-1 font-bold text-[#0c342b] focus:outline-none"
            >
              {[...Array(30)].map((_, i) => {
                const num = (i + 1).toString().padStart(2, '0');
                return (
                  <option key={num} value={num}>
                    Table {num}
                  </option>
                );
              })}
            </select>
          </div>

          {/* QR Code Graphic Card */}
          <div className="bg-[#0c342b] p-6 rounded-2xl border-2 border-[#c5a059] shadow-inner max-w-[240px] mx-auto text-white flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] mb-3">
              Bukhara Restaurant
            </span>

            {/* Generated SVG QR Code representation */}
            <div className="bg-white p-3 rounded-xl shadow-md">
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 fill-[#0c342b]"
                shapeRendering="crispEdges"
              >
                {/* Outer corners */}
                <rect x="0" y="0" width="28" height="28" fill="#0c342b" />
                <rect x="4" y="4" width="20" height="20" fill="white" />
                <rect x="8" y="8" width="12" height="12" fill="#0c342b" />

                <rect x="72" y="0" width="28" height="28" fill="#0c342b" />
                <rect x="76" y="4" width="20" height="20" fill="white" />
                <rect x="80" y="8" width="12" height="12" fill="#0c342b" />

                <rect x="0" y="72" width="28" height="28" fill="#0c342b" />
                <rect x="4" y="76" width="20" height="20" fill="white" />
                <rect x="8" y="80" width="12" height="12" fill="#0c342b" />

                {/* Simulated QR matrix patterns */}
                <rect x="36" y="8" width="8" height="8" />
                <rect x="48" y="16" width="12" height="8" />
                <rect x="8" y="36" width="12" height="8" />
                <rect x="24" y="44" width="8" height="8" />
                <rect x="36" y="36" width="16" height="16" fill="#c5a059" />
                <rect x="56" y="40" width="12" height="12" />
                <rect x="72" y="36" width="8" height="8" />
                <rect x="84" y="48" width="12" height="8" />
                <rect x="36" y="60" width="8" height="16" />
                <rect x="48" y="72" width="16" height="8" />
                <rect x="68" y="64" width="8" height="12" />
                <rect x="80" y="76" width="16" height="16" />
              </svg>
            </div>

            <span className="text-xs font-bold text-[#c5a059] mt-3">
              TABLE {tableNumber} • SCAN TO ORDER
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:border-[#c5a059] hover:text-[#0c342b] text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Direct Link Copied!' : 'Copy Table Menu Link'}</span>
            </button>

            <button
              onClick={handleOpenPrint}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printMenu}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
