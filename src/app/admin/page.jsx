// src/app/admin/page.jsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Calendar, UploadCloud } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const [pendingSchedules, setPendingSchedules] = useState(1)

  // State khusus untuk Fitur Upload Gambar Hero
  const [heroFile, setHeroFile] = useState(null)
  const [isUploadingHero, setIsUploadingHero] = useState(false)

  // 1. PROTEKSI HALAMAN: Cek token saat dashboard dibuka
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // 2. FUNGSI UPLOAD: Mengirim gambar ke Backend -> Cloudinary
  const handleUploadHero = async () => {
    if (!heroFile) return alert("Pilih file terlebih dahulu!")
    
    setIsUploadingHero(true)
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('image', heroFile) // 'image' harus sama dengan upload.single('image') di backend

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Jangan set Content-Type, browser otomatis akan mengaturnya sebagai multipart/form-data
        },
        body: formData
      })

      const data = await res.json()
      if (res.ok) {
        alert(`Berhasil! Gambar tersimpan di Cloudinary dengan URL:\n${data.url}`)
        setHeroFile(null) // Reset input file setelah sukses
      } else {
        alert(`Gagal mengunggah: ${data.message || 'Periksa server Anda'}`)
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi saat mengunggah file ke server.")
    } finally {
      setIsUploadingHero(false)
    }
  }

  // Jika belum terverifikasi login, tampilkan layar kosong sementara agar konten tidak bocor
  if (!isAuthenticated) return <div className="h-screen bg-[#F8F9F8]"></div>

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* ================= HEADER ATAS ================= */}
      <header className="h-[72px] border-b border-gray-200 bg-[#F8F9F8] flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8FA38F]/30 border-2 border-[#4A5E4A] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A5E4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22V8" />
              <path d="M12 16l-5-5" />
              <path d="M12 11l-5-5" />
              <path d="M12 16l5-5" />
              <path d="M12 11l5-5" />
            </svg>
          </div>
          <span className="font-bold text-[16px] text-gray-800">Ten Thirty Solutions</span>
        </div>
      </header>

      {/* ================= AREA UTAMA INDUK ================= */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR KIRI */}
        <aside className="w-64 bg-[#F4F5F4] border-r border-gray-200 flex flex-col pt-6 shrink-0">
          <div className="px-4 mb-4">
            <p className="text-sm font-bold text-gray-500">Menu</p>
          </div>
          
          <nav className="flex flex-col">
            <button 
              onClick={() => setActiveTab('sales')}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-colors ${activeTab === 'sales' ? 'bg-[#8FA38F] text-white' : 'text-gray-600 hover:bg-gray-200/50'}`}
            >
              <TrendingUp size={18} /> Sales
            </button>

            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center justify-between px-6 py-3.5 text-sm font-semibold transition-colors ${activeTab === 'schedule' ? 'bg-[#8FA38F] text-white' : 'text-gray-600 hover:bg-gray-200/50'}`}
            >
              <div className="flex items-center gap-3">
                <Calendar size={18} /> Schedule
              </div>
              {pendingSchedules > 0 && (
                <span className={`text-xs rounded-full px-2 py-0.5 ${activeTab === 'schedule' ? 'bg-white text-[#8FA38F]' : 'bg-[#8FA38F] text-white'}`}>
                  {pendingSchedules}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-colors ${activeTab === 'upload' ? 'bg-[#8FA38F] text-white' : 'text-gray-600 hover:bg-gray-200/50'}`}
            >
              <UploadCloud size={18} /> Upload
            </button>
          </nav>
        </aside>

        {/* KONTEN KANAN UTAMA */}
        <main className="flex-1 p-10 overflow-y-auto bg-white">
          
          {/* ----------------- TAB SALES ----------------- */}
          {activeTab === 'sales' && (
            <div className="max-w-5xl animate-in fade-in duration-300">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Laporan Sales & Donasi</h1>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 font-semibold mb-2">Total Pendapatan (Bulan Ini)</p>
                  <p className="text-3xl font-bold text-gray-800">$12,500</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <p className="text-sm text-green-700 font-semibold mb-2">Donasi Homelessness (5%)</p>
                  <p className="text-3xl font-bold text-green-700">$625</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 font-semibold mb-2">Total Layanan Selesai</p>
                  <p className="text-3xl font-bold text-blue-700">42</p>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- TAB SCHEDULE ----------------- */}
          {activeTab === 'schedule' && (
            <div className="max-w-5xl animate-in fade-in duration-300">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Jadwal</h1>
              
              {/* Bagian 1: Menunggu Persetujuan */}
              <h2 className="text-lg font-bold text-[#8FA38F] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                Menunggu Persetujuan
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-10">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Pelanggan</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Tanggal & Jam</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Layanan</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">Budi Santoso</p>
                        <p className="text-sm text-gray-500">budi@email.com</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">27 Mei 2026</p>
                        <p className="text-sm font-bold text-yellow-600">09:00 AM</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Inspection</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-4 py-2 bg-[#8FA38F] hover:bg-[#7A8B7A] text-white text-sm font-semibold rounded-lg transition-colors">Setujui</button>
                          <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors">Tolak</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bagian 2: Jadwal Disetujui */}
              <h2 className="text-lg font-bold text-[#8FA38F] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Jadwal Aktif (Disetujui)
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Pelanggan</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Tanggal & Jam</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">Layanan</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">Siti Aminah</p>
                        <p className="text-sm text-gray-500">siti@email.com</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">28 Mei 2026</p>
                        <p className="text-sm font-bold text-green-600">13:30 PM</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Septic Design</td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-semibold rounded-lg transition-colors">Batalkan</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----------------- TAB UPLOAD ----------------- */}
          {activeTab === 'upload' && (
            <div className="max-w-3xl animate-in fade-in duration-300 space-y-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Manajemen Konten</h1>
              
              {/* Seksi Upload Gambar Hero */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Hero Section (Max: 5MB - JPG/PNG/WEBP)</h2>
                <p className="text-xs text-gray-400 mb-4">Gambar ini akan diupload langsung ke Cloudinary dan digunakan sebagai latar belakang beranda utama.</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E8EDE8] file:text-[#4A5E4A] hover:file:bg-[#D1DDD1] cursor-pointer" 
                    onChange={(e) => {
                      const file = e.target.files[0]
                      // Proteksi ukuran file agar tidak melebihi limit backend
                      if (file && file.size > 5 * 1024 * 1024) {
                        alert("File terlalu besar! Maksimal ukuran file adalah 5MB."); 
                        e.target.value = '';
                        setHeroFile(null);
                      } else {
                        setHeroFile(file);
                      }
                    }}
                  />
                  <button 
                    onClick={handleUploadHero}
                    disabled={!heroFile || isUploadingHero}
                    className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-white transition-all ${!heroFile || isUploadingHero ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8FA38F] hover:bg-[#7A8B7A] shadow-md'}`}
                  >
                    {isUploadingHero ? 'Mengunggah...' : 'Upload Gambar'}
                  </button>
                </div>
              </div>

              {/* Seksi Formulir Tambah Anggota Tim About */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">About Us - Tambah Anggota Tim</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nama Lengkap" className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50" />
                  <input type="text" placeholder="Jabatan" className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50" />
                  <textarea placeholder="Narasi cerita/bio singkat..." className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm col-span-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#8FA38F]/50"></textarea>
                  <button className="col-span-2 bg-gray-800 hover:bg-black text-white py-3 rounded-lg font-semibold text-sm transition-colors">
                    Simpan Profil
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}