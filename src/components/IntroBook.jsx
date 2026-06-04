/**
 * IntroBook.jsx — Secuencia cinematográfica de intro inspirada en el Hada Madrina
 * Orquesta las fases: incantation → hologram → book-ready vía timers + Framer Motion.
 * Incluye Audio API procedural (campanitas mágicas) y confetti canvas al abrir.
 * Diseño Mobile-First: max-w-md centrado, min-h-screen.
 * Fecha: 2026
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// ── Easing Disney: arranque rápido, aterrizaje suave ──────────────────────
const EASE_MAGIC  = [0.16, 1, 0.3, 1]
const EASE_EXIT   = [0.4, 0, 1, 1]

// ── Palabras del encantamiento ────────────────────────────────────────────
const WORDS = ['Bibbidi...', 'Bobbidi...', 'Boo...']

/* ─────────────────────────────────────────────────────────────────────────
   useMagicAudio — Web Audio API: campanitas procedurales
   No requiere archivos de audio externos. Crea un acorde de campana
   usando osciladores sinusoidales con envolvente exponencial ADSR.
───────────────────────────────────────────────────────────────────────── */
function useMagicAudio(audioCtxRef) {
  const playBells = useCallback((delay = 0) => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    // Frecuencias: C5, E5, G5, C6 → acorde mayor brillante
    const freqs    = [523.25, 659.25, 783.99, 1046.50]
    const spacing  = 0.18  // segundos entre campanitas

    freqs.forEach((freq, idx) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      // Pequeño detune para calidez orgánica
      const osc2  = ctx.createOscillator()
      const gain2 = ctx.createGain()

      osc.type = osc2.type = 'sine'
      osc.frequency.value  = freq
      osc2.frequency.value = freq * 1.005  // 5 cents detune

      osc.connect(gain)
      osc2.connect(gain2)
      gain.connect(ctx.destination)
      gain2.connect(ctx.destination)

      const t = ctx.currentTime + delay + idx * spacing
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.22, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)

      gain2.gain.setValueAtTime(0, t)
      gain2.gain.linearRampToValueAtTime(0.08, t + 0.04)
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)

      osc.start(t); osc.stop(t + 1.8)
      osc2.start(t); osc2.stop(t + 1.8)
    })
  }, [audioCtxRef])

  const playRising = useCallback(() => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    // Glissando ascendente para el momento "hologram"
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 1.2)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4)
    osc.start(); osc.stop(ctx.currentTime + 1.4)
  }, [audioCtxRef])

  return { playBells, playRising }
}

/* ─────────────────────────────────────────────────────────────────────────
   fireOpeningConfetti — Ráfaga de destellos oro+cian al abrir la invitación
───────────────────────────────────────────────────────────────────────── */
function fireOpeningConfetti() {
  const COLORS = ['#e0a96d', '#f5c87a', '#7df9ff', '#ffffff', '#a8d8ea']

  // Lluvia central
  confetti({
    particleCount: 120,
    spread:        80,
    origin:        { y: 0.55 },
    colors:        COLORS,
    scalar:        1.3,
    startVelocity: 35,
  })

  // Cañonazos laterales con retraso
  setTimeout(() => {
    confetti({ particleCount: 70, angle: 55,  spread: 60, origin: { x: 0, y: 0.6 }, colors: COLORS })
    confetti({ particleCount: 70, angle: 125, spread: 60, origin: { x: 1, y: 0.6 }, colors: COLORS })
  }, 220)

  // Tercer burst — lluvia suave de estrellas
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread:        120,
      origin:        { y: 0.2 },
      colors:        COLORS,
      scalar:        0.9,
      gravity:       0.7,
    })
  }, 500)
}

/* ─────────────────────────────────────────────────────────────────────────
   MagicSparkles — Partículas flotantes de polvo de hada
───────────────────────────────────────────────────────────────────────── */
const SPARKLE_CONFIG = [
  { x: '22%', y: '18%', size: 5,  color: '#7df9ff', delay: 0    },
  { x: '72%', y: '12%', size: 4,  color: '#e0a96d', delay: 0.6  },
  { x: '82%', y: '38%', size: 6,  color: '#7df9ff', delay: 1.1  },
  { x: '14%', y: '55%', size: 3,  color: '#e0a96d', delay: 0.3  },
  { x: '78%', y: '62%', size: 5,  color: '#7df9ff', delay: 1.7  },
  { x: '38%', y: '82%', size: 4,  color: '#e0a96d', delay: 0.9  },
  { x: '60%', y: '88%', size: 3,  color: '#7df9ff', delay: 1.4  },
  { x: '50%', y: '8%',  size: 5,  color: '#ffffff', delay: 0.2  },
  { x: '88%', y: '22%', size: 3,  color: '#e0a96d', delay: 2.0  },
  { x: '10%', y: '30%', size: 4,  color: '#7df9ff', delay: 1.8  },
]

