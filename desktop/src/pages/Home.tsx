import { FC } from 'react'
import Background from '@/components/ui/Background'
import Hero from '@/components/sections/Hero'

const HomePage: FC = () => {
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