import Navbar from '@/components/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import { AboutSection, LocationSection } from '@/components/sections/AboutLocationSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import Footer from '@/components/Footer'

// This forces Next.js to fetch fresh data on every page load (no caching old content)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let cmsData = {}
  
  try {
    // Fetch all content from the backend CMS
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const res = await fetch(`${apiUrl}/api/content`, { cache: 'no-store' })
    
    if (res.ok) {
      cmsData = await res.json()
    }
  } catch (error) {
    console.error("Failed to fetch CMS data:", error)
  }

  return (
    <main>
      <Navbar />
      <HeroSection content={cmsData.hero} />
      <ServicesSection />
      <AboutSection content={cmsData.about} />
      <LocationSection content={cmsData.location} />
      <TestimonialsSection content={cmsData.testimonials}/>
      <Footer />
    </main>
  )
}