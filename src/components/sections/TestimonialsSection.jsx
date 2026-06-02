'use client'
import React from 'react'

export default function TestimonialsSection({ content }) {
  // Fallback dummy data in case the CMS is empty
  const testimonials = content?.list && content.list.length > 0 
    ? content.list 
    : [
        {
          id: 1,
          name: 'Budi Santoso',
          role: 'CEO PT Maju Jaya',
          message: 'Ten Thirty Solution sangat profesional dalam menangani manajemen limbah perusahaan kami. Sistem mereka efisien dan sangat transparan.',
          rating: 5,
          image: null
        },
        {
          id: 2,
          name: 'Siti Rahmawati',
          role: 'Direktur Operasional',
          message: 'Sangat puas dengan layanan edukasi lingkungan yang diberikan. Tim kami menjadi jauh lebih peduli terhadap sustainability.',
          rating: 5,
          image: null
        },
        {
          id: 3,
          name: 'Andi Wijaya',
          role: 'Manajer Pabrik',
          message: 'Pendekatan mereka dalam memecahkan masalah solusi lingkungan sangat unik dan terstruktur. Pengelolaan sampah kini bukan lagi beban.',
          rating: 4,
          image: null
        }
      ]

  return (
    <section id="testimonials" className="section-testimonials">
      <div className="container">
        
        {/* Header dynamically pulling from CMS */}
        <div className="section-header">
          <h2>{content?.title || "Apa Kata Klien Kami"}</h2>
          <p>{content?.subtitle || "Testimoni dari mitra yang telah melangkah bersama Ten Thirty Solution menuju masa depan yang berkelanjutan."}</p>
        </div>

        {/* Dynamic Grid Mapping */}
        <div className="testimonials-grid">
          {testimonials.map((testi, index) => {
            // Ensure rating is a number between 1 and 5
            const ratingValue = Number(testi.rating) || 5;
            
            return (
              <div key={testi.id || index} className="testimonial-card">
                {/* Dynamic Star Rating */}
                <div className="testi-rating">
                  {'★'.repeat(ratingValue)}{'☆'.repeat(5 - ratingValue)}
                </div>
                
                <p className="testi-message">"{testi.message}"</p>
                
                <div className="testi-author">
                  {testi.image ? (
                    <img src={testi.image} alt={testi.name} className="author-img" />
                  ) : (
                    // Initial avatar placeholder if no image is uploaded
                    <div className="author-placeholder">
                      {testi.name ? testi.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  <div className="author-info">
                    <h4>{testi.name}</h4>
                    <span>{testi.role}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .section-testimonials {
          padding: 100px 24px;
          background: #f8f9fa;
          scroll-margin-top: 70px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        .section-header {
          text-align: center;
          max-width: 650px;
          margin: 0 auto;
        }

        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: var(--apple-green-dark, #1a472a);
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .section-header p {
          font-size: 16px;
          color: var(--color-text-muted, #666);
          line-height: 1.6;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .testimonial-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 4px 24px rgba(26, 71, 42, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(26, 71, 42, 0.05);
        }

        .testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(26, 71, 42, 0.08);
        }

        .testi-rating {
          color: #f1c40f;
          font-size: 18px;
          letter-spacing: 2px;
        }

        .testi-message {
          font-size: 15px;
          line-height: 1.7;
          color: #444;
          font-style: italic;
          flex-grow: 1;
        }

        .testi-author {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 12px;
          border-top: 1px solid rgba(26, 71, 42, 0.08);
          padding-top: 24px;
        }

        .author-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--apple-green-emerald, #2ecc71);
        }

        .author-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--apple-green-dark, #1a472a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
        }

        .author-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--apple-green-dark, #1a472a);
        }

        .author-info span {
          font-size: 13px;
          color: #777;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .section-testimonials {
            padding: 80px 20px;
          }
          .section-header h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  )
}