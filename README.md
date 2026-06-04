# Invitación Cinematográfica Premium - Betsa Quinceañera

## 📱 Especificaciones de Optimización Móvil (Mobile-First)
- El diseño debe estar optimizado al 100% para pantallas de celulares.
- En computadoras (PC), todo el contenido visual debe encajarse en un contenedor centralizado de máximo `max-w-md` (estilo historia de Instagram/TikTok) con un fondo inmersivo detrás.
- **Temática:** Hada Madrina de Disney (Cenicienta). Paleta: Azules mágicos (#0d1b2a, #415a77), Oro (#e0a96d) y destellos celestes neón.

## 🎬 Flujo de la Secuencia Cinematográfica (IntroBook)
1. **Audio-Unlock:** Pantalla negra con botón sutil para activar sonido y WebGL.
2. **El Encantamiento:** Sonido de magia + texto sincronizado: "Bibbidi...", "Bobbidi...", "Boo...".
3. **El Holograma:** Emerge una luz azul/celeste, las partículas 3D se intensifican y se proyecta la silueta holográfica del Hada Madrina con el trazo de luz de su varita, mostrando el texto: "Estás cordialmente invitado...".
4. **El Libro Mágico:** Sobre el holograma, se materializa el libro/pergamino antiguo con bordes dorados y el botón final "Abrir Invitación".

## Estructura del Software
- `src/App.jsx`: Controlador de estados globales (`introStep`: 'words' | 'hologram' | 'open').
- `src/components/MagicCanvas.jsx`: Motor WebGL (Three.js) Escena con partículas de polvo de estrellas encargado de las partículas flotantes y destellos de la varita.
-  `src/components/IntroBook.jsx`: Componente interactivo que gestiona la intro cinematográfica de Disney y el libro. Un libro 3D mágico o pantalla de bienvenida que requiere interacción ("Abrir") del usuario.
- `src/components/SectionWrapper.jsx`: Contenedor animado con Framer Motion para la revelación de las secciones del scroll con todas las secciones informativas.
- `src/components/Countdown.jsx`: Contador de tiempo restante.
- `src/components/Timeline.jsx`: Itinerario del evento.


## 📝 Reglas de Código y Documentación Estrictas
1. Mantener todas las secciones en componentes separados dentro de `src/components/`.
2. El audio/música e interacciones 3D intensas solo deben arrancar tras interactuar con la pantalla para cumplir con las políticas del navegador.
3. **Documentación:** Cada función, hook o componente creado DEBE incluir un bloque de comentarios en la parte superior con una pequeña descripción de su propósito (para futuros ajustes técnicos) y la fecha de implementación (usar el año actual 2026).

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


