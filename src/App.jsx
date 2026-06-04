/**
 * App.jsx — Controlador de estados globales de la experiencia
 * Gestiona el flujo de fases cinematográficas de la invitación Betsa Quinceañera.
 * Fases: 'audio-unlock' → 'incantation' → 'hologram' → 'book-ready' → 'unveiled'
 * Fecha: 2026
 */

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MagicCanvas from './components/MagicCanvas'
import IntroBook from './components/IntroBook'
import SectionWrapper from './components/SectionWrapper'
import MusicPlayer from './components/MusicPlayer'

// Easing Disney: entrada rápida, aterrizaje suave
const MAGIC_EASE = [0.16, 1, 0.3, 1]

export default function App() {
  const [currentStage, setCurrentStage] = useState('audio-unlock')

  const advanceTo = useCallback((stage) => {
    setCurrentStage(stage)
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: '#0d1b2a' }}>

      {/* ── Canvas 3D fijo en fondo (se monta tras unlock) ── */}
      <AnimatePresence>
        {currentStage !== 'audio-unlock' && (
          <motion.div
            key="canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ position: 'fixed', inset: 0, zIndex: 0 }}
          >
            <MagicCanvas stage={currentStage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Viñeta perimetral (profundidad cinematográfica) ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #0d1b2a 100%)',
        }}
      />

      {/* ── Columna de contenido principal — Mobile-First ── */}
      <div
        className="relative mx-auto"
        style={{
          maxWidth: '28rem',       // max-w-md = 448px
          minHeight: '100svh',
          zIndex: 10,
        }}
      >

        {/* ── Pantalla Audio-Unlock ── */}
        <AnimatePresence mode="wait">
          {currentStage === 'audio-unlock' && (
            <motion.div
              key="audio-unlock"
              className="flex flex-col items-center justify-center"
              style={{ minHeight: '100svh', position: 'relative' }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.4, ease: 'easeInOut' } }}
            >
              {/* Fondo negro sólido durante unlock */}
              <div
                className="fixed inset-0"
                style={{ background: '#0a0e14', zIndex: -1 }}
              />

              <div className="flex flex-col items-center gap-8 px-8 text-center">
                {/* Estrella pulsante */}
                <motion.div
                  style={{ fontSize: '3rem', color: '#e0a96d', lineHeight: 1 }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale:   [1, 1.15, 1],
                    filter: [
                      'drop-shadow(0 0 8px rgba(224,169,109,0.3))',
                      'drop-shadow(0 0 24px rgba(224,169,109,0.9))',
                      'drop-shadow(0 0 8px rgba(224,169,109,0.3))',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                >
                  ✦
                </motion.div>

                <motion.p
                  style={{
                    color: '#a8d8ea',
                    fontSize: '0.7rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  Una invitación especial te aguarda
                </motion.p>

                {/* Botón dorado resplandeciente */}
                <motion.button
                  onClick={() => advanceTo('incantation')}
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(224,169,109,0.55)',
                    background: 'radial-gradient(ellipse, rgba(224,169,109,0.18) 0%, transparent 70%)',
                    color: '#e0a96d',
                    fontSize: '0.95rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: [
                      '0 0 18px rgba(224,169,109,0.2), inset 0 0 18px rgba(224,169,109,0.05)',
                      '0 0 45px rgba(224,169,109,0.55), inset 0 0 30px rgba(224,169,109,0.1)',
                      '0 0 18px rgba(224,169,109,0.2), inset 0 0 18px rgba(224,169,109,0.05)',
                    ],
                  }}
                  transition={{
                    opacity:    { delay: 0.8, duration: 0.8 },
                    scale:      { delay: 0.8, duration: 0.8 },
                    boxShadow:  { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 1.2 },
                  }}
                  whileHover={{
                    scale: 1.06,
                    boxShadow: '0 0 60px rgba(224,169,109,0.7)',
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  ✨ Encender Magia
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Secuencia Cinematográfica (incantation → hologram → book-ready) ── */}
        <AnimatePresence>
          {currentStage !== 'audio-unlock' && currentStage !== 'unveiled' && (
            <IntroBook
              key="intro"
              stage={currentStage}
              advanceTo={advanceTo}
            />
          )}
        </AnimatePresence>

        {/* ── Contenido principal tras abrir invitación ── */}
        <AnimatePresence>
          {currentStage === 'unveiled' && (
            <motion.div
              key="unveiled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: MAGIC_EASE }}
            >
              <SectionWrapper />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Reproductor de música — solo visible tras abrir invitación ── */}
        <AnimatePresence>
          {currentStage === 'unveiled' && <MusicPlayer key="music" />}
        </AnimatePresence>
      </div>
    </div>
  )
}
