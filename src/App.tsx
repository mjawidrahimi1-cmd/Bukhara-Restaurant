import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InfoBar } from './components/InfoBar';
import { SignatureExperience } from './components/SignatureExperience';
import { SignatureDishes } from './components/SignatureDishes';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { BranchesSection } from './components/BranchesSection';
import { OffersSection } from './components/OffersSection';
import { CateringSection } from './components/CateringSection';
import { GallerySection } from './components/GallerySection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

// Modals and Drawers
import { FoodDetailModal } from './components/FoodDetailModal';
import { OrderDrawer } from './components/OrderDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ReservationModal } from './components/ReservationModal';
import { BranchDetailModal } from './components/BranchDetailModal';
import { GalleryLightboxModal } from './components/GalleryLightboxModal';
import { BlogPostModal } from './components/BlogPostModal';
import { PrintMenuModal } from './components/PrintMenuModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { AdminPanel } from './components/AdminPanel';
import { ToastContainer } from './components/ToastContainer';

// Icons
import { MessageSquare, Calendar, ShoppingBag, Clock } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    isRTL,
    branches,
    activeBranchId,
    setIsReservationOpen,
    setIsCartOpen,
    cartCount,
    openWhatsApp,
    t,
  } = useStore();

  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  return (
    <div className={`min-h-screen bg-[#faf8f5] text-[#1c140e] flex flex-col ${isRTL ? 'font-vazirmatn' : 'font-sans'}`}>
      {/* Navigation Header */}
      <Header />

      {/* Main Page Layout Sections */}
      <main className="flex-1">
        {/* 1. Cinematic Hero Section */}
        <Hero />

        {/* 2. Dynamic Info Bar with Kabul Branches & 24h Indicator */}
        <InfoBar />

        {/* 3. 4 Signature Experience Pillars */}
        <SignatureExperience />

        {/* 4. Signature Dishes (Kabuli Pulao, Afghan Kebabs, Mantu, etc.) */}
        <SignatureDishes />

        {/* 5. Complete Digital Menu with Categories, Dietary Filters & Search */}
        <MenuSection />

        {/* 6. The Story of Bukhara & Afghan Culinary Heritage */}
        <AboutSection />

        {/* 7. Special Offers & Promos */}
        <OffersSection />

        {/* 8. Events, Private Dining & Banquets */}
        <CateringSection />

        {/* 9. Photo Gallery & Dining Moments */}
        <GallerySection />

        {/* 10. Diners Verified Reviews */}
        <ReviewsSection />

        {/* 11. Culinary Stories & Heritage Blog */}
        <BlogSection />

        {/* 12. Kabul Multi-Branch Locations & Google Maps (OUR KABUL LOCATIONS) */}
        <BranchesSection />

        {/* 13. Contact, Inquiries & Branch Details (CONNECT WITH BUKHARA) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons for Quick Access */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex flex-col gap-3 items-end`}>
        {/* Direct WhatsApp Chat Trigger */}
        <button
          onClick={() => openWhatsApp(currentBranch.whatsapp)}
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/40 flex items-center justify-center p-3.5 hover:scale-110 transition-all cursor-pointer group"
          title="Direct WhatsApp with Kabul Branch"
          aria-label="Direct WhatsApp chat"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
          <span className="sr-only">Chat on WhatsApp</span>
        </button>

        {/* Quick Cart Floating Button */}
        {cartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#0c342b] hover:bg-[#c5a059] text-[#fdfbf7] hover:text-[#0c342b] shadow-xl shadow-black/30 text-xs font-bold uppercase tracking-wider transition-all animate-bounce"
            aria-label="Open order cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
            <span>
              {t.cart} ({cartCount})
            </span>
          </button>
        )}
      </div>

      {/* Interactive Overlays, Modals & Drawers */}
      <FoodDetailModal />
      <OrderDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <ReservationModal />
      <BranchDetailModal />
      <GalleryLightboxModal />
      <BlogPostModal />
      <PrintMenuModal />
      <WhatsAppModal />
      <AdminPanel />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
