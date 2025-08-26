/**
 * Admin Pricing Management Page
 */

'use client';

import React, { useState } from 'react';
import { DollarSign, Edit, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminPricing() {
  const [plans, setPlans] = useState([
    {
      id: 'personal',
      name: 'Personal',
      monthlyPrice: 29.90,
      yearlyPrice: 299.90,
      popular: false,
      features: ['1 Dijital Kartvizit', 'QR Kod', 'Temel Analitik', 'Email Desteği']
    },
    {
      id: 'professional', 
      name: 'Professional',
      monthlyPrice: 59.90,
      yearlyPrice: 599.90,
      popular: true,
      features: ['5 Dijital Kartvizit', 'QR Kod + NFC', 'Gelişmiş Analitik', 'Öncelikli Destek', 'Özel Tasarım']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 99.90,
      yearlyPrice: 999.90,
      popular: false,
      features: ['Sınırsız Kartvizit', 'Tüm Özellikler', 'API Erişimi', '7/24 Destek', 'Özel Entegrasyon']
    }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <DollarSign className="mr-3 h-8 w-8 text-green-500" />
            Fiyat Yönetimi
          </h1>
          <p className="text-slate-400 mt-2">Plan fiyatlarını ve özelliklerini yönetin</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Plan
        </button>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-slate-800 rounded-xl p-6 border ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-700'}`}>
            {plan.popular && (
              <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                En Popüler
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-white">₺{plan.monthlyPrice}</span>
                <span className="text-slate-400 ml-1">/ay</span>
              </div>
              <div className="text-sm text-slate-400 mt-1">
                veya ₺{plan.yearlyPrice}/yıl (%17 indirim)
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Changes */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-slate-300">Değişiklikleri kaydetmeyi unutmayın</p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}