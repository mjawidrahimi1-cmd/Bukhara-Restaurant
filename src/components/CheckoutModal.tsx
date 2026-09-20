import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderType, PaymentMethod } from '../types';
import {
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react';

const KABUL_DISTRICTS = [
  'District 4 (Qowai Markaz, Kolola Pushta, Shahr-e-Ara)',
  'District 3 (Karte 4, Dehbori, Jamal Mina)',
  'District 10 (Shahr-e-Naw, Wazir Akbar Khan, Qala-e-Fatullah)',
  'District 2 (Deh Afghanan, Murad Khani, Andarabi)',
  'District 9 (Mikrorayan 1, 2, 3, 4, Macrorayan Kohna)',
  'District 15 (Khair Khana, Hesa-e-Awal, Panjsad Family)',
  'District 6 (Darulaman, Karte Seh, Sanatorium)',
  'District 7 (Chihil Sutun, Guzargah)',
  'District 8 (Karte Naw, Shah Shaheed)',
  'District 11 (Khair Khana Qala-e-Najarha)',
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    placeOrder,
    t,
    branches,
    activeBranchId,
  } = useStore();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBranchId);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState(KABUL_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const currentDeliveryFee = orderType === 'delivery' ? cartDeliveryFee : 0;
  const finalTotal = cartSubtotal - cartDiscount + currentDeliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMsg('Please enter a valid telephone contact.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setErrorMsg('Please enter your delivery street address in Kabul.');
      return;
    }

    setErrorMsg('');

    placeOrder({
      customerName: fullName,
      phone,
      email: email || undefined,
      address: orderType === 'delivery' ? address : undefined,
      district: orderType === 'delivery' ? district : undefined,
      deliveryInstructions: deliveryInstructions || undefined,
      orderType,
      paymentMethod,
      branchId: selectedBranchId,
    });

    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 my-8">
        {/* Header */}
        <div className="p-6 bg-[#0c342b] text-[#fdfbf7] flex items-center justify-between border-b border-[#c5a059]/30">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold">
              Bukhara Kabul
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold">
              {t.checkout}
            </h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Dining Preference (Order Type) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
              1. {t.orderType}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                  orderType === 'delivery'
                    ? 'border-[#0c342b] bg-[#0c342b]/5 text-[#0c342b] font-bold shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Truck className="w-5 h-5 mb-1.5 text-[#c5a059]" />
                <span className="text-xs">{t.delivery}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                  orderType === 'takeaway'
                    ? 'border-[#0c342b] bg-[#0c342b]/5 text-[#0c342b] font-bold shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <ShoppingBag className="w-5 h-5 mb-1.5 text-[#c5a059]" />
                <span className="text-xs">{t.takeaway}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                  orderType === 'dine-in'
                    ? 'border-[#0c342b] bg-[#0c342b]/5 text-[#0c342b] font-bold shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5 mb-1.5 text-[#c5a059]" />
                <span className="text-xs">{t.dineIn}</span>
              </button>
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
              Preparing Branch
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 bg-stone-50 focus:outline-none focus:border-[#c5a059]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nameEn} ({b.addressEn.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Customer Information */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              2. {t.customerInfo}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-stone-500 block mb-1">{t.fullName} *</span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="E.g., Ahmad Jawid Rahimi"
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

            <div>
              <span className="text-[11px] text-stone-500 block mb-1">{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.af"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* 3. Delivery Details (If delivery selected) */}
          {orderType === 'delivery' && (
            <div className="space-y-3 bg-[#faf8f5] p-4 rounded-2xl border border-[#e8e2d9]">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                3. Kabul Delivery Address
              </label>

              <div>
                <span className="text-[11px] text-stone-500 block mb-1">{t.selectDistrict}</span>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 bg-white focus:outline-none focus:border-[#c5a059]"
                >
                  {KABUL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block mb-1">{t.deliveryAddress} *</span>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, lane number, house or plaza number"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block mb-1">{t.deliveryNotes}</span>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Near mosque, beside grocery store, gate code..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
              4. {t.paymentMethod}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#0c342b] bg-[#0c342b]/5 text-[#0c342b] font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Banknote className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span className="text-xs">{t.cashOnDelivery}</span>
              </label>

              <label
                onClick={() => setPaymentMethod('pos')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'pos'
                    ? 'border-[#0c342b] bg-[#0c342b]/5 text-[#0c342b] font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span className="text-xs">{t.cardPOS}</span>
              </label>

              <label
                onClick={() => setPaymentMethod('hesabpay')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'hesabpay'
                    ? 'border-[#0c342b] bg-[#0c342b]/5 text-[#0c342b] font-bold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span className="text-xs">{t.hesabPay}</span>
              </label>
            </div>
          </div>

          {/* Summary & Submit */}
          <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#e8e2d9] space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{t.subtotal} ({cart.length} items)</span>
              <span className="font-semibold">{cartSubtotal.toLocaleString()} {t.afn}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>{t.discount}</span>
                <span className="font-semibold">-{cartDiscount.toLocaleString()} {t.afn}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>{t.deliveryFee}</span>
              <span className="font-semibold">
                {currentDeliveryFee === 0 ? t.freeDelivery : `${currentDeliveryFee} ${t.afn}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-300 text-sm font-bold text-[#0c342b]">
              <span>{t.total}</span>
              <span className="text-base">{finalTotal.toLocaleString()} {t.afn}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-sm tracking-wider uppercase transition-all shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
            <span>{t.placeOrder} • {finalTotal.toLocaleString()} {t.afn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
