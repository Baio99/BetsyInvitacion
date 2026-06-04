import { motion } from 'framer-motion'
import { sectionVariants } from '../SectionWrapper'

/* ── Cilindro del pergamino (arriba y abajo) ─────────────────────────── */
function ScrollRoll({ flip = false }) {
  return (
    <svg
      viewBox="0 0 320 46"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        display: 'block',
        transform: flip ? 'scaleY(-1)' : 'none',
        position: 'relative',
        zIndex: 3,
        marginBottom: flip ? 0 : -2,
        marginTop:    flip ? -2 : 0,
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cyl${flip}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a1504" />
          <stop offset="15%"  stopColor="#9c6515" />
          <stop offset="35%"  stopColor="#d4924a" />
          <stop offset="50%"  stopColor="#f0ba6a" />
          <stop offset="65%"  stopColor="#d4924a" />
          <stop offset="85%"  stopColor="#9c6515" />
          <stop offset="100%" stopColor="#2a1504" />
        </linearGradient>
        <radialGradient id={`knb${flip}`} cx="38%" cy="35%" r="62%">
          <stop offset="0%"   stopColor="#f5c87a" />
          <stop offset="55%"  stopColor="#c07820" />
          <stop offset="100%" stopColor="#3a1e04" />
        </radialGradient>
      </defs>

      {/* Cuerpo del cilindro */}
      <rect x="18" y="3" width="284" height="40" rx="5" fill={`url(#cyl${flip})`} />

      {/* Reflejo de luz */}
      <rect x="48" y="10" width="224" height="9" rx="4" fill="rgba(255,255,255,0.14)" />

      {/* Líneas de textura */}
      {[70, 120, 160, 200, 250].map(x => (
        <line key={x} x1={x} y1="3" x2={x} y2="43"
          stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" />
      ))}

      {/* Borde dorado superior e inferior */}
      <line x1="18" y1="4"  x2="302" y2="4"  stroke="rgba(240,186,106,0.6)" strokeWidth="0.8" />
      <line x1="18" y1="42" x2="302" y2="42" stroke="rgba(50,25,4,0.5)"     strokeWidth="0.8" />

      {/* Nudo izquierdo */}
      <ellipse cx="18" cy="23" rx="18" ry="18" fill={`url(#knb${flip})`} />
      <ellipse cx="13" cy="18" rx="6"  ry="5"  fill="rgba(255,255,255,0.14)" />
      <circle  cx="18" cy="23" r="6"   fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

      {/* Nudo derecho */}
      <ellipse cx="302" cy="23" rx="18" ry="18" fill={`url(#knb${flip})`} />
      <ellipse cx="297" cy="18" rx="6"  ry="5"  fill="rgba(255,255,255,0.14)" />
      <circle  cx="302" cy="23" r="6"   fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
    </svg>
  )
}

