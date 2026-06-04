import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sectionVariants } from '../SectionWrapper'

// ── Rutas de las fotos — pon los archivos en public/fotos/ ──
const PHOTOS = [
  { src: '/fotos/betsy1.png', caption: 'Nuestra pequeña princesa ✨' },
  { src: '/fotos/betsy2.png', caption: '¡Feliz primer añito, Betsy! 🌟' },
]

const AUTO_ADVANCE_MS = 4500

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0   }),
  center:        ({  x: 0,                             opacity: 1   }),
  exit:  (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0   }),
}

export default function Secc_Fotos() {
  const [current,   setCurrent]   = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused,    setPaused]    = useState(false)
  const timerRef = useRef(null)

  const goTo = useCallback((idx, dir) => {
    setDirection(dir)
    setCurrent(idx)
  }, [])

  const next = useCallback(() => {
    goTo((current + 1) % PHOTOS.length, 1)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + PHOTOS.length) % PHOTOS.length, -1)
  }, [current, goTo])

  // Auto-avance — pausa si el usuario está interactuando
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, AUTO_ADVANCE_MS)
    return () => clearInterval(timerRef.current)
  }, [paused, next])

  // Swipe táctil
  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) < 40) return
    info.offset.x < 0 ? next() : prev()
    setPaused(false)
  }

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}
    >
      {/* Separador superior */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(224,169,109,0.4), transparent)',
        marginBottom: '3rem',
      }} />

      {/* Icono decorativo */}
      <motion.div
        animate={{ rotate: [0, 8, -8, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        style={{ fontSize: '1.8rem', marginBottom: '0.9rem' }}
      >
        👑
      </motion.div>

      <p style={{
        color: '#a8d8ea',
        fontSize: '0.62rem',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        marginBottom: '0.45rem',
      }}>
        Presentando a
      </p>
      <p style={{
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        fontSize: '1.4rem',
        color: '#e0a96d',
        marginBottom: '2rem',
        textShadow: '0 0 20px rgba(224,169,109,0.4)',
      }}>
        Nuestra Pequeña Princesa
      </p>

      {/* ── Marco del carrusel ── */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => { setPaused(false) }}
      >
        {/* Glow exterior */}
        <div style={{
          position: 'absolute', inset: -2,
          borderRadius: '1.2rem',
          background: 'transparent',
          boxShadow: '0 0 40px rgba(224,169,109,0.2), 0 0 80px rgba(125,249,255,0.08)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Imagen con slide */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          borderRadius: '1.1rem',
          overflow: 'hidden',
          border: '1.5px solid rgba(224,169,109,0.45)',
          background: 'rgba(13,27,42,0.8)',
          zIndex: 1,
          cursor: 'grab',
        }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={current}
              src={PHOTOS[current].src}
              alt={`Betsy foto ${current + 1}`}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>

          {/* Drag invisible para swipe */}
          <motion.div
            style={{ position: 'absolute', inset: 0, zIndex: 2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
          />

          {/* Gradiente inferior + caption */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
            padding: '2rem 1rem 1rem',
            background: 'linear-gradient(to top, rgba(7,18,30,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={current}
                style={{
                  color: '#e8e0d0',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em',
                  textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                {PHOTOS[current].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Esquinas doradas decorativas */}
          {[
            { top: 8, left: 8, transform: 'none' },
            { top: 8, right: 8, transform: 'scaleX(-1)' },
            { bottom: 8, left: 8, transform: 'scaleY(-1)' },
            { bottom: 8, right: 8, transform: 'scale(-1,-1)' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', ...s, width: 16, height: 16, zIndex: 4, pointerEvents: 'none' }}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: '100%', height: '100%' }}>
                <path d="M1 9 Q1 1 9 1" stroke="#e0a96d" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
                <path d="M1 1 L1 5 M1 1 L5 1" stroke="#e0a96d" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Botón anterior */}
        <button
          onClick={() => { prev(); setPaused(true); setTimeout(() => setPaused(false), 6000) }}
          aria-label="Foto anterior"
          style={{
            position: 'absolute', left: -16, top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            width: 36, height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(224,169,109,0.45)',
            background: 'rgba(13,27,42,0.75)',
            backdropFilter: 'blur(8px)',
            color: '#e0a96d',
            fontSize: '1.3rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
            boxShadow: '0 0 14px rgba(224,169,109,0.2)',
          }}
        >‹</button>

        {/* Botón siguiente */}
        <button
          onClick={() => { next(); setPaused(true); setTimeout(() => setPaused(false), 6000) }}
          aria-label="Siguiente foto"
          style={{
            position: 'absolute', right: -16, top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 5,
            width: 36, height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(224,169,109,0.45)',
            background: 'rgba(13,27,42,0.75)',
            backdropFilter: 'blur(8px)',
            color: '#e0a96d',
            fontSize: '1.3rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
            boxShadow: '0 0 14px rgba(224,169,109,0.2)',
          }}
        >›</button>
      </div>

      {/* ── Indicadores (puntos) ── */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem' }}>
        {PHOTOS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => { goTo(i, i > current ? 1 : -1); setPaused(true); setTimeout(() => setPaused(false), 6000) }}
            aria-label={`Ir a foto ${i + 1}`}
            style={{
              height: 7,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: i === current ? '#e0a96d' : 'rgba(224,169,109,0.28)',
            }}
            animate={{ width: i === current ? 22 : 7 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Barra de progreso auto-avance */}
      {!paused && (
        <motion.div
          key={`${current}-progress`}
          style={{
            height: 1.5,
            borderRadius: 1,
            background: '#e0a96d',
            marginTop: '0.6rem',
            originX: 0,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
        />
      )}

      {/* Caption inferior */}
      <p style={{
        color: '#415a77',
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        marginTop: '1.2rem',
      }}>
        ✦ Desliza o toca las flechas para ver más ✦
      </p>
    </motion.section>
  )
}
