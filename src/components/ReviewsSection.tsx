import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Testimonial } from '../types';
import { Star, MessageSquarePlus, CheckCircle2, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { testimonials: initialTestimonials, language, t } = useStore();
  const [userReviews, setUserReviews] = useState<Testimonial[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Kabul');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const allReviews = [...userReviews, ...initialTestimonials];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newTestimonial: Testimonial = {
      id: `rev-${Date.now()}`,
      name,
      cityEn: city,
      cityFa: city,
      cityPs: city,
      rating,
      reviewEn: comment,
      reviewFa: comment,
      reviewPs: comment,
      date: 'Recent',
      source: 'Website',
    };

    setUserReviews((prev) => [newTestimonial, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddReview(false);
      setName('');
      setComment('');
    }, 2000);
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#faf8f5] relative border-t border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#c5a059] uppercase block mb-2">
            {t.testimonialsTitle}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#0c342b]">
            {t.testimonialsSubtitle}
          </h2>

          {/* Rating Summary Bar */}
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-[#c5a059]/40 shadow-sm mt-6">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#0c342b]">4.9 / 5.0</span>
            <span className="text-xs text-stone-500">• {t.googleRatingText}</span>
          </div>
        </div>

        {/* Action Button: Leave a Review */}
        <div className="text-center mb-10">
          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Interactive Add Review Form */}
        {showAddReview && (
          <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#c5a059]/40 shadow-xl mb-12 animate-fadeIn">
            {submitted ? (
              <div className="text-center py-6 text-emerald-700">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
                <h4 className="font-serif-title font-bold text-lg">Thank You for Your Review!</h4>
                <p className="text-xs text-stone-500">Your feedback has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif-title text-xl font-bold text-[#0c342b]">
                  Share Your Dining Experience
                </h3>

                {/* Rating Stars Selection */}
                <div>
                  <span className="text-xs text-stone-500 block mb-1">Your Rating</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ahmad Shah"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Location / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Wazir Akbar Khan, Kabul"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-500 block mb-1">Your Thoughts on Food & Service</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the Kabuli Pulao, mutton chops, hospitality..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allReviews.map((item: Testimonial) => {
            const commentText =
              language === 'fa'
                ? item.reviewFa
                : language === 'ps'
                ? item.reviewPs
                : item.reviewEn;
            const cityText =
              language === 'fa'
                ? item.cityFa
                : language === 'ps'
                ? item.cityPs
                : item.cityEn;

            return (
              <div
                key={item.id}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e8e2d9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#c5a059]/30" />
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-[#443831] leading-relaxed italic mb-6">
                    "{commentText}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#f0eae1] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-[#0c342b]">
                      {item.name}
                    </h5>
                    <span className="text-[11px] text-stone-500">{cityText} • {item.source}</span>
                  </div>

                  <span className="text-[10px] text-stone-400 font-mono">
                    {item.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
