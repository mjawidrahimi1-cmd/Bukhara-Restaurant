import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminRole } from '../../types';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Users,
  Shield,
  UserCheck,
  Crown,
  ChefHat,
  Info,
} from 'lucide-react';

interface AdminSecurityPasswordProps {
  userRole?: AdminRole;
}

export const AdminSecurityPassword: React.FC<AdminSecurityPasswordProps> = ({ userRole = 'admin' }) => {
  const { siteSettings, changeAdminPin, changeManagerPin, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'adminPin' | 'managerPin'>('adminPin');

  // Admin PIN Form State
  const [currentAdminPin, setCurrentAdminPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [confirmAdminPin, setConfirmAdminPin] = useState('');
  const [showCurrentAdmin, setShowCurrentAdmin] = useState(false);
  const [showNewAdmin, setShowNewAdmin] = useState(false);
  const [showConfirmAdmin, setShowConfirmAdmin] = useState(false);

  // Manager PIN Form State
  const [authAdminPinForManager, setAuthAdminPinForManager] = useState('');
  const [newManagerPin, setNewManagerPin] = useState('');
  const [confirmManagerPin, setConfirmManagerPin] = useState('');
  const [showAuthAdmin, setShowAuthAdmin] = useState(false);
  const [showNewManager, setShowNewManager] = useState(false);
  const [showConfirmManager, setShowConfirmManager] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAdminPin = siteSettings.adminPin || 'Rahimi1234';
  const activeManagerPin = siteSettings.managerPin || 'manager2026';

  // Evaluate password strength
  const getStrength = (val: string) => {
    if (!val) return { label: 'Empty', color: 'bg-stone-200 text-stone-600', score: 0 };
    if (val.length < 4) return { label: 'Too short', color: 'bg-red-100 text-red-700', score: 1 };
    if (val.length < 6) return { label: 'Fair', color: 'bg-amber-100 text-amber-700', score: 2 };
    if (val.length >= 8 && /[0-9]/.test(val) && /[a-zA-Z]/.test(val)) {
      return { label: 'Strong', color: 'bg-emerald-100 text-emerald-800', score: 4 };
    }
    return { label: 'Moderate', color: 'bg-blue-100 text-blue-700', score: 3 };
  };

  const handleAdminPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (userRole !== 'admin') {
      setStatusMessage({ type: 'error', text: 'Administrator privileges required to change security credentials.' });
      return;
    }

    if (!currentAdminPin.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your current administrator PIN.' });
      return;
    }

    if (newAdminPin.trim().length < 4) {
      setStatusMessage({ type: 'error', text: 'New PIN must be at least 4 characters long.' });
      return;
    }

    if (newAdminPin !== confirmAdminPin) {
      setStatusMessage({ type: 'error', text: 'New PIN and Confirmation PIN do not match.' });
      return;
    }

    setIsSubmitting(true);
    const result = changeAdminPin(currentAdminPin, newAdminPin);
    setIsSubmitting(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: 'Executive Administrator PIN updated and saved successfully.',
      });
      setCurrentAdminPin('');
      setNewAdminPin('');
      setConfirmAdminPin('');
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to update PIN. Please verify your current PIN.',
      });
    }
  };

  const handleManagerPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (userRole !== 'admin') {
      setStatusMessage({ type: 'error', text: 'Administrator privileges required to manage role credentials.' });
      return;
    }

    if (!authAdminPinForManager.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your current Master Admin PIN to authenticate this change.' });
      return;
    }

    if (newManagerPin.trim().length < 4) {
      setStatusMessage({ type: 'error', text: 'New Manager PIN must be at least 4 characters long.' });
      return;
    }

    if (newManagerPin !== confirmManagerPin) {
      setStatusMessage({ type: 'error', text: 'New Manager PIN and Confirmation PIN do not match.' });
      return;
    }

    setIsSubmitting(true);
    const result = changeManagerPin(authAdminPinForManager, newManagerPin);
    setIsSubmitting(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: 'Shift Manager Operations PIN updated and saved successfully.',
      });
      setAuthAdminPinForManager('');
      setNewManagerPin('');
      setConfirmManagerPin('');
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to update Manager PIN. Please verify your Master Admin PIN.',
      });
    }
  };

  // If Manager Role is logged in, show restricted view
  if (userRole === 'manager') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-serif-title text-xl font-bold text-stone-900">
                  Role Permission Restriction
                </h3>
                <p className="text-xs text-stone-500">
                  You are currently logged in with the <span className="font-bold text-amber-800">Shift Manager</span> role.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
              🛡️ Shift Manager Active
            </span>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              Administrator Authorization Required
            </p>
            <p>
              Security PIN credentials and system access parameters can only be altered by an authorized <strong>Executive Administrator</strong>. Shift Managers have operational access for kitchen dispatch, order status progression, reservation seating, and blog content creation, but cannot modify system security codes or erase archived content.
            </p>
          </div>
        </div>

        {/* Roles & Permissions Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c5a059]" />
            Role &amp; Permission Access Matrix
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2.5 font-bold uppercase tracking-wider">Module / Action</th>
                  <th className="py-2.5 font-bold uppercase tracking-wider text-center">👑 Executive Admin</th>
                  <th className="py-2.5 font-bold uppercase tracking-wider text-center">🛡️ Shift Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="py-2.5 font-medium">Live Kitchen Operations &amp; KDS Dispatch</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Order Management &amp; Status Updates</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Guest Reservations &amp; Table Allocations</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Menu Availability (86ing Items) &amp; Pricing</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Blog &amp; Story CMS (Write &amp; Edit)</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Write &amp; Edit</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Delete Historical Blog Posts &amp; Archives</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Allowed</td>
                  <td className="py-2.5 text-center text-red-500 font-bold">Restricted</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Change Security PINs / System Passwords</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Allowed</td>
                  <td className="py-2.5 text-center text-red-500 font-bold">Restricted</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Delete Physical Branches / Wipe Data</td>
                  <td className="py-2.5 text-center text-emerald-600 font-bold">Allowed</td>
                  <td className="py-2.5 text-center text-red-500 font-bold">Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const currentPinStrength = getStrength(activeTab === 'adminPin' ? newAdminPin : newManagerPin);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0c342b]/10 border border-[#0c342b]/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#0c342b]" />
          </div>
          <div>
            <h3 className="font-serif-title text-xl font-bold text-stone-900">
              Role Access &amp; Multi-User Security
            </h3>
            <p className="text-xs text-stone-500">
              Configure independent PIN codes for Executive Administrators and Shift Operations Managers.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Crown className="w-4 h-4 text-[#c5a059]" />
          <span>Executive Administrator Privilege</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Password Change Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          {/* Sub Tab Switcher */}
          <div className="flex border-b border-stone-200 mb-6 gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab('adminPin');
                setStatusMessage(null);
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'adminPin'
                  ? 'border-[#0c342b] text-[#0c342b]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Crown className="w-4 h-4 text-[#c5a059]" />
              <span>Executive Admin PIN</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('managerPin');
                setStatusMessage(null);
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'managerPin'
                  ? 'border-[#0c342b] text-[#0c342b]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <ChefHat className="w-4 h-4 text-blue-600" />
              <span>Shift Manager PIN</span>
            </button>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-xl border mb-6 flex items-start gap-3 text-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-bold block mb-0.5">
                  {statusMessage.type === 'success' ? 'Password Changed Successfully' : 'Update Failed'}
                </span>
                <span>{statusMessage.text}</span>
              </div>
            </div>
          )}

          {activeTab === 'adminPin' ? (
            /* Admin PIN Form */
            <form onSubmit={handleAdminPasswordChange} className="space-y-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span className="font-semibold">Target Account:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  👑 Master Administrator
                </span>
              </div>

              {/* Current PIN */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Current Master PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentAdmin ? 'text' : 'password'}
                    value={currentAdminPin}
                    onChange={(e) => setCurrentAdminPin(e.target.value)}
                    placeholder="Enter current master PIN"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentAdmin(!showCurrentAdmin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    {showCurrentAdmin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {activeAdminPin === 'bukhara2026' ? (
                  <p className="text-[11px] text-stone-400 mt-1">
                    Initial Setup Hint: Default access key is <code className="font-mono font-bold text-stone-600">bukhara2026</code>.
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Customized Master PIN active.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* New PIN */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    New Master PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewAdmin ? 'text' : 'password'}
                      value={newAdminPin}
                      onChange={(e) => setNewAdminPin(e.target.value)}
                      placeholder="Enter new PIN"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewAdmin(!showNewAdmin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showNewAdmin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New PIN */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Confirm New PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmAdmin ? 'text' : 'password'}
                      value={confirmAdminPin}
                      onChange={(e) => setConfirmAdminPin(e.target.value)}
                      placeholder="Re-enter new PIN"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmAdmin(!showConfirmAdmin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showConfirmAdmin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Strength meter */}
              {newAdminPin && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">Password Strength:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${currentPinStrength.color}`}>
                    {currentPinStrength.label}
                  </span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentAdminPin('');
                    setNewAdminPin('');
                    setConfirmAdminPin('');
                    setStatusMessage(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Clear Fields
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0c342b] hover:bg-[#c5a059] text-white hover:text-[#0c342b] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Admin PIN</span>
                </button>
              </div>
            </form>
          ) : (
            /* Manager PIN Form */
            <form onSubmit={handleManagerPasswordChange} className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <span className="font-semibold">Target Account:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  🛡️ Shift Operations Manager
                </span>
              </div>

              {/* Master Admin PIN Authentication */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Authorize with Master Admin PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showAuthAdmin ? 'text' : 'password'}
                    value={authAdminPinForManager}
                    onChange={(e) => setAuthAdminPinForManager(e.target.value)}
                    placeholder="Enter Master Admin PIN"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthAdmin(!showAuthAdmin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    {showAuthAdmin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* New Manager PIN */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    New Manager PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewManager ? 'text' : 'password'}
                      value={newManagerPin}
                      onChange={(e) => setNewManagerPin(e.target.value)}
                      placeholder="Enter new Manager PIN"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewManager(!showNewManager)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showNewManager ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Manager PIN */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Confirm New Manager PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmManager ? 'text' : 'password'}
                      value={confirmManagerPin}
                      onChange={(e) => setConfirmManagerPin(e.target.value)}
                      placeholder="Re-enter new Manager PIN"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-mono text-sm focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmManager(!showConfirmManager)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showConfirmManager ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Strength meter */}
              {newManagerPin && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">Password Strength:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${currentPinStrength.color}`}>
                    {currentPinStrength.label}
                  </span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setAuthAdminPinForManager('');
                    setNewManagerPin('');
                    setConfirmManagerPin('');
                    setStatusMessage(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Clear Fields
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Manager PIN</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Roles & Guidelines Card */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c5a059]" />
              Role Responsibilities
            </h4>
            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                  <Crown className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>👑 Executive Administrator</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Unrestricted access to all system controls, PIN management, database archives, and branch records.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                  <ChefHat className="w-3.5 h-3.5 text-blue-600" />
                  <span>🛡️ Shift Operations Manager</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Kitchen order progression, table bookings, menu stock toggles, and article creation. Deletion of historical articles and credential configuration are restricted.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200/80 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700 block mb-0.5">Active Role:</span>
            <span>Administrator authenticated. Full access privileges active.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
