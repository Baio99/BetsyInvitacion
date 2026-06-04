/**
 * Countdown.jsx — Contador regresivo interactivo hacia la fecha del evento
 * Calcula días, horas, minutos y segundos restantes en tiempo real.
 * Anima cada dígito con Framer Motion al cambiar.
 * Fecha: 2026
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Fecha objetivo del evento (ajustar cuando se confirme) ──
const EVENT_DATE = new Date('2026-06-27T14:00:00')

function getTimeLeft() {
  const diff = EVENT_DATE - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds, expired: false }
}

/* Dígito animado individual — flip vertical al cambiar el valor.
   key={value} hace que AnimatePresence remonte el span automáticamente,
   por lo que no necesitamos rastrear el valor previo con estado ni refs. */
function AnimatedDigit({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <div
        style={{
          position: 'relative',
          width: 62,
          height: 72,
          borderRadius: '0.75rem',
          border: '1px solid rgba(224,169,109,0.35)',
          background: 'rgba(13,27,42,0.7)',
          backdropFilter: 'blur(8px)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(224,169,109,0.1)',
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.4rem',
              fontWeight: 400,
              color: '#e0a96d',
              textShadow: '0 0 20px rgba(224,169,109,0.6)',
              display: 'block',
              lineHeight: 1,
            }}
            initial={{ y: -36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span style={{
        color: '#a8d8ea',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (timeLeft.expired) {
    return (
      <p style={{ color: '#7df9ff', textAlign: 'center', letterSpacing: '0.15em', fontSize: '1.1rem' }}>
        ✨ ¡La magia ya comenzó! ✨
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'flex-start' }}>
      <AnimatedDigit value={timeLeft.days}    label="Días" />
      <Colon />
      <AnimatedDigit value={timeLeft.hours}   label="Horas" />
      <Colon />
      <AnimatedDigit value={timeLeft.minutes} label="Min" />
      <Colon />
      <AnimatedDigit value={timeLeft.seconds} label="Seg" />
    </div>
  )
}

function Colon() {
  return (
    <div style={{ color: '#e0a96d', fontSize: '2rem', lineHeight: 1, paddingTop: '1rem', opacity: 0.6 }}>
      :
    </div>
  )
}
