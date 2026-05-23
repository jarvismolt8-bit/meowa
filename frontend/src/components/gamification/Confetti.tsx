import { useState, useCallback, useRef } from 'react'

const COLORS = ['#FFADAD', '#A8E6CF', '#FFF3B0', '#A0C4FF', '#B5EAD7', '#FFD6A5']
const PARTICLE_COUNT = 30

interface Particle {
  id: number
  x: number
  color: string
  size: number
  delay: number
}

export function useConfetti(duration = 2000) {
  const [particles, setParticles] = useState<Particle[]>([])
  const idRef = useRef(0)

  const trigger = useCallback(() => {
    const next: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      next.push({
        id: idRef.current++,
        x: 20 + Math.random() * 60,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.3,
      })
    }
    setParticles(next)
    setTimeout(() => setParticles([]), duration)
  }, [duration])

  return { particles, trigger }
}

interface ConfettiProps {
  particles: Particle[]
}

export default function Confetti({ particles }: ConfettiProps) {
  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-up rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1.2 + Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  )
}
