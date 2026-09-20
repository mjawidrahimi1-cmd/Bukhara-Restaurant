import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminRole } from '../../types';
import {
  Download,
  Upload,
  Database,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Utensils,
  BookOpen,
  Building2,
  Image as ImageIcon,
  Tag,
  Star,
  ShoppingBag,
  Calendar,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';

interface AdminBackupExportCMSProps {
  userRole?: AdminRole;
}

export const AdminBackupExportCMS: React.FC<AdminBackupExportCMSProps> = ({ userRole = 'admin' }) => {
  const {
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
    restoreAllDataBackup,
    showToast,
  } = useStore();

  const [isCopied, setIsCopied] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [pendingBackupData, setPendingBackupData] = useState<any>(null);
  const [importSummary, setImportSummary] = useState<{
    menuCount: number;
    blogCount: number;
    branchCount: number;
    galleryCount: number;
    offersCount: number;
    testimonialsCount: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to trigger file download with UTF-8 BOM for CSVs
  const downloadFile = (content: string, filename: string, mimeType: string, isCsv = false) => {
    const finalContent = isCsv ? '\uFEFF' + content : content;
    const blob = new Blob([finalContent], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to escape CSV cell content
  const escapeCsvCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const getTimestampStr = () => {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  };

  // 1. Full JSON Backup Payload
  const generateFullBackupJson = () => {
    return {
      appName: 'Bukhara Restaurant Kabul',
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      exportTimestampStr: getTimestampStr(),
      environment: 'Production Kabul Cloud Storage',
      data: {
        siteSettings,
        menuCategories: categories,
        menuItems,
        branches,
        blogPosts,
        gallery,
        specialOffers: offers,
        testimonials,
        orders,
        reservations,
      },
    };
  };

  // Export Full JSON
  const handleExportFullJSON = () => {
    const payload = generateFullBackupJson();
    const jsonStr = JSON.stringify(payload, null, 2);
    const fileName = `bukhara_kabul_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonStr, fileName, 'application/json');
    showToast('Full website backup (JSON) exported successfully!', 'success');
  };

  // Copy Full JSON to Clipboard
  const handleCopyJSON = () => {
    const payload = generateFullBackupJson();
    const jsonStr = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setIsCopied(true);
      showToast('Full backup JSON copied to clipboard!', 'info');
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  // 2. Export Menu Items CSV
  const handleExportMenuCSV = () => {
    const headers = [
      'Item_ID',
      'Slug',
      'Name_English',
      'Name_Dari',
      'Name_Pashto',
      'Price_AFN',
      'Category_ID',
      'Category_Name',
      'Available_InStock',
      'Is_Spicy',
      'Is_Vegetarian',
      'Is_Popular',
      'Is_Chef_Choice',
      'Serving_Size',
      'Description_English',
      'Image_URL',
    ];

    const rows = menuItems.map((item) => {
      const cat = categories.find((c) => c.id === item.category);
      return [
        escapeCsvCell(item.id),
        escapeCsvCell(item.slug || ''),
        escapeCsvCell(item.nameEn),
        escapeCsvCell(item.nameFa || ''),
        escapeCsvCell(item.namePs || ''),
        item.price,
        escapeCsvCell(item.category),
        escapeCsvCell(cat?.nameEn || item.category),
        item.available ? 'YES' : 'NO',
        item.dietary?.isSpicy ? 'YES' : 'NO',
        item.dietary?.isVegetarian ? 'YES' : 'NO',
        item.dietary?.isPopular ? 'YES' : 'NO',
        item.dietary?.isChefChoice ? 'YES' : 'NO',
        escapeCsvCell(item.servingSizeEn || '1-2 Persons'),
        escapeCsvCell(item.descriptionEn || ''),
        escapeCsvCell(item.image),
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    downloadFile(csvData, `bukhara_menu_items_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv', true);
    showToast(`Exported ${menuItems.length} menu dishes to CSV`, 'success');
  };

  // 3. Export Blog Posts CSV
  const handleExportBlogCSV = () => {
    const headers = [
      'Post_ID',
      'Slug',
      'Title_English',
      'Title_Dari',
      'Title_Pashto',
      'Category_English',
      'Author',
      'Read_Time',
      'Published_Date',
      'Excerpt_English',
      'Excerpt_Dari',
      'Excerpt_Pashto',
      'Image_URL',
    ];

    const rows = blogPosts.map((post) => {
      return [
        escapeCsvCell(post.id),
        escapeCsvCell(post.slug || ''),
        escapeCsvCell(post.titleEn),
        escapeCsvCell(post.titleFa || ''),
        escapeCsvCell(post.titlePs || ''),
        escapeCsvCell(post.categoryEn || 'Culinary Heritage'),
        escapeCsvCell(post.author || 'Bukhara Culinary Team'),
        escapeCsvCell(post.readTime || '5 min read'),
        escapeCsvCell(post.date || ''),
        escapeCsvCell(post.excerptEn || ''),
        escapeCsvCell(post.excerptFa || ''),
        escapeCsvCell(post.excerptPs || ''),
        escapeCsvCell(post.image || ''),
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    downloadFile(csvData, `bukhara_blog_articles_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv', true);
    showToast(`Exported ${blogPosts.length} blog articles to CSV`, 'success');
  };

  // 4. Export Branches CSV
  const handleExportBranchesCSV = () => {
    const headers = [
      'Branch_ID',
      'Slug',
      'Name_English',
      'Name_Dari',
      'Name_Pashto',
      'Address_English',
      'Address_Dari',
      'Phone',
      'WhatsApp',
      'Opening_Hours_English',
      'Latitude',
      'Longitude',
      'Primary_Photo',
    ];

    const rows = branches.map((b) => {
      return [
        escapeCsvCell(b.id),
        escapeCsvCell(b.slug || ''),
        escapeCsvCell(b.nameEn),
        escapeCsvCell(b.nameFa || ''),
        escapeCsvCell(b.namePs || ''),
        escapeCsvCell(b.addressEn),
        escapeCsvCell(b.addressFa || ''),
        escapeCsvCell(b.phone),
        escapeCsvCell(b.whatsapp || b.phone),
        escapeCsvCell(b.openingHoursEn || '11:00 AM – 11:30 PM'),
        b.coordinates?.lat || '',
        b.coordinates?.lng || '',
        escapeCsvCell(b.photos?.[0] || ''),
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    downloadFile(csvData, `bukhara_kabul_branches_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv', true);
    showToast(`Exported ${branches.length} branches to CSV`, 'success');
  };

  // 5. Export Orders CSV
  const handleExportOrdersCSV = () => {
    const headers = [
      'Order_ID',
      'Customer_Name',
      'Phone',
      'Email',
      'Order_Type',
      'Status',
      'Delivery_Address',
      'District',
      'Payment_Method',
      'Subtotal_AFN',
      'Delivery_Fee_AFN',
      'Discount_AFN',
      'Total_AFN',
      'Created_At',
      'Items_Summary',
    ];

    const rows = orders.map((o) => {
      const itemsSummary = o.items.map((i) => `${i.name} (x${i.quantity})`).join('; ');
      return [
        escapeCsvCell(o.id),
        escapeCsvCell(o.customerName),
        escapeCsvCell(o.phone),
        escapeCsvCell(o.email || ''),
        escapeCsvCell(o.orderType),
        escapeCsvCell(o.status),
        escapeCsvCell(o.address || 'Dine-in / Pickup'),
        escapeCsvCell(o.district || ''),
        escapeCsvCell(o.paymentMethod),
        o.subtotal,
        o.deliveryFee,
        o.discount,
        o.total,
        escapeCsvCell(o.createdAt),
        escapeCsvCell(itemsSummary),
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    downloadFile(csvData, `bukhara_orders_history_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv', true);
    showToast(`Exported ${orders.length} orders to CSV`, 'success');
  };

  // 6. Export Reservations CSV
  const handleExportReservationsCSV = () => {
    const headers = [
      'Reservation_ID',
      'Guest_Name',
      'Phone',
      'Email',
      'Guests_Count',
      'Booking_Date',
      'Booking_Time',
      'Branch_ID',
      'Occasion',
      'Special_Request',
      'Status',
      'Created_At',
    ];

    const rows = reservations.map((r) => {
      return [
        escapeCsvCell(r.id),
        escapeCsvCell(r.name),
        escapeCsvCell(r.phone),
        escapeCsvCell(r.email || ''),
        r.guests,
        escapeCsvCell(r.date),
        escapeCsvCell(r.time),
        escapeCsvCell(r.branchId),
        escapeCsvCell(r.occasion || 'Dining'),
        escapeCsvCell(r.specialRequest || ''),
        escapeCsvCell(r.status),
        escapeCsvCell(r.createdAt),
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    downloadFile(csvData, `bukhara_reservations_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv', true);
    showToast(`Exported ${reservations.length} reservations to CSV`, 'success');
  };

  // 7. Export Customer Reviews CSV
  const handleExportReviewsCSV = () => {
    const headers = ['Review_ID', 'Customer_Name', 'City_or_Region', 'Rating_Stars', 'Review_English', 'Review_Dari', 'Date', 'Source'];

    const rows = testimonials.map((rev) => {
      return [
        escapeCsvCell(rev.id),
        escapeCsvCell(rev.name),
        escapeCsvCell(rev.cityEn || 'Kabul'),
        rev.rating,
        escapeCsvCell(rev.reviewEn),
        escapeCsvCell(rev.reviewFa || ''),
        escapeCsvCell(rev.date || '2026'),
        escapeCsvCell(rev.source || 'Website'),
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    downloadFile(csvData, `bukhara_customer_reviews_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv', true);
    showToast(`Exported ${testimonials.length} reviews to CSV`, 'success');
  };

  // File Upload / Import Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      showToast('Please upload a valid JSON backup file (.json)', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Support both direct data structure and nested { data: { ... } } structure
        const targetData = parsed.data || parsed;

        if (!targetData || typeof targetData !== 'object') {
          throw new Error('Unrecognized backup file format.');
        }

        const menuCount = Array.isArray(targetData.menuItems) ? targetData.menuItems.length : 0;
        const blogCount = Array.isArray(targetData.blogPosts) ? targetData.blogPosts.length : 0;
        const branchCount = Array.isArray(targetData.branches) ? targetData.branches.length : 0;
        const galleryCount = Array.isArray(targetData.gallery) ? targetData.gallery.length : 0;
        const offersCount = Array.isArray(targetData.specialOffers || targetData.offers)
          ? (targetData.specialOffers || targetData.offers).length
          : 0;
        const testimonialsCount = Array.isArray(targetData.testimonials) ? targetData.testimonials.length : 0;

        if (menuCount === 0 && blogCount === 0 && branchCount === 0) {
          throw new Error('Backup file does not contain valid website entities.');
        }

        setPendingBackupData({
          menuItems: targetData.menuItems,
          categories: targetData.menuCategories || targetData.categories,
          branches: targetData.branches,
          blogPosts: targetData.blogPosts,
          gallery: targetData.gallery,
          offers: targetData.specialOffers || targetData.offers,
          testimonials: targetData.testimonials,
          siteSettings: targetData.siteSettings,
        });

        setImportSummary({
          menuCount,
          blogCount,
          branchCount,
          galleryCount,
          offersCount,
          testimonialsCount,
        });

        setIsImportModalOpen(true);
      } catch (err: any) {
        showToast(err?.message || 'Error parsing backup file.', 'error');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const confirmRestoreBackup = () => {
    if (!pendingBackupData) return;

    if (userRole !== 'admin') {
      showToast('Master Administrator privileges required to restore database backups.', 'error');
      setIsImportModalOpen(false);
      return;
    }

    const res = restoreAllDataBackup(pendingBackupData);
    if (res.success) {
      setIsImportModalOpen(false);
      setPendingBackupData(null);
      setImportSummary(null);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div id="admin-backup-export-cms" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Data Protection &amp; Backup</span>
            </span>
            <span className="text-xs text-stone-400 font-mono">Live Kabul Database</span>
          </div>
          <h3 className="font-serif-title text-xl font-bold text-stone-900 mt-1">
            Website Data Backup &amp; CSV/JSON Exporter
          </h3>
          <p className="text-xs text-stone-500">
            Export full system snapshots, menu catalogs, culinary articles, order logs, and branch records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyJSON}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-700 bg-stone-50 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Copy entire database JSON to clipboard"
          >
            {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportFullJSON}
            className="px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Master Backup (.json)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: JSON Master Backup & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Master Backup & Entity Counts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Master Snapshot Card */}
          <div className="bg-gradient-to-br from-[#0c342b] to-[#15463b] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#c5a059]">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif-title text-lg font-bold text-[#faf8f5]">Complete System Snapshot (JSON)</h4>
                  <p className="text-xs text-stone-300">All dishes, articles, branches, photos, orders &amp; settings in one verified bundle</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-mono font-bold border border-[#c5a059]/30">
                JSON v2026.1
              </span>
            </div>

            {/* Quick Live Entity Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-white/10 my-4 text-xs">
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-stone-300 mb-1">
                  <Utensils className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Menu Dishes</span>
                </div>
                <div className="text-base font-bold text-white font-mono">{menuItems.length} Items</div>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-stone-300 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Blog Articles</span>
                </div>
                <div className="text-base font-bold text-white font-mono">{blogPosts.length} Posts</div>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-stone-300 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Kabul Branches</span>
                </div>
                <div className="text-base font-bold text-white font-mono">{branches.length} Locations</div>
              </div>

              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-stone-300 mb-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Photo Gallery</span>
                </div>
                <div className="text-base font-bold text-white font-mono">{gallery.length} Photos</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Compatible with standard restore pipelines &amp; offline storage</span>
              </div>

              <button
                type="button"
                onClick={handleExportFullJSON}
                className="px-6 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#b08d46] text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer font-sans"
              >
                <Download className="w-4 h-4" />
                <span>Export Master JSON File</span>
              </button>
            </div>
          </div>

          {/* Modular CSV Export Options Grid */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif-title text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span>Modular CSV Spreadsheet Exports (Excel / Sheets)</span>
                </h4>
                <p className="text-xs text-stone-500">
                  Formatted with UTF-8 BOM encoding for seamless viewing of Dari, Pashto, and English text.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              
              {/* Menu Items CSV */}
              <div className="p-4 rounded-xl border border-stone-200 hover:border-[#c5a059] transition-all bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Menu Dishes &amp; Pricing</h5>
                    <p className="text-[11px] text-stone-500 font-mono">{menuItems.length} dishes • AFN prices • 3 languages</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportMenuCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#0c342b] hover:text-white border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Download Menu Dishes CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

              {/* Blog Posts CSV */}
              <div className="p-4 rounded-xl border border-stone-200 hover:border-[#c5a059] transition-all bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Culinary Blog Articles</h5>
                    <p className="text-[11px] text-stone-500 font-mono">{blogPosts.length} articles • Trilingual titles &amp; tags</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportBlogCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#0c342b] hover:text-white border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Download Blog Articles CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

              {/* Kabul Branches CSV */}
              <div className="p-4 rounded-xl border border-stone-200 hover:border-[#c5a059] transition-all bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Kabul Branches Directory</h5>
                    <p className="text-[11px] text-stone-500 font-mono">{branches.length} locations • Addresses &amp; phones</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportBranchesCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#0c342b] hover:text-white border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Download Branches CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

              {/* Orders History CSV */}
              <div className="p-4 rounded-xl border border-stone-200 hover:border-[#c5a059] transition-all bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Orders &amp; Dispatch History</h5>
                    <p className="text-[11px] text-stone-500 font-mono">{orders.length} orders • Customer logs &amp; totals</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportOrdersCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#0c342b] hover:text-white border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Download Orders CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

              {/* Table Reservations CSV */}
              <div className="p-4 rounded-xl border border-stone-200 hover:border-[#c5a059] transition-all bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Table Reservations Log</h5>
                    <p className="text-[11px] text-stone-500 font-mono">{reservations.length} bookings • Host station data</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportReservationsCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#0c342b] hover:text-white border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Download Reservations CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

              {/* Customer Reviews CSV */}
              <div className="p-4 rounded-xl border border-stone-200 hover:border-[#c5a059] transition-all bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Reviews &amp; Testimonials</h5>
                    <p className="text-[11px] text-stone-500 font-mono">{testimonials.length} reviews • Guest ratings</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportReviewsCSV}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#0c342b] hover:text-white border border-stone-300 text-stone-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Download Reviews CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right 1 Col: Backup Restore & Safety Controls */}
        <div className="space-y-6">
          
          {/* Restore / Import Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0c342b]/10 text-[#0c342b] flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif-title text-base font-bold text-stone-900">Restore from Backup</h4>
                <p className="text-[11px] text-stone-500">Upload an existing .json backup to restore</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border-2 border-dashed border-stone-300 text-center space-y-3">
              <FileJson className="w-8 h-8 text-stone-400 mx-auto" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Select Backup JSON File</span>
                <span className="text-[10px] text-stone-500">Accepts standard Bukhara snapshot (.json)</span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                id="backup-file-uploader"
              />

              <label
                htmlFor="backup-file-uploader"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Browse File</span>
              </label>
            </div>

            {userRole !== 'admin' && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Restoring requires Master Administrator credentials.</span>
              </div>
            )}
          </div>

          {/* Backup Best Practices & Security */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs space-y-3">
            <h5 className="font-bold text-stone-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#c5a059]" />
              <span>Backup Policy &amp; Security</span>
            </h5>
            <ul className="space-y-2 text-stone-600 text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Credential Leakage:</strong> Exported backups do not expose sensitive internal master PINs.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>UTF-8 Compliant:</strong> CSV exports include Byte Order Marks (BOM) to preserve Dari &amp; Pashto script in Microsoft Excel.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Portability:</strong> Backups can be restored instantly or imported into offline accounting spreadsheets.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Backup Restore Confirmation Modal */}
      {isImportModalOpen && importSummary && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-300 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            </div>

            <div className="text-center">
              <h4 className="font-serif-title text-lg font-bold text-stone-900">
                Confirm Database Restore
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                The uploaded backup contains verified website data. Review the summary below before applying:
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-600">Menu Items:</span>
                <span className="font-bold text-stone-900">{importSummary.menuCount} dishes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Blog Articles:</span>
                <span className="font-bold text-stone-900">{importSummary.blogCount} articles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Kabul Branches:</span>
                <span className="font-bold text-stone-900">{importSummary.branchCount} branches</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Gallery Photos:</span>
                <span className="font-bold text-stone-900">{importSummary.galleryCount} photos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Offers &amp; Deals:</span>
                <span className="font-bold text-stone-900">{importSummary.offersCount} promos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Testimonials:</span>
                <span className="font-bold text-stone-900">{importSummary.testimonialsCount} reviews</span>
              </div>
            </div>

            <div className="p-2.5 bg-red-50 text-red-700 rounded-xl text-[11px] border border-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>Restoring will overwrite current items with the uploaded backup records.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setPendingBackupData(null);
                  setImportSummary(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRestoreBackup}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Apply &amp; Restore Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
