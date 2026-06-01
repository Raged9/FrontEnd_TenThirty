'use client'
import React, { useState, useEffect } from 'react'

export default function SalesPage() {
  // 1. State for your real backend data
  const [salesData, setSalesData] = useState({
    totalClients: 0,
    monthlySchedules: 0,
    newProspects: 0,
    monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 12 months array
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // 2. Fetch data from your Express backend
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        
        // Update this URL if your backend runs on a different port
        const response = await fetch('http://localhost:5000/api/sales', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setSalesData({
            totalClients: data.totalClients || 0,
            monthlySchedules: data.monthlySchedules || 0,
            newProspects: data.newProspects || 0,
            // Assuming the backend returns an array of 12 numbers for the chart
            monthlyData: data.monthlyData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

  // 3. Dynamic Chart Logic - Calculates X/Y coordinates for the SVG path
  const maxDataValue = Math.max(...salesData.monthlyData, 5) // Base scale to prevent flatlining at 0
  
  const generateTrendLine = () => {
    return salesData.monthlyData.map((val, index) => {
      const x = (index / 11) * 100 // 11 segments across the X axis
      const y = 100 - ((val / maxDataValue) * 100) // Invert Y axis for SVG drawing
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  if (loading) {
    return <div className="sales-container"><p>Loading dashboard...</p></div>
  }

  return (
    <div className="sales-container">
      {/* Header & Spotlight Search */}
      <header className="sales-header">
        <div>
          <h1 className="sales-title">Sales & Client Trend Dashboard</h1>
          <p className="sales-subtitle">Pantau fluktuasi pengajuan jadwal kemitraan dan cari berkas data klien secara instan.</p>
        </div>
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
      </header>

      {/* Symmetrical Top Metrics with Real Data */}
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
           {/* Dynamic Y Axis based on max value */}
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
             
             {/* REAL DATA TREND LINE */}
             <svg className="trend-line" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path 
                 d={generateTrendLine()} 
                 fill="none" 
                 stroke="var(--apple-green-emerald)" 
                 strokeWidth="3" 
                 strokeLinecap="round" 
                 strokeLinejoin="round" 
               />
             </svg>

             {/* Dynamic X Axis Nodes */}
             <div className="x-axis">
               {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((month, index) => {
                 // Calculate the dot's height relative to the line
                 const yPos = (salesData.monthlyData[index] / maxDataValue) * 100;
                 return (
                   <div key={month} className="data-point">
                     <div 
                       className="node" 
                       style={{ 
                         transform: `translateY(-${yPos}px)`, // Adjusts dot to match the line height
                         marginBottom: '-10px'
                       }}
                     ></div>
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