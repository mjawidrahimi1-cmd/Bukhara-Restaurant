import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, ReservationStatus, MenuItem, Branch, Order, BUKHARA_LOGO_URL, AdminRole } from '../types';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Utensils,
  MapPin,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Check,
  Lock,
  Phone,
  Clock,
  Sparkles,
  AlertCircle,
  Download,
  Filter,
  Search,
  Printer,
  ChevronRight,
  Building2,
  Settings,
  Users,
  LogOut,
  Flame,
  Leaf,
  Star,
  CheckCircle2,
  Clock3,
  Truck,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  KeyRound,
  Tag,
  Sliders,
  Crown,
  ChefHat,
  Database,
} from 'lucide-react';
import { AdminSecurityPassword } from './admin/AdminSecurityPassword';
import { AdminBlogCMS } from './admin/AdminBlogCMS';
import { AdminGalleryCMS } from './admin/AdminGalleryCMS';
import { AdminBranchesCMS } from './admin/AdminBranchesCMS';
import { AdminMenuCMS } from './admin/AdminMenuCMS';
import { AdminSettingsCMS } from './admin/AdminSettingsCMS';
import { AdminOffersReviewsCMS } from './admin/AdminOffersReviewsCMS';
import { AdminBackupExportCMS } from './admin/AdminBackupExportCMS';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    orders,
    reservations,
    menuItems,
    branches,
    categories,
    siteSettings,
    updateOrderStatus,
    updateReservationStatus,
    placeReservation,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateBranch,
    updateSiteSettings,
    openWhatsApp,
    showToast,
    t,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AdminRole>('admin');
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Rate limiting countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Main Navigation Tabs (Full CMS & Operations)
  const [activeTab, setActiveTab] = useState<
    'kds' | 'orders' | 'reservations' | 'menu' | 'branches' | 'blog' | 'gallery' | 'offers' | 'security' | 'settings' | 'backup'
  >('kds');

  // Branch filter across CMS
  const [branchFilter, setBranchFilter] = useState<string>('all');

  // Order Search & Filter
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Reservation Filter & New Booking Form
  const [resStatusFilter, setResStatusFilter] = useState<string>('all');
  const [showAddResModal, setShowAddResModal] = useState(false);
  const [newResGuestName, setNewResGuestName] = useState('');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResGuests, setNewResGuests] = useState(4);
  const [newResDate, setNewResDate] = useState(new Date().toISOString().split('T')[0]);
  const [newResTime, setNewResTime] = useState('19:30');
  const [newResBranch, setNewResBranch] = useState(branches[0]?.id || 'branch-qowai-markaz');

  // Menu Search & Edit State
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Dish Form state
  const [dishNameEn, setDishNameEn] = useState('');
  const [dishNameFa, setDishNameFa] = useState('');
  const [dishNamePs, setDishNamePs] = useState('');
  const [dishPrice, setDishPrice] = useState(380);
  const [dishCategory, setDishCategory] = useState(categories[0]?.id || 'rice');
  const [dishDescEn, setDishDescEn] = useState('');
  const [dishImage, setDishImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
  const [dishIsSpicy, setDishIsSpicy] = useState(false);
  const [dishIsVegetarian, setDishIsVegetarian] = useState(false);
  const [dishIsPopular, setDishIsPopular] = useState(false);
  const [dishIsChefChoice, setDishIsChefChoice] = useState(false);

  // Receipt / Ticket print view
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Branch editing
  const [selectedEditBranch, setSelectedEditBranch] = useState<Branch | null>(null);

  if (!isAdminOpen) return null;

  // Multi-User Dynamic PIN Login (Admin vs Manager)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const currentAdminPin = siteSettings.adminPin || 'Rahimi1234';
    const currentManagerPin = siteSettings.managerPin || 'manager2026';

    if (pin.trim() === currentAdminPin) {
      setIsAuthenticated(true);
      setUserRole('admin');
      setLoginError(false);
      setFailedAttempts(0);
      setPin('');
      showToast('Welcome, Administrator (Full Executive Access)', 'success');
    } else if (pin.trim() === currentManagerPin) {
      setIsAuthenticated(true);
      setUserRole('manager');
      setLoginError(false);
      setFailedAttempts(0);
      setPin('');
      showToast('Welcome, Shift Manager (Operations & Content Access)', 'success');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      setLoginError(true);
      if (nextAttempts >= 5) {
        setLockoutSeconds(30);
        showToast('Too many failed attempts. Terminal temporarily locked for 30s.', 'error');
      }
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (branchFilter !== 'all' && o.branchId !== branchFilter) return false;
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone.toLowerCase().includes(q);
      return matchId || matchCust || matchPhone;
    }
    return true;
  });

  // KPI Metrics Calculation
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => ['received', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const totalCovers = reservations
    .filter((r) => r.status === 'confirmed' || r.status === 'completed')
    .reduce((sum, r) => sum + r.guests, 0);
  const inStockCount = menuItems.filter((i) => i.available).length;
  const outOfStockCount = menuItems.length - inStockCount;

  // Quick Action: Toggle Menu Item Availability (86 / In-Stock)
  const handleToggleAvailability = (item: MenuItem) => {
    const updated = { ...item, available: !item.available };
    updateMenuItem(updated);
    showToast(
      `${item.nameEn} is now ${updated.available ? 'IN STOCK (Available)' : '86’d (OUT OF STOCK)'}`,
      updated.available ? 'success' : 'info'
    );
  };

  // Quick Action: Save Dish
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishNameEn.trim()) {
      showToast('Please provide an English dish name', 'error');
      return;
    }

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        nameEn: dishNameEn,
        nameFa: dishNameFa || dishNameEn,
        namePs: dishNamePs || dishNameEn,
        price: Number(dishPrice),
        category: dishCategory,
        descriptionEn: dishDescEn,
        descriptionFa: dishDescEn,
        descriptionPs: dishDescEn,
        image: dishImage,
        dietary: {
          isSpicy: dishIsSpicy,
          isVegetarian: dishIsVegetarian,
          isPopular: dishIsPopular,
          isChefChoice: dishIsChefChoice,
        },
      });
      showToast(`Updated menu item: ${dishNameEn}`, 'success');
    } else {
      addMenuItem({
        id: `custom-${Date.now()}`,
        slug: dishNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        nameEn: dishNameEn,
        nameFa: dishNameFa || dishNameEn,
        namePs: dishNamePs || dishNameEn,
        price: Number(dishPrice),
        category: dishCategory,
        descriptionEn: dishDescEn,
        descriptionFa: dishDescEn,
        descriptionPs: dishDescEn,
        image: dishImage,
        available: true,
        dietary: {
          isSpicy: dishIsSpicy,
          isVegetarian: dishIsVegetarian,
          isPopular: dishIsPopular,
          isChefChoice: dishIsChefChoice,
        },
      });
      showToast(`Created new menu item: ${dishNameEn}`, 'success');
    }

    setShowDishModal(false);
    setEditingItem(null);
  };

  const openEditDishModal = (item: MenuItem) => {
    setEditingItem(item);
    setDishNameEn(item.nameEn);
    setDishNameFa(item.nameFa);
    setDishNamePs(item.namePs);
    setDishPrice(item.price);
    setDishCategory(item.category);
    setDishDescEn(item.descriptionEn);
    setDishImage(item.image);
    setDishIsSpicy(!!item.dietary?.isSpicy);
    setDishIsVegetarian(!!item.dietary?.isVegetarian);
    setDishIsPopular(!!item.dietary?.isPopular);
    setDishIsChefChoice(!!item.dietary?.isChefChoice);
    setShowDishModal(true);
  };

  const openAddDishModal = () => {
    setEditingItem(null);
    setDishNameEn('');
    setDishNameFa('');
    setDishNamePs('');
    setDishPrice(400);
    setDishCategory(categories[0]?.id || 'rice');
    setDishDescEn('');
    setDishImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
    setDishIsSpicy(false);
    setDishIsVegetarian(false);
    setDishIsPopular(false);
    setDishIsChefChoice(false);
    setShowDishModal(true);
  };

  // Quick Action: Add Walk-in Reservation
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResGuestName.trim() || !newResPhone.trim()) {
      showToast('Please enter guest name and contact number', 'error');
      return;
    }

    placeReservation({
      name: newResGuestName,
      phone: newResPhone,
      email: 'walkin@bukhara.af',
      guests: Number(newResGuests),
      date: newResDate,
      time: newResTime,
      branchId: newResBranch,
      occasion: 'Walk-In / Host Station',
      specialRequest: 'Booked directly via Host Station POS',
    });

    showToast(`Confirmed booking for ${newResGuestName} (${newResGuests} Guests)`, 'success');
    setShowAddResModal(false);
    setNewResGuestName('');
    setNewResPhone('');
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['OrderID', 'Customer', 'Phone', 'Type', 'Status', 'Total_AFN', 'Date', 'Address'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      o.phone,
      o.orderType,
      o.status,
      o.total,
      o.createdAt,
      `"${o.address || 'Dine-In/Takeaway'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bukhara_kabul_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders report successfully exported to CSV', 'success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn"
    >
      <div className="relative w-full max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-300 my-2 sm:my-4 flex flex-col min-h-[90vh] max-h-[94vh]">
        
        {/* Enterprise Executive Header */}
        <div className="bg-[#0c342b] text-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#c5a059]/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#c5a059] p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <img
                src={BUKHARA_LOGO_URL}
                alt="Bukhara Restaurant"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-title text-lg sm:text-xl font-bold tracking-wide">
                  Bukhara RMS &amp; Kitchen Operations
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  v3.8 Enterprise
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  3 Kabul Units Online (24/7 Gateway)
                </span>
                <span className="hidden md:inline text-stone-500">•</span>
                <span className="hidden md:inline font-mono text-[11px] text-[#c5a059]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <>
                {/* Active Role Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                    userRole === 'admin'
                      ? 'bg-[#c5a059]/20 border border-[#c5a059] text-[#e8c886]'
                      : 'bg-blue-500/20 border border-blue-400 text-blue-200'
                  }`}
                >
                  {userRole === 'admin' ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Admin Access</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                      <span>Manager Access</span>
                    </>
                  )}
                </div>

                {/* Branch Scope Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#08201a] border border-[#c5a059]/30 rounded-xl px-2.5 py-1.5 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="bg-transparent text-[#fdfbf7] font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="all" className="bg-[#0c342b]">All 3 Kabul Branches</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#0c342b]">
                        {b.nameEn.split('–')[1]?.trim() || b.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Export Data / Backup Button */}
                <button
                  onClick={() => setActiveTab('backup')}
                  title="Open Backup & Data Export Center"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'backup'
                      ? 'bg-[#c5a059] text-[#0c342b]'
                      : 'bg-white/10 hover:bg-white/20 text-stone-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Backup &amp; Export</span>
                </button>

                {/* Lock Session */}
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setPin('');
                    showToast('Logged out of Admin session', 'info');
                  }}
                  title="Lock Admin Session"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-xs font-semibold text-stone-200 hover:text-red-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Enterprise PIN Authentication View */
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-stone-100">
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-stone-300 shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0c342b] via-[#c5a059] to-[#0c342b]" />

              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#c5a059] p-1 flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                <img
                  src={BUKHARA_LOGO_URL}
                  alt="Bukhara Restaurant Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="font-serif-title text-2xl font-bold text-stone-900 mb-1">
                Executive Authentication
              </h3>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                Enter your role security PIN code (<strong>Administrator</strong> or <strong>Shift Manager</strong>) to access kitchen dispatch and CMS controls.
              </p>

              {lockoutSeconds > 0 ? (
                <div className="p-4 bg-amber-50 text-amber-900 text-xs rounded-2xl border border-amber-300 mb-5 flex items-center gap-3 text-left">
                  <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600" />
                  <div>
                    <span className="font-bold block text-sm">Terminal Locked</span>
                    <span>Too many invalid attempts. Please wait {lockoutSeconds}s before retrying.</span>
                  </div>
                </div>
              ) : loginError ? (
                <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 mb-5 flex items-center gap-2.5 text-left">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <div>
                    <span className="font-bold block">Access Denied</span>
                    <span>
                      Incorrect PIN entered. {5 - failedAttempts > 0 ? `${5 - failedAttempts} attempt(s) remaining.` : 'Locking terminal...'}
                    </span>
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pin}
                    disabled={lockoutSeconds > 0}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter Security PIN"
                    className="w-full px-4 py-3.5 text-center text-lg font-mono font-bold tracking-widest rounded-xl border-2 border-stone-300 focus:outline-none focus:border-[#c5a059] transition-colors disabled:bg-stone-100 disabled:text-stone-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={lockoutSeconds > 0 || !pin.trim()}
                  className="w-full py-3.5 rounded-xl bg-[#0c342b] text-white hover:bg-[#c5a059] hover:text-[#0c342b] text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify &amp; Unlock Panel
                </button>
              </form>

              {/* Multi-Role Quick Reference Tip */}
              <div className="mt-4 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-left text-[11px] text-stone-600 space-y-1">
                <div className="font-bold text-stone-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Multi-Role Access Levels:</span>
                </div>
                <div className="flex justify-between pl-5 text-[10px]">
                  <span>👑 Master Admin</span>
                  <span className="font-mono text-stone-500">Full Access + Security Config</span>
                </div>
                <div className="flex justify-between pl-5 text-[10px]">
                  <span>🛡️ Shift Manager</span>
                  <span className="font-mono text-stone-500">Operations &amp; Content Editing</span>
                </div>
              </div>

              {/* Security Policy Footnote */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Encrypted Client-Side Access • Brute-Force Protected</span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Authenticated Enterprise Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-100">
            
            {/* Left Nav Sidebar */}
            <div className="w-full md:w-64 bg-white border-r border-stone-200 p-3 sm:p-4 flex flex-row md:flex-col gap-1 shrink-0 overflow-x-auto md:overflow-y-auto">
              
              {/* Section 1: Kitchen & Restaurant Operations */}
              <div className="hidden md:block px-2 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Operations &amp; Dispatch
              </div>

              {/* Tab 1: Live Kitchen Display (KDS) */}
              <button
                onClick={() => setActiveTab('kds')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'kds'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'kds' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Live Operations</span>
                </div>
                {activeOrdersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              {/* Tab 2: Orders List */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Order History</span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  {orders.length}
                </span>
              </button>

              {/* Tab 3: Table Reservations */}
              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'reservations'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className={`w-4 h-4 ${activeTab === 'reservations' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Reservations</span>
                </div>
                {pendingReservationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    {pendingReservationsCount}
                  </span>
                )}
              </button>

              {/* Section 2: Website CMS Controls */}
              <div className="hidden md:block px-2 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-t border-stone-100 mt-1">
                Website Content CMS
              </div>

              {/* Tab 4: Menu Catalog & 86 Inventory */}
              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Utensils className={`w-4 h-4 ${activeTab === 'menu' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Dishes &amp; Categories</span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">{menuItems.length}</span>
              </button>

              {/* Tab 5: Kabul Branches & Addresses */}
              <button
                onClick={() => setActiveTab('branches')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'branches'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-4 h-4 ${activeTab === 'branches' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Branches &amp; Addresses</span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">{branches.length}</span>
              </button>

              {/* Tab 6: Culinary Blog */}
              <button
                onClick={() => setActiveTab('blog')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'blog'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className={`w-4 h-4 ${activeTab === 'blog' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Blog &amp; Articles</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  CMS
                </span>
              </button>

              {/* Tab 7: Visual Gallery */}
              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className={`w-4 h-4 ${activeTab === 'gallery' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Visual Photo Gallery</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Photos
                </span>
              </button>

              {/* Tab 8: Offers & Reviews */}
              <button
                onClick={() => setActiveTab('offers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'offers'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className={`w-4 h-4 ${activeTab === 'offers' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Offers &amp; Reviews</span>
                </div>
              </button>

              {/* Section 3: System & Security */}
              <div className="hidden md:block px-2 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-t border-stone-100 mt-1">
                System &amp; Security
              </div>

              {/* Tab 9: Panel Password Security */}
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className={`w-4 h-4 ${activeTab === 'security' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Password Security</span>
                </div>
                {userRole === 'admin' ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                    Master
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-600 font-medium flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>View Only</span>
                  </span>
                )}
              </button>

              {/* Tab 10: Storefront Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Site Sections &amp; Hero</span>
                </div>
              </button>

              {/* Tab 11: Data Backup & CSV/JSON Exporter */}
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'backup'
                    ? 'bg-[#0c342b] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Database className={`w-4 h-4 ${activeTab === 'backup' ? 'text-[#c5a059]' : 'text-stone-500'}`} />
                  <span>Backup &amp; Export</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                  JSON / CSV
                </span>
              </button>

              {/* Quick Summary Info Box */}
              <div className="hidden md:block mt-auto pt-4 border-t border-stone-200 text-[11px] text-stone-500 space-y-1.5">
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Current Session</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        userRole === 'admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {userRole === 'admin' ? '👑 Admin' : '🛡️ Manager'}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 leading-tight">
                    {userRole === 'admin'
                      ? 'Full master privileges granted.'
                      : 'Protected actions locked.'}
                  </div>
                </div>

                <div className="flex justify-between pt-1">
                  <span>CMS Status:</span>
                  <span className="text-emerald-600 font-bold">Online &amp; Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-bold text-[#0c342b]">AFN (Afghani)</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span className="font-mono">Asia/Kabul (+04:30)</span>
                </div>
              </div>
            </div>

            {/* Main Content Workspace */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[84vh] space-y-6">

              {/* GLOBAL METRIC CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Metric 1: Total Gross Sales */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Gross Sales</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#0c342b]">
                    {totalSales.toLocaleString()} <span className="text-xs text-[#c5a059] font-mono">AFN</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <span>Active Revenue Stream</span>
                  </span>
                </div>

                {/* Metric 2: Live Kitchen Queue */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Orders</span>
                    <Clock3 className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#0c342b]">
                    {activeOrdersCount}
                  </div>
                  <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                    <span>{orders.filter((o) => o.status === 'preparing').length} in Kitchen Prep</span>
                  </span>
                </div>

                {/* Metric 3: Confirmed Dining Covers */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Guest Covers</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#0c342b]">
                    {totalCovers} <span className="text-xs text-stone-400 font-normal">Guests</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-1">
                    <span>{pendingReservationsCount} awaiting review</span>
                  </span>
                </div>

                {/* Metric 4: Menu Health & 86 */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Menu In-Stock</span>
                    <Utensils className="w-4 h-4 text-[#c5a059]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-[#0c342b]">
                    {inStockCount} / {menuItems.length}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-1">
                    {outOfStockCount > 0 ? (
                      <span className="text-red-600 font-semibold">{outOfStockCount} items sold out</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">All dishes available</span>
                    )}
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* TAB 1: LIVE KITCHEN OPERATIONS (KDS)                                      */}
              {/* ========================================================================= */}
              {activeTab === 'kds' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                    <div>
                      <h3 className="font-serif-title text-lg font-bold text-[#0c342b]">
                        Live Kitchen Display &amp; Dispatch Board
                      </h3>
                      <p className="text-xs text-stone-500">
                        Real-time order pipeline across Kabul branches with instant stage progression.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Live Feed Active
                      </span>
                    </div>
                  </div>

                  {/* KDS Pipeline Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders
                      .filter((o) => branchFilter === 'all' || o.branchId === branchFilter)
                      .slice(0, 9)
                      .map((order) => {
                        const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
                          received: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
                          confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
                          preparing: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
                          ready: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300' },
                          out_for_delivery: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300' },
                          completed: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
                          cancelled: { bg: 'bg-stone-100', text: 'text-stone-500', border: 'border-stone-200' },
                        };

                        const currentStatusTheme = statusColors[order.status] || statusColors.received;

                        return (
                          <div
                            key={order.id}
                            className={`bg-white rounded-2xl border-2 ${currentStatusTheme.border} p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all`}
                          >
                            <div>
                              {/* Order Header */}
                              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                                <div>
                                  <span className="font-mono font-bold text-sm text-[#0c342b]">
                                    #{order.id}
                                  </span>
                                  <span className="text-[10px] text-stone-400 block font-mono">
                                    {order.createdAt}
                                  </span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentStatusTheme.bg} ${currentStatusTheme.text}`}>
                                  {order.status.replace(/_/g, ' ')}
                                </span>
                              </div>

                              {/* Customer & Branch */}
                              <div className="py-2 text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-stone-800">{order.customerName}</span>
                                  <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                                    {order.orderType}
                                  </span>
                                </div>
                                <div className="text-stone-500 flex items-center gap-2">
                                  <a href={`tel:${order.phone}`} className="hover:text-[#0c342b] font-mono flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-[#c5a059]" />
                                    {order.phone}
                                  </a>
                                  <button
                                    onClick={() => openWhatsApp(order.phone, `Salam ${order.customerName}, regarding your Bukhara order #${order.id}...`)}
                                    className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5 text-[10px] ml-auto cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>
                                </div>
                                {order.address && (
                                  <p className="text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded-lg border border-stone-100 line-clamp-2">
                                    <MapPin className="w-3 h-3 text-[#c5a059] inline mr-1" />
                                    {order.address} {order.district ? `(${order.district})` : ''}
                                  </p>
                                )}
                              </div>

                              {/* Itemized Order Line Items */}
                              <div className="border-t border-stone-100 pt-2 space-y-1.5">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded bg-stone-100 text-[#0c342b] font-bold text-[11px] flex items-center justify-center">
                                        {item.quantity}x
                                      </span>
                                      <span className="font-medium text-stone-800 line-clamp-1">
                                        {item.name}
                                      </span>
                                    </div>
                                    <span className="font-mono text-stone-600 shrink-0">
                                      {(item.price * item.quantity).toLocaleString()} AFN
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Total and Action Stage Transitions */}
                            <div className="pt-2 border-t border-stone-100 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-stone-500">Order Total:</span>
                                <span className="font-bold text-sm text-[#0c342b]">
                                  {order.total.toLocaleString()} AFN
                                </span>
                              </div>

                              {/* Progression Buttons */}
                              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                {order.status === 'received' && (
                                  <button
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'preparing');
                                      showToast(`Order #${order.id} sent to Kitchen Prep`, 'success');
                                    }}
                                    className="col-span-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Utensils className="w-3.5 h-3.5" />
                                    <span>Accept &amp; Start Prep</span>
                                  </button>
                                )}

                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'ready');
                                      showToast(`Order #${order.id} marked READY for Dispatch`, 'success');
                                    }}
                                    className="col-span-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Ready for Handover</span>
                                  </button>
                                )}

                                {order.status === 'ready' && (
                                  <button
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'out_for_delivery');
                                      showToast(`Order #${order.id} is Out for Delivery in Kabul`, 'info');
                                    }}
                                    className="col-span-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Truck className="w-3.5 h-3.5" />
                                    <span>Dispatch Driver</span>
                                  </button>
                                )}

                                {order.status === 'out_for_delivery' && (
                                  <button
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'completed');
                                      showToast(`Order #${order.id} marked as COMPLETED`, 'success');
                                    }}
                                    className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Mark Delivered / Complete</span>
                                  </button>
                                )}

                                {order.status === 'completed' && (
                                  <div className="col-span-2 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Completed Order</span>
                                  </div>
                                )}

                                {/* Print Receipt Action */}
                                <button
                                  onClick={() => setSelectedReceiptOrder(order)}
                                  className="py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3 text-[#c5a059]" />
                                  <span>Print Ticket</span>
                                </button>

                                {order.status !== 'cancelled' && order.status !== 'completed' && (
                                  <button
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'cancelled');
                                      showToast(`Order #${order.id} cancelled`, 'info');
                                    }}
                                    className="py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: COMPLETE ORDERS LOG & HISTORY                                      */}
              {/* ========================================================================= */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search by Order ID, Customer Name or Phone..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#c5a059] text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none"
                      >
                        <option value="all">All Statuses</option>
                        <option value="received">Received</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                          <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Branch</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Items Count</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Total (AFN)</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredOrders.map((o) => {
                            const b = branches.find((br) => br.id === o.branchId);
                            return (
                              <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-[#0c342b]">
                                  #{o.id}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-stone-800">{o.customerName}</div>
                                  <div className="text-[11px] text-stone-400">{o.phone}</div>
                                </td>
                                <td className="py-3 px-4 text-stone-600">
                                  {b ? b.nameEn.split('–')[1]?.trim() || b.nameEn : 'Kabul'}
                                </td>
                                <td className="py-3 px-4 font-semibold uppercase text-stone-600">
                                  {o.orderType}
                                </td>
                                <td className="py-3 px-4 text-stone-600">
                                  {o.items.reduce((sum, i) => sum + i.quantity, 0)} items
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                                    {o.status.replace(/_/g, ' ')}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-[#0c342b]">
                                  {o.total.toLocaleString()} AFN
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => setSelectedReceiptOrder(o)}
                                      title="Print Receipt"
                                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-[#0c342b] cursor-pointer"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => openWhatsApp(o.phone, `Salam ${o.customerName}, regarding Bukhara order #${o.id}...`)}
                                      title="WhatsApp Customer"
                                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 cursor-pointer"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: RESERVATIONS GUESTBOOK                                             */}
              {/* ========================================================================= */}
              {activeTab === 'reservations' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                    <div>
                      <h3 className="font-serif-title text-lg font-bold text-[#0c342b]">
                        Table Reservations &amp; VIP Lounges
                      </h3>
                      <p className="text-xs text-stone-500">
                        Manage family cabins, dining hall tables, and VIP banquet reservations.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={resStatusFilter}
                        onChange={(e) => setResStatusFilter(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none"
                      >
                        <option value="all">All Booking Statuses</option>
                        <option value="pending">Pending Confirmation</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed / Seated</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setShowAddResModal(true)}
                        className="py-2 px-3.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Walk-in Booking</span>
                      </button>
                    </div>
                  </div>

                  {/* Reservations Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reservations
                      .filter((r) => branchFilter === 'all' || r.branchId === branchFilter)
                      .filter((r) => resStatusFilter === 'all' || r.status === resStatusFilter)
                      .map((res) => {
                        const b = branches.find((br) => br.id === res.branchId);
                        return (
                          <div
                            key={res.id}
                            className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3 flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                                <span className="font-mono text-xs font-bold text-[#0c342b]">
                                  #{res.id}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    res.status === 'confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : res.status === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : res.status === 'pending'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-stone-100 text-stone-500'
                                  }`}
                                >
                                  {res.status}
                                </span>
                              </div>

                              <div className="text-xs space-y-1">
                                <div className="font-bold text-sm text-stone-900">{res.name}</div>
                                <div className="text-stone-500 flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-[#c5a059]" />
                                  <a href={`tel:${res.phone}`} className="hover:text-[#0c342b]">
                                    {res.phone}
                                  </a>
                                  <button
                                    onClick={() => openWhatsApp(res.phone, `Salam ${res.name}, your Bukhara table reservation for ${res.guests} guests on ${res.date} at ${res.time} is confirmed!`)}
                                    className="ml-auto text-emerald-600 hover:text-emerald-700 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>
                                </div>
                                <div className="text-stone-600 flex items-center gap-1.5 pt-1">
                                  <Calendar className="w-3 h-3 text-[#c5a059]" />
                                  <span>{res.date} at {res.time}</span>
                                  <span className="text-stone-300">•</span>
                                  <span className="font-bold text-[#0c342b]">{res.guests} Guests</span>
                                </div>
                                <div className="text-[11px] text-stone-500">
                                  <span>Branch: </span>
                                  <span className="font-semibold text-stone-700">{b?.nameEn.split('–')[1] || b?.nameEn}</span>
                                </div>
                                {res.specialRequest && (
                                  <p className="text-[11px] italic bg-stone-50 p-2 rounded-lg text-stone-600 border border-stone-100">
                                    "{res.specialRequest}"
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Status Transition Action Buttons */}
                            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs font-bold">
                              {res.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    updateReservationStatus(res.id, 'confirmed');
                                    showToast(`Reservation #${res.id} confirmed!`, 'success');
                                  }}
                                  className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-center cursor-pointer"
                                >
                                  Confirm
                                </button>
                              )}

                              {res.status === 'confirmed' && (
                                <button
                                  onClick={() => {
                                    updateReservationStatus(res.id, 'completed');
                                    showToast(`Guests for #${res.id} seated at table!`, 'success');
                                  }}
                                  className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-center cursor-pointer"
                                >
                                  Seat Guests (Complete)
                                </button>
                              )}

                              {res.status !== 'cancelled' && (
                                <button
                                  onClick={() => {
                                    updateReservationStatus(res.id, 'cancelled');
                                    showToast(`Reservation #${res.id} cancelled`, 'info');
                                  }}
                                  className="py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-600 transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: MENU & CATEGORIES CMS                                              */}
              {/* ========================================================================= */}
              {activeTab === 'menu' && <AdminMenuCMS />}

              {/* ========================================================================= */}
              {/* TAB 5: KABUL BRANCHES & ADDRESSES CMS                                     */}
              {/* ========================================================================= */}
              {activeTab === 'branches' && <AdminBranchesCMS userRole={userRole} />}

              {/* ========================================================================= */}
              {/* TAB 6: CULINARY BLOG CMS                                                  */}
              {/* ========================================================================= */}
              {activeTab === 'blog' && <AdminBlogCMS userRole={userRole} />}

              {/* ========================================================================= */}
              {/* TAB 7: VISUAL PHOTO GALLERY CMS                                           */}
              {/* ========================================================================= */}
              {activeTab === 'gallery' && <AdminGalleryCMS />}

              {/* ========================================================================= */}
              {/* TAB 8: SPECIAL OFFERS & REVIEWS CMS                                       */}
              {/* ========================================================================= */}
              {activeTab === 'offers' && <AdminOffersReviewsCMS />}

              {/* ========================================================================= */}
              {/* TAB 9: PANEL PASSWORD & PIN SECURITY                                      */}
              {/* ========================================================================= */}
              {activeTab === 'security' && <AdminSecurityPassword userRole={userRole} />}

              {/* ========================================================================= */}
              {/* TAB 10: STOREFRONT, HERO & SECTION CMS                                    */}
              {/* ========================================================================= */}
              {activeTab === 'settings' && <AdminSettingsCMS userRole={userRole} />}

              {/* ========================================================================= */}
              {/* TAB 11: DATA BACKUP & CSV/JSON EXPORTER                                   */}
              {/* ========================================================================= */}
              {activeTab === 'backup' && <AdminBackupExportCMS userRole={userRole} />}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: DISH EDIT / ADD MODAL                                          */}
        {/* ========================================================================= */}
        {showDishModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#c5a059]/40 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif-title text-lg font-bold text-[#0c342b]">
                  {editingItem ? `Edit Dish: ${editingItem.nameEn}` : 'Add New Dish to Menu'}
                </h3>
                <button
                  onClick={() => setShowDishModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Dish Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={dishNameEn}
                    onChange={(e) => setDishNameEn(e.target.value)}
                    placeholder="e.g. Royal Shahi Kabuli Pulao"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Name (دری / Dari)</label>
                    <input
                      type="text"
                      value={dishNameFa}
                      onChange={(e) => setDishNameFa(e.target.value)}
                      placeholder="قابلی پلو شاهی"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none font-vazirmatn"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Name (پښتو / Pashto)</label>
                    <input
                      type="text"
                      value={dishNamePs}
                      onChange={(e) => setDishNamePs(e.target.value)}
                      placeholder="شاهي قابلي پلو"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none font-vazirmatn"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Price in Afghani (AFN) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={dishPrice}
                      onChange={(e) => setDishPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category *</label>
                    <select
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.nameEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Image URL</label>
                  <input
                    type="url"
                    value={dishImage}
                    onChange={(e) => setDishImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Description (English)</label>
                  <textarea
                    rows={2}
                    value={dishDescEn}
                    onChange={(e) => setDishDescEn(e.target.value)}
                    placeholder="Slow-cooked spiced lamb shank served over aromatic sela rice..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:border-[#c5a059] focus:outline-none"
                  />
                </div>

                {/* Dietary Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsPopular}
                      onChange={(e) => setDishIsPopular(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Popular Highlight</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsChefChoice}
                      onChange={(e) => setDishIsChefChoice(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Chef's Choice</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsSpicy}
                      onChange={(e) => setDishIsSpicy(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishIsVegetarian}
                      onChange={(e) => setDishIsVegetarian(e.target.checked)}
                      className="rounded text-[#0c342b]"
                    />
                    <span>Vegetarian</span>
                  </label>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDishModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    {editingItem ? 'Update Dish' : 'Add to Menu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: WALK-IN / HOST RESERVATION                                      */}
        {/* ========================================================================= */}
        {showAddResModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#c5a059]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif-title text-lg font-bold text-[#0c342b]">
                  Host Station • Add Table Reservation
                </h3>
                <button
                  onClick={() => setShowAddResModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newResGuestName}
                    onChange={(e) => setNewResGuestName(e.target.value)}
                    placeholder="e.g. Ahmad Shah"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Guest Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newResPhone}
                    onChange={(e) => setNewResPhone(e.target.value)}
                    placeholder="+93 78 000 0000"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700 block mb-1">Party Size (Guests)</label>
                  <input
                    type="number"
                    min={1}
                    max={80}
                    value={newResGuests}
                    onChange={(e) => setNewResGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059] font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Date</label>
                    <input
                      type="date"
                      value={newResDate}
                      onChange={(e) => setNewResDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Time</label>
                    <input
                      type="time"
                      value={newResTime}
                      onChange={(e) => setNewResTime(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kabul Branch</label>
                  <select
                    value={newResBranch}
                    onChange={(e) => setNewResBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059]"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddResModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: KITCHEN ORDER TICKET / RECEIPT PREVIEW                         */}
        {/* ========================================================================= */}
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-300 space-y-4 text-stone-900 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-dashed border-stone-300 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white border border-stone-300 p-0.5 overflow-hidden shrink-0">
                    <img
                      src={BUKHARA_LOGO_URL}
                      alt="Bukhara Logo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase">Bukhara Restaurant Kabul</h4>
                    <span className="text-[10px] text-stone-500">Kitchen &amp; Guest Ticket</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
                <div className="flex justify-between">
                  <span>Order:</span>
                  <span className="font-bold">#{selectedReceiptOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedReceiptOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold">{selectedReceiptOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{selectedReceiptOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-bold uppercase">{selectedReceiptOrder.orderType}</span>
                </div>
                {selectedReceiptOrder.address && (
                  <div className="pt-1 text-[10px] text-stone-600">
                    <span className="font-bold">Delivery:</span> {selectedReceiptOrder.address} {selectedReceiptOrder.district ? `(${selectedReceiptOrder.district})` : ''}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2 border-b border-dashed border-stone-300 pb-3">
                {selectedReceiptOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <span>{item.quantity}x </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <span>{(item.price * item.quantity).toLocaleString()} AFN</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{selectedReceiptOrder.subtotal.toLocaleString()} AFN</span>
                </div>
                {selectedReceiptOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{selectedReceiptOrder.deliveryFee.toLocaleString()} AFN</span>
                  </div>
                )}
                {selectedReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-{selectedReceiptOrder.discount.toLocaleString()} AFN</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold pt-1 border-t border-stone-200 text-[#0c342b]">
                  <span>Total:</span>
                  <span>{selectedReceiptOrder.total.toLocaleString()} AFN</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Ticket</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: EDIT BRANCH CONTACT                                            */}
        {/* ========================================================================= */}
        {selectedEditBranch && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-300 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif-title text-base font-bold text-[#0c342b]">
                  Edit: {selectedEditBranch.nameEn}
                </h3>
                <button
                  onClick={() => setSelectedEditBranch(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBranch(selectedEditBranch);
                  showToast(`Saved branch configurations for ${selectedEditBranch.nameEn}`, 'success');
                  setSelectedEditBranch(null);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={selectedEditBranch.phone}
                    onChange={(e) =>
                      setSelectedEditBranch({ ...selectedEditBranch, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">WhatsApp Order Line</label>
                  <input
                    type="tel"
                    value={selectedEditBranch.whatsapp}
                    onChange={(e) =>
                      setSelectedEditBranch({ ...selectedEditBranch, whatsapp: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Full Address (English)</label>
                  <input
                    type="text"
                    value={selectedEditBranch.addressEn}
                    onChange={(e) =>
                      setSelectedEditBranch({ ...selectedEditBranch, addressEn: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Opening Hours (English)</label>
                  <input
                    type="text"
                    value={selectedEditBranch.openingHoursEn}
                    onChange={(e) =>
                      setSelectedEditBranch({ ...selectedEditBranch, openingHoursEn: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEditBranch(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
