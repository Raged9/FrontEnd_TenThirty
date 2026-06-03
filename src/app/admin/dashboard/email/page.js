'use client'
import React, { useState, useEffect } from 'react'

export default function AppointmentInboxPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // pending, confirmed, done, cancelled
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    let confirmMessage = '';
    if (newStatus === 'done') {
      confirmMessage = 'Apakah Anda yakin ingin menandai pertemuan ini telah selesai? Data akan masuk ke Portofolio.';
    } else {
      const actionText = newStatus === 'confirmed' ? 'MENYETUJUI' : 'MENOLAK'
      confirmMessage = `Apakah Anda yakin ingin ${actionText} jadwal ini? Email notifikasi otomatis akan dikirim ke klien.`;
    }

    if (!confirm(confirmMessage)) return;

    setProcessingId(id)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setAppointments(prev => 
          prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
        )
      } else {
        alert('Gagal mengupdate status.')
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan jaringan.')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak valid';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const filteredAppointments = appointments.filter(app => app.status === activeTab)

  if (loading) {
    return <div className="inbox-container"><p style={{color: 'var(--apple-green-dark)'}}>Loading inbox...</p></div>
  }

  return (
    <div className="inbox-container">
      <header className="inbox-header">
        <div>
          <h1 className="inbox-title">Appointment Inbox</h1>
          <p className="inbox-subtitle">Review pengajuan jadwal dari klien dan tandai pertemuan yang telah selesai.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="tab-container glass-panel">
        <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Menunggu Review 
          <span className="badge pending-badge">{appointments.filter(a => a.status === 'pending').length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`} onClick={() => setActiveTab('confirmed')}>
          Disetujui
          <span className="badge confirmed-badge">{appointments.filter(a => a.status === 'confirmed').length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'done' ? 'active' : ''}`} onClick={() => setActiveTab('done')}>
          Selesai
          <span className="badge done-badge">{appointments.filter(a => a.status === 'done').length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`} onClick={() => setActiveTab('cancelled')}>
          Ditolak / Batal
        </button>
      </div>

      {/* Grid */}
      <div className="appointments-grid">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state glass-panel">
            <p>Tidak ada data appointment di kategori ini.</p>
          </div>
        ) : (
          filteredAppointments.map((app) => (
            <div key={app._id} className="appointment-card glass-panel">
              <div className="card-header">
                <h3>{app.name}</h3>
                <span className={`status-tag ${app.status}`}>{app.status}</span>
              </div>
              
              <div className="card-body">
                <div className="info-group">
                  <span className="label">Layanan</span>
                  <span className="value service-badge">{app.service.replace('-', ' ')}</span>
                </div>
                <div className="info-group">
                  <span className="label">Jadwal</span>
                  <span className="value date-value">
                    {app.schedule ? formatDate(app.schedule.date) : 'Jadwal dihapus'} <br/>
                    {app.schedule ? `${app.schedule.startTime} - ${app.schedule.endTime}` : ''}
                  </span>
                </div>
                <div className="info-group">
                  <span className="label">Lokasi Pertemuan</span>
                  <span className="value">{app.location || '-'}</span>
                </div>
                <div className="info-group">
                  <span className="label">Kontak</span>
                  <span className="value">{app.email}<br/>{app.phone}</span>
                </div>
                {app.notes && (
                  <div className="info-group notes-group">
                    <span className="label">Catatan Klien:</span>
                    <p className="value notes-box">"{app.notes}"</p>
                  </div>
                )}
              </div>

              {/* Action Buttons for Pending */}
              {app.status === 'pending' && (
                <div className="card-actions">
                  <button className="btn-reject" disabled={processingId === app._id} onClick={() => handleStatusUpdate(app._id, 'cancelled')}>
                    Tolak Jadwal
                  </button>
                  <button className="btn-approve" disabled={processingId === app._id} onClick={() => handleStatusUpdate(app._id, 'confirmed')}>
                    {processingId === app._id ? 'Memproses...' : 'Setujui & Email'}
                  </button>
                </div>
              )}

              {/* Action Buttons for Confirmed (NEW) */}
              {app.status === 'confirmed' && (
                <div className="card-actions">
                  <button className="btn-done" disabled={processingId === app._id} onClick={() => handleStatusUpdate(app._id, 'done')}>
                    {processingId === app._id ? 'Memproses...' : 'Tandai Selesai ✓'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        /* Keep all your existing CSS here, and add these 3 new blocks below it: */
        .inbox-container { display: flex; flex-direction: column; gap: 32px; animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .inbox-title { font-size: 28px; color: var(--apple-green-dark); margin-bottom: 8px; font-weight: 700; }
        .inbox-subtitle { color: var(--apple-green-dark); opacity: 0.7; font-size: 15px; }
        .tab-container { display: flex; padding: 6px !important; gap: 4px; border-radius: 20px !important; width: fit-content; }
        .tab-btn { background: transparent; border: none; padding: 10px 24px; border-radius: 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--apple-green-dark); opacity: 0.6; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; }
        .tab-btn:hover { opacity: 1; background: rgba(255,255,255,0.3); }
        .tab-btn.active { background: white; opacity: 1; box-shadow: 0 4px 12px rgba(26, 71, 42, 0.08); }
        .badge { padding: 2px 8px; border-radius: 10px; font-size: 12px; }
        .pending-badge { background: #ffeaa7; color: #d35400; }
        .confirmed-badge { background: #55efc4; color: #00b894; }
        .appointments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
        .empty-state { text-align: center; padding: 48px !important; color: var(--apple-green-dark); opacity: 0.7; }
        .appointment-card { padding: 24px !important; display: flex; flex-direction: column; gap: 20px; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(26, 71, 42, 0.1); padding-bottom: 16px; }
        .card-header h3 { margin: 0; font-size: 18px; color: var(--apple-green-dark); font-weight: 700; }
        .status-tag { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; }
        .status-tag.pending { background: rgba(255, 165, 0, 0.15); color: #d35400; }
        .status-tag.confirmed { background: rgba(46, 204, 113, 0.15); color: #1b8a47; }
        .status-tag.cancelled { background: rgba(231, 76, 60, 0.15); color: #c0392b; }
        .card-body { display: flex; flex-direction: column; gap: 16px; }
        .info-group { display: flex; flex-direction: column; gap: 4px; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.5; font-weight: 700; }
        .value { font-size: 14px; font-weight: 500; line-height: 1.5; }
        .service-badge { background: var(--apple-green-dark); color: white; width: fit-content; padding: 4px 12px; border-radius: 8px; text-transform: capitalize; font-size: 13px; }
        .date-value { font-weight: 700; color: var(--apple-green-emerald); }
        .notes-box { background: rgba(255,255,255,0.5); padding: 12px; border-radius: 8px; font-style: italic; opacity: 0.8; }
        .card-actions { display: flex; gap: 12px; margin-top: auto; border-top: 1px solid rgba(26, 71, 42, 0.1); padding-top: 20px; }
        .btn-reject { flex: 1; padding: 12px; border-radius: 12px; border: none; background: rgba(231, 76, 60, 0.1); color: #c0392b; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-reject:hover { background: rgba(231, 76, 60, 0.2); }
        .btn-approve { flex: 2; padding: 12px; border-radius: 12px; border: none; background: var(--apple-green-emerald); color: white; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2); }
        .btn-approve:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(46, 204, 113, 0.3); }
        .btn-approve:disabled, .btn-reject:disabled { opacity: 0.5; cursor: not-allowed; }

        /* --- NEW CSS FOR DONE STATUS --- */
        .status-tag.done { background: rgba(52, 152, 219, 0.15); color: #2980b9; }
        .done-badge { background: #81ecec; color: #00cec9; }
        .btn-done {
          flex: 1; padding: 12px; border-radius: 12px; border: none;
          background: #3498db; color: white;
          font-weight: 700; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
        }
        .btn-done:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(52, 152, 219, 0.3); }
        .btn-done:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}