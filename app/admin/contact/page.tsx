'use client';

import React, { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface ContactInfo {
  emails?: {
    support: string;
    sales: string;
    general: string;
  };
  phones?: {
    support: string;
    sales: string;
  };
  address?: {
    street: string;
    district: string;
    postal: string;
    country: string;
  };
  social?: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  hours?: {
    weekdays: string;
    weekend: string;
  };
}

export default function ContactManagement() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'İletişim bilgileri başarıyla güncellendi! Ana sayfadaki değişiklikleri görmek için sayfayı yenileyin.' });
      } else {
        throw new Error('Güncelleme başarısız');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Güncelleme sırasında hata oluştu' });
    } finally {
      setSaving(false);
    }
  };

  const updateContactInfo = (section: keyof ContactInfo, key: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">İletişim Yönetimi</h1>
          <p className="text-slate-400 mt-2">Ana sayfada görünen iletişim bilgilerini yönetin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      {message && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* E-posta Adresleri */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">E-posta Adresleri</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Destek E-postası</label>
              <input
                type="email"
                value={contactInfo.emails?.support || ''}
                onChange={(e) => updateContactInfo('emails', 'support', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="destek@ravenkart.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Satış E-postası</label>
              <input
                type="email"
                value={contactInfo.emails?.sales || ''}
                onChange={(e) => updateContactInfo('emails', 'sales', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="satis@ravenkart.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Genel E-posta</label>
              <input
                type="email"
                value={contactInfo.emails?.general || ''}
                onChange={(e) => updateContactInfo('emails', 'general', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="info@ravenkart.com"
              />
            </div>
          </div>
        </div>

        {/* Telefon Numaraları */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Telefon Numaraları</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Destek Telefonu</label>
              <input
                type="tel"
                value={contactInfo.phones?.support || ''}
                onChange={(e) => updateContactInfo('phones', 'support', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="+90 (212) 555-0123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Satış Telefonu</label>
              <input
                type="tel"
                value={contactInfo.phones?.sales || ''}
                onChange={(e) => updateContactInfo('phones', 'sales', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="+90 (212) 555-0124"
              />
            </div>
          </div>
        </div>

        {/* Adres Bilgileri */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Adres Bilgileri</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sokak Adresi</label>
              <input
                type="text"
                value={contactInfo.address?.street || ''}
                onChange={(e) => updateContactInfo('address', 'street', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Maslak Mahallesi, Büyükdere Cad. No:123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">İlçe/Şehir</label>
              <input
                type="text"
                value={contactInfo.address?.district || ''}
                onChange={(e) => updateContactInfo('address', 'district', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Sarıyer/İstanbul"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Posta Kodu</label>
              <input
                type="text"
                value={contactInfo.address?.postal || ''}
                onChange={(e) => updateContactInfo('address', 'postal', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="34485"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Ülke</label>
              <input
                type="text"
                value={contactInfo.address?.country || ''}
                onChange={(e) => updateContactInfo('address', 'country', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Türkiye"
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Sosyal Medya</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Twitter</label>
              <input
                type="text"
                value={contactInfo.social?.twitter || ''}
                onChange={(e) => updateContactInfo('social', 'twitter', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="@ravenkart"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn</label>
              <input
                type="text"
                value={contactInfo.social?.linkedin || ''}
                onChange={(e) => updateContactInfo('social', 'linkedin', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="company/ravenkart"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Instagram</label>
              <input
                type="text"
                value={contactInfo.social?.instagram || ''}
                onChange={(e) => updateContactInfo('social', 'instagram', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="@ravenkart"
              />
            </div>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Çalışma Saatleri</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hafta İçi</label>
              <input
                type="text"
                value={contactInfo.hours?.weekdays || ''}
                onChange={(e) => updateContactInfo('hours', 'weekdays', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="09:00 - 18:00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hafta Sonu</label>
              <input
                type="text"
                value={contactInfo.hours?.weekend || ''}
                onChange={(e) => updateContactInfo('hours', 'weekend', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Kapalı"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}