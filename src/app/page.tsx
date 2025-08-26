import Navbar from '@/components/layout/navbar'
import HeroSection from '@/components/layout/hero-section'
import FeaturesSection from '@/components/layout/features-section'
import StatsSection from '@/components/layout/stats-section'
import CTASection from '@/components/layout/cta-section'
import Footer from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}