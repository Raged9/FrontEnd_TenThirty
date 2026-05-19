import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Appointment - Ten Thirty Solutions',
}

export default function AppointmentPage() {
  return (
    <main>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        paddingTop: '68px',
        background: '#fafaf7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Placeholder - akan diisi pada Phase 4 */}
      </div>
      <Footer />
    </main>
  )
}
