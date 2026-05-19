'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 6 C14 6, 9 10, 9 15 C9 18.3 11.2 20.5 14 21 C16.8 20.5 19 18.3 19 15 C19 10 14 6 14 6Z"
                    fill="currentColor" fillOpacity="0.7"/>
              <line x1="14" y1="21" x2="14" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Logo</span>
          </div>
          <p className="footer-tagline">
            Our goal is to provide convenience and help increase your sales business.
          </p>
          <div className="social-links">
            {['fb', 'tw', 'in'].map(s => (
              <a key={s} href="#" className="social-icon" aria-label={s}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fillOpacity="0.2"/>
                  <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">
                    {s === 'fb' ? 'f' : s === 'tw' ? 't' : 'in'}
                  </text>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="footer-col">
          <h4 className="footer-col-title">About</h4>
          <ul>
            <li><Link href="/tentang-kami">How it Works</Link></li>
            <li><Link href="#">Featured</Link></li>
            <li><Link href="#">Partnership</Link></li>
            <li><Link href="#">Business Relation</Link></li>
          </ul>
        </div>

        {/* Community */}
        <div className="footer-col">
          <h4 className="footer-col-title">Community</h4>
          <ul>
            <li><Link href="#">Events</Link></li>
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">Podcast</Link></li>
            <li><Link href="#">Invite a Friend</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="footer-col">
          <h4 className="footer-col-title">Socials</h4>
          <ul>
            <li><a href="#">Discord</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Facebook</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span>©2023 Company Name. All rights reserved</span>
        <div className="footer-bottom-links">
          <Link href="#">Privacy &amp; Policy</Link>
          <Link href="#">Terms &amp; Condition</Link>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-bg-dark);
          color: rgba(250,250,247,0.7);
          padding: 56px 24px 0;
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px; padding-bottom: 48px;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
          color: var(--color-white); font-weight: 600;
          font-size: 16px; margin-bottom: 14px;
        }
        .footer-tagline { font-size: 13px; line-height: 1.6; margin-bottom: 20px; }
        .social-links { display: flex; gap: 10px; }
        .social-icon {
          width: 32px; height: 32px;
          border: 1px solid rgba(250,250,247,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(250,250,247,0.6);
          transition: border-color var(--transition);
        }
        .social-icon:hover { border-color: rgba(250,250,247,0.6); }
        .footer-col-title {
          font-size: 14px; font-weight: 500;
          color: var(--color-white); margin-bottom: 16px;
          font-family: var(--font-body);
        }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-col ul li a {
          font-size: 13px; color: rgba(250,250,247,0.6);
          transition: color var(--transition);
        }
        .footer-col ul li a:hover { color: var(--color-white); }
        .footer-bottom {
          max-width: 1200px; margin: 0 auto;
          padding: 20px 0;
          border-top: 1px solid rgba(250,250,247,0.1);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: rgba(250,250,247,0.4);
        }
        .footer-bottom-links { display: flex; gap: 24px; }
        .footer-bottom-links a { color: rgba(250,250,247,0.4); transition: color var(--transition); }
        .footer-bottom-links a:hover { color: rgba(250,250,247,0.8); }
        @media (max-width: 768px) {
          .footer-inner { grid-template-columns: 1fr 1fr; }
          .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
