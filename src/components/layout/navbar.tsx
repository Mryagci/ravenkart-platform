'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { QrCode, Users, Menu, X, LogOut, Home, User, DollarSign, ChevronDown, Settings, CreditCard, HelpCircle, Grid, ScanLine, Folder, PenTool, Calendar } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const appsMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
      if (appsMenuRef.current && !appsMenuRef.current.contains(event.target as Node)) {
        setIsAppsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem'}}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flexShrink: 0}}
            onClick={() => router.push('/')}
          >
            <div style={{width: '2rem', height: '2rem', background: 'linear-gradient(to right, #22d3ee, #fb7185)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <QrCode style={{width: '1.25rem', height: '1.25rem', color: 'white'}} />
            </div>
            <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'white'}}>RAVENKART</span>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}} className="hidden md:flex">
            <nav style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive('/') ? 'white' : 'rgba(255,255,255,0.8)',
                  fontWeight: isActive('/') ? '600' : '400'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive('/') ? 'white' : 'rgba(255,255,255,0.8)'}
              >
                <Home style={{width: '1rem', height: '1rem'}} />
                Ana Sayfa
              </motion.button>
              
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push('/dashboard')}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    isActive('/dashboard') 
                      ? 'text-white font-semibold' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Kartvizitim
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/pricing')}
                className={`flex items-center gap-2 transition-colors duration-300 ${
                  isActive('/pricing') 
                    ? 'text-white font-semibold' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Fiyatlar
              </motion.button>

              {/* Applications Dropdown */}
              <div className="relative" ref={appsMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsAppsMenuOpen(!isAppsMenuOpen)}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    pathname.startsWith('/apps') 
                      ? 'text-white font-semibold' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Uygulamalar
                  <ChevronDown className={`w-3 h-3 transition-transform ${isAppsMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Apps Dropdown Menu */}
                <AnimatePresence>
                  {isAppsMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl overflow-hidden"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push('/apps/card-scanner');
                            setIsAppsMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                          <ScanLine className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-sm font-medium">Kartvizit Tarama</p>
                            <p className="text-xs text-white/60">QR kod ve kamera ile kartvizit tara</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            router.push('/apps/card-collection');
                            setIsAppsMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                          <Folder className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-sm font-medium">Kartvizit Kolleksiyonum</p>
                            <p className="text-xs text-white/60">Kayıtlı kartvizitlerinizi yönetin</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            router.push('/apps/digital-signature');
                            setIsAppsMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                          <PenTool className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-sm font-medium">Dijital İmza Oluşturma</p>
                            <p className="text-xs text-white/60">Profesyonel dijital imza tasarlayın</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            router.push('/apps/agenda');
                            setIsAppsMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                          <Calendar className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-sm font-medium">Ajandam</p>
                            <p className="text-xs text-white/60">İş randevularınızı takip edin</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Auth Buttons / User Info - Right Aligned */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Account Dropdown */}
                <div className="relative" ref={accountMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <User className="w-3 h-3 text-white/80" />
                    <span className="text-white/90 text-xs font-medium">
                      {getUserName()}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl overflow-hidden"
                      >
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white font-medium text-sm">{getUserName()}</p>
                          <p className="text-white/60 text-xs truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              router.push('/dashboard');
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                          >
                            <User className="w-4 h-4" />
                            <span className="text-sm">Kartvizitim</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push('/account/settings');
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Hesap Ayarları</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push('/account/billing');
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span className="text-sm">Abonelik ve Faturalama</span>
                          </button>

                          <button
                            onClick={() => {
                              router.push('/support');
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                          >
                            <HelpCircle className="w-4 h-4" />
                            <span className="text-sm">Yardım ve Destek</span>
                          </button>
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-white/10 py-2">
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors flex items-center gap-3"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Çıkış Yap</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth?mode=login')}
                  className="px-4 py-2 text-white/90 hover:text-white transition-colors duration-300"
                >
                  Giriş
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/auth?mode=register')}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-500 transition-all duration-300 shadow-lg"
                >
                  Kayıt Ol
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  router.push('/');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                  isActive('/') 
                    ? 'text-white font-semibold' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </button>
              
              {user && (
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                    isActive('/dashboard') 
                      ? 'text-white font-semibold' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Kartvizitim
                </button>
              )}
              
              <button
                onClick={() => {
                  router.push('/pricing');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 text-left transition-colors duration-300 py-2 ${
                  isActive('/pricing') 
                    ? 'text-white font-semibold' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Fiyatlar
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
                      router.push('/apps/card-collection');
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
                    {/* User Info */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <User className="w-4 h-4 text-white/80" />
                      <div>
                        <div className="text-white/90 text-sm font-medium">{getUserName()}</div>
                        <div className="text-white/60 text-xs">{user.email}</div>
                      </div>
                    </div>
                    
                    {/* Account Menu Items */}
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
      </div>
    </motion.nav>
  )
}

export default Navbar