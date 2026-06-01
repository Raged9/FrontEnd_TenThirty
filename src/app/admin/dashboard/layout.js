'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const MENU = [
  { label: 'Schedules', href: '/admin/dashboard/schedule', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
  { label: 'Site Content', href: '/admin/dashboard/content', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" /> },
  { label: 'Upload', href: '/admin/dashboard/upload', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /> },
  { label: 'Email', href: '/admin/dashboard/email', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
  { label: 'Portofolio', href: '/admin/dashboard/portofolio', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen admin-bg-gradient flex font-sans">
      {/* Sidebar - Liquid Glass */}
      <aside className={`w-72 glass-sidebar fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center shadow-lg shadow-forest/30">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-xl font-bold text-forest tracking-tight">Ten Thirty</h1>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sage ml-11">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {MENU.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.label} href={item.href}>
                <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer ${
                  isActive 
                    ? 'bg-forest text-white shadow-md shadow-forest/20' 
                    : 'text-slate-600 hover:bg-white/50 hover:text-forest'
                }`}>
                  <svg className={`w-5 h-5 ${isActive ? 'text-mint' : 'text-slate-400 group-hover:text-forest transition-colors'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon}
                  </svg>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 lg:ml-72 min-w-0 flex flex-col">
        {/* Header Transparan */}
        <header className="glass-header h-20 px-8 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 rounded-xl bg-white/50 text-forest"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Admin Utama</p>
              <p className="text-xs font-medium text-slate-500">Superadmin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-forest to-emerald p-0.5">
              <div className="w-full h-full rounded-full bg-white border-2 border-white overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=Admin&background=fff&color=1a472a`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Konten Halaman Injeksi */}
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
