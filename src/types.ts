export type Language = 'en' | 'fa' | 'ps';

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'cash' | 'pos' | 'hesabpay' | 'online';
export type OrderStatus = 'received' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface MenuItemAddon {
  id: string;
  nameEn: string;
  nameFa: string;
  namePs: string;
  price: number;
}

export interface MenuItemVariant {
  id: string;
  nameEn: string;
  nameFa: string;
  namePs: string;
  price: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  namePs: string;
  descriptionEn: string;
  descriptionFa: string;
  descriptionPs: string;
  price: number;
  category: string;
  image: string;
  dietary: {
    isSpicy?: boolean;
    isVegetarian?: boolean;
    isPopular?: boolean;
    isChefChoice?: boolean;
  };
  ingredientsEn?: string[];
  ingredientsFa?: string[];
  ingredientsPs?: string[];
  servingSizeEn?: string;
  servingSizeFa?: string;
  servingSizePs?: string;
  available: boolean;
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
}

export interface MenuCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  namePs: string;
  iconName: string;
}

export interface Branch {
  id: string;
  slug: string;
  nameEn: string;
  nameFa: string;
  namePs: string;
  addressEn: string;
  addressFa: string;
  addressPs: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHoursEn: string;
  openingHoursFa: string;
  openingHoursPs: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapEmbedUrl: string;
  photos: string[];
  featuresEn: string[];
  featuresFa: string[];
  featuresPs: string[];
}

export interface CartItem {
  id: string; // unique cart entry ID
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: MenuItemVariant;
  selectedAddons?: MenuItemAddon[];
  specialInstructions?: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  district?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  branchId: string;
  createdAt: string;
  deliveryInstructions?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  branchId: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
  adminNotes?: string;
}

export interface SpecialOffer {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  titlePs: string;
  descriptionEn: string;
  descriptionFa: string;
  descriptionPs: string;
  image: string;
  validDatesEn: string;
  validDatesFa: string;
  validDatesPs: string;
  originalPrice: number;
  discountedPrice: number;
  termsEn: string;
  termsFa: string;
  termsPs: string;
  badgeEn: string;
  badgeFa: string;
  badgePs: string;
  discountPercent?: number;
  validUntilEn?: string;
  validUntilFa?: string;
  validUntilPs?: string;
  promoCode?: string;
}

export interface CateringInquiry {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  guests: number;
  location: string;
  budget: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'confirmed';
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleFa: string;
  titlePs: string;
  category: 'food' | 'interior' | 'cuisine' | 'events' | 'dining' | 'team';
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  titlePs: string;
  excerptEn: string;
  excerptFa: string;
  excerptPs: string;
  contentEn: string[];
  contentFa: string[];
  contentPs: string[];
  image: string;
  author: string;
  date: string;
  readTime: string;
  categoryEn: string;
  categoryFa: string;
  categoryPs: string;
}

export interface Testimonial {
  id: string;
  name: string;
  cityEn: string;
  cityFa: string;
  cityPs: string;
  rating: number;
  reviewEn: string;
  reviewFa: string;
  reviewPs: string;
  date: string;
  source: 'Google' | 'TripAdvisor' | 'Website';
  avatar?: string;
}

export const BUKHARA_LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaIZHCkwFWfFAlJtw8OD5ZB2Ae4FqK--BpIOHK9V250elrFZeBL0rK9As&s=10';

export type AdminRole = 'admin' | 'manager';

export interface SiteSettings {
  logoUrl: string;
  adminPin: string;
  managerPin?: string;
  announcementBar: {
    enabled: boolean;
    textEn: string;
    textFa: string;
    textPs: string;
  };
  heroContent?: {
    headlineEn?: string;
    headlineFa?: string;
    headlinePs?: string;
    subheadlineEn?: string;
    subheadlineFa?: string;
    subheadlinePs?: string;
    badgeEn?: string;
  };
  mainPhone: string;
  mainWhatsapp: string;
  email: string;
  currencySymbol: string;
  googleRating: number;
  googleReviewCount: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tripadvisor?: string;
  };
}
