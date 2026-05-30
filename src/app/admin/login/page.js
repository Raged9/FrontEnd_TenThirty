'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Email dan password wajib diisi'); return }
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Login gagal'); return }
      localStorage.setItem('admin_token', data.token)
      router.push('/admin/dashboard')
    } catch {
      setError('Server tidak bisa dihubungi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="login-nav">
        <div className="nav-logo">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#2d3d2d" strokeWidth="1.5"/>
            <path d="M14 6C14 6 9 10 9 15C9 18.3 11.2 20.5 14 21C16.8 20.5 19 18.3 19 15C19 10 14 6 14 6Z"
                  fill="#2d3d2d" fillOpacity="0.7"/>
            <line x1="14" y1="21" x2="14" y2="25" stroke="#2d3d2d" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Ten Thirty Solutions</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#">How it Work</a>
          <a href="#">Rental Details</a>
          <a href="#">Choose</a>
          <a href="#">Testimonial</a>
          <span className="nav-divider"/>
          <a href="#" className="nav-register">Register</a>
          <button className="nav-login-btn">Log In</button>
        </div>
      </nav>

      {/* Card center */}
      <div className="center">
        <div className="card">
          <div className="logo">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
              <path d="M26 10C26 10 18 17 18 24C18 29.5 21.5 33 26 34C30.5 33 34 29.5 34 24C34 17 26 10 26 10Z"
                    fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="26" y1="34" x2="26" y2="42" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="title">Masuk ke Akun Anda</h1>

          {error && <div className="error-msg">{error}</div>}

          <div className="field">
            <label className="label">Surel / Nama Pengguna</label>
            <input
              className="input"
              type="email"
              placeholder="contoh@surel.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="field">
            <label className="label">Kata Sandi</label>
            <div className="pass-wrap">
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="placeholderpassword"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button className="eye" onClick={() => setShowPass(p => !p)} type="button">
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button className="btn-masuk" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="forgot">Lupa Kata Sandi?</p>
          <p className="register">Belum punya akun? <a href="#">Daftar sekarang</a></p>
        </div>
      </div>

      <style jsx>{`
        .page { min-height: 100vh; background: #f0f0ec; display: flex; flex-direction: column; }

        .login-nav {
          background: white; border-bottom: 1px solid #e8e6e0;
          height: 64px; padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; color: #1a2a1a; }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-links a { font-size: 13px; color: #6b7a6b; text-decoration: none; }
        .nav-links a:hover { color: #1a2a1a; }
        .nav-divider { width: 1px; height: 20px; background: #e8e6e0; }
        .nav-login-btn {
          background: #2d3d2d; color: white; padding: 8px 20px;
          border-radius: 6px; font-size: 13px; font-weight: 500;
          border: none; cursor: pointer; font-family: inherit;
        }

        .center { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }

        .card {
          background: #7a8f7a;
          border-radius: 0px;
          padding: 40px 36px 32px;
          width: 100%; max-width: 360px;
          display: flex; flex-direction: column; align-items: center;
          box-shadow: 10px 10px 0px rgba(0,0,0,0.3);
        }

        .logo { margin-bottom: 16px; }
        .title { font-size: 18px; font-weight: 400; color: #1a2a1a; text-align: center; font-family: inherit; margin-bottom: 24px; }

        .error-msg {
          width: 100%; background: rgba(0,0,0,0.15); color: white;
          padding: 10px 14px; border-radius: 6px; font-size: 13px;
          text-align: center; margin-bottom: 12px;
        }

        .field { width: 100%; display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .label { font-size: 13px; color: #1a2a1a; }

        .input {
          width: 100%; padding: 11px 14px;
          background: white;
          border: 1.5px solid white;
          border-radius: 0px;
          font-size: 14px; color: #333;
          outline: none; font-family: inherit;
          box-shadow: 3px 3px 0px rgba(0,0,0,0.15);
          transition: border-color 0.2s;
        }
        .input:focus { border-color: #2d3d2d; }

        .pass-wrap { position: relative; }
        .pass-wrap .input { padding-right: 44px; }
        .eye {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #888; display: flex; align-items: center; padding: 0;
        }

        .btn-masuk {
          width: 100%; margin-top: 6px; padding: 13px;
          background: #2d3d2d; color: white;
          border: none; border-radius: 0px;
          font-size: 15px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          box-shadow: 3px 3px 0px rgba(0,0,0,0.2);
          transition: opacity 0.2s;
        }
        .btn-masuk:hover:not(:disabled) { opacity: 0.88; }
        .btn-masuk:disabled { opacity: 0.6; cursor: not-allowed; }

        .forgot, .register { font-size: 13px; color: rgba(26,42,26,0.75); text-align: center; margin-top: 12px; }
        .register a { color: white; font-weight: 500; }
      `}</style>
    </div>
  )
}
