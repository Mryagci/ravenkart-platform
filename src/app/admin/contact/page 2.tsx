/**
 * Admin Contact Management Page
 */

'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Save, Edit, Globe, MessageSquare } from 'lucide-react';

export default function AdminContact() {
  const [contactInfo, setContactInfo] = useState({
    email: {
      support: 'destek@ravenkart.com',
      sales: 'satis@ravenkart.com',
      general: 'info@ravenkart.com'
    },
    phone: {
      support: '+90 (212) 555-0123',
      sales: '+90 (212) 555-0124'
    },
    address: {
      company: 'Ravenkart Teknoloji Ltd. Şti.',
      street: 'Maslak Mahallesi, Büyükdere Cad. No:123',
      district: 'Sarıyer/İstanbul',
      postal: '34485',
      country: 'Türkiye'
    },
    social: {
      twitter: '@ravenkart',
      linkedin: 'company/ravenkart',
      instagram: '@ravenkart'
    },
    hours: {
      weekdays: '09:00 - 18:00',
      weekend: 'Kapalı'
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
    // Show success message
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Phone className="mr-3 h-8 w-8 text-green-500" />
            İletişim Yönetimi
          </h1>
          <p className="text-slate-400 mt-2">Şirket iletişim bilgilerini yönetin</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Contact */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-500" />
            Email Adresleri
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Destek</label>
              <input
                type="email"
                value={contactInfo.email.support}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  email: { ...prev.email, support: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Satış</label>
              <input
                type="email"
                value={contactInfo.email.sales}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  email: { ...prev.email, sales: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Genel</label>
              <input
                type="email"
                value={contactInfo.email.general}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  email: { ...prev.email, general: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Phone Contact */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-green-500" />
            Telefon Numaraları
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Destek</label>
              <input
                type="tel"
                value={contactInfo.phone.support}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  phone: { ...prev.phone, support: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Satış</label>
              <input
                type="tel"
                value={contactInfo.phone.sales}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  phone: { ...prev.phone, sales: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-red-500" />
            Adres Bilgileri
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Şirket Adı</label>
              <input
                type="text"
                value={contactInfo.address.company}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  address: { ...prev.address, company: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sokak</label>
              <input
                type="text"
                value={contactInfo.address.street}
                disabled={!isEditing}
                className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                  isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                }`}
                onChange={(e) => setContactInfo(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">İlçe/Şehir</label>
                <input
                  type="text"
                  value={contactInfo.address.district}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                    isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                  }`}
                  onChange={(e) => setContactInfo(prev => ({
                    ...prev,
                    address: { ...prev.address, district: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Posta Kodu</label>
                <input
                  type="text"
                  value={contactInfo.address.postal}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                    isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                  }`}
                  onChange={(e) => setContactInfo(prev => ({
                    ...prev,
                    address: { ...prev.address, postal: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Hours */}
        <div className="space-y-6">
          {/* Social Media */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-purple-500" />
              Sosyal Medya
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Twitter</label>
                <input
                  type="text"
                  value={contactInfo.social.twitter}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                    isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={contactInfo.social.linkedin}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                    isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-500" />
              Çalışma Saatleri
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hafta İçi</label>
                <input
                  type="text"
                  value={contactInfo.hours.weekdays}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                    isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hafta Sonu</label>
                <input
                  type="text"
                  value={contactInfo.hours.weekend}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-slate-300 ${
                    isEditing ? 'border-slate-600 focus:border-blue-500' : 'border-slate-700'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}