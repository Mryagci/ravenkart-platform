'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { QrCode, Users, Menu, X, LogOut, Home, User, DollarSign, ChevronDown, Settings, CreditCard, HelpCircle, Grid, ScanLine, Folder, PenTool, Calendar, Phone, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    }
  }

  async function handleLogout() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const isActive = (path: string) => {
    return pathname === path;
  }

  const getUserName = () => {
    if (!user) return '';
    // Try to get display name from user metadata or email
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (displayName) return displayName;
    
    // Extract name from email
    const emailName = user.email?.split('@')[0];
    // Capitalize first letter
    return emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : 'User';
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] glass-effect border-b border-white/10 overflow-visible backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">RAVENKART</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <button
              onClick={() => router.push('/')}
              className={`flex items-center gap-2 transition-colors duration-300 ${
                isActive('/') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    isActive('/dashboard') ? 'text-white font-semibold' : pathname === '/' ? 'text-white hover:text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Kartvizitim
                </button>
                
                <button
                  onClick={() => router.push('/analytics')}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    isActive('/analytics') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analitik
                </button>
              </>
            )}
            
            <button
              onClick={() => router.push('/pricing')}
              className={`flex items-center gap-2 transition-colors duration-300 ${
                isActive('/pricing') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Fiyatlar
            </button>

            <button
              onClick={() => router.push('/contact')}
              className={`flex items-center gap-2 transition-colors duration-300 ${
                isActive('/contact') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              İletişim
            </button>

            {/* Applications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    pathname.startsWith('/apps') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Uygulamalar
                  <ChevronDown className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                sideOffset={8}
                className="w-72 bg-gray-900/95 backdrop-blur-lg border-white/20 text-white"
              >
                <DropdownMenuItem 
                  onClick={() => router.push('/apps/card-scanner')}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 focus:bg-white/10"
                >
                  <ScanLine className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium">Kartvizit Tarama</p>
                    <p className="text-xs text-white/60">QR kod ile tara</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => router.push('/apps/saved-cards')}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 focus:bg-white/10"
                >
                  <Folder className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium">Koleksiyonum</p>
                    <p className="text-xs text-white/60">Kartvizitlerinizi yönetin</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => router.push('/apps/digital-signature')}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 focus:bg-white/10"
                >
                  <PenTool className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm font-medium">Dijital İmza</p>
                    <p className="text-xs text-white/60">İmza oluştur</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => router.push('/apps/agenda')}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 focus:bg-white/10"
                >
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-sm font-medium">Ajanda</p>
                    <p className="text-xs text-white/60">Randevularınızı takip edin</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons / User Info */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
                      <User className="w-4 h-4 text-white/80" />
                      <div className="flex flex-col items-start">
                        <span className="text-white text-sm font-medium">
                          {getUserName()}
                        </span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-white/60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={8}
                    className="w-56 bg-gray-900/95 backdrop-blur-lg border-white/20 text-white"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-medium text-sm">{getUserName()}</p>
                      <p className="text-white/60 text-xs truncate">{user.email}</p>
                    </div>

                    <DropdownMenuItem 
                      onClick={() => router.push('/dashboard')}
                      className="flex items-center gap-3 p-2 hover:bg-white/10 focus:bg-white/10"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Kartvizitim</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => router.push('/analytics')}
                      className="flex items-center gap-3 p-2 hover:bg-white/10 focus:bg-white/10"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Analitik</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => router.push('/account/settings')}
                      className="flex items-center gap-3 p-2 hover:bg-white/10 focus:bg-white/10"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Hesap Ayarları</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => router.push('/account/billing')}
                      className="flex items-center gap-3 p-2 hover:bg-white/10 focus:bg-white/10"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Abonelik ve Faturalama</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => router.push('/support')}
                      className="flex items-center gap-3 p-2 hover:bg-white/10 focus:bg-white/10"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm">Yardım ve Destek</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/10" />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-2 text-red-400 hover:text-red-300 hover:bg-white/10 focus:bg-white/10 focus:text-red-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/auth?mode=login')}
                  className="btn-glass px-4 py-2 text-white/90 hover:text-white rounded-lg font-medium"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => router.push('/auth?mode=register')}
                  className="btn-primary px-6 py-2 text-white rounded-lg font-medium shadow-lg"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="lg:hidden py-4 border-t border-white/10 overflow-hidden"
            >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  router.push('/');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                  isActive('/') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
              
              {user && (
                <>
                  <button
                    onClick={() => {
                      router.push('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                      isActive('/dashboard') ? 'text-white font-semibold' : pathname === '/' ? 'text-white hover:text-white' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Kartvizitim
                  </button>
                  
                  <button
                    onClick={() => {
                      router.push('/analytics');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                      isActive('/analytics') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analitik
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  router.push('/pricing');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                  isActive('/pricing') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Fiyatlar
              </button>

              <button
                onClick={() => {
                  router.push('/contact');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                  isActive('/contact') ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                İletişim
              </button>
              
              {/* Applications Section for Mobile */}
              <div className="pt-3 pb-2">
                <div className="flex items-center gap-2 text-white/60 text-xs font-medium mb-2">
                  <Grid className="w-3 h-3" />
                  UYGULAMALAR
                </div>
                
                <div className="flex flex-col gap-2 pl-4">
                  <button
                    onClick={() => {
                      router.push('/apps/card-scanner');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-1.5"
                  >
                    <ScanLine className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">Kartvizit Tarama</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      router.push('/apps/saved-cards');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-1.5"
                  >
                    <Folder className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Kartvizit Kolleksiyonum</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      router.push('/apps/digital-signature');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-1.5"
                  >
                    <PenTool className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Dijital İmza Oluşturma</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      router.push('/apps/agenda');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-1.5"
                  >
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">Ajandam</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <User className="w-4 h-4 text-white/80" />
                      <div>
                        <div className="text-white/90 text-sm font-medium">{getUserName()}</div>
                        <div className="text-white/60 text-xs">{user.email}</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        router.push('/account/settings');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-2"
                    >
                      <Settings className="w-4 h-4" />
                      Hesap Ayarları
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/account/billing');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Abonelik ve Faturalama
                    </button>
                    
                    <button
                      onClick={() => {
                        router.push('/support');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-left text-white/80 hover:text-white transition-colors duration-300 py-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Yardım ve Destek
                    </button>
                    
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-left text-red-400 hover:text-red-300 transition-colors duration-300 py-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/auth?mode=login')}
                      className="text-left text-white/90 hover:text-white transition-colors duration-300 py-2"
                    >
                      Giriş
                    </button>
                    <button
                      onClick={() => router.push('/auth?mode=register')}
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 shadow-lg text-center"
                    >
                      Kayıt Ol
                    </button>
                  </>
                )}
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar