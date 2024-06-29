import { CreditCard, House, History } from 'lucide-react'
import { useRouter } from 'next/router'
 
  export default function Footer() {
    const router = useRouter()
    return (
      <footer>
      <div className='icon-wrapper' onClick={() => router.push('/')}>
          <House  />
          <small>Home</small>
      </div>

      <div className='icon-wrapper' onClick={() => router.push('/create')}>
          <CreditCard />
          <small>Create</small>
      </div>

      <div className='icon-wrapper' onClick={() => router.push('/history')}>
          <History />
          <small>History</small>
      </div>

  </footer>
    )
  }