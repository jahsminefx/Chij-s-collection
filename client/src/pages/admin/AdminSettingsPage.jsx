import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Store,
  Phone,
  Clock,
  Truck,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { storeAPI } from '../../services/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import WhatsAppPreview from '../../components/admin/WhatsAppPreview.jsx';
import { showToast } from '../../components/common/Toast.jsx';

export default function AdminSettingsPage() {
  const { refreshSettings } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [storeName, setStoreName] = useState("CHIJ's Collection");
  const [tagline, setTagline] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // Contact
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');

  // Hours
  const defaultHours = [
    { day: 'Monday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Tuesday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Wednesday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Thursday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Friday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Saturday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'Sunday', openTime: '12:00', closeTime: '17:00', isOpen: false },
  ];
  const [openingHours, setOpeningHours] = useState(defaultHours);

  // Policies
  const [deliveryInfo, setDeliveryInfo] = useState('');
  const [exchangePolicy, setExchangePolicy] = useState('');

  // WhatsApp
  const [whatsappTemplate, setWhatsappTemplate] = useState('');

  // Socials
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await storeAPI.getAdminSettings();
        if (res.success && res.data) {
          const s = res.data;
          setStoreName(s.storeName || "CHIJ's Collection");
          setTagline(s.tagline || '');
          setAnnouncement(s.announcement || '');
          setAnnouncementEnabled(s.announcementEnabled !== undefined ? s.announcementEnabled : true);

          setPhone(s.phone || '');
          setWhatsappNumber(s.whatsappNumber || '');
          setEmail(s.email || '');
          setAddress(s.address || '');
          setCity(s.city || '');
          setState(s.state || '');
          setMapsUrl(s.mapsUrl || '');

          if (s.openingHours && Array.isArray(s.openingHours)) {
            setOpeningHours(s.openingHours);
          }

          setDeliveryInfo(s.deliveryInfo || '');
          setExchangePolicy(s.exchangePolicy || '');
          setWhatsappTemplate(s.whatsappTemplate || '');

          setInstagram(s.instagram || '');
          setFacebook(s.facebook || '');
          setTiktok(s.tiktok || '');
        }
      } catch (err) {
        showToast('Error loading store settings', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleHourChange = (index, field, value) => {
    const updated = [...openingHours];
    updated[index] = { ...updated[index], [field]: value };
    setOpeningHours(updated);
  };

  const insertVariable = (variableName) => {
    setWhatsappTemplate((prev) => `${prev} {{${variableName}}}`);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      const payload = {
        storeName,
        tagline,
        announcement,
        announcementEnabled,
        phone,
        whatsappNumber,
        email,
        address,
        city,
        state,
        mapsUrl,
        openingHours,
        deliveryInfo,
        exchangePolicy,
        whatsappTemplate,
        instagram,
        facebook,
        tiktok,
      };

      const res = await storeAPI.updateSettings(payload);
      if (res.success) {
        showToast('Store settings saved successfully');
        refreshSettings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General & Brand', icon: Store },
    { id: 'contact', label: 'Contact & Location', icon: Phone },
    { id: 'hours', label: 'Opening Hours', icon: Clock },
    { id: 'policies', label: 'Delivery & Policies', icon: Truck },
    { id: 'whatsapp', label: 'WhatsApp Template', icon: MessageCircle },
    { id: 'social', label: 'Social Media', icon: Share2 },
  ];

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Store Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure boutique identity, contact phone, WhatsApp order templates, and policies.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-xs disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-zinc-200 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-t transition-colors whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? 'border-brand-primary text-zinc-900 bg-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-xs text-xs space-y-6">
        {/* TAB 1: General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold text-zinc-900 border-b pb-2">
              Brand Identity & Announcement Bar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Store Brand Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Store Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Refined Contemporary Fashion & Curated Footwear"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-zinc-700 uppercase tracking-wider">
                    Header Announcement Bar Text
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                      className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4"
                    />
                    <span className="font-semibold text-zinc-800">Show Announcement Bar</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. ✨ New Arrivals Just Dropped! Nationwide delivery available."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Contact & Location */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold text-zinc-900 border-b pb-2">
              Boutique Contact & Physical Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Customer Phone Line (Calls) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 812 345 6789"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Used by customers clicking "Call to Order"
                </p>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Store WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="2348123456789 (country code, no +)"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  International format without leading plus, e.g. 2348123456789
                </p>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Store Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@chijscollection.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Physical Store Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Plot 14 Airport Road, Opposite High Court"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Warri"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Delta State"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Opening Hours */}
        {activeTab === 'hours' && (
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold text-zinc-900 border-b pb-2">
              Weekly Operational Hours
            </h3>

            <div className="space-y-3">
              {openingHours.map((item, idx) => (
                <div
                  key={item.day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded"
                >
                  <div className="w-32 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`day-${item.day}`}
                      checked={item.isOpen}
                      onChange={(e) => handleHourChange(idx, 'isOpen', e.target.checked)}
                      className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4"
                    />
                    <label htmlFor={`day-${item.day}`} className="font-bold text-zinc-800 cursor-pointer">
                      {item.day}
                    </label>
                  </div>

                  {item.isOpen ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={item.openTime}
                        onChange={(e) => handleHourChange(idx, 'openTime', e.target.value)}
                        className="px-2.5 py-1.5 border border-zinc-300 rounded bg-white"
                      />
                      <span className="text-zinc-400">to</span>
                      <input
                        type="time"
                        value={item.closeTime}
                        onChange={(e) => handleHourChange(idx, 'closeTime', e.target.value)}
                        className="px-2.5 py-1.5 border border-zinc-300 rounded bg-white"
                      />
                    </div>
                  ) : (
                    <span className="text-zinc-400 font-semibold italic">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Delivery & Policies */}
        {activeTab === 'policies' && (
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold text-zinc-900 border-b pb-2">
              Customer Policies & Dispatch Details
            </h3>

            <div>
              <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Nationwide Delivery Information
              </label>
              <textarea
                rows={5}
                value={deliveryInfo}
                onChange={(e) => setDeliveryInfo(e.target.value)}
                placeholder="Explain dispatch timelines, courier partners, Lagos/Abuja/interstate shipping..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm font-sans"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Size Exchange Policy
              </label>
              <textarea
                rows={5}
                value={exchangePolicy}
                onChange={(e) => setExchangePolicy(e.target.value)}
                placeholder="Explain the terms under which customers can swap sizes..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm font-sans"
              />
            </div>
          </div>
        )}

        {/* TAB 5: WhatsApp Template Settings */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-zinc-900 border-b pb-2">
              WhatsApp Pre-filled Order Message Template
            </h3>

            <div className="space-y-3">
              <label className="block font-bold text-zinc-700 uppercase tracking-wider">
                Order Message Template
              </label>
              <textarea
                rows={7}
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                placeholder="Hello CHIJ's Collection 👋..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm font-mono"
              />

              {/* Dynamic Variables Chips */}
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5">
                  Click variable to insert into template:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['product_name', 'size', 'price', 'product_url', 'category'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertVariable(tag)}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded text-[11px] font-mono font-semibold text-zinc-800"
                    >
                      + {'{{' + tag + '}}'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-4">
                <WhatsAppPreview template={whatsappTemplate} phone={whatsappNumber} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Social Media Links */}
        {activeTab === 'social' && (
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold text-zinc-900 border-b pb-2">
              Social Media Accounts (Optional)
            </h3>
            <p className="text-[11px] text-zinc-500">
              Only links that are filled in will appear on the public footer.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/chijscollection"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/chijscollection"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  TikTok Profile URL
                </label>
                <input
                  type="url"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@chijscollection"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
