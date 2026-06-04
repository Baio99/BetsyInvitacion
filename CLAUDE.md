# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`betsa-invitacion` es una invitación web cinematográfica premium para los quince años de Betsa, inspirada en el Hada Madrina de Cenicienta (Disney). Construida con React 19 + Vite 8, combina una secuencia de intro animada con Three.js, Framer Motion y efectos de confetti, seguida de secciones de scroll informativas.

**Temática**: Hada Madrina — Paleta: Azul profundo `#0d1b2a`, Azul medio `#415a77`, Oro `#e0a96d`, Cian neón `#7df9ff`.
**Target**: 100% Mobile-First. En PC, todo el contenido vive en un contenedor `max-w-md` centrado (estilo historia de Instagram).

---

## Commands

```bash
npm run dev       # servidor dev con HMR → http://localhost:5173
npm run build     # build de producción → dist/
npm run preview   # sirve el build localmente
npm run lint      # ESLint (flat config, JS/JSX únicamente)
```

---

## Flujo de Fases de la Experiencia

El estado global `currentStage` en `App.jsx` controla cinco fases en secuencia estricta:

```
'audio-unlock'  →  'incantation'  →  'hologram'  →  'book-ready'  →  'unveiled'
    (click)         (T+0–3.2s)       (T+3.2–6.5s)   (T+6.5s+)       (click libro)
```

| Fase | Lo que el usuario ve |
|---|---|
| `audio-unlock` | Pantalla negra + botón dorado pulsante "Encender Magia" |
| `incantation` | Penumbra + palabras "Bibbidi... Bobbidi... Boo..." en secuencia |
| `hologram` | Luz cian, silueta SVG del Hada Madrina flotante, texto "Estás cordialmente invitado..." |
| `book-ready` | Pergamino con borde dorado, título "Betsa XV Años", botón "Abrir Invitación" |
| `unveiled` | Scroll vertical completo con las 4 secciones informativas |

---

## Arquitectura de Archivos

```
src/
├── index.css                          # Tailwind v4 + tokens CSS + keyframes globales
├── App.css                            # Vacío (limpiado del template Vite)
├── main.jsx                           # Entrada React
├── App.jsx                            # Controlador de estado global (currentStage)
└── components/
    ├── MagicCanvas.jsx                # Motor WebGL: 260 partículas Three.js en fondo fijo
    ├── IntroBook.jsx                  # Secuencia cinematográfica completa (4 sub-fases)
    ├── SectionWrapper.jsx             # Contenedor scroll; exporta sectionVariants
    ├── Countdown.jsx                  # Contador regresivo con dígitos flip animados
    ├── Timeline.jsx                   # Itinerario con línea dorada vertical
    └── sections/
        ├── Secc_Portada.jsx           # Hero: nombre Betsa + 5 mariposas SVG animadas
        ├── Secc_Bienvenida.jsx        # Mensaje emocional de los padres
        ├── Secc_Contador.jsx          # Wrapper del Countdown con fecha del evento
        └── Secc_Detalles.jsx          # Ubicación + Maps + Timeline + vestimenta + WhatsApp RSVP
```

**Entry chain**: `index.html` → `src/main.jsx` → `src/App.jsx`

---

## Decisiones Técnicas Clave

### Sistema de Partículas 3D (`MagicCanvas.jsx`)
- **260 partículas** en un esferoide oblato (distribución esférica uniforme aplanada en Y×0.35, Z×0.6).
- Cada partícula tiene parámetros orbitales propios almacenados en `Float32Array orbData[i*5]`: `[R_base, angle, yBase, phase, speed]`.
- Loop de animación **delta-time based** (`useFrame(_, delta)`) para independencia total de FPS.
- Multiplicadores de velocidad por fase: normal `×0.4`, hologram `×4.0`, book `×2.0`, unveiled `×1.4`.
- En fase `hologram`: convergencia radial `effectiveR[i] *= (1 - 0.012)` → simula espiral de varita mágica hacia el centro.
- Color: 60% partículas oro→blanco cálido, 40% cian→azul pálido. `AdditiveBlending` para glow sobre negro.
- `stageRef` pattern para evitar stale closures en `useFrame`: `const stageRef = useRef(stage)` + `useEffect(() => { stageRef.current = stage }, [stage])`.
- Caps de rendimiento móvil: `antialias: false`, `dpr={[1, 1.5]}`, `powerPreference: 'high-performance'`.

### Timing de la Intro (`IntroBook.jsx`)
- Orquestación mediante `setTimeout` anidados con array de IDs en `timers = useRef([])` para cleanup en `return () => timers.current.forEach(clearTimeout)`.
- Easing Disney personalizado: `[0.16, 1, 0.3, 1]` (arranque rápido, aterrizaje suave) para todas las entradas.
- Easing de salida: `[0.4, 0, 1, 1]` (ease-in) para transiciones hacia fuera.
- Audio procedural mediante **Web Audio API** (sin archivos externos): osciladores sinusoidales con envolvente ADSR exponencial. Acorde C5-E5-G5-C6 para campanitas, glissando 300Hz→1400Hz para la revelación del holograma.
- `AudioContext` creado en `useEffect` la primera vez (ya desbloqueado por el click previo en audio-unlock).

