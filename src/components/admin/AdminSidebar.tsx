/**
 * Admin Sidebar Component
 * Navigation sidebar for admin pages
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useSuperadmin } from '../../hooks/useSuperadmin'; // Temporarily disabled
import { 
  LayoutDashboard,
  Package,
  DollarSign,
  FileText,
  Phone,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: string | number;
  subItems?: {
    name: string;
    href: string;
    permission?: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: 'all'
  },
  {
    name: 'Ürün Yönetimi',
    href: '/admin/products',
    icon: Package,
    permission: 'products'
  },
  {
    name: 'Fiyatlandırma',
    href: '/admin/pricing',
    icon: DollarSign,
    permission: 'pricing'
  },
  {
    name: 'Politikalar',
    href: '/admin/policies',
    icon: FileText,
    permission: 'policies'
  },
  {
    name: 'İletişim',
    href: '/admin/contact',
    icon: Phone,
    permission: 'contact'
  },
  {
    name: 'Kullanıcılar',
    href: '/admin/users',
    icon: Users,
    permission: 'users',
    badge: 'Yakında'
  },
  {
    name: 'Ödemeler',
    href: '/admin/payments',
    icon: CreditCard,
    permission: 'payments',
    badge: 'Yakında'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'analytics',
    badge: 'Yakında'
  },
  {
    name: 'Ayarlar',
    href: '/admin/settings',
    icon: Settings,
    permission: 'all',
    badge: 'Yakında'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  // const { hasPermission } = useSuperadmin(); // Temporarily disabled
  const hasPermission = () => true; // Allow all permissions for now

  const isActiveItem = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:pt-16 lg:bg-slate-900 lg:border-r lg:border-slate-800">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = isActiveItem(item.href);
              const isDisabled = !!item.badge && item.badge === 'Yakında';
              
              return (
                <div key={item.name}>
                  <Link
                    href={isDisabled ? '#' : item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isDisabled
                        ? 'text-slate-500 cursor-not-allowed'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }
                      ${isDisabled ? '' : 'hover:scale-[1.02]'}
                    `}
                    onClick={(e) => isDisabled && e.preventDefault()}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    
                    {item.badge && (
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                        ${item.badge === 'Yakında' 
                          ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50'
                          : 'bg-blue-900/50 text-blue-400 border border-blue-700/50'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                    
                    {item.subItems && (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-slate-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Ravenkart</p>
                <p className="text-xs text-slate-400">Admin v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {/* This would be controlled by the mobile menu state from AdminHeader */}
      {/* For now, we'll keep it simple and focus on desktop experience */}
    </>
  );
}