'use client'
import { useEffect, useState } from 'react'

const DEFAULT_TEAM = [
  {
    id: 1,
    name: 'Adriana',
    image: null,
    position: 'left', // gambar kiri, teks kanan
    story: 'Bertemu Adriana: Saya berasal dari sebuah Busun kecil bernama Sumberpriangan kabupaten Ketapang, Kalimantan Barat. Lulus dari Akedemi Bahasa Asing Pontianak dan memulai karir saya sebagai guru bahasa inggris namun itu bukanlah sebuah impian saya. Tahun 2011 saya memutuskan untuk mencari pengalaman ke Denpasar, Bali dan disana saya mulai bekerja di MSA KARGO sebagai customer service, di Rama beach hotel and vilas Kuta sebagai Guest Relation Officer dan terakhir saya bekerja di Club Med Nusa Dua. Beberapa pengalaman sehingga membuat saya menjadi seorang pekerja keras dan sangat menghargai waktu. saya berharap bisa membangun PT. Ten Thirty Solusi Lingkungan di Manokwari agar masyarakat sadar akan kebersihan lingkungan.',
  },
  {
    id: 2,
    name: 'Ilka Bahabol',
    image: null,
    position: 'right', // gambar kanan, teks kiri
    story: 'Bertemu Ilka Bahabol: Saya Berasal dari Yahukimo - Papua. Saya adalah seorang pekerja keras. Sejak kecil saya terbiasa untuk melakukan segala sesuatu sendiri termasuk mencari uang. Saya senang bisa bekerja bersama PT. Ten Thirty Solusi Lingkungan di Manokwari agar saya bisa mendapatkan sebua ilmu baru di dunia pekerjaan. Saya akan berusaha agar perusahaan ini bisa berkembang.',
  },
]

export default function TentangKamiContent() {
  const [team, setTeam] = useState(DEFAULT_TEAM)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/tentang_kami`)
        if (res.ok) {
          const data = await res.json()
          if (data.team && data.team.length > 0) setTeam(data.team)
        }
      } catch {
        // pakai default
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  return (
    <div className="tentang-wrap">
      <div className="tentang-inner">
        <h1 className="tentang-title">TENTANG KAMI</h1>

        {loading ? (
          <div className="loading">
            <div className="loading-bar"/><div className="loading-bar short"/>
          </div>
        ) : (
          <div className="team-list">
            {team.map((member) => (
              <div key={member.id} className={`team-item ${member.position === 'right' ? 'reverse' : ''}`}>
                {/* Gambar */}
                <div className="member-image-wrap">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="member-image"/>
                  ) : (
                    <div className="member-image-placeholder">
                      <svg viewBox="0 0 200 240" fill="none">
                        <rect width="200" height="240" rx="8" fill="var(--color-bg-card)"/>
                        <circle cx="100" cy="80" r="40" fill="var(--color-accent)" fillOpacity="0.3"/>
                        <path d="M20 220C20 180 55 155 100 155C145 155 180 180 180 220"
                              fill="var(--color-accent)" fillOpacity="0.2"/>
                        <text x="100" y="200" textAnchor="middle" fontSize="13"
                              fill="var(--color-text-muted)" fontFamily="sans-serif">{member.name}</text>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Teks */}
                <div className="member-text">
                  <p className="member-story">{member.story}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .tentang-wrap {
          min-height: 100vh;
          padding-top: 68px;
          background: var(--color-white);
        }
        .tentang-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .tentang-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 36px;
          font-family: var(--font-display);
          letter-spacing: 0.02em;
        }
        .loading {
          display: flex; flex-direction: column; gap: 12px;
        }
        .loading-bar {
          height: 16px; background: var(--color-bg-card);
          border-radius: 4px; animation: pulse 1.4s ease infinite;
        }
        .loading-bar.short { width: 60%; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .team-list {
          display: flex; flex-direction: column; gap: 56px;
        }
        .team-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: start;
        }
        .team-item.reverse {
          direction: rtl;
        }
        .team-item.reverse > * {
          direction: ltr;
        }
        .member-image-wrap {
          width: 100%;
        }
        .member-image {
          width: 100%;
          border-radius: var(--radius-md);
          object-fit: cover;
          aspect-ratio: 3/4;
        }
        .member-image-placeholder {
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .member-image-placeholder svg {
          width: 100%; height: 100%;
        }
        .member-text {
          padding-top: 8px;
        }
        .member-story {
          font-size: 14px;
          line-height: 1.85;
          color: var(--color-text);
        }

        @media (max-width: 640px) {
          .team-item, .team-item.reverse {
            grid-template-columns: 1fr;
            direction: ltr;
          }
          .team-item.reverse .member-image-wrap {
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}
