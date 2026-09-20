import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

export const OrderDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    promoCode,
    applyPromoCode,
    t,
    isRTL,
  } = useStore();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyPromoCode(inputCode);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div
        className={`absolute inset-y-0 ${
          isRTL ? 'left-0' : 'right-0'
        } max-w-md w-full bg-white shadow-2xl flex flex-col z-10`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e8e2d9] bg-[#0c342b] text-[#fdfbf7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-serif-title text-xl font-bold">{t.cart}</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif-title text-lg font-bold text-stone-800 mb-1">
                {t.emptyCart}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                {t.emptyCartDesc}
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  const el = document.querySelector('#menu');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-full bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {t.exploreMenu}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8e2d9] relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h5 className="font-semibold text-xs sm:text-sm text-stone-800 truncate">
                        {item.name}
                      </h5>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-500 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Addons */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-[11px] text-[#c5a059] line-clamp-1 mb-1 font-medium">
                        + {item.selectedAddons.map((a) => a.nameEn).join(', ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-stone-500 italic line-clamp-1 mb-1">
                        Note: {item.specialInstructions}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-stone-200">
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 px-2 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="text-stone-500 hover:text-stone-800 p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="text-stone-500 hover:text-stone-800 p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#0c342b]">
                        {(item.price * item.quantity).toLocaleString()} {t.afn}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-right">
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-red-500 underline"
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Totals */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#e8e2d9] bg-[#faf8f5]">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCode} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Promo (BUKHARA10)"
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs uppercase focus:border-[#c5a059] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#0c342b] text-[#fdfbf7] hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Apply
              </button>
            </form>

            {promoCode && (
              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-3 flex items-center justify-between">
                <span>Code "{promoCode}" applied!</span>
                <span className="font-bold">-{cartDiscount} {t.afn}</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 mb-4">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold">{cartSubtotal.toLocaleString()} {t.afn}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t.discount}</span>
                  <span className="font-semibold">-{cartDiscount.toLocaleString()} {t.afn}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.deliveryFee}</span>
                <span className="font-semibold">
                  {cartDeliveryFee === 0 ? t.freeDelivery : `${cartDeliveryFee} ${t.afn}`}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-stone-300 text-sm font-bold text-[#0c342b]">
                <span>{t.total}</span>
                <span className="text-base">{cartTotal.toLocaleString()} {t.afn}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