/* ── Marco ornamental filigrana dorada ───────────────────────────────── */
function ParchmentBorder() {
  const corners = [
    '',
    'scale(-1,1) translate(-300,0)',
    'scale(1,-1) translate(0,-400)',
    'scale(-1,-1) translate(-300,-400)',
  ]
  return (
    <svg
      viewBox="0 0 300 400"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pbG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f0ba6a" />
          <stop offset="35%"  stopColor="#d4924a" />
          <stop offset="65%"  stopColor="#a06218" />
          <stop offset="100%" stopColor="#d4924a" />
        </linearGradient>
        <filter id="pbF" x="-18%" y="-18%" width="136%" height="136%">
          <feGaussianBlur stdDeviation="0.7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Marco doble exterior */}
      <rect x="5"  y="5"  width="290" height="390" rx="3"
        fill="none" stroke="url(#pbG)" strokeWidth="2.2" filter="url(#pbF)" />
      <rect x="10" y="10" width="280" height="380" rx="2"
        fill="none" stroke="url(#pbG)" strokeWidth="0.8" opacity="0.5" />

      {/* Ornamentos de esquina × 4 */}
      {corners.map((t, i) => (
        <g key={i} transform={t || undefined} filter="url(#pbF)">
          <path d="M5,52 Q5,5 52,5"   stroke="url(#pbG)" strokeWidth="2.2" fill="none" />
          <path d="M10,52 Q10,10 52,10" stroke="url(#pbG)" strokeWidth="0.8" fill="none" opacity="0.5" />
          {/* Hoja de acanto */}
          <path d="M14,46 C18,30 30,17 45,13 C38,22 27,31 19,42 Z"
            fill="url(#pbG)" opacity="0.82" />
          <path d="M19,40 C25,28 34,20 43,16"
            stroke="url(#pbG)" strokeWidth="0.8" fill="none" />
          {/* Medallón */}
          <circle cx="22" cy="22" r="6"   fill="none" stroke="url(#pbG)" strokeWidth="1.5" />
          <circle cx="22" cy="22" r="3"   fill="url(#pbG)" />
          <circle cx="22" cy="22" r="1.1" fill="#fff8e8" opacity="0.55" />
          {/* Cuadrado esquina */}
          <rect x="5" y="5" width="9" height="9" rx="1.5" fill="url(#pbG)" opacity="0.95" />
        </g>
      ))}

      {/* Ornamento central superior */}
      <g filter="url(#pbF)">
        <path d="M150,3 L157,11 L150,19 L143,11 Z" fill="url(#pbG)" />
        <path d="M143,11 Q118,7 88,11"  stroke="url(#pbG)" strokeWidth="1.3" fill="none" />
        <path d="M157,11 Q182,7 212,11" stroke="url(#pbG)" strokeWidth="1.3" fill="none" />
        <path d="M88,11 Q74,9 70,15"    stroke="url(#pbG)" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M212,11 Q226,9 230,15" stroke="url(#pbG)" strokeWidth="0.8" fill="none" opacity="0.7" />
        <circle cx="88"  cy="11" r="2.4" fill="url(#pbG)" opacity="0.88" />
        <circle cx="212" cy="11" r="2.4" fill="url(#pbG)" opacity="0.88" />
      </g>
      {/* Ornamento central inferior */}
      <g transform="scale(1,-1) translate(0,-400)" filter="url(#pbF)">
        <path d="M150,3 L157,11 L150,19 L143,11 Z" fill="url(#pbG)" />
        <path d="M143,11 Q118,7 88,11"  stroke="url(#pbG)" strokeWidth="1.3" fill="none" />
        <path d="M157,11 Q182,7 212,11" stroke="url(#pbG)" strokeWidth="1.3" fill="none" />
        <circle cx="88"  cy="11" r="2.4" fill="url(#pbG)" opacity="0.88" />
        <circle cx="212" cy="11" r="2.4" fill="url(#pbG)" opacity="0.88" />
      </g>

      {/* Bandas horizontales decorativas */}
      <path d="M52,28 Q150,40 248,28" stroke="url(#pbG)" strokeWidth="1"   fill="none" opacity="0.7" />
      <path d="M52,32 Q150,44 248,32" stroke="url(#pbG)" strokeWidth="0.4" fill="none" opacity="0.35" />
      <path d="M150,24 L154,28 L150,32 L146,28 Z" fill="url(#pbG)" opacity="0.78" />

      <path d="M52,372 Q150,360 248,372" stroke="url(#pbG)" strokeWidth="1"   fill="none" opacity="0.7" />
      <path d="M52,368 Q150,356 248,368" stroke="url(#pbG)" strokeWidth="0.4" fill="none" opacity="0.35" />
      <path d="M150,376 L154,372 L150,368 L146,372 Z" fill="url(#pbG)" opacity="0.78" />

      {/* Medallones laterales */}
      <path d="M5,200 L19,192 Q28,200 19,208 L5,200 Z"   fill="url(#pbG)" opacity="0.88" filter="url(#pbF)" />
      <circle cx="12" cy="200" r="2.5" fill="#fff8e8" opacity="0.4" />
      <path d="M295,200 L281,192 Q272,200 281,208 L295,200 Z" fill="url(#pbG)" opacity="0.88" filter="url(#pbF)" />
      <circle cx="288" cy="200" r="2.5" fill="#fff8e8" opacity="0.4" />

      {/* Divisor interior superior */}
      <line x1="20" y1="70"  x2="280" y2="70"  stroke="url(#pbG)" strokeWidth="0.6" opacity="0.4" />
      <path d="M150,66 L154,70 L150,74 L146,70 Z" fill="url(#pbG)" opacity="0.55" />

      {/* Divisor interior inferior */}
      <line x1="20" y1="330" x2="280" y2="330" stroke="url(#pbG)" strokeWidth="0.6" opacity="0.4" />
      <path d="M150,326 L154,330 L150,334 L146,330 Z" fill="url(#pbG)" opacity="0.55" />

      {/* Floritura inferior */}
      <path d="M110,385 Q150,376 190,385 Q150,394 110,385 Z" fill="url(#pbG)" opacity="0.52" />
      <circle cx="150" cy="385" r="3.2" fill="url(#pbG)" opacity="0.78" />
    </svg>
  )
}

/* ── Sección principal ───────────────────────────────────────────────── */
export default function Secc_Bienvenida() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{ padding: '4rem 1.2rem', textAlign: 'center' }}
    >
      {/* Separador superior */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(224,169,109,0.4), transparent)',
        marginBottom: '3rem',
      }} />

      {/* Icono + etiqueta (fuera del pergamino) */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ fontSize: '1.6rem', marginBottom: '0.8rem', lineHeight: 1 }}
      >
        🌹
      </motion.div>
      <p style={{
        color: '#a8d8ea',
        fontSize: '0.62rem',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        marginBottom: '1.4rem',
      }}>
        Un mensaje del corazón
      </p>

      {/* ── Pergamino completo ── */}
      <div style={{ position: 'relative' }}>

        {/* Rollo superior */}
        <ScrollRoll />

        {/* Cuerpo del pergamino */}
        <div style={{
          position: 'relative',
          background: `
            radial-gradient(ellipse at 12% 14%, rgba(185,145,65,0.2) 0%, transparent 45%),
            radial-gradient(ellipse at 88% 86%, rgba(155,115,45,0.18) 0%, transparent 42%),
            radial-gradient(ellipse at 86% 14%, rgba(170,130,58,0.15) 0%, transparent 38%),
            radial-gradient(ellipse at 13% 86%, rgba(165,125,52,0.15) 0%, transparent 38%),
            linear-gradient(162deg, #f7eac8 0%, #f0e0b4 28%, #f3e8c6 58%, #ead9a8 100%)
          `,
          borderLeft:  '2.5px solid #b07820',
          borderRight: '2.5px solid #b07820',
          boxShadow: [
            'inset 0 0 50px rgba(185,145,65,0.13)',
            'inset 4px 0 12px rgba(0,0,0,0.06)',
            'inset -4px 0 12px rgba(0,0,0,0.06)',
            '0 2px 10px rgba(0,0,0,0.25)',
          ].join(', '),
          padding: '2rem 1.8rem 2.2rem',
          minHeight: 220,
        }}>
          <ParchmentBorder />

          {/* Texto del mensaje */}
          <div style={{ position: 'relative', zIndex: 1, padding: '0.8rem 0.3rem 0.5rem' }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(0.92rem, 3.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: '#3b2005',
              marginBottom: '1.3rem',
              textAlign: 'center',
            }}>
              Mi linda princesa, en solo 12 meses nos has enseñado lo que es el amor incondicional. Eres nuestra luz, nuestra alegría, y lo más importante que tenemos en la vida.
            </p>

            <p style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(0.92rem, 3.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: '#3b2005',
              marginBottom: '1.8rem',
              textAlign: 'center',
            }}>
              Prometemos acompañarte, guiarte, amarte y cuidarte cada día de nuestras vidas. Hoy festejamos su primer añito y queremos que seas parte del primer capítulo del cuento de nuestra princesa. Será un día mágico si tú estás con nosotros
            </p>

            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(176,120,32,0.55), transparent)',
              marginBottom: '1.3rem',
            }} />

            <p style={{
              color: '#6b3810',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: '0.98rem',
              letterSpacing: '0.04em',
              lineHeight: 1.7,
            }}>
              Con amor eterno,
              <br />
              <span style={{
                fontSize: '1.08rem',
                color: '#8b3e0e',
                display: 'block',
                marginTop: '0.25rem',
              }}>
                Mamá y Papá
              </span>
            </p>
          </div>
        </div>

        {/* Rollo inferior */}
        <ScrollRoll flip />
      </div>

      {/* Separador inferior */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(224,169,109,0.4), transparent)',
        marginTop: '3rem',
      }} />
    </motion.section>
  )
}
