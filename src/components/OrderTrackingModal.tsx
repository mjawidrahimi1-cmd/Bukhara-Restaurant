import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Truck,
  Check,
  XCircle,
  Phone,
  MessageSquare,
  Search,
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; labelKey: string; icon: any }[] = [
  { status: 'received', labelKey: 'statusReceived', icon: Clock },
  { status: 'confirmed', labelKey: 'statusConfirmed', icon: CheckCircle2 },
  { status: 'preparing', labelKey: 'statusPreparing', icon: ChefHat },
  { status: 'ready', labelKey: 'statusReady', icon: PackageCheck },
  { status: 'out_for_delivery', labelKey: 'statusOutForDelivery', icon: Truck },
  { status: 'completed', labelKey: 'statusCompleted', icon: Check },
];

export const OrderTrackingModal: React.FC = () => {
  const {
    trackingOrderId,
    setTrackingOrderId,
    orders,
    t,
    branches,
  } = useStore();

  const [searchCode, setSearchCode] = useState('');

  if (!trackingOrderId) return null;

  const currentOrder = orders.find((o) => o.id === trackingOrderId);
  const branch = branches.find((b) => b.id === currentOrder?.branchId) || branches[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find((o) => o.id.toLowerCase() === searchCode.trim().toLowerCase());
    if (found) {
      setTrackingOrderId(found.id);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c5a059]/30 my-8">
        {/* Header */}
        <div className="p-6 bg-[#0c342b] text-[#fdfbf7] flex items-center justify-between border-b border-[#c5a059]/30">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold">
              Live Order Tracker
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold">
              {currentOrder ? currentOrder.id : 'Track Your Order'}
            </h3>
          </div>
          <button
            onClick={() => setTrackingOrderId(null)}
            className="p-1 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick Lookup Search Bar */}
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Search order code (e.g. BK-2026-000104)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase transition-colors"
            >
              Lookup
            </button>
          </form>

          {!currentOrder ? (
            <div className="text-center py-10">
              <p className="text-stone-500 text-sm">No order found with code "{trackingOrderId}".</p>
            </div>
          ) : (
            <>
              {/* Order Status Visual Stepper */}
              {currentOrder.status === 'cancelled' ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
                  <XCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{t.statusCancelled}</h4>
                    <p className="text-xs text-red-600">Please contact the branch for support or re-ordering.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative mb-6">
                    {/* Progress Bar Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-[#c5a059] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />

                    {/* Step Nodes */}
                    <div className="relative z-10 flex justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.status} className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isCurrent
                                  ? 'bg-[#0c342b] text-[#c5a059] border-2 border-[#c5a059] ring-4 ring-[#c5a059]/20 scale-110 shadow-md'
                                  : isDone
                                  ? 'bg-[#c5a059] text-[#0c342b]'
                                  : 'bg-stone-200 text-stone-400'
                              }`}
                            >
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[10px] mt-2 text-center max-w-[65px] font-medium leading-tight ${
                                isCurrent
                                  ? 'text-[#0c342b] font-bold'
                                  : isDone
                                  ? 'text-stone-800'
                                  : 'text-stone-400'
                              }`}
                            >
                              {(t as any)[step.labelKey]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8e2d9] text-center text-xs text-stone-600 font-medium">
                    {t.estimatedTime}
                  </div>
                </div>
              )}

              {/* Order Details & Summary */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Customer:</span>
                  <span className="font-semibold text-stone-800">{currentOrder.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Order Type:</span>
                  <span className="font-semibold text-stone-800 uppercase">{currentOrder.orderType}</span>
                </div>
                {currentOrder.address && (
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-stone-500">Delivery Address:</span>
                    <span className="font-semibold text-stone-800 text-right max-w-[220px]">
                      {currentOrder.address} ({currentOrder.district})
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div className="pt-2">
                  <span className="text-stone-500 block mb-2 font-semibold">Ordered Dishes:</span>
                  <div className="space-y-1.5">
                    {currentOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-700">
                        <span>
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-semibold">
                          {(it.price * it.quantity).toLocaleString()} {t.afn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-stone-300 font-bold text-sm text-[#0c342b]">
                  <span>Total Amount:</span>
                  <span>{currentOrder.total.toLocaleString()} {t.afn}</span>
                </div>
              </div>

              {/* Branch Contact Quick Buttons */}
              <div className="p-4 bg-[#0c342b] text-[#fdfbf7] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-[#c5a059] font-bold block">
                    {branch.nameEn}
                  </span>
                  <span className="text-xs text-stone-300">Need updates or delivery changes?</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${branch.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${branch.whatsapp.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
