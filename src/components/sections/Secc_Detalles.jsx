/**
 * Secc_Detalles.jsx — Información del evento: ubicación, itinerario, vestimenta y RSVP
 * Incluye botón a Google Maps y botón de confirmación vía WhatsApp.
 * Fecha: 2026
 */

import { motion } from 'framer-motion'
import { sectionVariants } from '../SectionWrapper'
import Timeline from '../Timeline'

// ── Datos del evento — PERSONALIZAR ──────────────────────────────────────
const EVENT = {
  // 👇 Reemplazar con la dirección real
  venue:       'Meraki Aqua Club',
  address:     'Gonzalo Valdiviezo y Fray Agustín León oe9-164, Quito',
  mapsUrl:     'https://maps.google.com/?q=VF4W%2BQ7+Quito',
  // 👇 Reemplazar con el número de WhatsApp (formato internacional sin + ni espacios)
  whatsappNum: '593984059574',
  whatsappMsg: encodeURIComponent('¡Confirmo mi asistencia al primer año de Betsy! 🎉✨'),
  dresscode:   'Temática personajes Disney',
}

/* Tarjeta de detalle reutilizable */
function DetailCard({ icon, label, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        border: '1px solid rgba(224,169,109,0.25)',
        borderRadius: '0.85rem',
        padding: '1.4rem',
        background: 'rgba(13,27,42,0.55)',
        backdropFilter: 'blur(10px)',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>
          {icon}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{
            color: '#a8d8ea',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}>
            {label}
          </p>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

/* Botón de acción principal */
function ActionButton({ href, color = '#e0a96d', children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        width: '100%',
        padding: '0.85rem 1.5rem',
        borderRadius: '9999px',
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
        color,
        fontSize: '0.82rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontFamily: 'Georgia, serif',
        textDecoration: 'none',
        textAlign: 'center',
        boxShadow: `0 0 20px ${color}22`,
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.03, boxShadow: `0 0 40px ${color}55` }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.a>
  )
}

export default function Secc_Detalles() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{ padding: '4rem 1.5rem', textAlign: 'center' }}
    >
      {/* Separador superior */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(224,169,109,0.4), transparent)',
        marginBottom: '3rem',
      }} />

      <p style={{
        color: '#a8d8ea',
        fontSize: '0.65rem',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>
        Los detalles del gran evento
      </p>
      <p style={{
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        fontSize: '1.3rem',
        color: '#e0a96d',
        marginBottom: '2rem',
      }}>
        Todo lo que necesitas saber
      </p>

      {/* ── Ubicación ── */}
      <DetailCard icon="📍" label="Lugar del Evento">
        <p style={{ color: '#e8e0d0', fontFamily: 'Georgia, serif', fontSize: '1rem', marginBottom: '0.3rem' }}>
          {EVENT.venue}
        </p>
        <p style={{ color: '#9ca8b4', fontSize: '0.82rem', marginBottom: '0.8rem' }}>
          {EVENT.address}
        </p>
        <ActionButton href={EVENT.mapsUrl} color="#7df9ff">
          📍 Ver en Google Maps
        </ActionButton>
      </DetailCard>

      {/* ── Itinerario ── */}
      <DetailCard icon="✨" label="Itinerario de la Tarde">
        <Timeline />
      </DetailCard>

      {/* ── Código de Vestimenta ── */}
      <DetailCard icon="👗" label="Código de Vestimenta">
        <p style={{ color: '#e8e0d0', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.95rem' }}>
          {EVENT.dresscode}
        </p>
        <p style={{ color: '#9ca8b4', fontSize: '0.75rem', marginTop: '0.4rem' }}>
          Solicitamos no venir de Cenicienta
        </p>
         <p style={{ color: '#9ca8b4', fontSize: '0.75rem', marginTop: '0.4rem' }}>
          No olvides tu terno de baño
        </p>
      </DetailCard>

      {/* ── Confirmación RSVP ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ marginTop: '1.5rem' }}
      >
        <p style={{
          color: '#a8d8ea',
          fontSize: '0.65rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Confirmar Asistencia
        </p>
        <ActionButton
          href={`https://wa.me/${EVENT.whatsappNum}?text=${EVENT.whatsappMsg}`}
          color="#25d366"
        >
          💬 Confirmar por WhatsApp
        </ActionButton>
        <p style={{
          color: '#415a77',
          fontSize: '0.68rem',
          marginTop: '0.75rem',
          letterSpacing: '0.08em',
        }}>
          {/* 👇 PERSONALIZAR: Fecha límite de confirmación */}
          Confirmar antes del 25 de Junio, 2026
        </p>
      </motion.div>

      {/* Separador inferior */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(224,169,109,0.4), transparent)',
        marginTop: '3rem',
      }} />
    </motion.section>
  )
}
