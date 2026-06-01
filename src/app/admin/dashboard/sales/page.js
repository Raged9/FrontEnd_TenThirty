// File: FrontEnd_TenThirty/src/app/admin/dashboard/sales/page.js
'current'
'use client'

import { useState, useEffect } from 'react'
import { adminFetch } from '@/lib/api'

export default function SalesDashboard() {
  const [chartData, setChartData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Mengambil data awal statistik grafik bulanan
  const fetchDashboardData = async () => {
    try {
      const res = await adminFetch('/api/sales/stats')
      if (res.ok) {
        const result = await res.json()
        setChartData(result.data)
      }
    } catch (err) {
      console.error('Gagal mengambil data statistik:', err)
    } finally {
      setLoading(false)
    }
  }

  // Menangani pencarian real-time saat admin mengetik kata kunci
  const handleSearchChange = async (e) => {
    const val = e.target.value
    setSearchQuery(val)

    if (val.trim().length > 1) {
      try {
        const res = await adminFetch(`/api/sales/clients?search=${val}`)
        if (res.ok) {
          const result = await res.json()
          setSearchResults(result.data)
          setShowDropdown(true)
        }
      } catch (err) {
        console.error('Pencarian error:', err)
      }
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }

  // Parameter kalkulasi dimensi untuk Pure SVG Line Chart
  const padding = 40
  const chartHeight = 260
  const chartWidth = 700
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value), 5) : 5

  // Membuat titik koordinat (X, Y) secara otomatis berdasarkan data bulanan
  const points = chartData.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (chartData.length - 1)
    const y = chartHeight - padding - (d.value * (chartHeight - padding * 2)) / maxValue
    return { x, y, ...d }
  })

  const pathD = points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '')

  return (
    <div className="p-6 max-w-5xl mx-auto bg-slate-50 min-h-screen text-slate-800">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Sales & Client Trend Dashboard</h1>
        <p className="text-sm text-slate-500">Pantau fluktuasi pengajuan jadwal kemitraan dan cari berkas data klien secara instan.</p>
      </div>

      {/* Bagian Atas: Komponen Pencarian Interaktif Dropdown */}
      <div className="relative mb-8 max-w-md bg-white p-4 rounded-xl shadow-xs border border-slate-200">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Pencarian Data Klien / Prospek</label>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            placeholder="Ketik nama klien, email, atau instansi..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setSearchResults.length > 0 && setShowDropdown(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowDropdown(false); setSelectedClient(null); }}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Hasil Pencarian Interaktif */}
        {showDropdown && (
          <div className="absolute left-4 right-4 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((client) => (
              <div
                key={client._id}
                className="p-3 text-sm hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedClient(client)
                  setShowDropdown(false)
                }}
              >
                <p className="font-semibold text-slate-900">{client.name}</p>
                <p className="text-xs text-slate-500">{client.email} • {client.service || 'Umum'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Bagian Kiri/Tengah: Visualisasi Grafik Tren Garis Besar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-xs border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Fluktuasi Pengajuan Jadwal Bulanan</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Memuat matriks data...</div>
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Belum ada data masuk di tahun ini.</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                {/* Garis Horizontal Grid Kelipatan */}
                {[0, 0.5, 1].map((ratio, i) => {
                  const y = padding + ratio * (chartHeight - padding * 2)
                  const labelVal = Math.round(maxValue - ratio * maxValue)
                  return (
                    <g key={i}>
                      <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                      <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">{labelVal}</text>
                    </g>
                  )
                })}

                {/* Plot Garis Utama Tren */}
                {pathD && (
                  <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Titik Point Interaktif */}
                {points.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" className="transition-all group-hover:r-7 group-hover:fill-blue-600" />
                    {/* Tooltip Angka ketika Kursor Menyentuh Point */}
                    <rect x={p.x - 18} y={p.y - 28} width="36" height="20" rx="4" className="fill-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <text x={p.x} y={p.y - 15} textAnchor="middle" className="text-[10px] fill-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">{p.value}</text>
                    {/* Label Teks Nama Bulan (Jan - Des) */}
                    <text x={p.x} y={chartHeight - padding + 20} textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">{p.month}</text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* Bagian Kanan: Panel Detail Klien dari Dropdown */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 min-h-[340px]">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Spesifikasi Profil Klien</h2>
          {selectedClient ? (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Lengkap</span>
                <p className="text-base font-semibold text-slate-900">{selectedClient.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kontak Email</span>
                <p className="text-sm text-slate-600 font-medium break-all">{selectedClient.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nomor Telepon</span>
                <p className="text-sm text-slate-600 font-medium">{selectedClient.phone || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Spesifikasi Layanan</span>
                <p className="text-sm bg-blue-50 text-blue-700 font-semibold px-2 py-1 rounded-md inline-block mt-1">
                  {selectedClient.service}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Pengajuan</span>
                <span className={`text-xs font-bold ml-2 px-2 py-0.5 rounded-full ${
                  selectedClient.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                  selectedClient.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedClient.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center text-slate-400 p-4 border border-dashed border-slate-200 rounded-lg">
              <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-xs">Silakan pilih klien pada kolom pencarian di atas untuk memuat spesifikasi profil.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}