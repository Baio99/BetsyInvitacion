/**
 * Timeline.jsx — Itinerario del evento en formato vertical con línea dorada
 * Cada item se anima al entrar en viewport. Diseño Mobile-First.
 * Fecha: 2026
 */

import { motion } from 'framer-motion'

// ── Datos del itinerario (placeholder, personalizar con datos reales) ──
const TIMELINE_ITEMS = [
  // { time: '2:00 PM',  icon: '🎭', title: 'Concurso de Disfraces',   desc: 'Desfila con tu personaje Disney favorito' },
  // { time: '2:30 PM',  icon: '🌿', title: 'Juegos en Tierra',        desc: 'Diversión y risas al aire libre' },
  // { time: '3:00 PM',  icon: '🍪', title: 'Refrigerio',              desc: 'Un momento para reponer energías' },
  // { time: '3:30 PM',  icon: '🎂', title: 'Pastel',                  desc: 'El dulce momento del primer año' },
  // { time: '4:30 PM',  icon: '🏊', title: 'Piscina',                 desc: '¡A disfrutar del agua hasta las 6:00 PM! No olvides tu gorro de baño!!' },
  { time: '',  icon: '🎭', title: 'Concurso de Disfraces',   desc: 'Desfila con tu personaje Disney favorito' },
  { time: '',  icon: '🌿', title: 'Juegos en Tierra',        desc: 'Diversión y risas al aire libre' },
  { time: '',  icon: '🍪', title: 'Refrigerio',              desc: 'Un momento para reponer energías' },
  { time: '',  icon: '🎂', title: 'Pastel',                  desc: 'El dulce momento del primer año' },
  { time: '',  icon: '🏊', title: 'Piscina',                 desc: '¡A disfrutar del agua. !No olvides tu gorro de baño!!' },

]

export default function Timeline() {
  return (
    <div style={{ position: 'relative', padding: '0 0.5rem' }}>
      {/* Línea vertical dorada */}
      <div style={{
        position: 'absolute',
        left: '2.8rem',
        top: 0,
        bottom: 0,
        width: 1,
        background: 'linear-gradient(180deg, transparent, #e0a96d 10%, #e0a96d 90%, transparent)',
        opacity: 0.4,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {TIMELINE_ITEMS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
            style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}
          >
            {/* Nodo de la línea de tiempo */}
            <div style={{
              flexShrink: 0,
              width: '2.8rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              paddingTop: '0.2rem',
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(224,169,109,0.5)',
                background: 'rgba(13,27,42,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 0 12px rgba(224,169,109,0.2)',
              }}>
                {item.icon}
              </div>
            </div>

            {/* Contenido */}
            <div style={{ paddingBottom: '0.5rem' }}>
              <p style={{
                color: '#e0a96d',
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.2rem',
              }}>
                {item.time}
              </p>
              <p style={{
                color: '#e8e0d0',
                fontSize: '0.95rem',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                marginBottom: '0.15rem',
                lineHeight: 1.3,
              }}>
                {item.title}
              </p>
              <p style={{
                color: '#a8d8ea',
                fontSize: '0.78rem',
                letterSpacing: '0.05em',
                opacity: 0.8,
              }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
