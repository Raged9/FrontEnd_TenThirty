'use client'
import { useState } from 'react'

const DEFAULT_TESTIMONIALS = [
  { id: 1, name: 'Visch Robert', role: 'Happy Customer', rating: 4.5, text: 'Excellent service and very professional team. Highly recommended!' },
  { id: 2, name: 'Visch Robert', role: 'Happy Customer', rating: 4.5, text: 'Very satisfied with the results. Fast response and thorough inspection.' },
  { id: 3, name: 'Visch Robert', role: 'Happy Customer', rating: 4.5, text: 'Great experience. They handled everything perfectly from start to finish.' },
]

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.floor(rating) ? 'star full' : i - 0.5 <= rating ? 'star half' : 'star'}>★</span>
      ))}
      <style jsx>{`
        .stars { display: flex; gap: 2px; }
        .star { font-size: 14px; color: var(--color-bg-card); }
        .star.full, .star.half { color: #f0b429; }
      `}</style>
    </div>
  )
}

export default function TestimonialsSection({ testimonials = DEFAULT_TESTIMONIALS }) {
  const [page, setPage] = useState(0)
  const perPage = 3
  const totalPages = Math.ceil(testimonials.length / perPage)
  const visible = testimonials.slice(page * perPage, page * perPage + perPage)

  return (
    <section id="testimonials" className="section-testimonials">
      <div className="container">
        <h2 className="section-title">Trusted by Thousands of<br/>Happy Customer</h2>
        <div className="testimonials-grid">
          {visible.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="var(--color-primary)" fillOpacity="0.2"/>
                    <circle cx="20" cy="15" r="7" fill="var(--color-primary)" fillOpacity="0.5"/>
                    <path d="M6 38C6 30 13 25 20 25C27 25 34 30 34 38" fill="var(--color-primary)" fillOpacity="0.3"/>
                  </svg>
                </div>
                <div className="reviewer-info">
                  <p className="reviewer-name">{t.name}</p>
                  <p className="reviewer-role">{t.role}</p>
                </div>
                <span className="rating-num">{t.rating}</span>
              </div>
              <StarRating rating={t.rating}/>
              <p className="testimonial-text">{t.text}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="testimonials-nav">
          <div className="dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} className={`dot${i === page ? ' active' : ''}`} onClick={() => setPage(i)}/>
            ))}
          </div>
          <div className="arrows">
            <button className="arrow" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>←</button>
            <button className="arrow" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1}>→</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-testimonials {
          padding: 80px 24px;
          background: var(--color-bg);
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .section-title {
          text-align: center;
          font-size: clamp(24px, 2.5vw, 36px);
          color: var(--color-text); margin-bottom: 48px; line-height: 1.3;
        }
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
          margin-bottom: 32px;
        }
        .testimonial-card {
          background: var(--color-bg-card);
          border-radius: var(--radius-md);
          padding: 24px; display: flex; flex-direction: column; gap: 12px;
        }
        .testimonial-header {
          display: flex; align-items: center; gap: 12px;
        }
        .avatar { width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; overflow: hidden; }
        .avatar svg { width: 100%; height: 100%; }
        .reviewer-name { font-size: 14px; font-weight: 500; color: var(--color-text); }
        .reviewer-role { font-size: 12px; color: var(--color-text-muted); }
        .rating-num {
          margin-left: auto; font-size: 13px;
          color: var(--color-text-muted); font-weight: 500;
        }
        .testimonial-text {
          font-size: 13px; color: var(--color-text-muted);
          line-height: 1.6; margin-top: 4px;
        }
        .testimonials-nav {
          display: flex; align-items: center; justify-content: space-between;
        }
        .dots { display: flex; gap: 8px; }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-bg-card); border: none;
          cursor: pointer; transition: background var(--transition);
        }
        .dot.active { background: var(--color-primary); }
        .arrows { display: flex; gap: 8px; }
        .arrow {
          width: 36px; height: 36px;
          border: 1px solid var(--color-bg-card);
          border-radius: 50%; font-size: 16px;
          color: var(--color-text-muted);
          display: flex; align-items: center; justify-content: center;
          transition: all var(--transition); cursor: pointer;
          font-family: var(--font-body);
        }
        .arrow:hover:not(:disabled) {
          border-color: var(--color-primary); color: var(--color-primary);
        }
        .arrow:disabled { opacity: 0.3; cursor: default; }
        @media (max-width: 768px) {
          .testimonials-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