function MagicSparkles() {
  return (
    <>
      {SPARKLE_CONFIG.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: s.x, top: s.y,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            zIndex: 4, pointerEvents: 'none',
          }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            scale:   [0, 1.6, 1, 0],
            y:       [0, -(14 + i * 3), -(28 + i * 4)],
            x:       [0, (i % 2 === 0 ? 4 : -4), 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2 + s.delay * 0.4,
            delay: s.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   FairyGodmotherSilhouette — Chroma-key por ratio B/R en canvas
   El fondo del video es azul saturado (B >> R). La hada tiene tonos
   neutros/cálidos (B ≈ R). El ratio B/R discrimina ambos con precisión:
     ratio > 2.6  →  fondo azul    → transparente (eliminado)
     ratio 1.8-2.6 →  borde suave  → semitransparente
     ratio < 1.8  →  personaje     → opaco (conservado)
   El drop-shadow de CSS sigue el contorno real de píxeles opacos.
───────────────────────────────────────────────────────────────────────── */
function FairyGodmotherSilhouette({ onEnded }) {
  const videoRef      = useRef(null)
  const canvasRef     = useRef(null)
  const rafRef        = useRef(null)
  const fallbackRef   = useRef(null)
  const isEndingRef   = useRef(false)       // evita múltiples setState
  const [isEnding, setIsEnding] = useState(false)

  useEffect(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const processFrame = () => {
      if (video.readyState < 2) {
        rafRef.current = requestAnimationFrame(processFrame)
        return
      }

      const vw = video.videoWidth  || 320
      const vh = video.videoHeight || 480

      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width  = vw
        canvas.height = vh
      }

      ctx.drawImage(video, 0, 0, vw, vh)
      const frame = ctx.getImageData(0, 0, vw, vh)
      const d = frame.data

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2]
        const ratio = b / (r + 1)
        const sum   = r + g + b

        if (sum < 110 && r < 42 && g < 55) { d[i + 3] = 0; continue }
        if (ratio > 2.5 && b > 38)          { d[i + 3] = 0; continue }
        if (ratio > 1.75 && b > 28) {
          const t = (ratio - 1.75) / (2.5 - 1.75)
          d[i + 3] = Math.round(d[i + 3] * (1 - Math.min(t, 1)))
        }
      }

      ctx.putImageData(frame, 0, 0)

      // Detectar los últimos 1.8 s → activar transición de salida
      if (!isEndingRef.current && isFinite(video.duration) && video.duration > 0) {
        const remaining = video.duration - video.currentTime
        if (remaining < 1.8 && remaining > 0) {
          isEndingRef.current = true
          setIsEnding(true)
        }
      }

      rafRef.current = requestAnimationFrame(processFrame)
    }

    // Cuando el video termina: congelar el último frame y disparar transición
    const handleEnded = () => {
      if (rafRef.current)      cancelAnimationFrame(rafRef.current)
      if (fallbackRef.current) clearTimeout(fallbackRef.current)
      // Pequeña pausa para que el último frame respire antes del fade
      setTimeout(() => onEnded?.(), 380)
    }

    const onPlay = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(processFrame)
    }

    video.addEventListener('play',  onPlay)
    video.addEventListener('ended', handleEnded)

    video.play().catch(() => {
      // Si autoplay falla, usar fallback de 8 s
      fallbackRef.current = setTimeout(() => onEnded?.(), 8000)
    })

    // Fallback de seguridad: si por alguna razón el evento 'ended' no llega
    video.addEventListener('loadedmetadata', () => {
      const dur = video.duration
      if (isFinite(dur) && dur > 0) {
        fallbackRef.current = setTimeout(() => onEnded?.(), (dur + 1) * 1000)
      }
    }, { once: true })

    return () => {
      video.removeEventListener('play',  onPlay)
      video.removeEventListener('ended', handleEnded)
      if (rafRef.current)      cancelAnimationFrame(rafRef.current)
      if (fallbackRef.current) clearTimeout(fallbackRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      style={{ position: 'relative', width: 260, height: 340 }}
      initial={{ opacity: 0, scale: 0.7, y: 28 }}
      animate={{ opacity: 1, scale: 1,   y: 0  }}
      transition={{ duration: 1.3, ease: EASE_MAGIC }}
    >
      {/* Resplandor cian de fondo — pulsa suavemente */}
      <motion.div
        style={{
          position: 'absolute', inset: -55,
          borderRadius: '50%', zIndex: 0,
          background: 'radial-gradient(ellipse 62% 72% at 50% 54%, rgba(125,249,255,0.52) 0%, rgba(65,90,119,0.16) 52%, transparent 78%)',
        }}
        animate={{ opacity: [0.45, 1, 0.45], scale: [0.9, 1.11, 0.9] }}
        transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
      />

      {/* Halo dorado en zona de la varita */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%', zIndex: 0,
          background: 'radial-gradient(ellipse 50% 58% at 68% 30%, rgba(224,169,109,0.3) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.18, 0.68, 0.18] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.45 }}
      />

      {/* Video oculto — fuente de frames */}
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}multimediaMovible/hadavideo.mp4`}
        muted playsInline
        style={{ display: 'none' }}
      />

      {/* Canvas: chroma-key + flotación → se desvanece al final del video */}
      <motion.div
        style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}
        animate={isEnding
          ? { y: 0, opacity: 0, scale: 1.22, filter: 'blur(10px)' }
          : { y: [0, -12, 0], opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={isEnding
          ? { duration: 1.7, ease: [0.16, 1, 0.3, 1] }
          : { y: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' } }
        }
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: [
              'drop-shadow(0 0 12px rgba(125,249,255,0.88))',
              'drop-shadow(0 0 30px rgba(125,249,255,0.42))',
              'drop-shadow(0 0 6px  rgba(224,169,109,0.38))',
              'brightness(1.06)',
            ].join(' '),
          }}
        />
      </motion.div>

      {/* Shimmer diagonal — barrido de luz cada ~5 s (solo mientras no es ending) */}
      {!isEnding && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(120deg, transparent 15%, rgba(255,255,255,0.09) 50%, transparent 85%)',
          }}
          animate={{ opacity: [0, 1, 0], x: ['-70%', '70%'] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut', repeatDelay: 4 }}
        />
      )}

      {/* Partículas de polvo mágico flotantes */}
      <MagicSparkles />

      {/* ── Flash mágico de cierre (Disney-style) ──────────────────────────
          Explota desde el centro al entrar en los últimos 1.8 s del video.
          Cubre el contorno rectangular y simula el destello de transformación.
      ─────────────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', inset: -90,
          zIndex: 5, pointerEvents: 'none',
          borderRadius: '50%',
          background: [
            'radial-gradient(ellipse at 50% 50%,',
            '  rgba(255,255,255,1)    0%,',
            '  rgba(200,240,255,0.92) 18%,',
            '  rgba(125,249,255,0.75) 38%,',
            '  rgba(224,169,109,0.45) 58%,',
            '  transparent            78%)',
          ].join(''),
        }}
        animate={isEnding
          ? { opacity: [0, 0.92, 0.6, 0], scale: [0.2, 1.1, 1.9, 2.8] }
          : { opacity: 0, scale: 0 }
        }
        transition={isEnding
          ? { duration: 1.75, ease: [0.16, 1, 0.3, 1], times: [0, 0.28, 0.6, 1] }
          : { duration: 0 }
        }
      />

      {/* Segundo anillo de flash — más suave, más tardío */}
      <motion.div
        style={{
          position: 'absolute', inset: -60,
          zIndex: 4, pointerEvents: 'none',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(125,249,255,0.55) 0%, rgba(65,90,119,0.25) 45%, transparent 72%)',
        }}
        animate={isEnding
          ? { opacity: [0, 0.8, 0], scale: [0.4, 1.5, 2.4] }
          : { opacity: 0, scale: 0 }
        }
        transition={isEnding
          ? { duration: 2.0, ease: 'easeOut', delay: 0.15, times: [0, 0.4, 1] }
          : { duration: 0 }
        }
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   WordReveal — Una palabra del encantamiento con animación de entrada/salida
───────────────────────────────────────────────────────────────────────── */
function WordReveal({ word, isVisible }) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.span
          key={word}
          style={{
            display: 'block',
            color: '#e0a96d',
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.2rem, 8vw, 3.2rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            textShadow: '0 0 30px rgba(224,169,109,0.9), 0 0 60px rgba(224,169,109,0.5)',
          }}
          initial={{ opacity: 0, scale: 0.78, filter: 'blur(12px)', y: 15 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          exit={{
            opacity: 0,
            scale: 1.18,
            filter: 'blur(8px)',
            y: -12,
            transition: { duration: 0.45, ease: EASE_EXIT },
          }}
          transition={{ duration: 0.75, ease: EASE_MAGIC }}
        >
          {word}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   IntroBook — Componente principal de la secuencia cinematográfica
───────────────────────────────────────────────────────────────────────── */
export default function IntroBook({ stage, advanceTo }) {
  const [wordIndex,  setWordIndex]  = useState(0)
  const [wordActive, setWordActive] = useState(true)
  const timers   = useRef([])
  const audioCtx = useRef(null)
  const { playBells, playRising } = useMagicAudio(audioCtx)

  // ── Iniciar AudioContext (ya desbloqueado por el click previo) ──
  useEffect(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume()
    }
  }, [])

  // ── Orquestador de timers para la secuencia completa ──
  useEffect(() => {
    if (stage !== 'incantation') return

    // Limpiar timers anteriores
    timers.current.forEach(clearTimeout)
    timers.current = []

    const T = (fn, ms) => {
      const id = setTimeout(fn, ms)
      timers.current.push(id)
      return id
    }

    // T=0ms: palabra 0 "Bibbidi..." + campanitas
    T(() => {
      setWordIndex(0)
      setWordActive(true)
      playBells(0)
    }, 0)

    // T=1800ms: salida palabra 0
    T(() => setWordActive(false), 1800)
    // T=1950ms: entrada palabra 1 "Bobbidi..."
    T(() => { setWordIndex(1); setWordActive(true) }, 1950)

    // T=3750ms: salida palabra 1
    T(() => setWordActive(false), 3750)
    // T=3900ms: entrada palabra 2 "Boo..." con acorde más agudo
    T(() => {
      setWordIndex(2)
      setWordActive(true)
      playBells(0)
    }, 3900)

    // T=5200ms: transición a HOLOGRAM + glissando ascendente
    T(() => {
      setWordActive(false)
      playRising()
      advanceTo('hologram')
    }, 5200)

    return () => timers.current.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  // hologram → book-ready: lo dispara el evento 'ended' del video en FairyGodmotherSilhouette

  // ── Handler: abrir invitación ──
  const handleOpen = useCallback(() => {
    fireOpeningConfetti()
    // Breve delay para que el confetti sea visible antes del fade
    setTimeout(() => advanceTo('unveiled'), 800)
  }, [advanceTo])

  return (
    <div
      className="relative flex flex-col items-center justify-center text-center px-6"
      style={{ maxWidth: '28rem', margin: '0 auto', minHeight: '100svh' }}
    >

      {/* ── FASE: INCANTATION ─────────────────────────────────────────── */}
      <AnimatePresence>
        {stage === 'incantation' && (
          <motion.div
            key="incantation"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            {/* Penumbra oscura */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ background: 'rgba(10, 14, 20, 0.72)', zIndex: -1 }}
            />

            {/* Partícula central decorativa */}
            <motion.div
              style={{ fontSize: '1.4rem', color: '#a8d8ea', marginBottom: '0.5rem' }}
              animate={{ opacity: [0.3, 1, 0.3], rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              ✧
            </motion.div>

            {/* Zona de palabras — altura fija para evitar saltos de layout */}
            <div style={{ height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WordReveal word={WORDS[wordIndex]} isVisible={wordActive} />
            </div>

            <motion.div
              style={{ fontSize: '1.4rem', color: '#a8d8ea', marginTop: '0.5rem' }}
              animate={{ opacity: [0.3, 1, 0.3], rotate: [0, -15, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.5 }}
            >
              ✧
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FASE: HOLOGRAM ───────────────────────────────────────────── */}
      <AnimatePresence>
        {stage === 'hologram' && (
          <motion.div
            key="hologram"
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.7 } }}
            transition={{ duration: 0.9, ease: EASE_MAGIC }}
          >
            {/* Halo de luz cian central */}
            <motion.div
              className="absolute"
              style={{
                width: 280,
                height: 280,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(125,249,255,0.22) 0%, rgba(65,90,119,0.1) 50%, transparent 80%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE_MAGIC }}
            />

            {/* Silueta del Hada Madrina — al terminar el video pasa al libro */}
            <FairyGodmotherSilhouette onEnded={() => advanceTo('book-ready')} />

            {/* Texto cinematográfico */}
            <motion.p
              style={{
                color: '#a8d8ea',
                fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textShadow: '0 0 20px rgba(125,249,255,0.7)',
                lineHeight: 1.7,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: EASE_MAGIC }}
            >
              Estás cordialmente<br />
              <span style={{ color: '#e0a96d', fontStyle: 'italic', fontSize: '1.1em' }}>
                invitado...
              </span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FASE: BOOK-READY ─────────────────────────────────────────── */}
      <AnimatePresence>
        {stage === 'book-ready' && (
          <motion.div
            key="book"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE_MAGIC }}
          >
            <MagicBook3D onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────────────────
   GoldFiligree — Marco ornamental dorado SVG para la tapa del libro 3D
───────────────────────────────────────────────────────────────────────── */
function GoldFiligree() {
  return (
    <svg
      viewBox="0 0 240 316"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gfGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f5c87a" />
          <stop offset="30%"  stopColor="#e0a96d" />
          <stop offset="65%"  stopColor="#b87830" />
          <stop offset="100%" stopColor="#e8b870" />
        </linearGradient>
        <filter id="gfGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Triple frame */}
      <rect x="6"  y="6"  width="228" height="304" rx="4" fill="none" stroke="url(#gfGold)" strokeWidth="2.2" filter="url(#gfGlow)" />
      <rect x="12" y="12" width="216" height="292" rx="3" fill="none" stroke="url(#gfGold)" strokeWidth="0.9" opacity="0.55" />
      <rect x="20" y="20" width="200" height="276" rx="2" fill="none" stroke="url(#gfGold)" strokeWidth="0.5" opacity="0.28" />

      {/* Corner ornaments — shared shape, reflected via transform */}
      {[
        '',
        'scale(-1,1) translate(-240,0)',
        'scale(1,-1) translate(0,-316)',
        'scale(-1,-1) translate(-240,-316)',
      ].map((transform, i) => (
        <g key={i} transform={transform || undefined} filter="url(#gfGlow)">
          <path d="M6,52 Q6,6 52,6"    stroke="url(#gfGold)" strokeWidth="2.2" fill="none" />
          <path d="M12,52 Q12,12 52,12" stroke="url(#gfGold)" strokeWidth="0.9" fill="none" opacity="0.55" />
          <path d="M16,46 C20,32 30,20 44,16 C38,24 28,32 20,42 Z" fill="url(#gfGold)" opacity="0.75" />
          <path d="M20,40 C25,30 32,24 40,20" stroke="url(#gfGold)" strokeWidth="0.8" fill="none" />
          <circle cx="22" cy="22" r="5.5" fill="none" stroke="url(#gfGold)" strokeWidth="1.4" />
          <circle cx="22" cy="22" r="2.8" fill="url(#gfGold)" />
          <circle cx="22" cy="22" r="1"   fill="#f5e6c8" opacity="0.55" />
          <rect   x="6"  y="6"  width="8" height="8" rx="1" fill="url(#gfGold)" opacity="0.9" />
        </g>
      ))}

      {/* Top center ornament */}
      <g filter="url(#gfGlow)">
        <path d="M120,4 L126,12 L120,20 L114,12 Z" fill="url(#gfGold)" />
        <path d="M114,12 Q96,8 76,12"   stroke="url(#gfGold)" strokeWidth="1.3" fill="none" />
        <path d="M126,12 Q144,8 164,12"  stroke="url(#gfGold)" strokeWidth="1.3" fill="none" />
        <path d="M76,12 Q68,10 66,16"    stroke="url(#gfGold)" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M164,12 Q172,10 174,16" stroke="url(#gfGold)" strokeWidth="0.8" fill="none" opacity="0.7" />
        <circle cx="76"  cy="12" r="2" fill="url(#gfGold)" opacity="0.8" />
        <circle cx="164" cy="12" r="2" fill="url(#gfGold)" opacity="0.8" />
      </g>
      {/* Bottom center ornament */}
      <g transform="scale(1,-1) translate(0,-316)" filter="url(#gfGlow)">
        <path d="M120,4 L126,12 L120,20 L114,12 Z" fill="url(#gfGold)" />
        <path d="M114,12 Q96,8 76,12"  stroke="url(#gfGold)" strokeWidth="1.3" fill="none" />
        <path d="M126,12 Q144,8 164,12" stroke="url(#gfGold)" strokeWidth="1.3" fill="none" />
        <circle cx="76"  cy="12" r="2" fill="url(#gfGold)" opacity="0.8" />
        <circle cx="164" cy="12" r="2" fill="url(#gfGold)" opacity="0.8" />
      </g>

      {/* Top & bottom horizontal bands */}
      <path d="M52,32 Q120,42 188,32" stroke="url(#gfGold)" strokeWidth="0.9" fill="none" opacity="0.65" />
      <path d="M52,36 Q120,46 188,36" stroke="url(#gfGold)" strokeWidth="0.4" fill="none" opacity="0.35" />
      <path d="M120,28 L123,32 L120,36 L117,32 Z" fill="url(#gfGold)" opacity="0.75" />
      <path d="M52,284 Q120,274 188,284" stroke="url(#gfGold)" strokeWidth="0.9" fill="none" opacity="0.65" />
      <path d="M52,280 Q120,270 188,280" stroke="url(#gfGold)" strokeWidth="0.4" fill="none" opacity="0.35" />
      <path d="M120,288 L123,284 L120,280 L117,284 Z" fill="url(#gfGold)" opacity="0.75" />

      {/* Side medallions */}
      <path d="M6,158 L20,150 Q28,158 20,166 L6,158 Z"       fill="url(#gfGold)" opacity="0.85" filter="url(#gfGlow)" />
      <path d="M234,158 L220,150 Q212,158 220,166 L234,158 Z" fill="url(#gfGold)" opacity="0.85" filter="url(#gfGlow)" />
      <circle cx="14"  cy="158" r="2.2" fill="#f5e6c8" opacity="0.45" />
      <circle cx="226" cy="158" r="2.2" fill="#f5e6c8" opacity="0.45" />

      {/* Inner horizontal dividers */}
      <line x1="24" y1="72"  x2="216" y2="72"  stroke="url(#gfGold)" strokeWidth="0.6" opacity="0.38" />
      <path d="M120,68 L124,72 L120,76 L116,72 Z" fill="url(#gfGold)" opacity="0.52" />
      <line x1="24" y1="244" x2="216" y2="244" stroke="url(#gfGold)" strokeWidth="0.6" opacity="0.38" />
      <path d="M120,240 L124,244 L120,248 L116,244 Z" fill="url(#gfGold)" opacity="0.52" />

      {/* Bottom flourish */}
      <path d="M90,268 Q120,260 150,268 Q120,276 90,268 Z" fill="url(#gfGold)" opacity="0.52" />
      <circle cx="120" cy="268" r="3" fill="url(#gfGold)" opacity="0.75" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   MagicBook3D — Libro con perspectiva CSS 3D real: cuero + filigrana dorada
   Tapa frontal con backface-visibility, lomo y canto de páginas visibles.
   Al hacer click rota -185° (abre) y dispara la secuencia de confetti.
───────────────────────────────────────────────────────────────────────── */
function MagicBook3D({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false)
  const W = 240, H = 316, D = 26

  const handleClick = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(onOpen, 760)
  }

  return (
    <div
      style={{
        perspective: '1100px',
        perspectiveOrigin: '58% 50%',
        width: W,
        height: H,
        cursor: isOpening ? 'default' : 'pointer',
        userSelect: 'none',
      }}
      onClick={handleClick}
    >
      <motion.div
        style={{ position: 'relative', width: W, height: H, transformStyle: 'preserve-3d' }}
        initial={{ rotateY: -20, opacity: 0, scale: 0.88 }}
        animate={isOpening
          ? { rotateY: -185, opacity: 1, scale: 1 }
          : { rotateY: [-20, -30, -20], y: [0, -12, 0], opacity: 1, scale: 1 }
        }
        transition={isOpening
          ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
          : {
              rotateY: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
              y:       { repeat: Infinity, duration: 3.8, ease: 'easeInOut' },
              opacity: { duration: 0.85, ease: EASE_MAGIC },
              scale:   { duration: 0.85, ease: EASE_MAGIC },
            }
        }
      >
        {/* ── TAPA FRONTAL ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          borderRadius: '3px 10px 10px 3px', overflow: 'hidden',
          background: `
            radial-gradient(ellipse at 28% 22%, rgba(65,90,119,0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 78% 82%, rgba(5,12,22,0.6) 0%, transparent 45%),
            linear-gradient(158deg, #192e44 0%, #0d1b2a 55%, #060f1a 100%)
          `,
          boxShadow: `
            inset -4px 0 14px rgba(0,0,0,0.6),
            inset 1px 1px 4px rgba(255,255,255,0.04),
            0 25px 70px rgba(0,0,0,0.8),
            0 0 50px rgba(224,169,109,0.12)
          `,
        }}>
          {/* Textura de cuero */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.07) 3px, rgba(255,255,255,0.07) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(0,0,0,0.05) 14px, rgba(0,0,0,0.05) 15px)
            `,
          }} />

          <GoldFiligree />

          {/* Contenido de la tapa */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '3rem 1.8rem', textAlign: 'center',
          }}>
            <p style={{ color: '#a8d8ea', fontSize: '0.65rem', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: '0.55rem', opacity: 0.9 }}>
              Con gran alegría
            </p>
            <h1 style={{
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '2.8rem', fontWeight: 400, lineHeight: 1,
              color: '#e0a96d',
              textShadow: '0 0 24px rgba(224,169,109,0.95), 0 2px 6px rgba(0,0,0,0.6)',
              marginBottom: '0.35rem',
            }}>Betsy</h1>
            <div style={{
              width: '55%', height: 1,
              background: 'linear-gradient(90deg, transparent, #e0a96d 40%, #7df9ff 50%, #e0a96d 60%, transparent)',
              margin: '0.5rem 0',
            }} />
            <p style={{ color: '#a8d8ea', fontSize: '0.64rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '0.25rem', opacity: 0.85 }}>
              Celebra su
            </p>
            <div style={{
              fontFamily: 'Georgia, serif', fontSize: '4rem', fontWeight: 400, lineHeight: 1,
              color: '#f5c87a',
              textShadow: '0 0 30px rgba(245,200,122,0.95), 0 2px 8px rgba(0,0,0,0.5)',
              marginBottom: '0.05rem',
            }}>1er</div>
            <p style={{ color: '#a8d8ea', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '1.8rem', opacity: 0.85 }}>
              Añito
            </p>
            <motion.div
              style={{
                padding: '0.52rem 1.4rem',
                borderRadius: '9999px',
                border: '1px solid rgba(224,169,109,0.55)',
                background: 'rgba(13,27,42,0.5)',
                color: '#e0a96d',
                fontSize: '0.63rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: 'Georgia, serif',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                pointerEvents: 'none',
              }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(224,169,109,0.18)',
                  '0 0 30px rgba(224,169,109,0.55)',
                  '0 0 10px rgba(224,169,109,0.18)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            >
              ✨ Abrir Invitación
            </motion.div>
          </div>
        </div>

        {/* ── LOMO ── */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: D, height: H,
          transformOrigin: 'left center',
          transform: 'rotateY(-90deg)',
          background: 'linear-gradient(90deg, #03080f 0%, #091520 50%, #03080f 100%)',
          borderRadius: '4px 0 0 4px', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 1, width: 1, background: 'linear-gradient(180deg, transparent, rgba(224,169,109,0.4) 20%, rgba(224,169,109,0.4) 80%, transparent)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 1, width: 1, background: 'linear-gradient(180deg, transparent, rgba(224,169,109,0.15) 20%, rgba(224,169,109,0.15) 80%, transparent)' }} />
        </div>

        {/* ── CANTO DE PÁGINAS ── */}
        <div style={{
          position: 'absolute', right: 0, top: 2,
          width: D - 4, height: H - 4,
          transformOrigin: 'right center',
          transform: 'rotateY(90deg)',
          background: 'linear-gradient(90deg, #c0b8a8, #ddd5c2, #c0b8a8)',
          overflow: 'hidden',
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${(i / 30) * 100}%`, height: '0.5px',
              background: 'rgba(0,0,0,0.1)',
            }} />
          ))}
        </div>

        {/* ── CONTRAPORTADA ── */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'linear-gradient(158deg, #0a1825, #050d18)',
          borderRadius: '3px 10px 10px 3px',
        }} />
      </motion.div>
    </div>
  )
}
