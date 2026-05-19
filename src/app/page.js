import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import { AboutSection, LocationSection } from '@/components/sections/AboutLocationSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/Footer'

// Di sini nantinya akan fetch data dari backend CMS
// Contoh: const heroContent = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/hero`).then(r => r.json())

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <LocationSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
