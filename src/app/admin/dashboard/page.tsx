'use client';

import React from 'react';
import {
  Users,
  CreditCard,
  Package,
  TrendingUp,
  Activity,
  DollarSign,
  FileText,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue' 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400',
  };

  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Clock;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="flex items-center mt-4 space-x-2">
          <TrendIcon className={`w-4 h-4 ${trendColors[trend]}`} />
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {trendValue}
          </span>
          <span className="text-slate-500 text-sm">bu ayda</span>
        </div>
      )}
    </div>
  );
};

const QuickAction = ({ 
  title, 
  description, 
  icon: Icon, 
  href, 
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) => (
  <a
    href={href}
    className="block bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 hover:shadow-lg transition-all duration-300 group"
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  </a>
);

export default function AdminDashboard() {
  const mockStats = {
    users: { total: 1247, active: 892, new_this_month: 156, growth_percent: 12.5 },
    payments: { total_revenue: 24750.00, total_transactions: 289, success_rate: 98.2 },
    cards: { total_cards: 892, active_cards: 734, qr_scans_today: 145 },
    system: { uptime: '99.9%', last_backup: '2 saat önce' }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Hoş geldiniz • Sistem durumu: <span className="text-green-400 ml-1">Aktif</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Kullanıcı"
          value={mockStats.users.total.toLocaleString('tr-TR')}
          subtitle={`${mockStats.users.active} aktif`}
          icon={Users}
          trend="up"
          trendValue={`+${mockStats.users.growth_percent}%`}
          color="blue"
        />
        
        <StatCard
          title="Toplam Gelir"
          value={`₺${mockStats.payments.total_revenue.toLocaleString('tr-TR')}`}
          subtitle={`${mockStats.payments.total_transactions} işlem`}
          icon={DollarSign}
          trend="up"
          trendValue={`%${mockStats.payments.success_rate} başarı`}
          color="green"
        />
        
        <StatCard
          title="Dijital Kartlar"
          value={mockStats.cards.total_cards.toLocaleString('tr-TR')}
          subtitle={`${mockStats.cards.active_cards} aktif`}
          icon={Package}
          trend="up"
          trendValue={`${mockStats.cards.qr_scans_today} tarama bugün`}
          color="purple"
        />
        
        <StatCard
          title="Sistem Durumu"
          value={mockStats.system.uptime}
          subtitle="Çalışma süresi"
          icon={Activity}
          trend="neutral"
          trendValue={mockStats.system.last_backup}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction title="Ürün Yönetimi" description="Ürünleri düzenle, yeni özellik ekle" icon={Package} href="/admin/products" />
          <QuickAction title="Fiyat Güncelle" description="Plan fiyatlarını ve özelliklerini yönet" icon={DollarSign} href="/admin/pricing" />
          <QuickAction title="Politika Düzenle" description="Gizlilik ve kullanım şartlarını güncelle" icon={FileText} href="/admin/policies" />
          <QuickAction title="İletişim Güncelle" description="İletişim bilgilerini yönet" icon={Phone} href="/admin/contact" />
          <QuickAction title="Kullanıcı Analizi" description="Kullanıcı istatistikleri ve raporlar" icon={TrendingUp} href="/admin/users" />
          <QuickAction title="Ödeme Takibi" description="Ödemeleri ve abonelikleri izle" icon={CreditCard} href="/admin/payments" />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Son Aktiviteler</h2>
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 space-y-4">
            {[
              { time: '5 dk önce', action: 'Yeni kullanıcı kaydı', user: 'mehmet@example.com', status: 'success' },
              { time: '12 dk önce', action: 'Ödeme tamamlandı', user: '₺29.90 - Personal Plan', status: 'success' },
              { time: '25 dk önce', action: 'QR kod taraması', user: 'Ahmet Yılmaz kartviziti', status: 'info' },
              { time: '1 saat önce', action: 'Başarısız ödeme', user: '₺99.90 - Professional Plan', status: 'error' },
              { time: '2 saat önce', action: 'Politika güncellendi', user: 'Gizlilik Politikası v1.1', status: 'success' },
            ].map((activity, index) => {
              const statusColors = {
                success: 'text-green-400',
                error: 'text-red-400', 
                info: 'text-blue-400',
              };
              
              const StatusIcon = activity.status === 'success' ? CheckCircle : 
                               activity.status === 'error' ? AlertCircle : Activity;
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <StatusIcon className={`w-5 h-5 ${statusColors[activity.status as keyof typeof statusColors]}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-slate-400 text-sm">{activity.user}</p>
                  </div>
                  <span className="text-slate-500 text-sm">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}