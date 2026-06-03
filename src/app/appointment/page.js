'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReCAPTCHA from 'react-google-recaptcha'

const SERVICES = [
  { value: 'septic-design', label: 'Septic Design' },
  { value: 'inspection', label: 'Inspections' },
  { value: 'environmental-consulting', label: 'Environmental Consulting' },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}
function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AppointmentPage() {
  const today = new Date()
  const [step, setStep] = useState(1) // 1: pilih jadwal, 2: isi form, 3: sukses
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [schedules, setSchedules] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', location: '', notes: '' })
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const MAX_WORDS = 20;
  const currentWords = form.location.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => { fetchSchedules() }, [currentMonth, currentYear])

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedules`)
      if (res.ok) setSchedules(await res.json())
    } catch {}
    setLoading(false)
  }

  const getScheduleForDate = (dateNum) => {
    return schedules.find(s => {
      const sd = new Date(s.date)
      return sd.getUTCFullYear() === currentYear &&
            sd.getUTCMonth() === currentMonth &&
            sd.getUTCDate() === dateNum
    })
  }
  
  const handleDateClick = (dateNum) => {
    const sched = getScheduleForDate(dateNum)
    if (sched) setSelectedSchedule(sched)
  }

  // NEW: Custom handler to restrict location input by word count
  const handleLocationChange = (e) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/).filter(Boolean);
    
    // Only allow typing if under the limit, or if they are deleting text
    if (words.length <= MAX_WORDS || val === '') {
      setForm({ ...form, location: val });
    }
  }

  const handleSubmit = async () => {
    setError('')
    // NEW: Ensure location is required before submitting
    if (!form.name || !form.email || !form.phone || !form.service || !form.location) {
      setError('Semua field dengan tanda * wajib diisi'); return
    }
    if (!selectedSchedule) {
      setError('Pilih jadwal terlebih dahulu'); return
    }
    if (!captchaToken) {
      setError('Silakan selesaikan validasi CAPTCHA terlebih dahulu'); return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, scheduleId: selectedSchedule._id, captchaToken }),
      })
      if (res.ok) {
        setStep(3)
      } else {
        const d = await res.json()
        setError(d.message || 'Gagal membuat appointment')
      }
    } catch { setError('Server tidak bisa dihubungi') }
    setSubmitting(false)
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  return (
    <main>
      <Navbar />
      <div className="page">
        <div className="container">

          {/* ── Step indicator ── */}
          <div className="steps">
            {['Pilih Jadwal', 'Isi Data', 'Konfirmasi'].map((s, i) => (
              <div key={i} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                <div className="step-dot">{step > i + 1 ? '✓' : i + 1}</div>
                <span className="step-label">{s}</span>
                {i < 2 && <div className="step-line"/>}
              </div>
            ))}
          </div>

          {/* ── Step 1: Pilih jadwal ── */}
          {step === 1 && (
            <div className="step-content">
              <h2 className="section-heading">Pilih Tanggal & Waktu</h2>
              <div className="step1-grid">

                {/* Calendar */}
                <div className="card">
                  <div className="cal-header">
                    <button className="cal-nav" onClick={prevMonth}>‹</button>
                    <div className="cal-title">
                      <span>{MONTHS[currentMonth]}</span>
                      <span className="cal-arrow">▾</span>
                      <span style={{marginLeft:8}}>{currentYear}</span>
                      <span className="cal-arrow">▾</span>
                    </div>
                    <button className="cal-nav" onClick={nextMonth}>›</button>
                  </div>
                  <div className="cal-days-header">
                    {DAYS.map(d => <span key={d} className="day-label">{d}</span>)}
                  </div>
                  <div className="cal-grid">
                    {Array.from({ length: totalCells }).map((_, i) => {
                      const dateNum = i - firstDay + 1
                      const isValid = dateNum >= 1 && dateNum <= daysInMonth
                      const isPast = isValid && new Date(currentYear, currentMonth, dateNum) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                      const sched = isValid ? getScheduleForDate(dateNum) : null
                      const isAvailable = !!sched
                      const isSelected = selectedSchedule && sched && sched._id === selectedSchedule._id
                      const isToday = isValid && dateNum === today.getUTCDate() &&
                                      currentMonth === today.getUTCMonth() &&
                                      currentYear === today.getUTCFullYear()
                      return (
                        <button
                          key={i}
                          className={['cal-cell',
                            !isValid ? 'empty' : '',
                            isPast ? 'past' : '',
                            isAvailable && !isPast ? 'available' : '',
                            isSelected ? 'selected' : '',
                            isToday ? 'is-today' : '',
                          ].join(' ')}
                          onClick={() => isValid && !isPast && isAvailable && handleDateClick(dateNum)}
                          disabled={!isValid || isPast || !isAvailable}
                        >
                          {isValid ? dateNum : ''}
                        </button>
                      )
                    })}
                  </div>
                  <div className="cal-legend">
                    <div className="legend-item"><span className="dot available-dot"/>Tersedia</div>
                    <div className="legend-item"><span className="dot selected-dot"/>Dipilih</div>
                    <div className="legend-item"><span className="dot unavail-dot"/>Tidak tersedia</div>
                  </div>
                </div>

                {/* Selected info */}
                <div className="schedule-info">
                  {selectedSchedule ? (
                    <div className="card selected-card">
                      <div className="selected-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <h3 className="selected-title">Jadwal Dipilih</h3>
                      <p className="selected-date">{formatDate(selectedSchedule.date)}</p>
                      <p className="selected-time">{selectedSchedule.startTime} – {selectedSchedule.endTime}</p>
                      <button className="btn-next" onClick={() => setStep(2)}>
                        Lanjutkan →
                      </button>
                    </div>
                  ) : (
                    <div className="card empty-card">
                      <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <p className="empty-text">Pilih tanggal yang tersedia<br/>pada kalender</p>
                    </div>
                  )}

                  {loading && <p className="loading-text">Memuat jadwal...</p>}
                  {!loading && schedules.length === 0 && (
                    <p className="no-schedule">Belum ada jadwal tersedia saat ini.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Isi form ── */}
          {step === 2 && (
            <div className="step-content">
              <h2 className="section-heading">Isi Data Diri</h2>
              <div className="step2-grid">

                {/* Form */}
                <div className="card form-card">
                  {error && <div className="error-msg">{error}</div>}

                  <div className="field">
                    <label className="label">Nama Lengkap *</label>
                    <input className="input" placeholder="Nama lengkap Anda"
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                  </div>
                  <div className="field">
                    <label className="label">Email *</label>
                    <input className="input" type="email" placeholder="email@contoh.com"
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
                  </div>
                  <div className="field">
                    <label className="label">Nomor Telepon *</label>
                    <input className="input" type="tel" placeholder="+62 812 3456 7890"
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                  </div>
                  <div className="field">
                    <label className="label">Layanan *</label>
                    <select className="input" value={form.service}
                      onChange={e => setForm({...form, service: e.target.value})}>
                      <option value="">Pilih layanan...</option>
                      {SERVICES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* NEW: Lokasi Field with Word Counter */}     
                  <div className="field">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="label">Lokasi Pertemuan *</label>
                      <span className="label" style={{ fontSize: '11px', color: currentWords >= MAX_WORDS ? '#c0392b' : 'var(--color-text-muted)' }}>
                        {currentWords} / {MAX_WORDS} kata
                      </span>
                    </div>
                    <input className="input" placeholder="Contoh: Kantor PT Maju Jaya (Jl. Sudirman) / Zoom Meeting"
                      value={form.location} onChange={handleLocationChange}/>
                  </div>

                  <div className="field">
                    <label className="label">Catatan (opsional)</label>
                    <textarea className="input textarea" rows={3} placeholder="Informasi tambahan..."
                      value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}/>
                  </div>

                  <div className="field" style={{ marginTop: '8px', marginBottom: '8px' }}>
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={(token) => setCaptchaToken(token)}
                      onExpired={() => setCaptchaToken(null)}
                    />
                  </div>

                  <div className="form-actions">
                    <button className="btn-back" onClick={() => setStep(1)}>← Kembali</button>
                    <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'Memproses...' : 'Buat Appointment'}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="card summary-card">
                  <h3 className="summary-title">Ringkasan</h3>
                  <div className="summary-item">
                    <span className="summary-label">Tanggal</span>
                    <span className="summary-value">{formatDate(selectedSchedule?.date)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Waktu</span>
                    <span className="summary-value">{selectedSchedule?.startTime} – {selectedSchedule?.endTime}</span>
                  </div>
                  {form.service && (
                    <div className="summary-item">
                      <span className="summary-label">Layanan</span>
                      <span className="summary-value">{SERVICES.find(s => s.value === form.service)?.label}</span>
                    </div>
                  )}
                  {/* NEW: Show Location in Summary */}
                  {form.location && (
                    <div className="summary-item">
                      <span className="summary-label">Lokasi</span>
                      <span className="summary-value">{form.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Sukses ── */}
          {step === 3 && (
            <div className="step-content success-wrap">
              <div className="card success-card">
                <div className="success-icon">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <h2 className="success-title">Appointment Berhasil Dibuat!</h2>
                <p className="success-sub">
                  Terima kasih, <strong>{form.name}</strong>. Kami akan segera menghubungi Anda melalui email <strong>{form.email}</strong> untuk konfirmasi.
                </p>
                <div className="success-detail">
                  <div className="summary-item">
                    <span className="summary-label">Tanggal</span>
                    <span className="summary-value">{formatDate(selectedSchedule?.date)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Waktu</span>
                    <span className="summary-value">{selectedSchedule?.startTime} – {selectedSchedule?.endTime}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Layanan</span>
                    <span className="summary-value">{SERVICES.find(s => s.value === form.service)?.label}</span>
                  </div>
                  {/* NEW: Show Location in Success Detail */}
                  <div className="summary-item">
                    <span className="summary-label">Lokasi</span>
                    <span className="summary-value">{form.location}</span>
                  </div>
                </div>
                <a href="/" className="btn-home">Kembali ke Beranda</a>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />

      <style jsx>{`
        .page {
          min-height: 100vh; padding-top: 68px;
          background: var(--color-bg); padding-bottom: 80px;
        }
        .container { max-width: 960px; margin: 0 auto; padding: 48px 24px; }

        /* Steps */
        .steps {
          display: flex; align-items: center; margin-bottom: 48px;
        }
        .step { display: flex; align-items: center; gap: 10px; }
        .step-dot {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid var(--color-bg-card);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600; color: var(--color-text-muted);
          background: white; flex-shrink: 0;
        }
        .step.active .step-dot {
          border-color: var(--color-primary-dark);
          background: var(--color-primary-dark); color: white;
        }
        .step.done .step-dot {
          border-color: var(--color-primary);
          background: var(--color-primary); color: white;
        }
        .step-label { font-size: 13px; color: var(--color-text-muted); white-space: nowrap; }
        .step.active .step-label { color: var(--color-primary-dark); font-weight: 500; }
        .step.done .step-label { color: var(--color-primary); }
        .step-line { width: 48px; height: 1px; background: var(--color-bg-card); margin: 0 8px; flex-shrink: 0; }

        .section-heading {
          font-size: 22px; font-weight: 700; color: var(--color-text);
          margin-bottom: 24px;
        }

        /* Cards */
        .card {
          background: white; border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }

        /* Step 1 */
        .step1-grid { display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start; }

        /* Calendar */
        .card { padding: 24px; }
        .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .cal-nav {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid var(--color-bg-card); background: white;
          font-size: 18px; color: var(--color-text-muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .cal-nav:hover { background: var(--color-bg); }
        .cal-title {
          font-size: 15px; font-weight: 700; color: var(--color-text);
          display: flex; align-items: center; gap: 2px;
        }
        .cal-arrow { font-size: 9px; color: var(--color-text-muted); margin-left: 2px; }
        .cal-days-header { display: grid; grid-template-columns: repeat(7,1fr); margin-bottom: 4px; }
        .day-label { text-align: center; font-size: 12px; color: var(--color-text-muted); padding: 3px 0; }
        .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 3px; }
        .cal-cell {
          aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
          font-size: 13px; border-radius: 8px; border: none; background: none;
          color: var(--color-text); cursor: not-allowed; opacity: 0.35;
          font-family: var(--font-body);
        }
        .cal-cell.empty { visibility: hidden; }
        .cal-cell.past { opacity: 0.25; }
        .cal-cell.available {
          background: var(--color-primary); color: white;
          opacity: 1; cursor: pointer; font-weight: 500;
          transition: transform 0.15s;
        }
        .cal-cell.available:hover { transform: scale(1.1); }
        .cal-cell.selected {
          background: var(--color-primary-dark); color: white;
          opacity: 1; font-weight: 700;
          box-shadow: 0 2px 8px rgba(45,61,45,0.3);
        }
        .cal-cell.is-today {
          outline: 2px solid var(--color-primary-dark);
          outline-offset: 2px;
        }
        .cal-legend {
          display: flex; gap: 16px; margin-top: 16px; padding-top: 14px;
          border-top: 1px solid var(--color-bg-card);
        }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--color-text-muted); }
        .dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
        .available-dot { background: var(--color-primary); }
        .selected-dot { background: var(--color-primary-dark); }
        .unavail-dot { background: var(--color-bg-card); }

        /* Selected card */
        .selected-card {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 8px;
        }
        .selected-icon { color: var(--color-primary); margin-bottom: 4px; }
        .selected-title { font-size: 15px; font-weight: 600; color: var(--color-text); }
        .selected-date { font-size: 16px; font-weight: 700; color: var(--color-primary-dark); }
        .selected-time { font-size: 14px; color: var(--color-text-muted); }
        .btn-next {
          width: 100%; margin-top: 8px; padding: 12px;
          background: var(--color-primary-dark); color: white;
          border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: var(--font-body); transition: opacity 0.2s;
        }
        .btn-next:hover { opacity: 0.88; }

        .empty-card {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 12px; padding: 32px 24px;
        }
        .empty-icon { color: var(--color-bg-card); }
        .empty-text { font-size: 13px; color: var(--color-text-muted); line-height: 1.6; }
        .loading-text, .no-schedule { font-size: 13px; color: var(--color-text-muted); text-align: center; margin-top: 8px; }

        /* Step 2 */
        .step2-grid { display: grid; grid-template-columns: 1fr 260px; gap: 20px; align-items: start; }
        .form-card { display: flex; flex-direction: column; gap: 16px; }
        .error-msg {
          background: #fdecea; border: 1px solid #f5c6cb;
          color: #c0392b; padding: 10px 14px; border-radius: 6px; font-size: 13px;
        }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .label { font-size: 13px; font-weight: 500; color: var(--color-text-muted); }
        .input {
          padding: 11px 14px; border: 1.5px solid var(--color-bg-card);
          border-radius: 8px; font-size: 14px; color: var(--color-text);
          outline: none; font-family: var(--font-body); background: white;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: var(--color-primary); }
        .textarea { resize: vertical; }
        select.input { cursor: pointer; }
        .form-actions { display: flex; gap: 12px; margin-top: 4px; }
        .btn-back {
          padding: 12px 20px; border: 1.5px solid var(--color-bg-card);
          border-radius: 8px; background: none; font-size: 14px;
          color: var(--color-text-muted); cursor: pointer; font-family: var(--font-body);
          transition: all 0.2s;
        }
        .btn-back:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .btn-submit {
          flex: 1; padding: 12px;
          background: var(--color-primary-dark); color: white;
          border: none; border-radius: 8px; font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: var(--font-body); transition: opacity 0.2s;
        }
        .btn-submit:hover:not(:disabled) { opacity: 0.88; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .summary-card { display: flex; flex-direction: column; gap: 14px; }
        .summary-title { font-size: 15px; font-weight: 600; color: var(--color-text); margin-bottom: 4px; }
        .summary-item { display: flex; flex-direction: column; gap: 2px; }
        .summary-label { font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .summary-value { font-size: 14px; font-weight: 600; color: var(--color-text); word-wrap: break-word; }

        /* Step 3 */
        .success-wrap { display: flex; justify-content: center; }
        .success-card {
          max-width: 480px; width: 100%;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 12px;
        }
        .success-icon { color: var(--color-primary); margin-bottom: 4px; }
        .success-title { font-size: 22px; font-weight: 700; color: var(--color-text); }
        .success-sub { font-size: 14px; color: var(--color-text-muted); line-height: 1.6; }
        .success-detail {
          width: 100%; background: var(--color-bg);
          border-radius: 8px; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
          text-align: left; margin: 8px 0;
        }
        .btn-home {
          padding: 12px 32px; background: var(--color-primary-dark); color: white;
          border-radius: 8px; font-size: 14px; font-weight: 500;
          text-decoration: none; transition: opacity 0.2s; margin-top: 4px;
        }
        .btn-home:hover { opacity: 0.88; }

        @media (max-width: 768px) {
          .step1-grid, .step2-grid { grid-template-columns: 1fr; }
          .steps { gap: 4px; }
          .step-label { display: none; }
        }
      `}</style>
    </main>
  )
}