import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  MenuItem,
  MenuCategory,
  Branch,
  SpecialOffer,
  GalleryItem,
  BlogPost,
  Testimonial,
  SiteSettings,
  CartItem,
  Order,
  Reservation,
  CateringInquiry,
  OrderStatus,
  ReservationStatus,
} from '../types';
import {
  initialCategories,
  initialMenuItems,
  initialBranches,
  initialOffers,
  initialGallery,
  initialBlogPosts,
  initialTestimonials,
  initialSiteSettings,
} from '../data/initialData';
import { translations } from '../translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: typeof translations['en'];

  // Data Collections
  menuItems: MenuItem[];
  categories: MenuCategory[];
  branches: Branch[];
  offers: SpecialOffer[];
  gallery: GalleryItem[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  siteSettings: SiteSettings;
  orders: Order[];
  reservations: Reservation[];
  cateringInquiries: CateringInquiry[];

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedVariantId?: string, selectedAddonIds?: string[], specialInstructions?: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;

  // Ordering & Reservations
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'items' | 'subtotal' | 'deliveryFee' | 'discount' | 'total'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  placeReservation: (resData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => Reservation;
  updateReservationStatus: (resId: string, status: ReservationStatus, adminNotes?: string) => void;
  submitCateringInquiry: (inquiryData: Omit<CateringInquiry, 'id' | 'createdAt' | 'status'>) => void;

  // CMS Updates for All Website Sections
  // 1. Menu & Categories
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  addCategory: (category: MenuCategory) => void;
  updateCategory: (category: MenuCategory) => void;
  deleteCategory: (categoryId: string) => void;

  // 2. Branches & Locations
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (branchId: string) => void;

  // 3. Blog Posts
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;

  // 4. Gallery Items
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (itemId: string) => void;

  // 5. Special Offers & Deals
  addOffer: (offer: SpecialOffer) => void;
  updateOffer: (offer: SpecialOffer) => void;
  deleteOffer: (offerId: string) => void;
  specialOffers: SpecialOffer[];
  addSpecialOffer: (offer: SpecialOffer) => void;
  updateSpecialOffer: (offer: SpecialOffer) => void;
  deleteSpecialOffer: (offerId: string) => void;

  // 6. Testimonials & Reviews
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (testimonial: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  // 7. Site Settings & Security
  updateSiteSettings: (settings: SiteSettings) => void;
  changeAdminPin: (currentPin: string, newPin: string) => { success: boolean; error?: string };
  changeManagerPin: (currentAdminPin: string, newManagerPin: string) => { success: boolean; error?: string };
  resetAllContentToDefault: () => void;
  restoreAllDataBackup: (backupData: any) => { success: boolean; message: string };

  // Modals & Navigation States
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  selectedBlogPost: BlogPost | null;
  setSelectedBlogPost: (post: BlogPost | null) => void;
  selectedGalleryImage: GalleryItem | null;
  setSelectedGalleryImage: (image: GalleryItem | null) => void;
  isQrMenuOpen: boolean;
  setIsQrMenuOpen: (open: boolean) => void;
  isPrintMenuOpen: boolean;
  setIsPrintMenuOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  openWhatsApp: (phone?: string, message?: string) => void;

  // Selected Branch Filter for Dining
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;

  // Toast System
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bukhara_lang');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'fa' || language === 'ps';
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bukhara_lang', lang);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);

    if (language === 'fa') {
      document.title = 'رستورانت بخارا کابل – غذای اصیل افغانی و پذیرایی سنتی';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'تجربه بهترین غذاهای اصیل افغانی در رستورانت بخارا کابل. قابلی پلو شاهی، کباب های تازه، منتو، کرایی شنواری و پذیرایی ۲۴ ساعته در شعبات قوای مرکز، کارته ۴ و وزیر اکبرخان.'
        );
      }
    } else if (language === 'ps') {
      document.title = 'د بخارا رستورانت کابل – اصیل افغاني خواړه او ۲۴ ساعته خدمتونه';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'په کابل کې د بخارا رستورانت سره د اصیلو افغاني خوړو څخه خوند واخلئ. شاهي کابلي پلو، تازه کبابونه، منتو، کرايي او د ۲۴ ساعته کورنیو څانګو خدمتونه.'
        );
      }
    } else {
      document.title = 'Bukhara Restaurant – Authentic Afghan Dining in Kabul';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Experience authentic Afghan dining at Bukhara Restaurant in Kabul. Famous for traditional Kabuli Pulao, Afghan Kebabs, Mantu, and international cuisine. Open 24 Hours across Kabul.'
        );
      }
    }
  }, [isRTL, language]);

  // Helper for safe JSON parsing from storage
  const safeLoad = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  // Data states initialized with localStorage fallback and exception safety
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => safeLoad('bukhara_menu', initialMenuItems));
  const [categories, setCategories] = useState<MenuCategory[]>(() => safeLoad('bukhara_categories', initialCategories));
  const [branches, setBranches] = useState<Branch[]>(() => safeLoad('bukhara_branches', initialBranches));
  const [offers, setOffers] = useState<SpecialOffer[]>(() => safeLoad('bukhara_offers', initialOffers));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => safeLoad('bukhara_gallery', initialGallery));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => safeLoad('bukhara_blog', initialBlogPosts));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => safeLoad('bukhara_testimonials', initialTestimonials));

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('bukhara_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const resolvedAdminPin =
          !parsed.adminPin || parsed.adminPin === 'bukhara2026'
            ? initialSiteSettings.adminPin
            : parsed.adminPin;
        return {
          ...initialSiteSettings,
          ...parsed,
          adminPin: resolvedAdminPin || 'Rahimi1234',
          managerPin: parsed.managerPin || initialSiteSettings.managerPin || 'manager2026',
          announcementBar: {
            ...initialSiteSettings.announcementBar,
            ...(parsed.announcementBar || {}),
          },
        };
      } catch {
        return initialSiteSettings;
      }
    }
    return initialSiteSettings;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bukhara_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'BK-2026-000104',
        customerName: 'Ahmad Wali',
        phone: '+93 78 888 1234',
        email: 'wali@example.af',
        address: 'Street 4, Shahr-e-Naw, Kabul',
        district: 'District 10 (Shahr-e-Naw)',
        orderType: 'delivery',
        paymentMethod: 'cash',
        items: [
          {
            id: 'c-init-1',
            menuItemId: 'item-1',
            name: 'Bukhara Royal Kabuli Pulao',
            price: 450,
            quantity: 2,
            image: initialMenuItems[0].image,
          },
          {
            id: 'c-init-2',
            menuItemId: 'item-10',
            name: 'Chilled Afghan Doogh',
            price: 80,
            quantity: 2,
            image: initialMenuItems[9].image,
          }
        ],
        subtotal: 1060,
        deliveryFee: 100,
        discount: 0,
        total: 1160,
        status: 'out_for_delivery',
        branchId: 'branch-qowai-markaz',
        createdAt: '2026-09-19 12:45',
      }
    ];
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('bukhara_reservations');
    return saved ? JSON.parse(saved) : [
      {
        id: 'BK-RES-2026-0012',
        name: 'Sultan Mahmoud',
        phone: '+93 79 123 4567',
        email: 'sultan@kabulgroup.af',
        branchId: 'branch-qowai-markaz',
        date: '2026-09-20',
        time: '19:30',
        guests: 8,
        occasion: 'Family Dinner',
        specialRequest: 'Private family lounge booth please.',
        status: 'confirmed',
        createdAt: '2026-09-19 10:15',
      }
    ];
  });

  const [cateringInquiries, setCateringInquiries] = useState<CateringInquiry[]>(() => {
    const saved = localStorage.getItem('bukhara_catering');
    return saved ? JSON.parse(saved) : [];
  });

  // Active branch selector for info bar
  const [activeBranchId, setActiveBranchId] = useState<string>('branch-qowai-markaz');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bukhara_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Modals & UI Controls
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);
  const [isQrMenuOpen, setIsQrMenuOpen] = useState(false);
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const openWhatsApp = (phone?: string, message?: string) => {
    const rawNumber = phone || siteSettings.mainWhatsapp;
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const defaultMsg =
      message ||
      'Hello Bukhara Restaurant Kabul, I would like to place an order or inquire about table reservations.';
    const encoded = encodeURIComponent(defaultMsg);
    const directUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`;

    // Always open modal so the user has immediate access to copy/dial/direct options
    setIsWhatsAppModalOpen(true);

    try {
      window.open(directUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Browser popup blocked, modal remains visible for user
    }
  };

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('bukhara_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bukhara_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bukhara_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('bukhara_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('bukhara_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('bukhara_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('bukhara_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('bukhara_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('bukhara_blog', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('bukhara_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('bukhara_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('bukhara_catering', JSON.stringify(cateringInquiries));
  }, [cateringInquiries]);

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity = 1,
    selectedVariantId?: string,
    selectedAddonIds: string[] = [],
    specialInstructions?: string
  ) => {
    let itemPrice = item.price;
    let selectedVariant = undefined;

    if (selectedVariantId && item.variants) {
      selectedVariant = item.variants.find((v) => v.id === selectedVariantId);
      if (selectedVariant) itemPrice = selectedVariant.price;
    }

    const selectedAddons = (item.addons || []).filter((ad) => selectedAddonIds.includes(ad.id));
    const addonsTotal = selectedAddons.reduce((sum, ad) => sum + ad.price, 0);
    const unitPrice = itemPrice + addonsTotal;

    const cartId = `${item.id}-${selectedVariantId || 'base'}-${selectedAddonIds.sort().join('_')}`;

    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === cartId);
      if (existing) {
        return prev.map((ci) =>
          ci.id === cartId ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      const displayName = language === 'fa' ? item.nameFa : language === 'ps' ? item.namePs : item.nameEn;
      return [
        ...prev,
        {
          id: cartId,
          menuItemId: item.id,
          name: displayName,
          price: unitPrice,
          quantity,
          selectedVariant,
          selectedAddons,
          specialInstructions,
          image: item.image,
        },
      ];
    });

    const addedName = language === 'fa' ? item.nameFa : language === 'ps' ? item.namePs : item.nameEn;
    showToast(`${addedName} ${language === 'fa' ? 'به سبد افزوده شد' : language === 'ps' ? 'کڅوړې ته اضافه شو' : 'added to order basket'}`);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) => prev.map((ci) => (ci.id === cartItemId ? { ...ci, quantity } : ci)));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setPromoCode('');
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BUKHARA10' || clean === 'KABUL10') {
      setDiscountPercent(10);
      setPromoCode(clean);
      showToast(language === 'fa' ? 'تخفیف ۱۰٪ با موفقیت اعمال شد' : language === 'ps' ? '۱۰٪ تخفیف اضافه شو' : '10% discount promo code applied!', 'success');
      return true;
    }
    if (clean === 'ROYAL20') {
      setDiscountPercent(20);
      setPromoCode(clean);
      showToast(language === 'fa' ? 'تخفیف ۲۰٪ ویژه شاهانه اعمال شد' : language === 'ps' ? '۲۰٪ ځانګړی تخفیف اضافه شو' : '20% Royal VIP promo code applied!', 'success');
      return true;
    }
    showToast(language === 'fa' ? 'کد تخفیف نامعتبر است' : language === 'ps' ? 'تخفیف کوډ ناسم دی' : 'Invalid promo code. Try "BUKHARA10"', 'error');
    return false;
  };

  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const cartDiscount = Math.round((cartSubtotal * discountPercent) / 100);
  const cartDeliveryFee = cartSubtotal > 1500 || cartSubtotal === 0 ? 0 : 100;
  const cartTotal = cartSubtotal - cartDiscount + cartDeliveryFee;

  // Order Placement
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'items' | 'subtotal' | 'deliveryFee' | 'discount' | 'total'>
  ): Order => {
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: `BK-2026-${orderNumber}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'received',
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: orderData.orderType === 'delivery' ? cartDeliveryFee : 0,
      discount: cartDiscount,
      total: cartSubtotal - cartDiscount + (orderData.orderType === 'delivery' ? cartDeliveryFee : 0),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Order ${orderId} updated to ${status}`);
  };

  // Reservation Placement
  const placeReservation = (resData: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Reservation => {
    const resNumber = Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      ...resData,
      id: `BK-RES-2026-${resNumber}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };

    setReservations((prev) => [newReservation, ...prev]);
    return newReservation;
  };

  const updateReservationStatus = (resId: string, status: ReservationStatus, adminNotes?: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status, adminNotes: adminNotes ?? r.adminNotes } : r))
    );
    showToast(`Reservation ${resId} status: ${status}`);
  };

  // Catering Inquiry
  const submitCateringInquiry = (inquiryData: Omit<CateringInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: CateringInquiry = {
      ...inquiryData,
      id: `CAT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'new',
    };
    setCateringInquiries((prev) => [newInquiry, ...prev]);
    showToast(t.cateringSubmitted, 'success');
  };

  // CMS functions for All Website Sections
  // 1. Menu Items & Categories
  const updateMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    showToast(`Updated "${item.nameEn}"`);
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
    showToast(`Added new dish "${item.nameEn}"`);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    showToast(`Dish removed from menu`);
  };

  const addCategory = (category: MenuCategory) => {
    setCategories((prev) => [...prev, category]);
    showToast(`Added category "${category.nameEn}"`);
  };

  const updateCategory = (category: MenuCategory) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
    showToast(`Updated category "${category.nameEn}"`);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast(`Category removed`);
  };

  // 2. Branches & Addresses
  const addBranch = (branch: Branch) => {
    setBranches((prev) => [...prev, branch]);
    showToast(`Added new branch "${branch.nameEn}"`);
  };

  const updateBranch = (branch: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === branch.id ? branch : b)));
    showToast(`Branch "${branch.nameEn}" updated`);
  };

  const deleteBranch = (branchId: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchId));
    showToast(`Branch removed`);
  };

  // 3. Blog Posts
  const addBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...prev]);
    showToast(`Published article "${post.titleEn}"`);
  };

  const updateBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    showToast(`Article "${post.titleEn}" updated`);
  };

  const deleteBlogPost = (postId: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast(`Article deleted`);
  };

  // 4. Gallery Items
  const addGalleryItem = (item: GalleryItem) => {
    setGallery((prev) => [item, ...prev]);
    showToast(`Image added to gallery`);
  };

  const updateGalleryItem = (item: GalleryItem) => {
    setGallery((prev) => prev.map((g) => (g.id === item.id ? item : g)));
    showToast(`Gallery item updated`);
  };

  const deleteGalleryItem = (itemId: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== itemId));
    showToast(`Image removed from gallery`);
  };

  // 5. Special Offers
  const addOffer = (offer: SpecialOffer) => {
    setOffers((prev) => [offer, ...prev]);
    showToast(`Special offer "${offer.titleEn}" created`);
  };

  const updateOffer = (offer: SpecialOffer) => {
    setOffers((prev) => prev.map((o) => (o.id === offer.id ? offer : o)));
    showToast(`Special offer "${offer.titleEn}" updated`);
  };

  const deleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    showToast(`Offer removed`);
  };

  // 6. Testimonials
  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials((prev) => [testimonial, ...prev]);
    showToast(`Review added`);
  };

  const updateTestimonial = (testimonial: Testimonial) => {
    setTestimonials((prev) => prev.map((t) => (t.id === testimonial.id ? testimonial : t)));
    showToast(`Review updated`);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showToast(`Review removed`);
  };

  // 7. Site Settings & Security
  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    showToast('Site settings updated');
  };

  const changeAdminPin = (currentPin: string, newPin: string): { success: boolean; error?: string } => {
    const activePin = siteSettings.adminPin || 'Rahimi1234';
    const isCurrentValid = currentPin.trim() === activePin;

    if (!isCurrentValid) {
      return { success: false, error: 'Current password/PIN is incorrect.' };
    }

    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: 'New password/PIN must be at least 4 characters.' };
    }

    const updatedSettings = {
      ...siteSettings,
      adminPin: newPin.trim(),
    };
    setSiteSettings(updatedSettings);
    localStorage.setItem('bukhara_settings', JSON.stringify(updatedSettings));
    showToast('Admin password/PIN updated successfully', 'success');
    return { success: true };
  };

  const changeManagerPin = (currentAdminPin: string, newManagerPin: string): { success: boolean; error?: string } => {
    const activeAdminPin = siteSettings.adminPin || 'Rahimi1234';
    const isCurrentValid = currentAdminPin.trim() === activeAdminPin;

    if (!isCurrentValid) {
      return { success: false, error: 'Administrator authentication required. Master PIN is incorrect.' };
    }

    if (!newManagerPin || newManagerPin.trim().length < 4) {
      return { success: false, error: 'Manager PIN must be at least 4 characters.' };
    }

    const updatedSettings = {
      ...siteSettings,
      managerPin: newManagerPin.trim(),
    };
    setSiteSettings(updatedSettings);
    localStorage.setItem('bukhara_settings', JSON.stringify(updatedSettings));
    showToast('Manager operations PIN updated successfully', 'success');
    return { success: true };
  };

  const restoreAllDataBackup = (backupData: any): { success: boolean; message: string } => {
    try {
      if (!backupData || typeof backupData !== 'object') {
        return { success: false, message: 'Invalid backup file structure.' };
      }

      if (Array.isArray(backupData.menuItems) && backupData.menuItems.length > 0) {
        setMenuItems(backupData.menuItems);
        localStorage.setItem('bukhara_menu', JSON.stringify(backupData.menuItems));
      }

      if (Array.isArray(backupData.categories) && backupData.categories.length > 0) {
        setCategories(backupData.categories);
        localStorage.setItem('bukhara_categories', JSON.stringify(backupData.categories));
      }

      if (Array.isArray(backupData.branches) && backupData.branches.length > 0) {
        setBranches(backupData.branches);
        localStorage.setItem('bukhara_branches', JSON.stringify(backupData.branches));
      }

      if (Array.isArray(backupData.offers) && backupData.offers.length > 0) {
        setOffers(backupData.offers);
        localStorage.setItem('bukhara_offers', JSON.stringify(backupData.offers));
      }

      if (Array.isArray(backupData.gallery) && backupData.gallery.length > 0) {
        setGallery(backupData.gallery);
        localStorage.setItem('bukhara_gallery', JSON.stringify(backupData.gallery));
      }

      if (Array.isArray(backupData.blogPosts) && backupData.blogPosts.length > 0) {
        setBlogPosts(backupData.blogPosts);
        localStorage.setItem('bukhara_blog', JSON.stringify(backupData.blogPosts));
      }

      if (Array.isArray(backupData.testimonials) && backupData.testimonials.length > 0) {
        setTestimonials(backupData.testimonials);
        localStorage.setItem('bukhara_testimonials', JSON.stringify(backupData.testimonials));
      }

      if (backupData.siteSettings && typeof backupData.siteSettings === 'object') {
        const mergedSettings = {
          ...siteSettings,
          ...backupData.siteSettings,
          adminPin: siteSettings.adminPin, // preserve current active admin PIN for security
        };
        setSiteSettings(mergedSettings);
        localStorage.setItem('bukhara_settings', JSON.stringify(mergedSettings));
      }

      showToast('Website database & CMS data restored successfully!', 'success');
      return { success: true, message: 'Backup restored successfully!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to parse backup data.' };
    }
  };

  const resetAllContentToDefault = () => {
    setMenuItems(initialMenuItems);
    setCategories(initialCategories);
    setBranches(initialBranches);
    setOffers(initialOffers);
    setGallery(initialGallery);
    setBlogPosts(initialBlogPosts);
    setTestimonials(initialTestimonials);
    setSiteSettings(initialSiteSettings);

    localStorage.removeItem('bukhara_menu');
    localStorage.removeItem('bukhara_categories');
    localStorage.removeItem('bukhara_branches');
    localStorage.removeItem('bukhara_offers');
    localStorage.removeItem('bukhara_gallery');
    localStorage.removeItem('bukhara_blog');
    localStorage.removeItem('bukhara_testimonials');
    localStorage.removeItem('bukhara_settings');

    showToast('All website sections reset to default showcase data', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        menuItems,
        categories,
        branches,
        offers,
        gallery,
        blogPosts,
        testimonials,
        siteSettings,
        orders,
        reservations,
        cateringInquiries,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartDiscount,
        cartTotal,
        promoCode,
        applyPromoCode,
        placeOrder,
        updateOrderStatus,
        placeReservation,
        updateReservationStatus,
        submitCateringInquiry,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        addCategory,
        updateCategory,
        deleteCategory,
        addBranch,
        updateBranch,
        deleteBranch,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addOffer,
        updateOffer,
        deleteOffer,
        specialOffers: offers,
        addSpecialOffer: addOffer,
        updateSpecialOffer: updateOffer,
        deleteSpecialOffer: deleteOffer,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateSiteSettings,
        changeAdminPin,
        changeManagerPin,
        resetAllContentToDefault,
        restoreAllDataBackup,
        selectedMenuItem,
        setSelectedMenuItem,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        trackingOrderId,
        setTrackingOrderId,
        isReservationOpen,
        setIsReservationOpen,
        selectedBranch,
        setSelectedBranch,
        selectedBlogPost,
        setSelectedBlogPost,
        selectedGalleryImage,
        setSelectedGalleryImage,
        isQrMenuOpen,
        setIsQrMenuOpen,
        isPrintMenuOpen,
        setIsPrintMenuOpen,
        isAdminOpen,
        setIsAdminOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        openWhatsApp,
        activeBranchId,
        setActiveBranchId,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
