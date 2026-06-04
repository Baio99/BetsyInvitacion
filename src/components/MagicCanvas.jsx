/**
 * MagicCanvas.jsx — Motor WebGL de partículas mágicas (Polvo de Hadas)
 * Usa React Three Fiber + Three.js. Fondo fijo en z-index 0.
 * Sistema de 260 partículas en esferoide oblato con órbita diferencial.
 * Responde a `stage` para acelerar la espiral (efecto varita mágica).
 * Fecha: 2026
 */

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 260

/* ─────────────────────────────────────────────────────────────────────────
   FairyDust — El núcleo del sistema de partículas

   Matemática orbital:
   • Posición inicial: esferoide oblato via distribución esférica uniforme
     φ = arccos(1 − 2u), θ = 2π·v  →  aplastado en Y(×0.35) y Z(×0.6)
   • Cada partícula orbita en el plano XZ con R_i y θ_i individuales
   • useFrame delta-based: independiente de FPS
   • En 'hologram': ω ×10 + convergencia radial (espiral al centro = varita)
───────────────────────────────────────────────────────────────────────── */
function FairyDust({ stageRef }) {
  const pointsRef  = useRef()
  const matRef     = useRef()
  const globalTime = useRef(0)

  // Float32Arrays en refs — explícitamente mutables, sin restricciones de React
  // orbData layout por partícula: [R_base, angle, yBase, phase, speed]
  const orbDataRef    = useRef(new Float32Array(PARTICLE_COUNT * 5))
  const effectiveRRef = useRef(new Float32Array(PARTICLE_COUNT))
  const posArrayRef   = useRef(new Float32Array(PARTICLE_COUNT * 3))
  const colorArrayRef = useRef(new Float32Array(PARTICLE_COUNT * 3))

  // Inicialización en useEffect — los efectos pueden llamar funciones impuras
  useEffect(() => {
    const orb = orbDataRef.current
    const eff = effectiveRRef.current
    const pos = posArrayRef.current
    const col = colorArrayRef.current

    const gold      = new THREE.Color('#e0a96d')
    const goldLight = new THREE.Color('#f5c87a')
    const cyan      = new THREE.Color('#7df9ff')
    const cyanPale  = new THREE.Color('#a8d8ea')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u   = Math.random()
      const v   = Math.random()
      const phi = Math.acos(1 - 2 * u)
      const tht = 2 * Math.PI * v
      const r   = 2.5 + Math.random() * 4.5

      const x0 = r * Math.sin(phi) * Math.cos(tht)
      const y0 = r * Math.sin(phi) * Math.sin(tht) * 0.35
      const z0 = r * Math.cos(phi) * 0.6

      pos[i * 3]     = x0
      pos[i * 3 + 1] = y0
      pos[i * 3 + 2] = z0

      const R_base = Math.sqrt(x0 * x0 + z0 * z0)
      const angle  = Math.atan2(z0, x0)
      const speed  = (0.12 + Math.random() * 0.18) * (Math.random() > 0.5 ? 1 : -1)

      orb[i * 5]     = R_base
      orb[i * 5 + 1] = angle
      orb[i * 5 + 2] = y0
      orb[i * 5 + 3] = Math.random() * Math.PI * 2
      orb[i * 5 + 4] = speed

      eff[i] = R_base

      const isCyan = Math.random() > 0.6
      const mix    = Math.random() * 0.5
      const c      = isCyan
        ? cyan.clone().lerp(cyanPale, mix)
        : gold.clone().lerp(goldLight, mix)

      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    if (pointsRef.current) {
      const geo = pointsRef.current.geometry
      geo.attributes.position.needsUpdate = true
      geo.attributes.color.needsUpdate    = true
    }
  }, [])

  // ── Loop de animación principal ──
  useFrame((_, delta) => {
    if (!pointsRef.current || !matRef.current) return

    const stage = stageRef.current
    globalTime.current += delta

    const isHologram = stage === 'hologram'
    const isBook     = stage === 'book-ready'
    const isUnveiled = stage === 'unveiled'
    const speedMult  = isHologram ? 4.0 : isBook ? 2.0 : isUnveiled ? 1.4 : 0.4
    const converge   = isHologram ? 0.012 : isBook ? 0.002 : 0

    const targetSize    = isHologram ? 0.075 : isUnveiled ? 0.065 : 0.05
    const targetOpacity = isHologram ? 0.95  : isUnveiled ? 0.85  : 0.72

    matRef.current.size    += (targetSize    - matRef.current.size)    * 0.04
    matRef.current.opacity += (targetOpacity - matRef.current.opacity) * 0.04

    const t   = globalTime.current
    const orb = orbDataRef.current
    const eff = effectiveRRef.current
    const pos = posArrayRef.current

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const base  = i * 5
      const omega = orb[base + 4] * speedMult * delta

      orb[base + 1] += omega

      if (converge > 0) {
        eff[i] = Math.max(0.3, eff[i] * (1 - converge))
      } else {
        eff[i] += (orb[base] - eff[i]) * 0.005
      }

      const R   = eff[i]
      const ang = orb[base + 1]
      const yB  = orb[base + 2]
      const ph  = orb[base + 3]

      pos[i * 3]     = R * Math.cos(ang)
      pos[i * 3 + 1] = yB + Math.sin(t * 0.4 + ph) * 0.18
      pos[i * 3 + 2] = R * Math.sin(ang) * 0.55
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[posArrayRef.current, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorArrayRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.05}
        vertexColors
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   GlowCore — Luz ambiental cian que se intensifica en fase hologram
───────────────────────────────────────────────────────────────────────── */
function GlowCore({ stageRef }) {
  const lightRef = useRef()

  useFrame(() => {
    if (!lightRef.current) return
    const stage = stageRef.current
    const targetIntensity =
      stage === 'hologram'   ? 4.5 :
      stage === 'book-ready' ? 2.5 :
      stage === 'unveiled'   ? 2.0 : 0.8

    lightRef.current.intensity +=
      (targetIntensity - lightRef.current.intensity) * 0.025
  })

  return (
    <pointLight
      ref={lightRef}
      color="#7df9ff"
      intensity={0.8}
      position={[0, 0, 2]}
      distance={20}
    />
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   MagicCanvas — Componente exportable: Canvas R3F fijo en fondo
───────────────────────────────────────────────────────────────────────── */
export default function MagicCanvas({ stage }) {
  // Ref para evitar stale closures en useFrame
  const stageRef = useRef(stage)
  useEffect(() => { stageRef.current = stage }, [stage])

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 1.5, 9], fov: 65 }}
      gl={{
        antialias:        false,  // OFF en mobile para rendimiento
        alpha:            true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}             // cap pixel ratio para mobile
    >
      <ambientLight color="#0d1b2a" intensity={0.3} />
      <GlowCore stageRef={stageRef} />
      <FairyDust stageRef={stageRef} />
    </Canvas>
  )
}
