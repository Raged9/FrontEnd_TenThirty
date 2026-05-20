import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AboutSection from '@/components/sections/AboutSection' // Gunakan komponen yang terpisah (Tailwind)
import { LocationSection } from '@/components/sections/AboutLocationSection' // Hanya ambil Location
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/Footer'

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