import '../styles/globals.css'

export const metadata = {
  title: 'Ten Thirty Solutions',
  description: 'Septic System and Environmental Compliance Solutions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
