# Sistema de diseño de Kaptativa

Única fuente de verdad: los tokens al inicio de `src/styles/global.css` (bloque "SISTEMA DE DISEÑO KAPTATIVA"). Todo lo que sigue describe cómo usarlos. Las demos de producto (`DemoInmobiliaria`, `DemoSistema`, `public/Realstate`) y el panel `/admin` quedan fuera del sistema.

## 1. Principios

1. **Un solo acento.** El violeta eléctrico es el único color de marca. Todo lo demás es negro, blanco y grises neutros.
2. **Botones sólidos.** Sin degradados en controles. El degradado queda solo como recurso puntual (barras de datos en maquetas).
3. **Ritmo claro/oscuro con criterio.** Oscuro donde se muestra el producto (hero, Control total, módulos, proceso, CTA); claro donde el cliente lee y decide (rubros, integraciones, planes, preguntas). Las secciones claras son paneles blancos con esquinas redondeadas; nunca dos claras seguidas salvo que sean la misma unidad.
4. **Brillos con medida.** El resplandor violeta aparece solo en el hero y al pasar el mouse por el botón principal. Las tarjetas usan sombra neutra.
5. **Los colores con significado no se usan para decorar.** Verde = pagado/éxito, naranja = aviso, rojo = error/problema, cian = datos.
6. **Sin capa de plantilla.** No hay etiquetas en mayúsculas sobre los títulos, ni una frase en violeta en cada título, ni flechas "→" pegadas a botones y enlaces, ni puntos medios "·" en los textos. El violeta en texto queda reservado para el hero (la palabra que rota).
7. **Cada bloque con su propio dispositivo visual.** Rubros = tarjetas con el ícono grande de fondo como identidad. Módulos = grilla de celdas con líneas finas (catálogo). Planes = tarjetas comparables sobre fondo claro. No repetir el mismo kit de tarjeta en tres secciones seguidas.
8. **Movimiento con sentido, no por sección.** Sin animación de entrada genérica por bloque ni "salto" de tarjetas. Lo que sí se mueve, porque cuenta algo: la palabra del hero, el recorrido "Control total", los contadores que cuentan al entrar en pantalla, la línea del proceso que se dibuja, el brillo que sigue el mouse dentro de las tarjetas (`.spot-glow`, lo agrega `app.js`), el mega menú que entra escalonado y los logos del hero. Todo respeta `prefers-reduced-motion`.
9. **Íconos, no caracteres.** Tildes, cruces, estrellas y flechas son SVG en línea (`svg.glyph`, 1 em, color heredado) o íconos de `plataforma.js`. Nada de "✓", "★" ni emojis como íconos, tampoco dentro de las maquetas de producto.
10. **Sentence case en todo.** Títulos, chips, etiquetas de formulario y textos de maquetas van en minúscula tras la primera letra; sin `text-transform: uppercase` en páginas públicas (solo siglas: CRM, SEO, API). Las maquetas hablan castellano ("Flujo de dependencias", no "Dependency flow").
11. **Comparaciones sin chip.** Las tarjetas "antes / con Kaptativa" llevan su título y el ícono en círculo; no llevan etiqueta flotante encima.

## 2. Color

### Violeta de marca
| Token | Hex | Uso |
|---|---|---|
| `--v-100` | `#EDE9FF` | Fondo tenue en secciones claras |
| `--v-200` | `#C9BFFF` | Detalles sobre oscuro |
| `--v-300` | `#A08CFF` | **Texto destacado sobre fondo oscuro** (7,0:1) |
| `--v-400` | `#8F75FF` | Links al pasar el mouse sobre oscuro |
| `--v-500` | `#7C5CFF` | **Logo, íconos, bordes activos, texto grande** |
| `--v-600` | `#6A48F5` | **Relleno de botones y chips con texto blanco** (5,4:1) |
| `--v-700` | `#5B3FE0` | **Texto destacado sobre fondo claro** (6,0:1) y hover de botones |
| `--v-800` | `#4A32B8` | Reservado |
| `--v-900` | `#2E1F7A` | Marca de agua del footer |

Tintes con transparencia: `rgba(124, 92, 255, 0.12)` fondo de ícono/chip · `rgba(124, 92, 255, 0.25)` borde activo.

