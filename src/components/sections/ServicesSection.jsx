'use client'

const DEFAULT_SERVICES = [
  {
    id: 1,
    icon: 'location',
    title: 'Septic Design',
    description: 'Professional septic designs for residential and commercial systems.',
    badge: null,
  },
  {
    id: 2,
    icon: 'briefcase',
    title: 'Inspections',
    description: 'Compliance inspections and expert troubleshooting for all system types.',
    badge: null,
  },
  {
    id: 3,
    icon: 'car',
    title: 'Environmental Consulting',
    description: 'Meeting your business regulatory needs with expert consulting.',
    badge: null,
  },
]

const DEFAULT_DETAIL_SERVICES = [
  {
    id: 1,
    title: 'Septic System Design',
    description: 'Custom-tailored designs for new builds and upgrades. From small homes to large commercial sites.',
    badge: 'Certified Advanced Designer',
  },
  {
    id: 2,
    title: 'Inspections & Troubleshooting',
    description: 'Detailed compliance inspections and expert problem-solving for all types of septic systems.',
    badge: 'Certified Advanced Inspector',
  },
  {
    id: 3,
    title: 'Environmental Compliance',
    description: 'Regulatory consulting and tailored solutions for businesses. From local government to national compliance.',
    badge: 'Business Regulatory Services',
  },
]

function ServiceIcon({ type }) {
  if (type === 'location') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  )
  if (type === 'briefcase') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  )
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 3h15v13H1z"/>
      <path d="M16 8l4 2v6h-4V8Z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}

export default function ServicesSection({ services = DEFAULT_SERVICES, detailServices = DEFAULT_DETAIL_SERVICES }) {
  return (
    <>
      {/* Section 1: Overview */}
      <section id="services" className="section-services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>

          {/* Wavy connector line */}
          <div className="services-connector">
            <svg viewBox="0 0 800 40" fill="none" preserveAspectRatio="none">
              <path d="M0 20 Q200 5 400 20 Q600 35 800 20"
                    stroke="var(--color-accent)" strokeWidth="1.5"
                    fill="none" strokeDasharray="6 4"/>
              {[0, 400, 800].map((x, i) => (
                <circle key={i} cx={x} cy="20" r="5"
                        fill="var(--color-primary)" fillOpacity="0.5"/>
              ))}
            </svg>
          </div>

          <div className="services-grid">
            {services.map(svc => (
              <div key={svc.id} className="service-card">
                <div className="service-icon">
                  <ServiceIcon type={svc.icon}/>
                </div>
                <h3 className="service-name">{svc.title}</h3>
                <p className="service-desc">{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Detailed cards (dark bg) */}
      <section className="section-services-detail">
        <div className="container">
          <h2 className="section-title-light">Our Septic &amp; Environmental<br/>Services.</h2>
          <div className="detail-grid">
            {detailServices.map(svc => (
              <div key={svc.id} className="detail-card">
                <h3 className="detail-title">{svc.title}</h3>
                <p className="detail-desc">{svc.description}</p>
                {svc.badge && <span className="detail-badge">{svc.badge}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-services {
          padding: 80px 24px;
          background: var(--color-bg);
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .section-title {
          text-align: center; font-size: clamp(28px, 3vw, 38px);
          color: var(--color-text); margin-bottom: 32px;
        }
        .services-connector {
          width: 100%; max-width: 700px; margin: 0 auto 56px;
          height: 40px;
        }
        .services-connector svg { width: 100%; height: 100%; }
        .services-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
        }
        .service-card {
          text-align: center; padding: 12px;
        }
        .service-icon {
          width: 52px; height: 52px;
          background: var(--color-bg-card);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          color: var(--color-primary-dark);
        }
        .service-name {
          font-size: 18px; font-weight: 600; margin-bottom: 10px;
          color: var(--color-text);
          font-family: var(--font-display);
        }
        .service-desc { font-size: 14px; color: var(--color-text-muted); line-height: 1.6; }

        /* Detail section */
        .section-services-detail {
          padding: 80px 24px;
          background: var(--color-bg-dark);
        }
        .section-title-light {
          text-align: center; font-size: clamp(26px, 3vw, 36px);
          color: var(--color-white); margin-bottom: 48px; line-height: 1.3;
        }
        .detail-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .detail-card {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          padding: 28px; color: var(--color-white);
          transition: background var(--transition);
        }
        .detail-card:hover { background: rgba(255,255,255,0.12); }
        .detail-title {
          font-size: 16px; font-weight: 600; margin-bottom: 12px;
          font-family: var(--font-display);
        }
        .detail-desc { font-size: 13px; color: rgba(250,250,247,0.7); line-height: 1.6; margin-bottom: 16px; }
        .detail-badge {
          display: inline-block;
          font-size: 11px; color: rgba(250,250,247,0.5);
          border: 1px solid rgba(250,250,247,0.2);
          padding: 4px 10px; border-radius: 20px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .services-grid, .detail-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </>
  )
}
