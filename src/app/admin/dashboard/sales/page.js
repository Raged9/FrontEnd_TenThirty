'use client'
import React, { useState, useEffect } from 'react'

export default function SalesPage() {
  const [salesData, setSalesData] = useState({
    totalClients: 0,
    monthlySchedules: 0,
    newProspects: 0,
    monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)

  // 1. Fetch Main Dashboard Data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        // UPDATED: Now hitting /api/sales/stats
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const json = await response.json()
        
        if (response.ok && json.success) {
          setSalesData({
            totalClients: json.totalClients || 0,
            monthlySchedules: json.monthlySchedules || 0,
            newProspects: json.newProspects || 0,
            monthlyData: json.monthlyData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          })
        }
      } catch (error) {
        console.error("Error fetching sales data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSalesData()
  }, [])

  // 2. Search Live Clients (Debounced)
  useEffect(() => {
    // We use a timeout so it doesn't spam your database on every single letter typed
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true)
        try {
          const token = localStorage.getItem('admin_token')
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/clients?search=${searchQuery}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const json = await res.json()
          if (json.success) setSearchResults(json.data)
        } catch (err) {
          console.error("Error searching:", err)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 400) // Waits 400ms after you stop typing to fetch

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Chart Logic
  const maxDataValue = Math.max(...salesData.monthlyData, 5)
  const generateTrendLine = () => {
    return salesData.monthlyData.map((val, index) => {
      const x = (index / 11) * 100
      const y = 100 - ((val / maxDataValue) * 100)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  if (loading) return <div className="sales-container"><p>Loading dashboard...</p></div>

  return (
    <div className="sales-container">
      {/* Header & Spotlight Search */}
      <header className="sales-header">
        <div>
          <h1 className="sales-title">Sales & Client Trend Dashboard</h1>
          <p className="sales-subtitle">Pantau fluktuasi pengajuan jadwal kemitraan dan cari berkas data klien secara instan.</p>
        </div>
        
        {/* NEW: Search Wrapper to hold the dropdown */}
        <div style={{ position: 'relative' }}>
          <div className="search-bar-glass">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Ketik nama klien, email, atau..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* NEW: Live Search Results Dropdown */}
          {searchQuery.length > 0 && (
            <div className="glass-panel" style={{ 
              position: 'absolute', top: '100%', left: 0, width: '100%', 
              marginTop: '8px', zIndex: 50, padding: '16px', borderRadius: '16px',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              {isSearching ? (
                <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>Mencari...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map(client => (
                  <div key={client._id} style={{ borderBottom: '1px solid rgba(26,71,42,0.1)', paddingBottom: '8px' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px 0', color: 'var(--apple-green-dark)' }}>{client.name}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.7, color: 'var(--apple-green-dark)' }}>
                      <span>{client.email}</span>
                      <span style={{ 
                        background: client.status === 'confirmed' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 165, 0, 0.2)', 
                        padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize' 
                      }}>
                        {client.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>Klien tidak ditemukan.</p>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Symmetrical Top Metrics */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <h3>Total Klien Aktif</h3>
          <div className="metric-value">{salesData.totalClients}</div>
          <div className="metric-trend positive">Terverifikasi</div>
        </div>
        <div className="metric-card glass-panel">
          <h3>Jadwal Bulan Ini</h3>
          <div className="metric-value">{salesData.monthlySchedules}</div>
          <div className="metric-trend positive">Aktif</div>
        </div>
        <div className="metric-card glass-panel">
          <h3>Prospek Baru</h3>
          <div className="metric-value">{salesData.newProspects}</div>
          <div className="metric-trend neutral">Menunggu Review</div>
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="chart-container glass-panel">
        <div className="chart-header">
          <h2>Fluktuasi Pengajuan Jadwal Bulanan</h2>
          <button className="filter-btn">Tahun 2026 ▾</button>
        </div>
        
        <div className="chart-visual">
           <div className="y-axis">
             <span>{Math.ceil(maxDataValue)}</span>
             <span>{Math.ceil(maxDataValue * 0.8)}</span>
             <span>{Math.ceil(maxDataValue * 0.6)}</span>
             <span>{Math.ceil(maxDataValue * 0.4)}</span>
             <span>{Math.ceil(maxDataValue * 0.2)}</span>
             <span>0</span>
           </div>
           
           <div className="chart-area">
             <div className="grid-line"></div>
             <div className="grid-line"></div>
             <div className="grid-line"></div>
             <div className="grid-line"></div>
             <div className="grid-line"></div>
             <div className="grid-line"></div>
             
             <svg className="trend-line" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d={generateTrendLine()} fill="none" stroke="var(--apple-green-emerald)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
             </svg>

             <div className="x-axis">
               {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((month, index) => {
                 const yPos = (salesData.monthlyData[index] / maxDataValue) * 100;
                 return (
                   <div key={month} className="data-point">
                     <div className="node" style={{ transform: `translateY(-${yPos}px)`, marginBottom: '-10px' }}></div>
                     <span>{month}</span>
                   </div>
                 )
               })}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}