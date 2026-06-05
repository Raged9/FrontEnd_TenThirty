'use client'

const DEFAULT_ABOUT = {
  title: 'More Than Just a Business',
  description: 'We are committed to protecting public health through our expert environmental solutions, while simultaneously addressing homelessness and poverty in our community. Every service you book helps a person in need.',
  points: [
    {
      title: 'Expertise with a Purpose',
      desc: 'Delivering certified septic designs and inspections that safeguard the ecosystem.',
    },
    {
      title: 'Donations that Make an Impact',
      desc: '5% of our monthly revenue is donated directly to help address homelessness in Anoka County.',
    },
    {
      title: 'Partners in Progress.',
      desc: 'We support Ten Thirty House to provide essential services to families in need.',
    },
  ],
  image: null,
}

const DEFAULT_LOCATION = {
  address: 'Ruko Peterongan Plaza Blok C-2, Jalan MT. Haryono Nomor 719, Desa/Kelurahan Wonodri, Kec. Semarang Selatan, Kota Semarang, Provinsi Jawa Tengah, Kode Pos: 50242',
  map_image: null,
}

export function AboutSection({ content = DEFAULT_ABOUT }) {
  return (
    <section id="about" className="section-about">
      <div className="container">
        <div className="about-grid">
          {/* Image */}
          <div className="about-image-wrap">
            {content.image ? (
              <img src={content.image} alt="Ten Thirty Solutions" className="about-img"/>
            ) : (
              <div className="about-img-placeholder">
                <svg viewBox="0 0 200 160" fill="none">
                  <rect width="200" height="160" rx="8" fill="var(--color-bg-card)"/>
                  <rect x="20" y="20" width="160" height="120" rx="4" fill="var(--color-accent)" fillOpacity="0.2"/>
                  <path d="M60 100 Q80 70 100 80 Q120 90 160 60" stroke="var(--color-accent)" strokeWidth="2" fill="none"/>
                  <circle cx="80" cy="55" r="18" fill="var(--color-accent)" fillOpacity="0.3"/>
                  <path d="M20 130 L60 100 L100 115 L140 85 L180 95 L180 150 L20 150Z"
                        fill="var(--color-primary)" fillOpacity="0.15"/>
                </svg>
              </div>
            )}
          </div>

          {/* Text as a Box */}
          <div className="about-text">
            <h2 className="about-title">{content.title}</h2>
            <p className="about-desc">{content.description}</p>
            <div className="about-points">
              {content.points.map((pt, i) => (
                <div key={i} className="about-point">
                  <div className="point-dot"/>
                  <div>
                    <h4 className="point-title">{pt.title}</h4>
                    <p className="point-desc">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-about { padding: 80px 24px; background: var(--color-bg); }
        .container { max-width: 1200px; margin: 0 auto; }
        
        /* 1. Change to Flexbox with wrap enabled */
        .about-grid {
          display: flex; 
          flex-wrap: wrap; /* This is the magic property that drops the box down */
          gap: 64px;
          justify-content: center; /* Keeps them centered whether side-by-side or stacked */
          align-items: center;
        }

        /* Strictly Fixed 500x1000px Image */
        .about-image-wrap { 
          display: flex; justify-content: center; align-items: center; 
          flex: 0 0 auto; /* Tells the image never to shrink or grow */
        }
        .about-img { 
          width: 500px !important; min-width: 500px; max-width: 500px;
          height: 1000px !important; min-height: 1000px; max-height: 1000px;
          border-radius: var(--radius-lg); object-fit: cover; 
        }
        .about-img-placeholder {
          width: 500px !important; min-width: 500px; max-width: 500px;
          height: 1000px !important; min-height: 1000px; max-height: 1000px;
          border-radius: var(--radius-lg); overflow: hidden; 
          background: var(--color-bg-card);
        }
        .about-img-placeholder svg { width: 100%; height: 100%; }

        /* 2. The Rigid Text Box */
        .about-text {
          background: white;
          padding: 48px;
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
          
          /* This makes the box rigid. It tries to stay 500px wide. */
          /* Note: using min(100%, 500px) ensures it doesn't overflow on tiny mobile phones */
          width: 100%;
          max-width: 600px; 
          flex: 0 0 min(100%, 500px); 
          
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </section>
  )
}

export function LocationSection({ content = DEFAULT_LOCATION }) {
  return (
    <section className="section-location">
      <div className="container">
        <div className="location-grid">
          <div className="location-text">
            <h2 className="location-title">Our Location</h2>
            <p className="location-address">{content.address}</p>
          </div>
          <div className="location-map">
            {content.map_image ? (
              <img src={content.map_image} alt="Location map" className="map-img"/>
            ) : (
              <div className="map-placeholder">
                <svg viewBox="0 0 300 220" fill="none">
                  <rect width="300" height="220" rx="12" fill="var(--color-bg-card)"/>
                  <rect x="10" y="10" width="280" height="200" rx="8" fill="var(--color-accent)" fillOpacity="0.15"/>
                  {/* Simple map lines */}
                  <line x1="0" y1="110" x2="300" y2="110" stroke="var(--color-accent)" strokeWidth="6" strokeOpacity="0.3"/>
                  <line x1="150" y1="0" x2="150" y2="220" stroke="var(--color-accent)" strokeWidth="4" strokeOpacity="0.2"/>
                  <line x1="0" y1="60" x2="300" y2="60" stroke="var(--color-accent)" strokeWidth="2" strokeOpacity="0.15"/>
                  <line x1="0" y1="160" x2="300" y2="160" stroke="var(--color-accent)" strokeWidth="2" strokeOpacity="0.15"/>
                  {/* Pin */}
                  <circle cx="150" cy="105" r="18" fill="var(--color-primary)" fillOpacity="0.8"/>
                  <path d="M150 87 C142 87 135 94 135 102 C135 112 150 125 150 125 C150 125 165 112 165 102 C165 94 158 87 150 87Z"
                        fill="var(--color-primary-dark)"/>
                  <circle cx="150" cy="101" r="5" fill="white"/>
                  <text x="150" y="145" textAnchor="middle" fontSize="10" fill="var(--color-text-muted)" fontFamily="sans-serif">Ten Thirty Solutions</text>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-location { padding: 80px 24px; background: var(--color-bg); }
        .container { max-width: 1200px; margin: 0 auto; }
        .location-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
          align-items: center;
        }
        .location-title {
          font-size: clamp(28px, 3vw, 42px); font-weight: 700;
          color: var(--color-text); margin-bottom: 16px;
        }
        .location-address {
          font-size: 14px; color: var(--color-text-muted); line-height: 1.8;
        }
        .map-img { width: 100%; border-radius: var(--radius-lg); object-fit: cover; }
        .map-placeholder {
          width: 100%; border-radius: var(--radius-lg);
          overflow: hidden; aspect-ratio: 4/3;
          background: var(--color-bg-dark);
        }
        .map-placeholder svg { width: 100%; height: 100%; }
        @media (max-width: 768px) {
          .location-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </section>
  )
}