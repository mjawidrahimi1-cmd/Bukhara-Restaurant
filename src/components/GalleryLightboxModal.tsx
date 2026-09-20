import React, { useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const GalleryLightboxModal: React.FC = () => {
  const { selectedGalleryImage, setSelectedGalleryImage, gallery, language } = useStore();

  const handleClose = useCallback(() => {
    setSelectedGalleryImage(null);
  }, [setSelectedGalleryImage]);

  const handleNext = useCallback(() => {
    if (!selectedGalleryImage) return;
    const currentIndex = gallery.findIndex((g) => g.id === selectedGalleryImage.id);
    const nextIndex = (currentIndex + 1) % gallery.length;
    setSelectedGalleryImage(gallery[nextIndex]);
  }, [selectedGalleryImage, gallery, setSelectedGalleryImage]);

  const handlePrev = useCallback(() => {
    if (!selectedGalleryImage) return;
    const currentIndex = gallery.findIndex((g) => g.id === selectedGalleryImage.id);
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setSelectedGalleryImage(gallery[prevIndex]);
  }, [selectedGalleryImage, gallery, setSelectedGalleryImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGalleryImage) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryImage, handleClose, handleNext, handlePrev]);

  if (!selectedGalleryImage) return null;

  const title =
    language === 'fa'
      ? selectedGalleryImage.titleFa
      : language === 'ps'
      ? selectedGalleryImage.titlePs
      : selectedGalleryImage.titleEn;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
    >
      {/* Top Header / Actions */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button
          onClick={handleClose}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close photo preview"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-[#c5a059] text-white hover:text-[#0c342b] flex items-center justify-center transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-[#c5a059] text-white hover:text-[#0c342b] flex items-center justify-center transition-all"
        aria-label="Next image"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Modal Content Container */}
      <div
        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedGalleryImage.image}
          alt={title}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
        />

        {/* Caption */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c5a059] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#0c342b] border border-[#c5a059]/40 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{selectedGalleryImage.category}</span>
          </span>
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#fdfbf7]">
            {title}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Bukhara Restaurant Kabul Visual Chronicles
          </p>
        </div>
      </div>
    </div>
  );
};
