'use client'
import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Navbar from '@/components/Navbar'

export default function SchedulePage() {
  const [isMounted, setIsMounted] = useState(false)
  const [date, setDate] = useState(new Date())
  const [allSchedules, setAllSchedules] = useState([])
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', service: 'septic-design', notes: '', time: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setIsMounted(true)
    const fetchSchedules = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schedules') 
        const data = await res.json()
        setAllSchedules(data)
      } catch (err) {
        console.error("Gagal mengambil jadwal:", err)
      }
    }
    fetchSchedules()
  }, [])

  // Fungsi untuk memblokir tanggal masa lalu saja
  const tileDisabled = ({ date: calDate, view }) => {
    if (view === 'month') {
      return calDate < new Date().setHours(0,0,0,0)
    }
    return false
  }

  // Fungsi untuk menampilkan Badge di dalam kotak kalender
  const tileContent = ({ date: calDate, view }) => {
    if (view === 'month') {
      const daySchedules = allSchedules.filter(sch => 
        new Date(sch.date).toDateString() === calDate.toDateString()
      )
      
      if (daySchedules.length > 0) {
        return (
          <div className="flex flex-col gap-0.5 mt-1 items-center overflow-hidden">
            {daySchedules.map((sch, i) => (
              <span key={i} className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold px-1 rounded-sm w-full truncate text-center">
                {sch.startTime} Booked
              </span>
            ))}
          </div>
        )
      }
    }
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.time) return alert("Pilih jam terlebih dahulu!")

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('http://localhost:5000/api/schedules/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date: date.toISOString() })
      })
      
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: "Berhasil! Permintaan dikirim." })
        setFormData({ name: '', email: '', phone: '', service: 'septic-design', notes: '', time: '' })
        // Tambahkan langsung ke UI kalender agar langsung terlihat badge-nya
        setAllSchedules([...allSchedules, { date: date.toISOString(), startTime: data.data.time || formData.time }])
      } else {
        setMessage({ type: 'error', text: data.message || "Gagal mengirim permintaan." })
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Terjadi kesalahan koneksi." })
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) return <div className="min-h-screen bg-[#FAFAF7] pt-32 pb-20 flex justify-center"><p className="animate-pulse text-[#6B7A6B]">Memuat kalender...</p></div>

  return (
    <main className="min-h-screen bg-[#FAFAF7] pt-32 pb-20">
     <Navbar/>
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        
        <div>
          <h1 className="text-3xl font-bold text-[#2D3D2D] font-display mb-2">Book an Appointment</h1>
          <p className="text-[#6B7A6B] mb-8">Pilih tanggal dari kalender, lalu tentukan jam yang Anda inginkan.</p>
          
          {/* Custom CSS agar badge muat di kotak kalender */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <style jsx global>{`
              .react-calendar__tile { height: 75px; display: flex; flex-direction: column; justify-content: flex-start; padding: 0.5em; }
            `}</style>
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileDisabled={tileDisabled}
              tileContent={tileContent}
              className="w-full border-none rounded-lg"
            />
          </div>
        </div>

        {/* Kolom Kanan: Form Data Diri */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold text-[#2D3D2D] font-display mb-6">Detail Kontak & Waktu</h2>
          
          {message && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Terpilih</label>
              <div className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed">
                {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Jam *</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">No. HP *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Layanan *</label>
              <select name="service" value={formData.service} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50">
                <option value="septic-design">Septic Design</option>
                <option value="inspection">Inspection</option>
                <option value="environmental-consulting">Environmental Consulting</option>
              </select>
            </div>

            {/* Tombol dipastikan berada di dalam form dan terlihat */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-2 py-3.5 rounded-full font-bold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8FA38F] hover:bg-[#7A8B7A] shadow-md hover:shadow-lg'}`}
            >
              {loading ? 'Mengirim...' : 'Request Appointment'}
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}