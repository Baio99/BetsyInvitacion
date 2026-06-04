/**
 * SectionWrapper.jsx — Contenedor del scroll vertical post-unveil
 * Renderiza todas las secciones informativas en secuencia.
 * Cada sección se revela con Framer Motion al entrar en viewport (IntersectionObserver via whileInView).
 * Fecha: 2026
 */

import { motion } from 'framer-motion'
import Secc_Portada    from './sections/Secc_Portada'
import Secc_Fotos      from './sections/Secc_Fotos'
import Secc_Bienvenida from './sections/Secc_Bienvenida'
import Secc_Contador   from './sections/Secc_Contador'
import Secc_Detalles   from './sections/Secc_Detalles'

// Variante de entrada por scroll — reutilizada en cada sección
export const sectionVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}

export default function SectionWrapper() {
  return (
    <div
      style={{
        maxWidth: '28rem',
        margin: '0 auto',
        paddingBottom: '4rem',
      }}
    >
      {/* Separador superior con brillo */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, #e0a96d, #7df9ff, #e0a96d, transparent)',
          marginBottom: '0.5rem',
        }}
      />

      <Secc_Portada />
      <Secc_Fotos />
      <Secc_Bienvenida />
      <Secc_Contador />
      <Secc_Detalles />

      {/* Footer mágico */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', padding: '2rem 1rem', color: '#415a77', fontSize: '0.75rem', letterSpacing: '0.15em' }}
      >
        ✦ Con todo el amor del mundo ✦
      </motion.footer>
    </div>
  )
}
