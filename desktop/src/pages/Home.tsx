import { FC } from 'react'
import Background from '@/components/ui/Background'
import Hero from '@/components/sections/Hero'
import { useAuth } from '@/lib/context/AuthContext'

const HomePage: FC = () => {
  console.log('HomePage rendering')
  const { loading, user } = useAuth()
  console.log('Home page auth state:', { loading, user })
  return (
    <>
      <Background />
      <main className="relative z-0">
        <div className="relative max-w-6xl mx-auto px-4 py-32 sm:px-6 md:px-8">
          <Hero />
        </div>
      </main>
    </>
  )
}

export default HomePage 