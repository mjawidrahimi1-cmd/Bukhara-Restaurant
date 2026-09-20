import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SiteSettings, AdminRole } from '../../types';
import {
  Sliders,
  Sparkles,
  Phone,
  MessageSquare,
  Mail,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Type,
  Globe,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface AdminSettingsCMSProps {
  userRole?: AdminRole;
}

export const AdminSettingsCMS: React.FC<AdminSettingsCMSProps> = ({ userRole = 'admin' }) => {
  const { siteSettings, updateSiteSettings, resetAllContentToDefault, showToast } = useStore();

  // Announcement bar state
  const [announcementEnabled, setAnnouncementEnabled] = useState(siteSettings.announcementBar?.enabled ?? true);
  const [announcementTextEn, setAnnouncementTextEn] = useState(siteSettings.announcementBar?.textEn || '');
  const [announcementTextFa, setAnnouncementTextFa] = useState(siteSettings.announcementBar?.textFa || '');
  const [announcementTextPs, setAnnouncementTextPs] = useState(siteSettings.announcementBar?.textPs || '');

  // Hero content state
  const [headlineEn, setHeadlineEn] = useState(siteSettings.heroContent?.headlineEn || 'The Grand Afghan Royal Dastarkhan');
  const [headlineFa, setHeadlineFa] = useState(siteSettings.heroContent?.headlineFa || 'دستـرخوان شـاهی و اصیـل افـغانسـتان');
  const [headlinePs, setHeadlinePs] = useState(siteSettings.heroContent?.headlinePs || 'د افـغانـستان شـاهي او اصیـل دستـرخوان');
  const [subheadlineEn, setSubheadlineEn] = useState(
    siteSettings.heroContent?.subheadlineEn ||
      'Savor generations of heritage culinary art in Kabul. 24/7 charcoal grills, slow-steamed Kabuli Pulao, royal clay-tandoor breads, and majestic family dining halls.'
  );
  const [subheadlineFa, setSubheadlineFa] = useState(
    siteSettings.heroContent?.subheadlineFa ||
      'میراث قرن‌ها هنر آشپزی کابل در فضایی مجلل و خانوادگی. کباب‌های زغالی، قابلی پلو زعفرانی، نان‌های تنوری روغنی و خدمات ۲۴ ساعته در تمام روزهای هفته.'
  );
  const [subheadlinePs, setSubheadlinePs] = useState(
    siteSettings.heroContent?.subheadlinePs ||
      'په کابل کې د پیړیو پخلی هنر او شاهي خوند. د سکرو کبابونه، زعفراني قابلي پلو، په تنور کې تازه ډوډۍ او ۲۴ ساعته خدمتونه.'
  );
  const [heroBadgeEn, setHeroBadgeEn] = useState(siteSettings.heroContent?.badgeEn || 'Open 24 Hours • Kabul, Afghanistan');

  // Contact details
  const [mainPhone, setMainPhone] = useState(siteSettings.mainPhone || '+93 78 944 4222');
  const [mainWhatsapp, setMainWhatsapp] = useState(siteSettings.mainWhatsapp || '+93789444222');
  const [email, setEmail] = useState(siteSettings.email || 'info@bukhararestaurant.af');
  const [currencySymbol, setCurrencySymbol] = useState(siteSettings.currencySymbol || 'AFN');
  const [googleRating, setGoogleRating] = useState(siteSettings.googleRating || 4.9);
  const [googleReviewCount, setGoogleReviewCount] = useState(siteSettings.googleReviewCount || 1840);

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: SiteSettings = {
      ...siteSettings,
      mainPhone,
      mainWhatsapp,
      email,
      currencySymbol,
      googleRating: Number(googleRating),
      googleReviewCount: Number(googleReviewCount),
      announcementBar: {
        enabled: announcementEnabled,
        textEn: announcementTextEn,
        textFa: announcementTextFa || announcementTextEn,
        textPs: announcementTextPs || announcementTextEn,
      },
      heroContent: {
        headlineEn,
        headlineFa,
        headlinePs,
        subheadlineEn,
        subheadlineFa,
        subheadlinePs,
        badgeEn: heroBadgeEn,
      },
    };

    updateSiteSettings(updated);
    showToast('Website sections & settings saved and published!', 'success');
  };

  const handleResetConfirm = () => {
    if (userRole !== 'admin') {
      showToast('Administrator privileges required to perform factory content reset.', 'error');
      setIsResetConfirmOpen(false);
      return;
    }
    resetAllContentToDefault();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0c342b]/10 border border-[#0c342b]/20 flex items-center justify-center shrink-0">
            <Sliders className="w-6 h-6 text-[#0c342b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title text-xl font-bold text-stone-900">
                Storefront &amp; Website Sections Control
              </h3>
              {userRole === 'manager' && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200">
                  🛡️ Shift Manager Mode
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Customize the front-page Hero headlines, top announcement bar, brand contact hotlines, and social links in real time.
            </p>
          </div>
        </div>

        {userRole === 'admin' ? (
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs font-semibold transition-colors border border-stone-200 cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Content to Default</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => showToast('Administrator privileges required to perform factory content reset.', 'error')}
            title="Reset requires Administrator role"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-400 text-xs font-semibold border border-stone-200 cursor-not-allowed self-start md:self-auto"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Reset Locked (Admin Only)</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Top Announcement Bar Control */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-5 h-5 text-[#c5a059]" />
              <div>
                <h4 className="font-serif-title text-base font-bold text-stone-900">
                  Header Announcement Bar
                </h4>
                <p className="text-xs text-stone-500">The scrolling highlight ticker shown at the very top of the website</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0c342b]"></div>
              <span className="ml-3 text-xs font-bold text-stone-700">
                {announcementEnabled ? 'Ticker Active' : 'Hidden'}
              </span>
            </label>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Announcement Message (English)
              </label>
              <input
                type="text"
                value={announcementTextEn}
                onChange={(e) => setAnnouncementTextEn(e.target.value)}
                placeholder="Open 24/7 in Kabul • Free Delivery on Orders Over 1,500 AFN • Call +93 78 944 4222"
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  پیام نوار اعلان (دری / فارسی)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={announcementTextFa}
                  onChange={(e) => setAnnouncementTextFa(e.target.value)}
                  placeholder="خدمات ۲۴ ساعته در کابل • ارسال رایگان برای سفارش‌های بالای ۱۵۰۰ افغانی..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  د اعلان پټې متن (پښتو)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={announcementTextPs}
                  onChange={(e) => setAnnouncementTextPs(e.target.value)}
                  placeholder="په کابل کې ۲۴ ساعته خلاص • د ۱۵۰۰ افغانیو څخه پورته وړیا رسول..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Headlines Control */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Type className="w-5 h-5 text-[#c5a059]" />
            <div>
              <h4 className="font-serif-title text-base font-bold text-stone-900">
                Hero Section Headlines &amp; Subtitles
              </h4>
              <p className="text-xs text-stone-500">The primary welcoming banner displayed on the landing page</p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Main Headline (English)
              </label>
              <input
                type="text"
                value={headlineEn}
                onChange={(e) => setHeadlineEn(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-serif-title text-base font-bold text-stone-900 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  سرلیک اصلی هیرو (دری / فارسی)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={headlineFa}
                  onChange={(e) => setHeadlineFa(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  د هیرو اصلي سرلیک (پښتو)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={headlinePs}
                  onChange={(e) => setHeadlinePs(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm font-bold text-stone-900 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            {/* Subheadlines */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Subheadline &amp; Narrative (English)
              </label>
              <textarea
                rows={2}
                value={subheadlineEn}
                onChange={(e) => setSubheadlineEn(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs leading-relaxed focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  توضیحات فرعی هیرو (دری / فارسی)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={subheadlineFa}
                  onChange={(e) => setSubheadlineFa(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  د هیرو فرعي توضیحات (پښتو)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={subheadlinePs}
                  onChange={(e) => setSubheadlinePs(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Header Badge Pill
              </label>
              <input
                type="text"
                value={heroBadgeEn}
                onChange={(e) => setHeroBadgeEn(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Storefront Info */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#c5a059]" />
            <div>
              <h4 className="font-serif-title text-base font-bold text-stone-900">
                Official Contact Hotlines &amp; Ratings
              </h4>
              <p className="text-xs text-stone-500">Contact details shown in headers, footers, and WhatsApp ordering triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Main Telephone Hotline
              </label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={mainPhone}
                  onChange={(e) => setMainPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Official WhatsApp Order Line
              </label>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={mainWhatsapp}
                  onChange={(e) => setMainWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Menu Currency Code
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Google Rating Display (e.g. 4.9)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={googleRating}
                onChange={(e) => setGoogleRating(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Review Count Display (e.g. 1840)
              </label>
              <input
                type="number"
                min="0"
                value={googleReviewCount}
                onChange={(e) => setGoogleReviewCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save &amp; Publish Website Changes</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-lg font-bold text-stone-900 mb-1">
              Reset All Content to Default?
            </h4>
            <p className="text-xs text-stone-500 mb-6">
              This will restore default Kabul showcase data for menus, blog articles, photo gallery, branches, and site settings.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
