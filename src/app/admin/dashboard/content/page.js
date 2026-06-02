'use client'
import { useState, useEffect } from 'react'

const SECTIONS = [
  { key: 'hero', label: 'Hero Section' },
  { key: 'about', label: 'More Than Just a Business' },
  { key: 'location', label: 'Our Location' },
  { key: 'tentang_kami', label: 'Tentang Kami' },
]

export default function ContentPage() {
  const [activeSection, setActiveSection] = useState('hero')
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  useEffect(() => {
    fetchAllContent()
  }, [])

  const fetchAllContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content`)
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      }
    } catch {}
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${activeSection}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: content[activeSection] }),
      })
      if (res.ok) {
        showToast('Konten berhasil disimpan!', 'success')
      } else {
        showToast('Gagal menyimpan', 'error')
      }
    } catch {
      showToast('Server error', 'error')
    }
    setSaving(false)
  }

  const showToast = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: '' }), 3000)
  }

  const updateField = (field, value) => {
    setContent(prev => ({
      ...prev,
      [activeSection]: { ...prev[activeSection], [field]: value }
    }))
  }

  const updatePoint = (index, key, value) => {
    const points = [...(content[activeSection]?.points || [])]
    points[index] = { ...points[index], [key]: value }
    updateField('points', points)
  }

  const updateTeamMember = (index, key, value) => {
    const team = [...(content.tentang_kami?.team || [])]
    team[index] = { ...team[index], [key]: value }
    setContent(prev => ({
      ...prev,
      tentang_kami: { ...prev.tentang_kami, team }
    }))
  }

  const addTeamMember = () => {
    const team = [...(content.tentang_kami?.team || [])]
    team.push({ id: Date.now(), name: '', story: '', image: null, position: 'left' })
    setContent(prev => ({ ...prev, tentang_kami: { ...prev.tentang_kami, team } }))
  }

  const removeTeamMember = (index) => {
    const team = [...(content.tentang_kami?.team || [])]
    team.splice(index, 1)
    setContent(prev => ({ ...prev, tentang_kami: { ...prev.tentang_kami, team } }))
  }

  const cur = content[activeSection] || {}

  return (
    <div className="content-page">
      {toast.msg && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="content-layout">
        {/* Section tabs */}
        <div className="section-tabs">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={`tab-btn ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => setActiveSection(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="editor-panel">
          {loading ? (
            <div className="loading-state">Memuat konten...</div>
          ) : (
            <>
              {/* HERO */}
              {activeSection === 'hero' && (
                <div className="fields">
                  <h2 className="editor-title">Hero Section</h2>
                  <Field label="Headline" value={cur.headline || ''} onChange={v => updateField('headline', v)} multiline maxLength={80} />
                  <Field label="Subtext" value={cur.subtext || ''} onChange={v => updateField('subtext', v)} multiline maxLength={200} />
                  <div className="stats-grid">
                    <Field label="Stat 1 - Angka" value={cur.stat1_number || ''} onChange={v => updateField('stat1_number', v)} maxLength={10} />
                    <Field label="Stat 1 - Label" value={cur.stat1_label || ''} onChange={v => updateField('stat1_label', v)} maxLength={25} />
                    <Field label="Stat 2 - Angka" value={cur.stat2_number || ''} onChange={v => updateField('stat2_number', v)} maxLength={10} />
                    <Field label="Stat 2 - Label" value={cur.stat2_label || ''} onChange={v => updateField('stat2_label', v)} maxLength={25} />
                    <Field label="Stat 3 - Angka" value={cur.stat3_number || ''} onChange={v => updateField('stat3_number', v)} maxLength={10} />
                    <Field label="Stat 3 - Label" value={cur.stat3_label || ''} onChange={v => updateField('stat3_label', v)} maxLength={25} />
                  </div>
                  <ImageField label="Hero Image" value={cur.hero_image} onChange={v => updateField('hero_image', v)} token={token}/>
                </div>
              )}

              {/* ABOUT */}
              {activeSection === 'about' && (
                <div className="fields">
                  <h2 className="editor-title">More Than Just a Business</h2>
                  <Field label="Judul Utama" value={cur.title || ''} onChange={v => updateField('title', v)} maxLength={50} />
                  <Field label="Deskripsi" value={cur.description || ''} onChange={v => updateField('description', v)} multiline maxLength={350} />
                  <ImageField label="Gambar" value={cur.image} onChange={v => updateField('image', v)} token={token}/>
                  
                  <div className="points-section">
                    <p className="points-label">Poin-poin Dukungan</p>
                    {(cur.points || [{}, {}, {}]).map((pt, i) => (
                      <div key={i} className="point-item">
                        <Field label={`Judul Poin ${i + 1}`} value={pt.title || ''} onChange={v => updatePoint(i, 'title', v)} maxLength={40} />
                        <Field label={`Deskripsi Poin ${i + 1}`} value={pt.desc || ''} onChange={v => updatePoint(i, 'desc', v)} multiline rows={2} maxLength={120} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {activeSection === 'location' && (
                <div className="fields">
                  <h2 className="editor-title">Our Location</h2>
                  <Field label="Alamat Lengkap" value={cur.address || ''} onChange={v => updateField('address', v)} multiline maxLength={200} />
                  <ImageField label="Gambar Peta" value={cur.map_image} onChange={v => updateField('map_image', v)} token={token}/>
                </div>
              )}

              {/* TENTANG KAMI */}
              {activeSection === 'tentang_kami' && (
                <div className="fields">
                  <h2 className="editor-title">Tentang Kami — Tim</h2>
                  {(content.tentang_kami?.team || []).map((member, i) => (
                    <div key={member.id || i} className="team-editor-card">
                      <div className="team-editor-header">
                        <span className="team-editor-num">Anggota {i + 1}</span>
                        <button className="btn-remove" onClick={() => removeTeamMember(i)}>Hapus</button>
                      </div>
                      <Field label="Nama" value={member.name || ''} onChange={v => updateTeamMember(i, 'name', v)} maxLength={40} />
                      <Field label="Cerita / Bio" value={member.story || ''} onChange={v => updateTeamMember(i, 'story', v)} multiline rows={4} maxLength={300} />
                      <div className="position-field">
                        <p className="field-label">Posisi Gambar</p>
                        <div className="radio-group">
                          {['left', 'right'].map(pos => (
                            <label key={pos} className="radio-label">
                              <input type="radio" name={`pos-${i}`} value={pos}
                                checked={member.position === pos}
                                onChange={() => updateTeamMember(i, 'position', pos)}/>
                              Gambar {pos === 'left' ? 'Kiri' : 'Kanan'}
                            </label>
                          ))}
                        </div>
                      </div>
                      <ImageField label="Foto" value={member.image} onChange={v => updateTeamMember(i, 'image', v)} token={token}/>
                    </div>
                  ))}
                  <button className="btn-add-member" onClick={addTeamMember}>+ Tambah Anggota Tim</button>
                </div>
              )}

              <button className="btn-save-main" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .content-page { position: relative; }
        .toast {
          position: fixed; top: 80px; right: 24px;
          padding: 12px 20px; border-radius: var(--radius-sm);
          font-size: 14px; z-index: 999; color: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .toast-success { background: var(--color-primary-dark); }
        .toast-error { background: #c0392b; }

        .content-layout { display: flex; gap: 24px; align-items: flex-start; }

        .section-tabs {
          display: flex; flex-direction: column; gap: 4px;
          width: 200px; flex-shrink: 0;
        }
        .tab-btn {
          padding: 10px 14px; border-radius: var(--radius-sm);
          border: none; background: none; text-align: left;
          font-size: 14px; color: var(--color-text-muted);
          cursor: pointer; font-family: var(--font-body);
          transition: all var(--transition);
        }
        .tab-btn:hover { background: var(--color-bg-card); color: var(--color-text); }
        .tab-btn.active {
          background: var(--color-primary); color: white; font-weight: 500;
        }

        .editor-panel {
          flex: 1; background: white;
          border-radius: var(--radius-md);
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .loading-state { color: var(--color-text-muted); font-size: 14px; padding: 20px 0; }
        .editor-title {
          font-size: 20px; font-weight: 600; color: var(--color-text);
          margin-bottom: 24px; padding-bottom: 16px;
          border-bottom: 1px solid var(--color-bg-card);
        }
        .fields { display: flex; flex-direction: column; gap: 16px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .points-section { display: flex; flex-direction: column; gap: 12px; }
        .points-label { font-size: 13px; font-weight: 500; color: var(--color-text); }
        .point-item {
          background: var(--color-bg); padding: 16px;
          border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 10px;
        }

        .team-editor-card {
          background: var(--color-bg); padding: 20px;
          border-radius: var(--radius-md);
          display: flex; flex-direction: column; gap: 12px;
          border: 1px solid var(--color-bg-card);
        }
        .team-editor-header {
          display: flex; justify-content: space-between; align-items: center;
        }
        .team-editor-num { font-size: 14px; font-weight: 600; color: var(--color-text); }
        .btn-remove {
          font-size: 12px; color: #c0392b; background: none; border: none;
          cursor: pointer; font-family: var(--font-body);
          padding: 4px 8px; border-radius: 4px;
          transition: background var(--transition);
        }
        .btn-remove:hover { background: #fdecea; }
        .position-field { display: flex; flex-direction: column; gap: 8px; }
        .radio-group { display: flex; gap: 20px; }
        .radio-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--color-text-muted); cursor: pointer;
        }

        .btn-add-member {
          padding: 12px; border: 2px dashed var(--color-accent);
          border-radius: var(--radius-sm); background: none;
          color: var(--color-primary); font-size: 14px;
          cursor: pointer; font-family: var(--font-body);
          transition: all var(--transition); text-align: center;
        }
        .btn-add-member:hover { background: var(--color-bg); }

        .btn-save-main {
          margin-top: 24px;
          width: 100%; padding: 13px;
          background: var(--color-primary-dark); color: white;
          border: none; border-radius: var(--radius-sm);
          font-size: 15px; font-weight: 500;
          cursor: pointer; font-family: var(--font-body);
          transition: opacity var(--transition);
        }
        .btn-save-main:hover:not(:disabled) { opacity: 0.9; }
        .btn-save-main:disabled { opacity: 0.6; cursor: not-allowed; }

        .field-label { font-size: 13px; color: var(--color-text-muted); }
      `}</style>
    </div>
  )
}

// UPGRADED: Reusable field component now enforces max length and shows a counter!
function Field({ label, value, onChange, multiline, rows = 3, maxLength }) {
  const currentLength = value?.length || 0;
  
  return (
    <div className="field">
      <div className="label-header">
        <label className="label">{label}</label>
        {maxLength && (
          <span className="char-count" style={{ color: currentLength >= maxLength ? '#c0392b' : 'var(--color-text-muted)' }}>
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea 
          className="input" 
          rows={rows} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          maxLength={maxLength}
        />
      ) : (
        <input 
          className="input" 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          maxLength={maxLength}
        />
      )}
      <style jsx>{`
        .field { display: flex; flex-direction: column; gap: 6px; }
        .label-header { display: flex; justify-content: space-between; align-items: center; }
        .label { font-size: 13px; color: var(--color-text-muted); font-weight: 500; }
        .char-count { font-size: 11px; opacity: 0.8; font-family: monospace; }
        .input {
          padding: 10px 12px; border: 1px solid var(--color-bg-card);
          border-radius: var(--radius-sm); font-size: 14px;
          color: var(--color-text); font-family: var(--font-body);
          background: white; outline: none; resize: vertical;
          transition: border-color var(--transition);
        }
        .input:focus { border-color: var(--color-primary); }
      `}</style>
    </div>
  )
}

function ImageField({ label, value, onChange, token }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        onChange(data.url)
      }
    } catch {}
    setUploading(false)
  }

  return (
    <div className="img-field">
      <label className="label">{label}</label>
      {value && <img src={value} alt="preview" className="preview"/>}
      <label className="upload-btn">
        {uploading ? 'Mengupload...' : value ? 'Ganti Gambar' : 'Upload Gambar'}
        <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }}/>
      </label>
      <style jsx>{`
        .img-field { display: flex; flex-direction: column; gap: 8px; }
        .label { font-size: 13px; color: var(--color-text-muted); font-weight: 500; }
        .preview {
          width: 100%; max-height: 200px; object-fit: cover;
          border-radius: var(--radius-sm); border: 1px solid var(--color-bg-card);
        }
        .upload-btn {
          display: inline-block; padding: 9px 16px;
          border: 1px solid var(--color-primary);
          border-radius: var(--radius-sm); color: var(--color-primary);
          font-size: 13px; cursor: pointer;
          transition: all var(--transition); text-align: center;
        }
        .upload-btn:hover { background: var(--color-primary); color: white; }
      `}</style>
    </div>
  )
}