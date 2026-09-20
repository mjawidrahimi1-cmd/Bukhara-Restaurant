import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Branch, AdminRole } from '../../types';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Eye,
  Navigation,
  Lock,
} from 'lucide-react';

interface AdminBranchesCMSProps {
  userRole?: AdminRole;
}

export const AdminBranchesCMS: React.FC<AdminBranchesCMSProps> = ({ userRole = 'admin' }) => {
  const { branches, addBranch, updateBranch, deleteBranch, showToast, setSelectedBranch } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form state
  const [nameEn, setNameEn] = useState('');
  const [nameFa, setNameFa] = useState('');
  const [namePs, setNamePs] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressFa, setAddressFa] = useState('');
  const [addressPs, setAddressPs] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [openingHoursEn, setOpeningHoursEn] = useState('Open 24 Hours / 7 Days a Week');
  const [openingHoursFa, setOpeningHoursFa] = useState('۲۴ ساعته / ۷ روز هفته');
  const [openingHoursPs, setOpeningHoursPs] = useState('۲۴ ساعته / ۷ ورځې په اونۍ کې');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [lat, setLat] = useState(34.5355);
  const [lng, setLng] = useState(69.1711);
  const [photosText, setPhotosText] = useState('');
  const [featuresEnText, setFeaturesEnText] = useState('VIP Family Dining Halls, Open Charcoal Firepit, Saffron Tea Majlis, Free Valet Parking, Prayer Room');
  const [featuresFaText, setFeaturesFaText] = useState('سالون اختصاصی فامیلی، پخت زغالی در حضور مشتری، مجلس چای زعفرانی، پارکینگ رایگان، نمازخانه');
  const [featuresPsText, setFeaturesPsText] = useState('د کورنیو ځانګړی سالون، د سکرو کباب، د زعفرانو چای، وړیا پارکینګ، لمونځ ځای');

  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  const handleOpenNewModal = () => {
    setEditingBranch(null);
    setNameEn('Bukhara Restaurant – New Branch');
    setNameFa('رستورانت بخارا – شعبه جدید');
    setNamePs('د بخارا رستورانت – نوې څانګه');
    setAddressEn('District 10, Kabul, Afghanistan');
    setAddressFa('ناحیه ۱۰، کابل، افغانستان');
    setAddressPs('۱۰ مه ناحیه، کابل، افغانستان');
    setPhone('+93 78 944 4222');
    setWhatsapp('+93789444222');
    setEmail('kabul@bukhararestaurant.af');
    setOpeningHoursEn('Open 24 Hours / 7 Days a Week');
    setOpeningHoursFa('۲۴ ساعته / ۷ روز هفته');
    setOpeningHoursPs('۲۴ ساعته / ۷ ورځې په اونۍ کې');
    setMapEmbedUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.0!2d69.171!3d34.535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDMyJzA3LjgiTiA2OcKwMTAnMTYuMCJF!5e0!3m2!1sen!2saf!4v1620000000000!5m2!1sen!2saf');
    setLat(34.5355);
    setLng(69.1711);
    setPhotosText('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80');
    setFeaturesEnText('VIP Family Dining Halls, Open Charcoal Firepit, Saffron Tea Majlis, Free Valet Parking, Prayer Room');
    setFeaturesFaText('سالون اختصاصی فامیلی، پخت زغالی در حضور مشتری، مجلس چای زعفرانی، پارکینگ رایگان، نمازخانه');
    setFeaturesPsText('د کورنیو ځانګړی سالون، د سکرو کباب، د زعفرانو چای، وړیا پارکینګ، لمونځ ځای');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: Branch) => {
    setEditingBranch(b);
    setNameEn(b.nameEn);
    setNameFa(b.nameFa);
    setNamePs(b.namePs);
    setAddressEn(b.addressEn);
    setAddressFa(b.addressFa);
    setAddressPs(b.addressPs);
    setPhone(b.phone);
    setWhatsapp(b.whatsapp);
    setEmail(b.email);
    setOpeningHoursEn(b.openingHoursEn);
    setOpeningHoursFa(b.openingHoursFa);
    setOpeningHoursPs(b.openingHoursPs);
    setMapEmbedUrl(b.mapEmbedUrl);
    setLat(b.coordinates.lat);
    setLng(b.coordinates.lng);
    setPhotosText(b.photos.join('\n'));
    setFeaturesEnText(b.featuresEn.join(', '));
    setFeaturesFaText(b.featuresFa.join('، '));
    setFeaturesPsText(b.featuresPs.join('، '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim() || !addressEn.trim()) {
      showToast('Please provide a branch name and street address in English', 'error');
      return;
    }

    const photos = photosText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const featuresEn = featuresEnText
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const featuresFa = featuresFaText
      .split(/[,،]/)
      .map((f) => f.trim())
      .filter(Boolean);

    const featuresPs = featuresPsText
      .split(/[,،]/)
      .map((f) => f.trim())
      .filter(Boolean);

    const slug = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (editingBranch) {
      const updated: Branch = {
        ...editingBranch,
        nameEn,
        nameFa: nameFa || nameEn,
        namePs: namePs || nameEn,
        addressEn,
        addressFa: addressFa || addressEn,
        addressPs: addressPs || addressEn,
        phone,
        whatsapp,
        email,
        openingHoursEn,
        openingHoursFa: openingHoursFa || openingHoursEn,
        openingHoursPs: openingHoursPs || openingHoursEn,
        mapEmbedUrl,
        coordinates: { lat: Number(lat), lng: Number(lng) },
        photos: photos.length > 0 ? photos : editingBranch.photos,
        featuresEn: featuresEn.length > 0 ? featuresEn : editingBranch.featuresEn,
        featuresFa: featuresFa.length > 0 ? featuresFa : editingBranch.featuresFa,
        featuresPs: featuresPs.length > 0 ? featuresPs : editingBranch.featuresPs,
      };
      updateBranch(updated);
    } else {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        slug: slug || `branch-${Date.now()}`,
        nameEn,
        nameFa: nameFa || nameEn,
        namePs: namePs || nameEn,
        addressEn,
        addressFa: addressFa || addressEn,
        addressPs: addressPs || addressEn,
        phone,
        whatsapp,
        email,
        openingHoursEn,
        openingHoursFa: openingHoursFa || openingHoursEn,
        openingHoursPs: openingHoursPs || openingHoursEn,
        mapEmbedUrl,
        coordinates: { lat: Number(lat), lng: Number(lng) },
        photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'],
        featuresEn: featuresEn.length > 0 ? featuresEn : ['VIP Family Halls', 'Charcoal Grills'],
        featuresFa: featuresFa.length > 0 ? featuresFa : ['سالون فامیلی'],
        featuresPs: featuresPs.length > 0 ? featuresPs : ['د کورنیو سالون'],
      };
      addBranch(newBranch);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (userRole !== 'admin') {
      showToast('Administrator privileges required to delete a branch location.', 'error');
      setDeletingBranchId(null);
      return;
    }
    if (deletingBranchId) {
      if (branches.length <= 1) {
        showToast('At least one primary restaurant location must remain active.', 'error');
        setDeletingBranchId(null);
        return;
      }
      deleteBranch(deletingBranchId);
      setDeletingBranchId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0c342b]/10 border border-[#0c342b]/20 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-[#0c342b]" />
          </div>
          <div>
            <h3 className="font-serif-title text-xl font-bold text-stone-900">
              Branches &amp; Addresses CMS
            </h3>
            <p className="text-xs text-stone-500">
              Control physical addresses, neighborhood locations, hotlines, WhatsApp numbers, operating hours, and Google Maps embed codes for all Bukhara Kabul locations.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch Location</span>
        </button>
      </div>

      {/* Locations Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative h-44 bg-stone-100 overflow-hidden group">
                <img
                  src={b.photos[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
                  alt={b.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0c342b]/90 backdrop-blur-md text-[#c5a059] text-[10px] font-bold uppercase tracking-wider">
                  24/7 Service
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px]">
                  {b.photos.length} Photos
                </span>
              </div>

              {/* Details */}
              <div className="p-5 space-y-3">
                <div>
                  <h4 className="font-serif-title text-base font-bold text-stone-900 mb-1">
                    {b.nameEn}
                  </h4>
                  <div className="text-xs text-stone-500 font-sans" dir="rtl">
                    {b.nameFa}
                  </div>
                </div>

                {/* Address Box */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">{b.addressEn}</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5" dir="rtl">{b.addressFa}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Hours */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp: {b.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{b.openingHoursEn}</span>
                  </div>
                </div>

                {/* Features Tags */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
                  {b.featuresEn.slice(0, 3).map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]">
                      {f}
                    </span>
                  ))}
                  {b.featuresEn.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-stone-400">
                      +{b.featuresEn.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedBranch(b)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0c342b] hover:text-[#c5a059] transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(b)}
                  title="Edit branch details"
                  className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {userRole === 'admin' ? (
                  <button
                    onClick={() => setDeletingBranchId(b.id)}
                    title="Delete branch (Admin only)"
                    className="p-2 rounded-xl bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 transition-colors border border-stone-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => showToast('Administrator privileges required to delete a branch location.', 'error')}
                    title="Branch deletion locked for Manager role"
                    className="p-2 rounded-xl bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200 flex items-center justify-center"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-300 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-[#0c342b] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-serif-title text-lg font-bold">
                  {editingBranch ? `Edit Location: ${editingBranch.nameEn}` : 'Add New Branch Location'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Branch Names */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Branch Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Bukhara Restaurant – Qowai Markaz (Main Flagship)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-[#c5a059]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    نام شعبه (فارسی / دری)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={nameFa}
                    onChange={(e) => setNameFa(e.target.value)}
                    placeholder="رستورانت بخارا – شعبه قوای مرکز"
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    د څانګې نوم (پښتو)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={namePs}
                    onChange={(e) => setNamePs(e.target.value)}
                    placeholder="د بخارا رستورانت – د قوای مرکز څانګه"
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              {/* Physical Addresses (English, Dari, Pashto) */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c5a059]" />
                  Physical Street Address Details
                </h5>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Full Address (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressEn}
                    onChange={(e) => setAddressEn(e.target.value)}
                    placeholder="e.g. Qowai Markaz, District 2, Kabul, Afghanistan"
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059] bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      آدرس دقیق (فارسی / دری)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={addressFa}
                      onChange={(e) => setAddressFa(e.target.value)}
                      placeholder="قوای مرکز، ناحیه ۲، کابل، افغانستان"
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      بشپړ ادرس (پښتو)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={addressPs}
                      onChange={(e) => setAddressPs(e.target.value)}
                      placeholder="قوای مرکز، ۲ مه ناحیه، کابل، افغانستان"
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#c5a059] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Hotlines & Operations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Hotline
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+93 78 944 4222"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    WhatsApp Orders
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+93789444222"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kabul@bukhara.af"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Operating Hours (English)
                </label>
                <input
                  type="text"
                  value={openingHoursEn}
                  onChange={(e) => setOpeningHoursEn(e.target.value)}
                  placeholder="Open 24 Hours / 7 Days a Week"
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              {/* Google Maps Embed URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Google Maps Embed Iframe URL
                </label>
                <input
                  type="text"
                  value={mapEmbedUrl}
                  onChange={(e) => setMapEmbedUrl(e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>

              {/* Photo URLs */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Photo URLs (One per line)
                  </label>
                  <span className="text-[11px] text-stone-400">First image is the primary banner</span>
                </div>
                <textarea
                  rows={3}
                  value={photosText}
                  onChange={(e) => setPhotosText(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                />
              </div>

              {/* Amenities & Features */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Key Amenities &amp; Features (Comma-separated)
                </label>
                <input
                  type="text"
                  value={featuresEnText}
                  onChange={(e) => setFeaturesEnText(e.target.value)}
                  placeholder="VIP Family Halls, Free Valet Parking, Prayer Room, Charcoal Firepit"
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {editingBranch ? 'Save Branch Changes' : 'Create Branch Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingBranchId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-300 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-title text-lg font-bold text-stone-900 mb-1">Remove Branch?</h4>
            <p className="text-xs text-stone-500 mb-6">
              Are you sure you want to remove this branch location from the website?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingBranchId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
