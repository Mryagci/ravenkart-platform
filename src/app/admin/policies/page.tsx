/**
 * Admin Policies Management Page
 */

'use client';

import React, { useState } from 'react';
import { FileText, Edit, Save, Eye, Clock } from 'lucide-react';

export default function AdminPolicies() {
  const [policies] = useState([
    {
      id: 'privacy',
      title: 'Gizlilik Politikası',
      lastUpdated: '2025-08-15',
      status: 'published',
      version: '1.2'
    },
    {
      id: 'terms',
      title: 'Kullanım Şartları',
      lastUpdated: '2025-08-10', 
      status: 'published',
      version: '1.1'
    },
    {
      id: 'cookies',
      title: 'Çerez Politikası',
      lastUpdated: '2025-08-01',
      status: 'draft',
      version: '1.0'
    }
  ]);

  const [selectedPolicy, setSelectedPolicy] = useState(policies[0]);
  const [content, setContent] = useState(`# Gizlilik Politikası

## 1. Kişisel Verilerin Toplanması
Ravenkart olarak, size daha iyi hizmet verebilmek için...

## 2. Verilerin Kullanımı
Toplanan veriler aşağıdaki amaçlarla kullanılır:
- Hizmet kalitesini artırmak
- Güvenliği sağlamak
- İletişim kurmak

## 3. Veri Güvenliği
Kişisel verileriniz en yüksek güvenlik standartlarıyla korunmaktadır.`);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <FileText className="mr-3 h-8 w-8 text-blue-500" />
          Politika Yönetimi
        </h1>
        <p className="text-slate-400 mt-2">Gizlilik politikası ve kullanım şartlarını yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Policy List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4">Politikalar</h2>
          <div className="space-y-2">
            {policies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedPolicy.id === policy.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="font-medium">{policy.title}</div>
                <div className="text-sm opacity-75">v{policy.version}</div>
                <div className="flex items-center mt-2 text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    policy.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  {policy.status === 'published' ? 'Yayınlandı' : 'Taslak'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedPolicy.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedPolicy.lastUpdated}
                  </span>
                  <span>v{selectedPolicy.version}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Önizle
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-300 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                placeholder="Markdown formatında içerik yazın..."
              />
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-b-xl">
              <div className="text-sm text-slate-400">
                Markdown formatı destekleniyor
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  Yayınla
                </button>
                <button className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm">
                  Taslak Olarak Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}