import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SpecialOffer, Testimonial } from '../../types';
import {
  Tag,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Star,
  Sparkles,
  Calendar,
  DollarSign,
  Check,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminOffersReviewsCMS: React.FC = () => {
  const {
    specialOffers,
    testimonials,
    addSpecialOffer,
    updateSpecialOffer,
    deleteSpecialOffer,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    showToast,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'reviews'>('offers');

  // Offer modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);

  // Offer form state
  const [offerTitleEn, setOfferTitleEn] = useState('');
  const [offerTitleFa, setOfferTitleFa] = useState('');
  const [offerTitlePs, setOfferTitlePs] = useState('');
  const [offerDescEn, setOfferDescEn] = useState('');
  const [offerDescFa, setOfferDescFa] = useState('');
  const [offerDescPs, setOfferDescPs] = useState('');
  const [offerImage, setOfferImage] = useState('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [validUntilEn, setValidUntilEn] = useState('Valid 24/7');
  const [validUntilFa, setValidUntilFa] = useState('معتبر در تمام اوقات');
  const [validUntilPs, setValidUntilPs] = useState('ټول وخت د اعتبار وړ');
  const [promoCode, setPromoCode] = useState('BUKHARA20');
  const [originalPrice, setOriginalPrice] = useState(1500);
  const [discountedPrice, setDiscountedPrice] = useState(1200);

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Testimonial | null>(null);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewCityEn, setReviewCityEn] = useState('Kabul, Afghanistan');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewEn, setReviewEn] = useState('');
  const [reviewFa, setReviewFa] = useState('');
  const [reviewPs, setReviewPs] = useState('');
  const [reviewSource, setReviewSource] = useState<'Google' | 'TripAdvisor' | 'Website'>('Google');

  // Deletions
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Handlers for Offers
  const handleOpenNewOffer = () => {
    setEditingOffer(null);
    setOfferTitleEn('');
    setOfferTitleFa('');
    setOfferTitlePs('');
    setOfferDescEn('');
    setOfferDescFa('');
    setOfferDescPs('');
    setOfferImage('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80');
    setDiscountPercent(20);
    setValidUntilEn('Valid 24/7');
    setValidUntilFa('معتبر ۲۴ ساعته');
    setValidUntilPs('۲۴ ساعته باوري');
    setPromoCode('BUKHARA20');
    setOriginalPrice(1500);
    setDiscountedPrice(1200);
    setIsOfferModalOpen(true);
  };

  const handleOpenEditOffer = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setOfferTitleEn(offer.titleEn);
    setOfferTitleFa(offer.titleFa);
    setOfferTitlePs(offer.titlePs);
    setOfferDescEn(offer.descriptionEn);
    setOfferDescFa(offer.descriptionFa);
    setOfferDescPs(offer.descriptionPs);
    setOfferImage(offer.image);
    setDiscountPercent(offer.discountPercent || Math.round((1 - (offer.discountedPrice / offer.originalPrice)) * 100) || 20);
    setValidUntilEn(offer.validUntilEn || offer.validDatesEn || 'Valid 24/7');
    setValidUntilFa(offer.validUntilFa || offer.validDatesFa || 'معتبر در تمام اوقات');
    setValidUntilPs(offer.validUntilPs || offer.validDatesPs || 'ټول وخت د اعتبار وړ');
    setPromoCode(offer.promoCode || 'BUKHARA20');
    setOriginalPrice(offer.originalPrice);
    setDiscountedPrice(offer.discountedPrice);
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitleEn.trim()) {
      showToast('Please provide an English offer title', 'error');
      return;
    }

    const slug = offerTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingOffer) {
      const updated: SpecialOffer = {
        ...editingOffer,
        titleEn: offerTitleEn,
        titleFa: offerTitleFa || offerTitleEn,
        titlePs: offerTitlePs || offerTitleEn,
        descriptionEn: offerDescEn,
        descriptionFa: offerDescFa || offerDescEn,
        descriptionPs: offerDescPs || offerDescEn,
        image: offerImage,
        discountPercent: Number(discountPercent),
        validUntilEn,
        validUntilFa: validUntilFa || validUntilEn,
        validUntilPs: validUntilPs || validUntilEn,
        validDatesEn: validUntilEn,
        validDatesFa: validUntilFa || validUntilEn,
        validDatesPs: validUntilPs || validUntilEn,
        promoCode,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        badgeEn: `${discountPercent}% OFF`,
        badgeFa: `تخفیف %${discountPercent}`,
        badgePs: `%${discountPercent} تخفیف`,
      };
      updateSpecialOffer(updated);
    } else {
      const newOffer: SpecialOffer = {
        id: `offer-${Date.now()}`,
        slug: slug || `offer-${Date.now()}`,
        titleEn: offerTitleEn,
        titleFa: offerTitleFa || offerTitleEn,
        titlePs: offerTitlePs || offerTitleEn,
        descriptionEn: offerDescEn,
        descriptionFa: offerDescFa || offerDescEn,
        descriptionPs: offerDescPs || offerDescEn,
        image: offerImage,
        discountPercent: Number(discountPercent),
        validUntilEn,
        validUntilFa: validUntilFa || validUntilEn,
        validUntilPs: validUntilPs || validUntilEn,
        validDatesEn: validUntilEn,
        validDatesFa: validUntilFa || validUntilEn,
        validDatesPs: validUntilPs || validUntilEn,
        promoCode,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        termsEn: 'Dine-in and Online Delivery. Cannot be combined with other promotions.',
        termsFa: 'قابل استفاده در سالون و تحویل آنلاین.',
        termsPs: 'په سالون او انلاین تحویل کې د کارونې وړ.',
        badgeEn: `${discountPercent}% OFF`,
        badgeFa: `تخفیف %${discountPercent}`,
        badgePs: `%${discountPercent} تخفیف`,
      };
      addSpecialOffer(newOffer);
    }

    setIsOfferModalOpen(false);
  };

  // Handlers for Reviews
  const handleOpenNewReview = () => {
    setEditingReview(null);
    setReviewName('');
    setReviewCityEn('Kabul, Afghanistan');
    setReviewRating(5);
    setReviewEn('');
    setReviewFa('');
    setReviewPs('');
    setReviewSource('Google');
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (r: Testimonial) => {
    setEditingReview(r);
    setReviewName(r.name);
    setReviewCityEn(r.cityEn);
    setReviewRating(r.rating);
    setReviewEn(r.reviewEn);
    setReviewFa(r.reviewFa);
    setReviewPs(r.reviewPs);
    setReviewSource(r.source);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewEn.trim()) {
      showToast('Please provide a reviewer name and review text', 'error');
      return;
    }

    if (editingReview) {
      const updated: Testimonial = {
        ...editingReview,
        name: reviewName,
        cityEn: reviewCityEn,
        cityFa: reviewCityEn,
        cityPs: reviewCityEn,
        rating: Number(reviewRating),
        reviewEn,
        reviewFa: reviewFa || reviewEn,
        reviewPs: reviewPs || reviewEn,
        source: reviewSource,
      };
      updateTestimonial(updated);
    } else {
      const newReview: Testimonial = {
        id: `review-${Date.now()}`,
        name: reviewName,
        cityEn: reviewCityEn,
        cityFa: reviewCityEn,
        cityPs: reviewCityEn,
        rating: Number(reviewRating),
        reviewEn,
        reviewFa: reviewFa || reviewEn,
        reviewPs: reviewPs || reviewEn,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        source: reviewSource,
      };
      addTestimonial(newReview);
    }

    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs Toggle */}
      <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 w-fit">
        <button
          onClick={() => setActiveSubTab('offers')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'offers'
              ? 'bg-[#0c342b] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Tag className="w-4 h-4 text-[#c5a059]" />
          <span>Special Offers &amp; Deals ({specialOffers.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'reviews'
              ? 'bg-[#0c342b] text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#c5a059]" />
          <span>Customer Testimonials ({testimonials.length})</span>
        </button>
      </div>

      {/* OFFERS SECTION */}
      {activeSubTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-stone-900">
                Special Offers &amp; Promotional Deals CMS
              </h3>
              <p className="text-xs text-stone-500">
                Control discount banners, promo codes, discounted prices, and validity badges displayed on the website.
              </p>
            </div>

            <button
              onClick={handleOpenNewOffer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Special Offer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img src={offer.image} alt={offer.titleEn} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold tracking-wider">
                      {offer.discountPercent}% OFF
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#c5a059] font-mono text-xs font-bold">
                      {offer.promoCode}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-serif-title text-base font-bold text-stone-900">
                      {offer.titleEn}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2">{offer.descriptionEn}</p>

                    <div className="pt-2 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="line-through text-stone-400 mr-2">
                          {offer.originalPrice} AFN
                        </span>
                        <span className="font-bold text-sm text-[#0c342b]">
                          {offer.discountedPrice} AFN
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500">{offer.validUntilEn}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenEditOffer(offer)}
                    className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingOfferId(offer.id)}
                    className="p-2 rounded-xl bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 transition-colors border border-stone-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS SECTION */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-title text-xl font-bold text-stone-900">
                Customer Testimonials &amp; Verified Reviews CMS
              </h3>
              <p className="text-xs text-stone-500">
                Manage guest testimonials, star ratings, and review sources (Google, TripAdvisor, Website).
              </p>
            </div>

            <button
              onClick={handleOpenNewReview}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold">
                      {r.source}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "{r.reviewEn}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h5 className="font-serif-title text-xs font-bold text-stone-900">{r.name}</h5>
                    <span className="text-[10px] text-stone-400">{r.cityEn}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditReview(r)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingReviewId(r.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-600 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-base font-bold">
                  {editingOffer ? 'Edit Special Offer' : 'Create Special Offer'}
                </h3>
              </div>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Offer Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={offerTitleEn}
                  onChange={(e) => setOfferTitleEn(e.target.value)}
                  placeholder="e.g. Royal Weekend Family Platter"
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Original Price (AFN)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Discounted Price (AFN)
                  </label>
                  <input
                    type="number"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={offerImage}
                  onChange={(e) => setOfferImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={offerDescEn}
                  onChange={(e) => setOfferDescEn(e.target.value)}
                  placeholder="Offer details and inclusions..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300">
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-base font-bold">
                  {editingReview ? 'Edit Testimonial' : 'Add Guest Review'}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Ahmad Tariq"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Source
                  </label>
                  <select
                    value={reviewSource}
                    onChange={(e) => setReviewSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Google">Google Review</option>
                    <option value="TripAdvisor">TripAdvisor</option>
                    <option value="Website">Website Direct</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Review Text (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewEn}
                  onChange={(e) => setReviewEn(e.target.value)}
                  placeholder="Customer's impressions of the food and service..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Offer Confirm */}
      {deletingOfferId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-base font-bold text-stone-900 mb-1">Delete Offer?</h4>
            <p className="text-xs text-stone-500 mb-6">Are you sure you want to remove this promotion?</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingOfferId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSpecialOffer(deletingOfferId);
                  setDeletingOfferId(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirm */}
      {deletingReviewId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-base font-bold text-stone-900 mb-1">Delete Review?</h4>
            <p className="text-xs text-stone-500 mb-6">Are you sure you want to remove this testimonial?</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingReviewId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTestimonial(deletingReviewId);
                  setDeletingReviewId(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
