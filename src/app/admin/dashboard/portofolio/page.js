'use client'
import React, { useState, useEffect } from 'react'

export default function PortofolioPage() {
  const [doneAppointments, setDoneAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoneAppointments()
  }, [])

  const fetchDoneAppointments = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (Array.isArray(data)) {
        // Filter ONLY the appointments that have status 'done'
        const completed = data.filter(app => app.status === 'done')
        setDoneAppointments(completed)
      }
    } catch (error) {
      console.error('Error fetching portofolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  if (loading) {
    return <div className="portofolio-container"><p style={{color: 'var(--apple-green-dark)'}}>Loading portofolio...</p></div>
  }

  return (
    <div className="portofolio-container">
      <header className="portofolio-header">
        <div>
          <h1 className="portofolio-title">Portofolio Klien</h1>
          <p className="portofolio-subtitle">Daftar klien dan project yang telah sukses diselesaikan (Selesai Meet).</p>
        </div>
        <div className="total-badge glass-panel">
          <span className="total-number">{doneAppointments.length}</span>
          <span className="total-text">Project Selesai</span>
        </div>
      </header>

      <div className="appointments-grid">
        {doneAppointments.length === 0 ? (
          <div className="empty-state glass-panel">
            <p>Belum ada project atau pertemuan yang ditandai selesai.</p>
          </div>
        ) : (
          doneAppointments.map((app) => (
            <div key={app._id} className="appointment-card glass-panel">
              <div className="card-header">
                <h3>{app.name}</h3>
                <span className="status-tag done">Selesai</span>
              </div>
              
              <div className="card-body">
                <div className="info-group">
                  <span className="label">Layanan Diselesaikan</span>
                  <span className="value service-badge">{app.service.replace('-', ' ')}</span>
                </div>
                <div className="info-group">
                  <span className="label">Tanggal Pelaksanaan</span>
                  <span className="value date-value">
                    {app.schedule ? formatDate(app.schedule.date) : 'Tanggal tidak tersedia'}
                  </span>
                </div>
                <div className="info-group">
                  <span className="label">Lokasi Project</span>
                  <span className="value">{app.location || '-'}</span>
                </div>
                <div className="info-group">
                  <span className="label">Info Klien</span>
                  <span className="value">{app.email}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .portofolio-container { display: flex; flex-direction: column; gap: 32px; animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .portofolio-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .portofolio-title { font-size: 28px; color: var(--apple-green-dark); margin-bottom: 8px; font-weight: 700; }
        .portofolio-subtitle { color: var(--apple-green-dark); opacity: 0.7; font-size: 15px; }
        
        .total-badge { padding: 16px 24px !important; display: flex; align-items: center; gap: 12px; }
        .total-number { font-size: 32px; font-weight: 800; color: #3498db; }
        .total-text { font-size: 14px; font-weight: 600; color: var(--apple-green-dark); opacity: 0.8; }

        .appointments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .empty-state { text-align: center; padding: 48px !important; color: var(--apple-green-dark); opacity: 0.7; }
        
        .appointment-card { padding: 24px !important; display: flex; flex-direction: column; gap: 20px; border-left: 4px solid #3498db; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(26, 71, 42, 0.1); padding-bottom: 16px; }
        .card-header h3 { margin: 0; font-size: 18px; color: var(--apple-green-dark); font-weight: 700; }
        
        .status-tag { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; }
        .status-tag.done { background: rgba(52, 152, 219, 0.15); color: #2980b9; }
        
        .card-body { display: flex; flex-direction: column; gap: 16px; }
        .info-group { display: flex; flex-direction: column; gap: 4px; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.5; font-weight: 700; }
        .value { font-size: 14px; font-weight: 500; line-height: 1.5; }
        .service-badge { background: var(--apple-green-dark); color: white; width: fit-content; padding: 4px 12px; border-radius: 8px; text-transform: capitalize; font-size: 13px; }
        .date-value { font-weight: 700; color: var(--apple-green-emerald); }
      `}</style>
    </div>
  )
}