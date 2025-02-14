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
        <Hero />
      </main>
    </>
  )
}

export default HomePage 