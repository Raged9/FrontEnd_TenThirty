import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta'
})

export const metadata = {
  title: 'Ten Thirty Solution',
  description: 'Environmental Compliance Solutions',
}

export default function RootLayout({ children }) {
  return (
    // Terapkan font ke seluruh aplikasi
    <html lang="id" className={`${jakarta.variable} font-sans`}>
      <body className="text-slate-800 antialiased">
        {children}
      </body>
    </html>
  )
}