'use client'
import { useState, useEffect } from 'react'

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']
const PERIODS = ['AM', 'PM']

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

// Convert 12h format to 24h string "HH:MM"
function to24h(h, m, period) {
  let hour = parseInt(h)
  if (period === 'AM' && hour === 12) hour = 0
  if (period === 'PM' && hour !== 12) hour += 12
  return `${String(hour).padStart(2, '0')}:${m}`
}

// Convert 24h "HH:MM" to 12h object
function to12h(timeStr) {
  const [hStr, mStr] = timeStr.split(':')
  let hour = parseInt(hStr)
  const period = hour >= 12 ? 'PM' : 'AM'
  if (hour === 0) hour = 12
  else if (hour > 12) hour -= 12
  return { h: String(hour).padStart(2, '0'), m: mStr, period }
}

function DrumScroller({ values, selected, onSelect }) {
  const idx = values.indexOf(selected)
  const prev = values[(idx - 1 + values.length) % values.length]
  const next = values[(idx + 1) % values.length]

  return (
    <div className="drum">
      <button className="drum-item dim" onClick={() => onSelect(prev)}>{prev}</button>
      <div className="drum-line" />
      <button className="drum-item active">{selected}</button>
      <div className="drum-line" />
      <button className="drum-item dim" onClick={() => onSelect(next)}>{next}</button>
      <style jsx>{`
        .drum { display: flex; flex-direction: column; align-items: center; min-width: 52px; }
        .drum-item {
          width: 100%; height: 44px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.85);
          background: none; border: none; cursor: pointer; font-family: var(--font-body);
        }
        .drum-item.dim { font-size: 17px; color: rgba(255,255,255,0.28); font-weight: 400; }
        .drum-item.active { font-size: 24px; font-weight: 700; color: white; cursor: default; }
        .drum-item.dim:hover { color: rgba(255,255,255,0.55); }
        .drum-line { width: 100%; height: 1px; background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  )
}

export default function SchedulePage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [timeMode, setTimeMode] = useState('start')
  const [startTime, setStartTime] = useState({ h: '09', m: '00', period: 'AM' })
  const [endTime, setEndTime] = useState({ h: '05', m: '00', period: 'PM' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  useEffect(() => { fetchSchedules() }, [currentMonth, currentYear])

  const fetchSchedules = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedules/all?month=${currentMonth + 1}&year=${currentYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) setSchedules(await res.json())
    } catch {}
  }

  const getScheduleForDate = (dateNum) => {
    const d = new Date(currentYear, currentMonth, dateNum)
    return schedules.find(s => {
      const sd = new Date(s.date)
      return sd.getFullYear() === d.getFullYear() &&
             sd.getMonth() === d.getMonth() &&
             sd.getDate() === d.getDate()
    })
  }

  const handleDateClick = (dateNum) => {
    setSelectedDate(dateNum)
    const existing = getScheduleForDate(dateNum)
    if (existing) {
      setStartTime(to12h(existing.startTime))
      setEndTime(to12h(existing.endTime))
    } else {
      setStartTime({ h: '09', m: '00', period: 'AM' })
      setEndTime({ h: '05', m: '00', period: 'PM' })
    }
    setShowTimePicker(true)
  }

  const handleSave = async () => {
    if (!selectedDate) return
    setSaving(true)
    try {
      const date = new Date(currentYear, currentMonth, selectedDate)
      const existing = getScheduleForDate(selectedDate)

      // ✅ Convert to 24h before saving
      const startTime24 = to24h(startTime.h, startTime.m, startTime.period)
      const endTime24 = to24h(endTime.h, endTime.m, endTime.period)

      const body = {
        date: date.toISOString(),
        startTime: startTime24,
        endTime: endTime24,
        isAvailable: true,
      }

      const url = existing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/schedules/${existing._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/schedules`

      const res = await fetch(url, {
        method: existing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        showToast('Jadwal berhasil disimpan!')
        setShowTimePicker(false)
        fetchSchedules()
      } else {
        const d = await res.json()
        showToast(d.message || 'Gagal menyimpan')
      }
    } catch { showToast('Terjadi error') }
    setSaving(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
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
  const selectedSchedule = selectedDate ? getScheduleForDate(selectedDate) : null
  const curTime = timeMode === 'start' ? startTime : endTime
  const setCurTime = (v) => timeMode === 'start' ? setStartTime(v) : setEndTime(v)

  return (
    <div className="schedule-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="top-row">
        {/* ── Calendar card ── */}
        <div className="card calendar-card">
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
              const isToday = isValid && dateNum === today.getDate() &&
                              currentMonth === today.getMonth() && currentYear === today.getFullYear()
              const isSelected = isValid && dateNum === selectedDate
              const hasSchedule = isValid && !!getScheduleForDate(dateNum)
              const isPast = isValid && new Date(currentYear, currentMonth, dateNum) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

              return (
                <button
                  key={i}
                  className={['cal-cell',
                    !isValid ? 'empty' : '',
                    isPast && !isSelected ? 'past' : '',
                    isToday && !isSelected ? 'today' : '',
                    isSelected ? 'selected' : '',
                    hasSchedule && !isSelected ? 'has-schedule' : '',
                  ].join(' ')}
                  onClick={() => isValid && handleDateClick(dateNum)}
                  disabled={!isValid}
                >
                  {isValid ? dateNum : ''}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Time Picker card ── */}
        {showTimePicker && (
          <div className="card time-card">
            <div className="tp-header">
              <span className="tp-title">
                Set time {timeMode === 'start' ? 'Start' : 'End'} Availability
              </span>
              <button className="tp-switch" onClick={() => setTimeMode(m => m === 'start' ? 'end' : 'start')}>
                Switch
              </button>
            </div>

            <div className="drums-wrap">
              <DrumScroller values={HOURS} selected={curTime.h} onSelect={h => setCurTime({ ...curTime, h })} />
              <span className="colon">:</span>
              <DrumScroller values={MINUTES} selected={curTime.m} onSelect={m => setCurTime({ ...curTime, m })} />
              <span className="colon">:</span>
              <DrumScroller values={['00']} selected="00" onSelect={() => {}} />
              <DrumScroller values={PERIODS} selected={curTime.period} onSelect={p => setCurTime({ ...curTime, period: p })} />
            </div>

            <div className="tp-actions">
              <button className="btn-cancel" onClick={() => setShowTimePicker(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Info card (separate, below) ── */}
      {selectedDate && (
        <div className="card info-card">
          <div className="info-row">
            <span className="info-label">Availability :</span>
            <strong className="info-value">{selectedDate} {MONTHS[currentMonth]} {currentYear}</strong>
          </div>
          {selectedSchedule && (
            <div className="info-row">
              <span className="info-label">Time :</span>
              <strong className="info-value">{selectedSchedule.startTime} - {selectedSchedule.endTime}</strong>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .schedule-page { display: flex; flex-direction: column; gap: 20px; position: relative; }

        .toast {
          position: fixed; top: 80px; right: 24px;
          background: var(--color-primary-dark); color: white;
          padding: 12px 20px; border-radius: var(--radius-sm);
          font-size: 14px; z-index: 999;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        .top-row { display: flex; gap: 24px; align-items: stretch; }

        /* ── Shared card ── */
        .card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
        }

        /* ── Calendar ── */
        .calendar-card { width: 340px; flex-shrink: 0; padding: 24px 20px; }

        .cal-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
        }
        .cal-nav {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid #e8e6e0; background: white;
          font-size: 18px; color: var(--color-text-muted);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .cal-nav:hover { background: var(--color-bg); }
        .cal-title {
          font-size: 15px; font-weight: 700; color: var(--color-text);
          display: flex; align-items: center; gap: 2px;
        }
        .cal-arrow { font-size: 9px; color: var(--color-text-muted); margin-left: 1px; }

        .cal-days-header {
          display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 6px;
        }
        .day-label {
          text-align: center; font-size: 12px;
          color: var(--color-text-muted); font-weight: 500; padding: 3px 0;
        }

        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
        .cal-cell {
          aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
          font-size: 13px; border-radius: 8px; border: none;
          cursor: pointer; background: none; color: var(--color-text);
          transition: all 0.15s; font-family: var(--font-body);
        }
        .cal-cell:hover:not(.empty):not(:disabled):not(.past) { background: var(--color-bg); }
        .cal-cell.empty { visibility: hidden; }
        .cal-cell.past { color: #ccc; cursor: default; }
        .cal-cell.today {
          background: var(--color-primary-dark); color: white;
          font-weight: 700; border-radius: 50%;
        }
        .cal-cell.selected {
          background: transparent;
          border: 2px solid var(--color-primary-dark);
          color: var(--color-primary-dark); font-weight: 700;
          border-radius: 8px;
        }
        .cal-cell.has-schedule {
          background: var(--color-primary); color: white; border-radius: 8px;
        }

        /* ── Info card ── */
        .info-card {
          width: 340px;
          padding: 20px 24px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .info-row { display: flex; flex-direction: column; gap: 3px; }
        .info-label { font-size: 13px; color: var(--color-text-muted); }
        .info-value { font-size: 15px; font-weight: 700; color: var(--color-text); }

        /* ── Time Picker ── */
        .time-card {
          width: 340px; flex-shrink: 0;
          background: var(--color-primary-dark);
          padding: 24px 20px;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .tp-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
        }
        .tp-title { font-size: 15px; font-weight: 500; color: white; }
        .tp-switch {
          background: transparent; border: 1.5px solid rgba(255,255,255,0.35);
          color: white; padding: 5px 16px; border-radius: 20px;
          font-size: 13px; cursor: pointer; font-family: var(--font-body);
          transition: border-color 0.15s;
        }
        .tp-switch:hover { border-color: rgba(255,255,255,0.8); }

        .drums-wrap {
          display: flex; align-items: center; justify-content: center; gap: 0;
        }
        .colon {
          color: rgba(255,255,255,0.35); font-size: 22px; font-weight: 300; padding: 0 2px;
        }

        .tp-actions {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        .btn-cancel {
          padding: 12px; border-radius: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: white; font-size: 14px; cursor: pointer; font-family: var(--font-body);
          transition: background 0.15s;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.18); }
        .btn-save {
          padding: 12px; border-radius: 10px;
          background: var(--color-primary);
          border: none; color: white; font-size: 14px;
          cursor: pointer; font-family: var(--font-body); transition: opacity 0.15s;
        }
        .btn-save:hover:not(:disabled) { opacity: 0.85; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
