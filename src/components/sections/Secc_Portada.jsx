/**
 * Secc_Portada.jsx — Sección hero con el nombre de Betsa y mariposas mágicas SVG animadas
 * Primera sección visible tras abrir la invitación. Full-height, centrada.
 * Fecha: 2026
 */

import { motion } from 'framer-motion'
import { sectionVariants } from '../SectionWrapper'

/* Mariposa SVG mágica animada (vuela en trayectoria aleatoria) */
function MagicButterfly({ style, delay = 0, scale = 1 }) {
  return (
    <motion.div
      style={{ position: 'absolute', ...style }}
      animate={{
        x: [0, 12, -8, 18, 0],
        y: [0, -18, -8, -24, 0],
        rotate: [0, 8, -6, 10, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 5 + delay,
        ease: 'easeInOut',
        delay,
      }}
    >
      <svg
        viewBox="0 0 60 40"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 36 * scale, height: 24 * scale, opacity: 0.75 }}
      >
        <defs>
          <radialGradient id={`bflyL${delay}`} cx="30%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#7df9ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#415a77" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id={`bflyR${delay}`} cx="70%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e0a96d" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#415a77" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        {/* Alas superiores */}
        <path d="M30 20 Q10 0 2 8 Q0 18 12 22 Z" fill={`url(#bflyL${delay})`} />
        <path d="M30 20 Q50 0 58 8 Q60 18 48 22 Z" fill={`url(#bflyR${delay})`} />
        {/* Alas inferiores */}
        <path d="M30 22 Q8 28 6 34 Q14 38 26 30 Z" fill={`url(#bflyL${delay})`} opacity="0.6" />
        <path d="M30 22 Q52 28 54 34 Q46 38 34 30 Z" fill={`url(#bflyR${delay})`} opacity="0.6" />
        {/* Cuerpo */}
        <ellipse cx="30" cy="22" rx="1.8" ry="6" fill="#e0a96d" opacity="0.8" />
        {/* Antenas */}
        <path d="M29 16 Q24 8 22 5" stroke="#e0a96d" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M31 16 Q36 8 38 5" stroke="#e0a96d" strokeWidth="0.8" fill="none" opacity="0.7" />
        <circle cx="22" cy="5" r="1.2" fill="#7df9ff" opacity="0.9" />
        <circle cx="38" cy="5" r="1.2" fill="#7df9ff" opacity="0.9" />
      </svg>
    </motion.div>
  )
}

export default function Secc_Portada() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Mariposas decorativas */}
      <MagicButterfly style={{ top: '12%', left: '8%'  }} delay={0}   scale={1.1} />
      <MagicButterfly style={{ top: '15%', right: '6%' }} delay={1.3} scale={0.85} />
      <MagicButterfly style={{ top: '30%', left: '2%'  }} delay={2.1} scale={0.7} />
      <MagicButterfly style={{ bottom: '25%', right: '4%' }} delay={0.7} scale={0.9} />
      <MagicButterfly style={{ bottom: '18%', left: '10%' }} delay={1.8} scale={0.75} />

      {/* Partícula decorativa superior */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        style={{ fontSize: '1.2rem', color: '#a8d8ea', marginBottom: '1.5rem' }}
      >
        ✦
      </motion.div>

      {/* Título principal */}
      <motion.p
        style={{
          color: '#a8d8ea',
          fontSize: '0.65rem',
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Con todo el amor del mundo presentamos a
      </motion.p>

      {/* Nombre de Betsa */}
      <motion.h1
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(3.5rem, 14vw, 5.5rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.05,
          color: '#e0a96d',
          textShadow: '0 0 40px rgba(224,169,109,0.6), 0 0 80px rgba(224,169,109,0.2)',
          marginBottom: '0.5rem',
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        Betsy
      </motion.h1>

      {/* Decoración central */}
      <motion.div
        style={{
          height: 1,
          width: '60%',
          background: 'linear-gradient(90deg, transparent, #e0a96d, #7df9ff, #e0a96d, transparent)',
          margin: '1rem auto',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.9 }}
      />

      {/* Subtítulo XV años */}
      <motion.div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.8rem, 7vw, 2.5rem)',
          fontWeight: 400,
          color: '#f5c87a',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textShadow: '0 0 25px rgba(245,200,122,0.5)',
        }}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        1 Año
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#415a77',
          fontSize: '0.85rem',       /* ← tamaño del texto "Deslizar / ↓" */
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
        animate={{ y: [0, 6, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
<span style={{ fontWeight: 700 }}>Deslizar</span>
<span style={{ fontSize: '1.1rem', fontWeight: 700 }}>↓</span>     

 </motion.div>
    </motion.section>
  )
}
