/**
 * Secc_Contador.jsx — Sección de cuenta regresiva interactiva
 * Muestra el componente Countdown con contexto visual del evento.
 * Fecha: 2026
 */

import { motion } from 'framer-motion'
import { sectionVariants } from '../SectionWrapper'
import Countdown from '../Countdown'

export default function Secc_Contador() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      {/* Icono decorativo */}
      <motion.div
        animate={{ rotate: [0, 5, -5, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{ fontSize: '2rem', marginBottom: '1.2rem' }}
      >
        ⏳
      </motion.div>

      <p style={{
        color: '#a8d8ea',
        fontSize: '0.65rem',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        marginBottom: '0.6rem',
      }}>
        La magia comienza en
      </p>

      {/* 👇 PERSONALIZAR: Fecha y datos del evento */}
      <p style={{
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        fontSize: '1.1rem',
        color: '#e0a96d',
        marginBottom: '2.5rem',
      }}>
        27 de Junio, 2026
      </p>

      <Countdown />

      <p style={{
        color: '#415a77',
        fontSize: '0.72rem',
        letterSpacing: '0.15em',
        marginTop: '2rem',
      }}>
        ✦ Cada segundo vale la pena ✦
      </p>
    </motion.section>
  )
}
