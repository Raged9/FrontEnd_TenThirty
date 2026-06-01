const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function fetchContent(section) {
  try {
    const res = await fetch(`${API_URL}/api/content/${section}`, {
      cache: 'no-store', // <-- Menginstruksikan Next.js agar selalu mengambil data terbaru (tanpa cache)
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchTestimonials() {
  try {
    const res = await fetch(`${API_URL}/api/testimonials`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Admin API calls (require token)
export async function adminFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
  }
  return res
}
