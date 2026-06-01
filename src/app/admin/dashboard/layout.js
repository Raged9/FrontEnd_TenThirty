'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const MENU = [
  {
    label: 'Sales',
    href: '/admin/dashboard/sales',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Schedule',
    href: '/admin/dashboard/schedule',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Content',
    href: '/admin/dashboard/content',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'Upload',
    href: '/admin/dashboard/upload',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="16 16 12 12 8 16"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: '/admin/dashboard/email',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'Portofolio',
    href: '/admin/dashboard/portofolio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
      </svg>
    ),
  },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
    } else {
      setChecking(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (checking) return null

  return (
    <div className="admin-wrap">
      {/* Top Navbar */}
      <nav className="admin-nav">
        <div className="admin-nav-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="var(--color-primary-dark)" strokeWidth="1.5"/>
            <path d="M14 6C14 6 9 10 9 15C9 18.3 11.2 20.5 14 21C16.8 20.5 19 18.3 19 15C19 10 14 6 14 6Z"
                  fill="var(--color-primary-dark)" fillOpacity="0.7"/>
            <line x1="14" y1="21" x2="14" y2="25" stroke="var(--color-primary-dark)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Ten Thirty Solutions</span>
        </div>
        <div className="admin-nav-links">
          <Link href="/">Home</Link>
          <Link href="#">How it Work</Link>
          <Link href="#">Rental Details</Link>
          <Link href="#">Why Choose Us</Link>
          <Link href="#">Testimonial</Link>
          <span className="nav-divider"/>
          <Link href="#">Register</Link>
          <button className="btn-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </nav>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <p className="sidebar-label">Menu</p>
          <nav className="sidebar-nav">
            {MENU.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item${pathname === item.href ? ' active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>

      <style jsx>{`
        .admin-wrap { min-height: 100vh; display: flex; flex-direction: column; background: var(--color-bg); }

        /* Navbar */
        .admin-nav {
          height: 60px; background: var(--color-white);
          border-bottom: 1px solid var(--color-bg-card);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; position: sticky; top: 0; z-index: 50;
        }
        .admin-nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-weight: 600; font-size: 15px; color: var(--color-text);
        }
        .admin-nav-links {
          display: flex; align-items: center; gap: 20px;
        }
        .admin-nav-links a {
          font-size: 13px; color: var(--color-text-muted);
          transition: color var(--transition);
        }
        .admin-nav-links a:hover { color: var(--color-text); }
        .nav-divider { width: 1px; height: 20px; background: var(--color-bg-card); }
        .btn-logout {
          background: var(--color-primary-dark); color: white;
          padding: 7px 18px; border-radius: var(--radius-sm);
          font-size: 13px; font-weight: 500;
          border: none; cursor: pointer; font-family: var(--font-body);
        }

        /* Body */
        .admin-body { display: flex; flex: 1; }

        /* Sidebar */
        .admin-sidebar {
          width: 200px; flex-shrink: 0;
          background: var(--color-primary);
          border-right: none;
          padding: 28px 16px;
          min-height: calc(100vh - 60px);
        }
        .sidebar-label {
          font-size: 14px; font-weight: 600;
          color: rgba(255,255,255,0.5); margin-bottom: 16px;
          padding: 0 8px;
        }
        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
        .sidebar-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: var(--radius-sm);
          font-size: 14px; color: rgba(255,255,255,0.6);
          transition: all var(--transition);
        }
        .sidebar-item:hover {
          background: rgba(255,255,255,0.1); color: white;
        }
        .sidebar-item.active {
          background: rgba(255,255,255,0.15); color: white;
          font-weight: 500;
        }
        .sidebar-icon { display: flex; align-items: center; }

        /* Main */
        .admin-main { flex: 1; padding: 32px; overflow: auto; }
      `}</style>
    </div>
  )
}