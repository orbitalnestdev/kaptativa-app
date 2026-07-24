# Prompt — Sitio Web INMOBILIARIA SOCTEN (rediseño)

Construí el rediseño premium del sitio de **Inmobiliaria Socten** (La Rioja, Argentina), basado en su sitio actual (Google Sites) pero elevado a una estética moderna de alta gama. Todos los textos en **español rioplatense (voseo: "vos")**. Una sola página con secciones ancladas. Imágenes locales en `fotos/` (fotos reales extraídas de su sitio actual + fotos de apoyo).

## DATOS REALES DEL NEGOCIO (extraídos de su sitio actual)

- **Nombre:** Inmobiliaria Socten
- **Ubicación:** Mariano Moreno 234, La Rioja, Argentina — [mapa](https://maps.app.goo.gl/Gf7NpVeDFbJVTDza9)
- **Teléfono / WhatsApp:** 380 454 8961 (intl: +54 9 380 454 8961 → `wa.me/5493804548961`)
- **Instagram:** instagram.com/socten_inmobiliaria
- **Facebook:** facebook.com/socteninmobiliaira
- **Rubro principal:** ALQUILERES (departamentos, locales, tinglados) — confirmado por los carteles "Alquilo" en sus fotos

## STACK TÉCNICO

- **HTML5 semántico + CSS3 + JavaScript vanilla.** Sin frameworks.
- CSS con variables (`:root`), Flexbox y Grid. Responsive (desktop 1200 / tablet 900 / mobile 600).
- Google Fonts: **Playfair Display** (títulos serif) + **Inter** (cuerpo).
- Íconos SVG inline lineales.

## 1. ESTILO DE DISEÑO

Estética moderna y enérgica de inmobiliaria joven: hero oscuro atmosférico, secciones blancas limpias, acentos en el **naranja vibrante de la marca**, tipografía editorial serif, sombras sutiles, micro-animaciones premium (preloader, reveals, tilt 3D, botones magnéticos, parallax).

## 2. PALETA DE COLORES (variables CSS)

- `--oscuro: #1A1A1A` / `--negro: #121212` (fondos oscuros, texto)
- `--marca: #FF3D0A` (naranja de marca — acentos, badges, íconos, itálicas)
- `--marca-claro: #FF6B42` / `--marca-oscuro: #E03408`
- Gradiente marca (botones): `linear-gradient(135deg, #E03408, #FF6B42)`
- `--whatsapp: #25D366` (solo botón flotante y referencias de WhatsApp)
- `--blanco: #FFFFFF` / `--crema: #FAFAF8`
- `--gris: #8A8A8A` / `--gris-suave: #6B6B6B` / `--borde: #E8E4DC`
- **Contraste:** texto BLANCO sobre naranja (nunca texto oscuro).

## 3. TIPOGRAFÍA

- Títulos/logo: Playfair Display (H1 ~64px, H2 ~40px); una frase por titular en **itálica serif naranja**.
- Cuerpo/nav/botones: Inter; micro-etiquetas en mayúsculas con letter-spacing 2–3px color marca.

## 4. LAYOUT Y ESPACIADO

Contenedor 1200px; padding de sección 90–120px; grilla de propiedades 4→2→1 columnas; gaps 24–32px; border-radius 4–6px.

## 5. HEADER / NAVEGACIÓN

Fijo, transparente sobre el hero, oscuro con blur al scroll. Logo: casa line-art naranja + "SOCTEN / INMOBILIARIA". Links: INICIO · PROPIEDADES · SERVICIOS · NOSOTROS · CONTACTO. CTA píldora naranja **"PUBLICÁ TU PROPIEDAD"** → abre WhatsApp (`wa.me/5493804548961` con mensaje pre-cargado). Hamburguesa funcional en mobile.

## 6. SECCIONES

### 6.1 HERO
100vh, fondo `fotos/01-hero-casa-con-piscina.png` + overlay oscuro. H1: *"Encontrá el depto ideal con **atención personalizada**"*. Bajada: *"Te acompañamos en cada paso para que encuentres el lugar perfecto para vos en La Rioja."*
- **Buscador flotante** (tarjeta blanca): OPERACIÓN: *Alquiler/Venta* · TIPO: *Departamento/Local/Tinglado/Casa* · UBICACIÓN: *La Rioja, Argentina* + botón negro "BUSCAR PROPIEDADES".
- **Stats:** **+150 PROPIEDADES · +300 CLIENTES FELICES · +5 AÑOS DE EXPERIENCIA · 100% COMPROMISO** (contadores animados).

### 6.2 PROPIEDADES DISPONIBLES
Eyebrow "PROPIEDADES DISPONIBLES", H2 *"Explorá las mejores **oportunidades**"*. Grilla de **8 tarjetas reales** extraídas de su sitio actual, **precios en pesos argentinos (alquiler mensual)**, badge naranja "DESTACADA" u oscuro "NUEVA":

| # | Propiedad | Imagen | Detalle | Precio | Badge |
|---|---|---|---|---|---|
| 1 | Departamento en Gaucho Rivero | `fotos/socten-gaucho-rivero.jpg` | 1 dorm · Cerca de UNLAR | $ 480.000/mes | DESTACADA |
| 2 | Departamento en Av. Perón 465 | `fotos/socten-peron465.png` | 2 dorm | $ 650.000/mes | NUEVA |
| 3 | Departamento en Dalmacio Vélez | `fotos/socten-dalmacio-velez.png` | 2 dorm · Vélez 1100 | $ 690.000/mes | DESTACADA |
| 4 | Departamento en Av. Rivadavia | `fotos/socten-rivadavia296.png` | 1 dorm · Rivadavia 296 | $ 520.000/mes | NUEVA |
| 5 | Monoambiente céntrico | `fotos/socten-jvgonzalez.png` | Joaquín V. González · Plaza 25 de Mayo | $ 380.000/mes | NUEVA |
| 6 | Monoambiente en Av. Perón | `fotos/socten-peron1062.png` | Perón 1062 | $ 420.000/mes | DESTACADA |
| 7 | Departamento en Tupa Amarú | `fotos/socten-tupa-amaru.png` | 1 dorm · Hospital Vera Barros | $ 450.000/mes | NUEVA |
| 8 | Local Comercial en Av. Rivadavia | `fotos/socten-local-rivadavia1100.png` | Rivadavia 1100 · Zona comercial | $ 1.500.000/mes | DESTACADA |

Botón outline **"VER MÁS PROPIEDADES →"** → WhatsApp.

### 6.3 ¿POR QUÉ ELEGIR SOCTEN?
Fondo crema, 3 tarjetas: **ATENCIÓN PERSONALIZADA / ASESORAMIENTO PROFESIONAL / TRANSPARENCIA Y CONFIANZA** (íconos en círculo naranja).

### 6.4 NOSOTROS
2 columnas: `fotos/10-oficina-moderna.png` con botón play naranja pulsante. Texto: *"Más que una inmobiliaria, **somos tu aliado**."* + stats (+5 AÑOS · +300 CLIENTES) + botón "CONOCER MÁS".

### 6.5 CONTACTO
Fondo oscuro, 2 columnas. Info: **380 454 8961** (tel) · **WhatsApp directo** (wa.me) · **Mariano Moreno 234, La Rioja** (link al mapa) · sociales reales (IG/FB/WhatsApp). Formulario oscuro con validación JS (nombre, email, teléfono, motivo, consulta) + botón naranja "ENVIAR CONSULTA →".

### 6.6 FOOTER
4 columnas: logo + tagline · NAVEGACIÓN · SERVICIOS (Alquileres, Ventas, Administración, Tasaciones) · NEWSLETTER. Barra inferior: "© {año} Inmobiliaria Socten" | "La Rioja, Argentina".

### 6.7 BOTÓN FLOTANTE DE WHATSAPP (siempre visible)
Círculo verde `#25D366` fijo abajo-derecha con ícono WhatsApp blanco, anillo pulsante y tooltip "Escribinos por WhatsApp". Link: `wa.me/5493804548961` con texto pre-cargado. El botón "volver arriba" se apila encima de él.

## 7. INTERACCIONES Y RESPONSIVE

Preloader con logo · hero con Ken Burns + parallax + título revelado por líneas · contadores animados (formato es-AR) · reveals escalonados con IntersectionObserver (+ red de seguridad) · tilt 3D en tarjetas · botones magnéticos con barrido de brillo · navbar con blur al scroll · menú mobile fullscreen · validación de formularios con shake · fallback `no-js` · `prefers-reduced-motion` respetado.