### Confetti de Apertura
- Triple ráfaga con `canvas-confetti`: lluvia central (120 partículas), dos cañonazos laterales con 220ms de retraso, lluvia suave de estrellas a los 500ms.
- Colores: `['#e0a96d', '#f5c87a', '#7df9ff', '#ffffff', '#a8d8ea']`.
- El avance a `'unveiled'` ocurre 800ms después del click para que el confetti sea visible antes del fade.

### Estilo y Layout
- Tailwind CSS v4 cargado vía plugin Vite (`@tailwindcss/vite`). **No existe `tailwind.config.js`**; los tokens se definen en `src/index.css` como CSS custom properties.
- Todo el contenido visual vive en `max-width: 28rem (448px)` centrado con `margin: 0 auto`.
- El `MagicCanvas` es `position: fixed; inset: 0; z-index: 0` — siempre detrás de todo el contenido.
- Viñeta perimetral: `radial-gradient(ellipse 80% 80% at center, transparent 40%, #0d1b2a 100%)` en `z-index: 2; pointer-events: none`.
- Silueta del Hada Madrina: SVG inline con gradientes radiales, `<animateTransform>` nativo para la estrella de la varita, y `<animate>` para los destellos circundantes.

### Secciones Post-Unveil
- `SectionWrapper.jsx` exporta `sectionVariants` (hidden/visible) para que cada sección lo importe y use con `whileInView` + `viewport={{ once: true }}`.
- `Countdown.jsx`: `setInterval` de 1s con `AnimatePresence mode="popLayout"` para el flip de dígitos (entrada desde arriba, salida hacia abajo).
- `Timeline.jsx`: línea dorada absoluta `left: 2.8rem` con items que se revelan con `x: -20 → 0` escalonados por `delay: idx * 0.05`.

---

## Bugs Resueltos

1. **Template Vite interference**: `src/App.css` traía estilos del template (counter, hero, etc.) que pisaban el diseño. Se limpió completamente.
2. **Stale closure en `useFrame`**: pasar `stage` como prop directamente a los componentes Three.js causaría que `useFrame` siempre vea el valor inicial. Solución: `stageRef` pattern (ref que se sincroniza vía `useEffect`).
3. **Audio policy en mobile**: los navegadores bloquean `AudioContext` hasta interacción del usuario. La fase `audio-unlock` garantiza que el click ocurra antes de cualquier intento de reproducción.
4. **BufferGeometry mutations en R3F v9**: se usa `args={[typedArray, 3]}` para crear el `BufferAttribute` una sola vez desde un `Float32Array` de `useMemo`. Las mutaciones en `useFrame` sobre el mismo array son reflejadas automáticamente; solo requieren `attribute.needsUpdate = true`.

---

## Pendiente para Próximas Fases

### Datos reales a personalizar
| Archivo | Línea | Qué cambiar |
|---|---|---|
| `src/components/Countdown.jsx` | `L12` | `EVENT_DATE` — fecha y hora exacta del evento |
| `src/components/sections/Secc_Bienvenida.jsx` | `L61` | Mensaje real de los padres + sus nombres (`L75`) |
| `src/components/sections/Secc_Contador.jsx` | `L35` | Fecha visible en texto |
| `src/components/sections/Secc_Detalles.jsx` | `L14–21` | Salón, dirección, URL Maps, número WhatsApp, fecha límite RSVP |
| `src/components/Timeline.jsx` | `L11–18` | Horas e items reales del itinerario |

### Features pendientes
- **Música de fondo**: agregar un `<audio loop>` con track ambient; debe arrancar solo tras el botón audio-unlock.
- **Foto de Betsa**: reemplazar el placeholder de texto en `Secc_Portada.jsx` con su foto real (ir a `src/assets/`).
- **Mapa embebido**: considerar un `<iframe>` de Google Maps en `Secc_Detalles` para no salir de la app.
- **Foto de la familia/mesa de honor**: sección adicional opcional entre Bienvenida y Contador.
- **OG/meta tags**: agregar `<meta property="og:image">` y `<meta name="theme-color" content="#0d1b2a">` en `index.html` para preview al compartir por WhatsApp.
- **PWA / install prompt**: considerar un `manifest.json` para que se pueda instalar en Home Screen.
- **Performance audit**: validar en un dispositivo físico Android mid-range; reducir `PARTICLE_COUNT` a 160 si hay drops de FPS.

---

## Key Dependencies

| Package | Versión | Propósito |
|---|---|---|
| `react` | ^19.2.6 | UI framework |
| `@react-three/fiber` | ^9.6.1 | React renderer para Three.js (Canvas R3F) |
| `@react-three/drei` | ^10.7.7 | Helpers R3F — instalado, aún no usado activamente |
| `framer-motion` | ^12.40.0 | Animaciones declarativas + AnimatePresence |
| `canvas-confetti` | ^1.9.4 | Ráfagas de confetti imperativas |
| `three` | ^0.184.0 | Motor 3D base |
| `tailwindcss` | ^4.3.0 | CSS utility (plugin Vite, sin config file) |
| `lucide-react` | ^1.16.0 | Íconos — instalado, disponible para uso futuro |

## Linting

ESLint configurado en `eslint.config.js` (flat config) con `eslint-plugin-react-hooks` y `eslint-plugin-react-refresh`. Sin TypeScript — solo JS/JSX.

Suprimir `react-hooks/exhaustive-deps` con `// eslint-disable-next-line` en `useEffect` de `IntroBook.jsx` (las dependencias omitidas son `useCallback` estables que no cambian entre renders).
