import { useEffect, useRef, useState } from "react"

/**
 * Anima um número de 0 até `value` de forma suave.
 * Por quê: um número que "aparece pronto" é estático e parece um dado bruto de banco.
 * Um número que sobe transmite conquista — mesmo truque que Duolingo/Strava usam
 * ao mostrar XP ganho.
 */
export function useCountUp(value: number, durationMs = 900) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)

  useEffect(() => {
    fromRef.current = display
    startRef.current = null

    let frame: number
    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs])

  return display
}