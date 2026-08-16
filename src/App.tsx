import { useEffect } from 'react'
import { Preloader } from './components/Preloader'
import { Nav } from './components/Nav'
import { ScrollProgress } from './components/ScrollProgress'
import { Cursor } from './components/Cursor'
import { HeroFlight } from './components/HeroFlight'
import { Marquee } from './components/Marquee'
import { Thesis } from './components/Thesis'
import { ParallaxQuote } from './components/ParallaxQuote'
import { Platform } from './components/Platform'
import { CircuitLab } from './components/CircuitLab'
import { Pipeline } from './components/Pipeline'
import { Evidence } from './components/Evidence'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { scrollEngine } from './lib/scrollEngine'

export default function App() {
  useEffect(() => {
    scrollEngine.start()
  }, [])

  return (
    <div id="top" className="relative overflow-clip bg-base font-body tracking-[-0.012em]" style={{ position: 'relative' }}>
      <Cursor />
      <ScrollProgress />
      <Preloader />
      <Nav />

      <HeroFlight />
      <Marquee />
      <Thesis />
      <ParallaxQuote />
      <Platform />
      <CircuitLab />
      <Pipeline />
      <Evidence />
      <Contact />
      <Footer />
    </div>
  )
}