### Neutros
| Token | Hex | Uso |
|---|---|---|
| `--n-0` | `#FFFFFF` | Texto principal sobre oscuro, tarjetas en secciones claras |
| `--n-50` | `#F6F6F7` | Fondo de secciones claras |
| `--n-100` | `#ECECEF` | Fondo terciario y bordes en secciones claras |
| `--n-200` | `#D4D4D9` | Bordes marcados sobre claro |
| `--n-300` | `#B4B4BE` | **Texto secundario sobre oscuro** (9,3:1) |
| `--n-400` | `#8E8E99` | **Texto atenuado sobre oscuro** (5,9:1; 5,3 sobre tarjeta) |
| `--n-500` | `#6E6E7A` | Texto atenuado sobre claro (4,7:1) |
| `--n-600` | `#52525B` | **Texto secundario sobre claro** (7,2:1) |
| `--n-700` | `#2A2A31` | Separadores marcados sobre oscuro |
| `--n-800` | `#1B1B20` | Tarjetas sobre oscuro |
| `--n-850` | `#151519` | Fondo secundario |
| `--n-900` | `#0F0F12` | **Fondo de página y texto principal sobre claro** |

Bordes sobre oscuro: `rgba(255, 255, 255, 0.06)` en reposo, violeta al 25 % activo.

### Semánticos
`--ok #10B981` · `--warn #F97316` · `--danger #EF4444` · `--info #06B6D4` (cian, solo para datos y gráficos).

### Roles (lo que usan los componentes)
`--brand-primary` (v-500) · `--brand-primary-light` (v-300) · `--brand-fill` (v-600) · `--brand-fill-hover` (v-700) · `--brand-gradient` y `--brand-gradient-text` (hoy sólidos; existen por compatibilidad).

### Combinaciones aprobadas (contraste WCAG)
| Texto | Fondo | Ratio |
|---|---|---|
| Blanco | v-600 (botón) | 5,4 ✓ |
| v-300 | n-900 / n-800 | 7,0 / 6,3 ✓ |
| v-700 | n-50 / blanco | 6,0 / 6,5 ✓ |
| n-300 | n-900 | 9,3 ✓ |
| n-400 | n-900 / n-800 | 5,9 / 5,3 ✓ |
| n-600 | n-50 | 7,2 ✓ |
| v-500 | n-900 | 4,4 — **solo texto ≥ 24 px o íconos** |

## 3. Tipografía
- **Títulos:** Lexend 600. **Texto:** Inter 400/500/600. Autoalojadas (`@fontsource`), con precarga de Lexend 600 e Inter 400.
- Pesos permitidos: 400, 500, 600. (Quedan 700/800 heredados en reglas viejas de `global.css`: deuda.)
- Escala sugerida: 12 · 14 · 16 · 18 · 20 · 24 · 32 · 40 · 56 px. Hoy conviven 28 tamaños en la home: deuda.

## 4. Radios
`--radius-sm 8px` (chips, inputs, elementos internos) · `--radius-md 12px` (tarjetas chicas, íconos) · `--radius-lg 20px` (tarjetas) · `--radius-xl 28px` (tarjetas grandes, header flotante) · `--radius-pill 999px` (botones, etiquetas). Los alias viejos `--border-radius-sm/md/lg` apuntan a esta escala.

## 5. Sombras
`--shadow-soft` (neutra, tarjetas al pasar el mouse) · `--shadow-brand` (violeta, solo botón principal al pasar el mouse). `--shadow-glow` ahora es un alias de `--shadow-soft`.

## 6. Botones
- **Principal:** relleno v-600, texto blanco, forma píldora, hover v-700 + `--shadow-brand`. Texto: "Solicitar demo" (en todo el sitio).
- **Secundario:** fondo transparente, borde `rgba(255,255,255,0.15)`, texto blanco; en secciones claras fondo blanco y borde n-200. Texto: "Escribinos" / acción concreta.
- Un solo botón principal por bloque.

## 7. Secciones claras
Dos clases equivalentes: `h2-light` (home) y `section-light` (global, en `global.css`): redefinen los tokens de texto, tarjeta y borde y pasan el texto destacado a v-700. Ritmo actual: home → rubros, trabajos, integraciones, planes y preguntas frecuentes (principio 3); soluciones → "Así lo resolvemos" y preguntas; servicios → "Lo que importa" (comparativa) y rubros; precios → comparativa y preguntas; nosotros → comparativa de identidad; contacto → todo oscuro (formulario); servicios → rubros (tarjetas blancas con contorno violeta); soluciones → Preguntas frecuentes. Regla: una o dos secciones claras por página, nunca dos seguidas.

## 8. Logo
Isotipo (flecha) y punto de "kaptativa." en v-500 sólido, sin degradado. Archivos: `Header.astro`, `Footer.astro`, `public/logo.svg`, `public/favicon.svg`, `public/og-image.jpg` (1200×630).

