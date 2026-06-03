'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showApptButton, setShowApptButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // 1. Triggers the frosted glass background after scrolling down just 50px
      setIsScrolled(window.scrollY > 50)
      
      // 2. Triggers the Appointment button after scrolling past the Hero (600px)
      setShowApptButton(window.scrollY > 600)
    }

    handleScroll() // Check on load
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar${isScrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 6 C14 6, 9 10, 9 15 C9 18.3 11.2 20.5 14 21 C16.8 20.5 19 18.3 19 15 C19 10 14 6 14 6Z" fill="currentColor" fillOpacity="0.7"/>
              <line x1="14" y1="21" x2="14" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">Ten Thirty Solutions</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar-links">
          <li><Link href="/#services">Our Services</Link></li>
          <li><Link href="/#about">Our Mission</Link></li>
          <li><Link href="/#testimonials">Testimonials</Link></li>
        </ul>

        {/* CTA */}
        {showApptButton && (
            <Link href="/appointment" className="btn-appointment">
              Appointment
            </Link>
        )}

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/#services" onClick={() => setMenuOpen(false)}>Our Services</Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>Our Mission</Link>
          <Link href="/#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</Link>
          <Link href="/appointment" className="btn-appointment" onClick={() => setMenuOpen(false)}>Appointment</Link>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: var(--transition);
          padding: 0 24px;
        }
        .navbar.scrolled {
          background: rgba(245, 244, 240, 0.95);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 20px rgba(26,42,26,0.08);
        }
        .navbar-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; gap: 32px;
          height: 68px;
        }
        .navbar-logo {
          display: flex; align-items: center; gap: 10px;
          color: var(--color-primary-dark);
          font-weight: 500; font-size: 15px; white-space: nowrap;
        }
        .logo-icon { color: var(--color-primary); flex-shrink: 0; }
        .navbar-links {
          display: flex; list-style: none; gap: 32px;
          margin-left: auto;
        }
        .navbar-links a {
          font-size: 14px; color: var(--color-text-muted);
          transition: color var(--transition); font-weight: 400;
        }
        .navbar-links a:hover { color: var(--color-primary-dark); }
        .btn-appointment {
          background: var(--color-primary-dark);
          color: var(--color-white);
          padding: 9px 20px; border-radius: var(--radius-sm);
          font-size: 14px; font-weight: 500;
          transition: background var(--transition);
          white-space: nowrap;
        }
        .btn-appointment:hover { background: var(--color-primary); }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          padding: 4px; margin-left: auto;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--color-primary-dark); border-radius: 2px;
        }
        .mobile-menu {
          display: flex; flex-direction: column; gap: 4px;
          background: var(--color-white); padding: 16px 24px 20px;
          border-bottom: 1px solid var(--color-bg-card);
        }
        .mobile-menu a {
          padding: 10px 0; font-size: 15px;
          color: var(--color-text-muted); border-bottom: 1px solid var(--color-bg-card);
        }
        .mobile-menu .btn-appointment {
          margin-top: 12px; text-align: center;
          background: var(--color-primary-dark); color: var(--color-white);
          padding: 12px; border-radius: var(--radius-sm);
          border: none;
        }
        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .btn-appointment:not(.mobile-menu .btn-appointment) { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>
    </nav>
  )
}
