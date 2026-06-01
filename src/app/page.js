import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AboutSection from '@/components/sections/AboutSection'
import { LocationSection } from '@/components/sections/AboutLocationSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/Footer'
import { fetchContent } from '@/lib/api' // Import fungsi penarik data

// Gunakan async karena kita mengambil data dari backend
export default async function HomePage() {
  // Ambil data khusus 'hero' dari backend (Server-side)
  const heroData = await fetchContent('hero')

  return (
    <main>
      <Navbar />
      {/* Teruskan data yang di-fetch ke komponen HeroSection */}
      <HeroSection content={heroData} />
      <ServicesSection />
      <AboutSection />
      <LocationSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}