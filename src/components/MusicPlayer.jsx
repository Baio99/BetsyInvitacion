import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MUSIC_SRC = '/musica/so-this-is-love.mp3'
const VOLUME    = 0.38   // 0.0 – 1.0  ←  ajusta aquí el volumen

export default function MusicPlayer() {
  const audioRef           = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ready,     setReady]     = useState(false)   // archivo cargado
  const [visible,   setVisible]   = useState(false)   // botón visible

  // Montar: intentar autoplay
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = VOLUME

    audio.addEventListener('canplay', () => setReady(true), { once: true })
    audio.addEventListener('error',   () => setReady(false))

    // Intentar autoplay (funciona porque el usuario ya interactuó con la página)
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))  // bloqueado por el navegador → el usuario usa el botón

    // Mostrar botón con pequeño retraso para que no distraiga al confetti
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      {/* Elemento de audio oculto */}
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      {/* Botón flotante */}
      <AnimatePresence>
        {visible && (
          <motion.button
            onClick={toggle}
            aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
            title={isPlaying ? 'Pausar música' : 'Reproducir música'}
            style={{
              position: 'fixed',
              top: '0.9rem',
              right: '0.9rem',
              zIndex: 100,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid rgba(224,169,109,0.55)',
              background: 'rgba(13,27,42,0.82)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1px',
              padding: 0,
              outline: 'none',
            }}
            initial={{ opacity: 0, scale: 0.6, y: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: isPlaying
                ? [
                    '0 0 10px rgba(224,169,109,0.25)',
                    '0 0 28px rgba(224,169,109,0.55)',
                    '0 0 10px rgba(224,169,109,0.25)',
                  ]
                : '0 0 10px rgba(224,169,109,0.2)',
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              opacity:    { duration: 0.5 },
              scale:      { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y:          { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              boxShadow:  { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.12, borderColor: 'rgba(224,169,109,0.9)' }}
            whileTap={{ scale: 0.93 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

/* Icono de pausa — dos barras verticales doradas */
function PauseIcon() {
  return (
    <motion.svg
      width="16" height="18" viewBox="0 0 16 18"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
    >
      <rect x="1.5" y="1" width="4.5" height="16" rx="2" fill="#e0a96d" />
      <rect x="10"  y="1" width="4.5" height="16" rx="2" fill="#e0a96d" />
    </motion.svg>
  )
}

/* Icono de play — triángulo dorado */
function PlayIcon() {
  return (
    <svg
      width="16" height="18" viewBox="0 0 16 18"
      fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 1.5 L14.5 9 L2 16.5 Z" fill="#e0a96d" />
    </svg>
  )
}
