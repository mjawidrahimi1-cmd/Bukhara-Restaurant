import React, { useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Calendar, Clock, User, Sparkles, BookOpen } from 'lucide-react';

export const BlogPostModal: React.FC = () => {
  const { selectedBlogPost, setSelectedBlogPost, language } = useStore();

  const handleClose = useCallback(() => {
    setSelectedBlogPost(null);
  }, [setSelectedBlogPost]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!selectedBlogPost) return null;

  const title =
    language === 'fa'
      ? selectedBlogPost.titleFa
      : language === 'ps'
      ? selectedBlogPost.titlePs
      : selectedBlogPost.titleEn;

  const category =
    language === 'fa'
      ? selectedBlogPost.categoryFa
      : language === 'ps'
      ? selectedBlogPost.categoryPs
      : selectedBlogPost.categoryEn;

  const contentParagraphs =
    language === 'fa'
      ? selectedBlogPost.contentFa
      : language === 'ps'
      ? selectedBlogPost.contentPs
      : selectedBlogPost.contentEn;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/40 my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Photo */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={selectedBlogPost.image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c342b] via-[#0c342b]/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Close article"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Hero */}
          <div className="absolute bottom-6 inset-x-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059] text-[#0c342b] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{category}</span>
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white leading-tight">
              {title}
            </h2>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div className="px-6 sm:px-8 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{selectedBlogPost.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>{selectedBlogPost.date}</span>
            </span>
          </div>

          <span className="flex items-center gap-1.5 font-semibold text-[#0c342b]">
            <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{selectedBlogPost.readTime}</span>
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
          {contentParagraphs.map((p, idx) => (
            <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-[#0c342b]">
              {p}
            </p>
          ))}

          {/* Bukhara Note */}
          <div className="mt-8 p-5 rounded-2xl bg-[#0c342b]/5 border border-[#c5a059]/30 flex items-start gap-3 text-xs text-stone-600">
            <BookOpen className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#0c342b] text-sm mb-1">
                Experience This at Bukhara Restaurant Kabul
              </h4>
              <p>
                Our chefs prepare each traditional recipe daily across our Kabul branches. Visit us in Qowai Markaz, Karte 4, or Wazir Akbar Khan or order hot delivery 24 hours a day.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
};
