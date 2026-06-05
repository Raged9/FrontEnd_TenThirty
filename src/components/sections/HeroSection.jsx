'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Ini nanti akan di-fetch dari backend CMS
const DEFAULT_HERO = {
  headline: 'Septic System and Environmental Compliance Solutions',
  subtext: 'Helping Florida homeowners and businesses solve complex and critical environmental and compliance issues at affordable prices.',
  stat1_number: '250+',
  stat1_label: '250 Revenue Monthly Donations to Homelessness',
  stat2_number: '10%',
  stat2_label: '10% Profits Annual Donation to Ten Thirty House',
  stat3_number: 'CAD',
  stat3_label: 'Certified, Advanced Designer & Inspector (FPI)',
  hero_image: null, // nanti dari CMS
}

export default function HeroSection({ content = DEFAULT_HERO }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className={`hero${visible ? ' visible' : ''}`}>
      <div className="hero-inner">
        {/* Left: Text */}
        <div className="hero-text">
          <h1 className="hero-headline">{content.headline}</h1>
          <p className="hero-sub">{content.subtext}</p>
          <div className="hero-actions">
            <Link href="/appointment" className="btn-primary">Appointment</Link>
            <Link href="/tentang-kami" className="btn-ghost">About us</Link>
          </div>
        </div>

        {/* Right: Image placeholder (CMS-ready) */}
        <div className="hero-image-wrap">
          {content.hero_image ? (
            <img src={content.hero_image} alt="Ten Thirty Solutions" className="hero-img" />
          ) : (
            <div className="hero-img-placeholder">
              <div className="eco-icon">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <circle cx="60" cy="60" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                  {/* Sun */}
                  <circle cx="60" cy="32" r="8" fill="rgba(255,220,100,0.8)"/>
                  {/* Leaf */}
                  <path d="M60 60 C60 60 48 52 48 44 C48 37 54 32 60 32 C66 32 72 37 72 44 C72 52 60 60 60 60Z"
                        fill="rgba(255,255,255,0.5)"/>
                  {/* Wind */}
                  <path d="M36 70 Q50 64 64 70" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M40 78 Q54 72 68 78" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  {/* Water */}
                  <path d="M60 82 C56 78 52 75 52 71 C52 67 55.6 64 60 64 C64.4 64 68 67 68 71 C68 75 64 78 60 82Z"
                        fill="rgba(150,200,255,0.7)"/>
                  {/* Glow */}
                  <circle cx="60" cy="60" r="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stats-label">Stats</div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-num">{content.stat1_number}</span>
              <span className="stat-desc">{content.stat1_label}</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-num">{content.stat2_number}</span>
              <span className="stat-desc">{content.stat2_label}</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-num">{content.stat3_number}</span>
              <span className="stat-desc">{content.stat3_label}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%);
          display: flex; flex-direction: column;
          padding-top: 68px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .hero.visible { opacity: 1; transform: translateY(0); }
        .hero-inner {
          flex: 1; max-width: 1200px; margin: 0 auto; width: 100%;
          padding: 60px 24px 40px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
          align-items: center;
        }
        .hero-text { color: var(--color-white); }
        .hero-headline {
          font-size: clamp(28px, 4vw, 48px);
          line-height: 1.15; font-weight: 700;
          margin-bottom: 20px;
          color: var(--color-white);
        }
        .hero-sub {
          font-size: 15px; line-height: 1.7;
          color: rgba(250,250,247,0.75);
          max-width: 480px; margin-bottom: 36px;
        }
        .hero-actions { display: flex; gap: 14px; align-items: center; }
        .btn-primary {
          background: var(--color-white);
          color: var(--color-primary-dark);
          padding: 12px 28px; border-radius: var(--radius-sm);
          font-weight: 500; font-size: 15px;
          transition: all var(--transition);
        }
        .btn-primary:hover { background: var(--color-bg); transform: translateY(-1px); }
        .btn-ghost {
          color: rgba(250,250,247,0.8);
          font-size: 15px; padding: 12px 20px;
          border: 1px solid rgba(250,250,247,0.3);
          border-radius: var(--radius-sm);
          transition: all var(--transition);
          font-family: var(--font-body);
        }
        .btn-ghost:hover { border-color: rgba(250,250,247,0.7); color: var(--color-white); }

        .hero-image-wrap { display: flex; justify-content: center; align-items: center; }
        
        .hero-img { 
          width: 400px; 
          height: 400px; 
          border-radius: 50%; 
          object-fit: cover; 
        }
        
        .hero-img-placeholder {
          width: 400px; 
          height: 400px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
        }
        .eco-icon svg { width: 160px; height: 160px; }
        /* Stats */
        .stats-bar {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          margin: 0 40px;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          box-shadow: 0 -4px 30px rgba(26,42,26,0.1);
        }
        .stats-inner {
          max-width: 1120px; margin: 0 auto;
          padding: 20px 32px;
          display: flex; align-items: center; gap: 24px;
        }
        .stats-label {
          font-size: 11px; font-weight: 500;
          color: var(--color-text-muted); text-transform: uppercase;
          letter-spacing: 0.08em; white-space: nowrap;
        }
        .stats-grid {
          display: flex; align-items: center; gap: 0; flex: 1;
        }
        .stat-item {
          flex: 1; padding: 0 24px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .stat-num {
          font-size: 18px; font-weight: 600;
          color: var(--color-primary-dark);
          font-family: var(--font-display);
        }
        .stat-desc {
          font-size: 11px; color: var(--color-text-muted); line-height: 1.4;
        }
        .stat-divider {
          width: 1px; height: 36px;
          background: var(--color-bg-card);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; padding: 40px 24px 32px; gap: 40px; }
          .hero-image-wrap { order: -1; }
          
          /* Resize image and placeholder for mobile */
          .hero-img { width: 240px; height: 240px; }
          .hero-img-placeholder { width: 240px; height: 240px; }
          
          .stats-bar { margin: 0 16px; }
          .stats-inner { flex-direction: column; padding: 16px; gap: 12px; }
          .stats-grid { flex-direction: column; gap: 12px; width: 100%; }
          .stat-divider { width: 100%; height: 1px; }
          .stat-item { padding: 0; }
        }
      `}</style>
    </section>
  )
}
