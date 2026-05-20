'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Efek background navbar saat di-scroll sedikit
      setScrolled(window.scrollY > 30)
      
      // Logika memunculkan tombol schedule setelah melewati area Hero (sekitar 400px)
      if (window.scrollY > 400) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-gray-200 shadow-sm py-4' : 'bg-[#FAFAF7] border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8FA38F]/30 border-2 border-[#4A5E4A] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5E4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22V8" />
              <path d="M12 16l-5-5" />
              <path d="M12 11l-5-5" />
              <path d="M12 16l5-5" />
              <path d="M12 11l5-5" />
            </svg>
          </div>
          <span className="font-bold text-[17px] text-gray-800">Ten Thirty Solutions</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-gray-800 hover:text-[#8FA38F] transition-colors">Home</Link>
          <Link href="/#about" className="text-sm font-bold text-gray-800 hover:text-[#8FA38F] transition-colors">About Us</Link>
          <Link href="/#services" className="text-sm font-bold text-gray-800 hover:text-[#8FA38F] transition-colors">Services</Link>
          <Link href="/#testimonials" className="text-sm font-bold text-gray-800 hover:text-[#8FA38F] transition-colors">Testimonials</Link>
          
          {/* SCHEDULE BUTTON (Muncul perlahan saat scroll) */}
          <Link 
            href="/schedule" 
            className={`bg-[#8FA38F] hover:bg-[#7A8B7A] text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              showButton ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            Schedule
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 py-4 px-6 flex flex-col gap-4 shadow-lg">
          <Link href="/" onClick={() => setMenuOpen(false)} className="font-semibold text-gray-700">Home</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)} className="font-semibold text-gray-700">About Us</Link>
          <Link href="/#services" onClick={() => setMenuOpen(false)} className="font-semibold text-gray-700">Services</Link>
          <Link href="/#testimonials" onClick={() => setMenuOpen(false)} className="font-semibold text-gray-700">Testimonials</Link>
          <Link href="/schedule" onClick={() => setMenuOpen(false)} className="bg-[#8FA38F] text-white px-4 py-2 rounded-full font-semibold text-center w-full mt-2">
            Schedule
          </Link>
        </div>
      )}
    </nav>
  )
}