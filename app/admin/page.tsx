/**
 * Admin Dashboard Page
 * Main overview dashboard for superadmins
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSuperadmin, useAdminApi } from '../../hooks/useSuperadmin';
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
  Loader2
} from 'lucide-react';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    growth_percent: number;
  };
  payments: {
    total_revenue: number;
    total_transactions: number;
    pending_payments: number;
    success_rate: number;
  };
  cards: {
    total_cards: number;
    active_cards: number;
    qr_scans_today: number;
    avg_scans_per_card: number;
  };
  system: {
    uptime: string;
    last_backup: string;
    storage_used_mb: number;
    api_requests_today: number;
  };
}

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
  color = 'blue' 
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color?: string;
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
  const { user, hasPermission } = useSuperadmin();
  const { adminFetch, isReady } = useAdminApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, [isReady]);

  const loadDashboardStats = async () => {
    if (!isReady) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - in real implementation, fetch from API
      const mockStats: DashboardStats = {
        users: {
          total: 1247,
          active: 892,
          new_this_month: 156,
          growth_percent: 12.5
        },
        payments: {
          total_revenue: 24750.00,
          total_transactions: 289,
          pending_payments: 3,
          success_rate: 98.2
        },
        cards: {
          total_cards: 892,
          active_cards: 734,
          qr_scans_today: 145,
          avg_scans_per_card: 23.4
        },
        system: {
          uptime: '99.9%',
          last_backup: '2 saat önce',
          storage_used_mb: 2048,
          api_requests_today: 8934
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-400 font-medium">Hata</h3>
        </div>
        <p className="text-slate-300 mt-2">{error}</p>
        <button
          onClick={loadDashboardStats}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Hoş geldiniz, {user?.email} • Sistem durumu: 
          <span className="text-green-400 ml-1">Aktif</span>
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.users.total.toLocaleString('tr-TR')}
            subtitle={`${stats.users.active} aktif`}
            icon={Users}
            trend="up"
            trendValue={`+${stats.users.growth_percent}%`}
            color="blue"
          />
          
          <StatCard
            title="Toplam Gelir"
            value={`₺${stats.payments.total_revenue.toLocaleString('tr-TR')}`}
            subtitle={`${stats.payments.total_transactions} işlem`}
            icon={DollarSign}
            trend="up"
            trendValue={`%${stats.payments.success_rate} başarı`}
            color="green"
          />
          
          <StatCard
            title="Dijital Kartlar"
            value={stats.cards.total_cards.toLocaleString('tr-TR')}
            subtitle={`${stats.cards.active_cards} aktif`}
            icon={Package}
            trend="up"
            trendValue={`${stats.cards.qr_scans_today} tarama bugün`}
            color="purple"
          />
          
          <StatCard
            title="Sistem Durumu"
            value={stats.system.uptime}
            subtitle="Çalışma süresi"
            icon={Activity}
            trend="neutral"
            trendValue={stats.system.last_backup}
            color="orange"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hasPermission('products') && (
            <QuickAction
              title="Ürün Yönetimi"
              description="Ürünleri düzenle, yeni özellik ekle"
              icon={Package}
              href="/admin/products"
            />
          )}
          
          {hasPermission('pricing') && (
            <QuickAction
              title="Fiyat Güncelle"
              description="Plan fiyatlarını ve özelliklerini yönet"
              icon={DollarSign}
              href="/admin/pricing"
            />
          )}
          
          {hasPermission('policies') && (
            <QuickAction
              title="Politika Düzenle"
              description="Gizlilik ve kullanım şartlarını güncelle"
              icon={FileText}
              href="/admin/policies"
            />
          )}
          
          {hasPermission('contact') && (
            <QuickAction
              title="İletişim Güncelle"
              description="İletişim bilgilerini yönet"
              icon={Phone}
              href="/admin/contact"
            />
          )}
          
          {hasPermission('users') && (
            <QuickAction
              title="Kullanıcı Analizi"
              description="Kullanıcı istatistikleri ve raporlar"
              icon={TrendingUp}
              href="/admin/users"
            />
          )}
          
          {hasPermission('payments') && (
            <QuickAction
              title="Ödeme Takibi"
              description="Ödemeleri ve abonelikleri izle"
              icon={CreditCard}
              href="/admin/payments"
            />
          )}
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
                               activity.status === 'error' ? AlertCircle : 
                               Activity;
              
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