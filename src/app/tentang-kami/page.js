import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TentangKamiContent from './TentangKamiContent'

export const metadata = {
  title: 'Tentang Kami - Ten Thirty Solutions',
}

export default function TentangKamiPage() {
  return (
    <main>
      <Navbar />
      <TentangKamiContent />
      <Footer />
    </main>
  )
}