Geometría de la flecha (en todos lados, misma escala de 40×40): curva `M 26 47 C 17 41 11 36 11 30 C 11 24 19 20 26 13` y punta `M 13.5 13 L 26 13 L 26 25.5`. La curva entra a 45° en la punta (igual que la flecha) y la cola termina alineada con la punta.
- Junto al texto: trazo 6,2 con `translate(-4 7.6) scale(0.69)` (se apoya en el peso de Lexend 600).
- Como ícono (favicon, íconos de app, isotipo 3D): trazo 7, ocupando ~70 % del alto de la pastilla (`translate(10.2 -2.5) scale(1.15)` en 64×64).
- Íconos PNG (`icon-192`, `icon-512`, `apple-touch-icon`) y `favicon.ico` (16/32/48) salen de `favicon.svg` (los PNG sin esquinas redondeadas). `og-image.jpg` sale de `docs/og-image.html` con captura de Chrome a 1200×630.

12. **Un bloque bento por página, no más.** En la home, los módulos van en grilla bento con dos tiles en violeta sólido (Sitio web y Asistente IA) como foco; el resto de las secciones mantiene tarjetas sobrias.
13. **Numerar solo secuencias.** "De la demo a tu negocio funcionando" lleva 1–4 porque es un proceso; ninguna otra grilla se numera.
14. **Planes: el recomendado en violeta sólido.** Sección oscura; el plan "Más elegido" es la única tarjeta rellena en violeta, sobresale 20 px por arriba y por abajo, con etiqueta y botón blancos. Los demás planes llevan tarjeta oscura y botón violeta. El precio es un bloque propio ("Precio a medida" + nota chica).
15. **Menú Soluciones como mega menú.** Panel de presentación a la izquierda y grilla de rubros con descripción de una línea a la derecha, centrado bajo el header.

16. **Contorno con brillo.** Las tarjetas de listado (rubros, contadores) llevan borde en degradado (claro arriba a la izquierda, violeta abajo a la derecha) y una línea de brillo centrada en el borde superior; al pasar el mouse el borde se enciende. Los contadores de servicios llevan además el ícono apoyado sobre el borde superior.
17. **Gráfico por tarjeta de rubro.** Cada tarjeta de la grilla de rubros de la home abre con una mini-interfaz oscura que ilustra qué resuelve la plataforma en ese rubro (pedido pagado, lista mayorista, comanda con QR, cuotas al día, turno reservado, propiedad publicada, padrón, respuesta automática), con el ícono del rubro como marca de agua en la esquina y animación de entrada al verse (`RubroVisual.astro`, observador en `app.js`). Referencia: la grilla de funciones de MasLeads, pero en HTML/CSS y no en imágenes. El proceso se cuenta en tres pasos, no cuatro.
18. **Trabajos como vitrina filtrable.** Panel claro con filtros por rubro, cuatro tarjetas por fila (captura en marco de navegador con el dominio, monograma, nombre y etiquetas) y la captura larga del sitio que se desplaza al pasar el mouse (en celular, sola y despacio). Referencia: la grilla de Coredevs, en nuestro sistema de tarjetas blancas. Solo capturas reales (Chrome headless), nunca maquetas; los enlaces salen sin referencia.

## 9. Puntaje por página (2026-10-12, cierre)
Escala 1–10 sobre estética y "capa genérica". Detalle y método en `2doCerebro/OUTPUTS/auditoria-kaptativa-web-2026-10-12.md`.

| Página | Antes | Ahora | Lo que falta para 10 |
|---|---|---|---|
| `/` | 8,5 | **9** | Logos de MODO/Andreani/ARCA/Tokko en SVG; cifras reales en planes |
| `/servicios/` | 6 | **8** | Más contenido propio en el hub (hoy 465 palabras) |
| `/servicios/*` | 6–6,5 | **8–8,5** | Casos reales con números; unificar escala tipográfica |
| `/soluciones/*` | 7–7,5 | **8,5–9** | Capturas reales del producto en lugar de maquetas |
| `/nosotros/` | 6,5 | **8** | Copy menos genérico en el hero; definir si "®" corresponde |
| `/contacto/` | 7,5 | **8,5** | Definir "®" |
| `/inmobiliarias/` | 5 | **7** | Reemplazar avatares de stock y el "Más de 30 inmobiliarias" por datos reales, o redirigir a `/soluciones/inmobiliarias/` |
| `/privacidad/`, `/terminos/` | 7 | **8** | — |
| **Sitio** | ≈7 | **≈8,5** | Trabajos reales, fotos propias y cifras verdaderas |

## 10. Deuda conocida
- `global.css` (~7.000 líneas, ~2.900 `!important`): capas de overrides acumuladas. Las reglas sin uso ya se eliminaron; ordenar el resto requiere reescritura con revisión visual.
- Escala tipográfica y pesos 700/800 sin normalizar.
- Las páginas de servicios conservan estilos propios (`src/styles/servicios.css` + bloque por página).
