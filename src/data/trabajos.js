// Trabajos reales para la sección "Trabajos" de la home. Vacío = la sección no se muestra.
// Cada ítem: { nombre, categoria, rubro, url, imagen: '/trabajos/<slug>.webp', resultado: 'una línea con lo entregado' }
// categoria: clave de `categorias` (filtros). La captura larga para el recorrido al pasar el mouse es '/trabajos/<slug>-full.webp'.
// Capturas: Chrome headless a 1440×900, recortadas a 1200×750 (16:10) en WebP. Sin maquetas ni fotos de stock.
export const trabajos = [
  {
    nombre: 'Tiendapi',
    categoria: 'software',
    rubro: 'Software · Tiendas con IA',
    url: 'https://tiendapi.com/',
    imagen: '/trabajos/tiendapi.webp',
    resultado: 'Creador de tiendas online con punto de venta, stock único y una IA que vende por WhatsApp.',
  },
  {
    nombre: 'INMOActiva',
    categoria: 'software',
    rubro: 'Software · CRM inmobiliario',
    url: 'https://inmoactiva.com/',
    imagen: '/trabajos/inmoactiva.webp',
    resultado: 'CRM y sitio web para inmobiliarias: propiedades, consultas, alquileres y reservas en un solo panel, con demo agendable.',
  },
  {
    nombre: 'El almacén de las mil cosas',
    categoria: 'tiendas',
    rubro: 'Tienda online · La Rioja',
    url: 'https://almacenmil.mitiendapi.com/',
    imagen: '/trabajos/almacen-mil.webp',
    resultado: 'Tienda online de aromas, cosmética, accesorios y regalos con catálogo por categorías, carrito, medios de pago y envíos.',
  },
  {
    nombre: 'Airlar',
    categoria: 'servicios',
    rubro: 'Servicio técnico · La Rioja',
    url: 'https://airlar.com.ar/',
    imagen: '/trabajos/airlar.webp',
    resultado: 'Sitio de servicio técnico de aires acondicionados con reserva de visitas, servicios, preguntas frecuentes y blog.',
  },
  {
    nombre: 'UrbanPoint',
    categoria: 'tiendas',
    rubro: 'Tienda online · Retiro de cercanía',
    url: 'https://urbanpoints.com.ar/',
    imagen: '/trabajos/urban-points.webp',
    resultado: 'Tienda minorista con catálogo, cuenta de cliente, puntos de retiro por barrio y programa de revendedores con comisiones.',
  },
  {
    nombre: 'MUV Propiedades',
    categoria: 'inmobiliarias',
    rubro: 'Inmobiliaria boutique · Buenos Aires',
    url: 'https://muvpropiedades.com/',
    imagen: '/trabajos/muv-propiedades.webp',
    resultado: 'Buscador de propiedades por operación, barrio y tipo, emprendimientos premium, tasaciones y reseñas de Google integradas.',
  },
  {
    nombre: 'MS Estudio Inmobiliario',
    categoria: 'inmobiliarias',
    rubro: 'Inmobiliaria · Buenos Aires',
    url: 'https://msestudioinmobiliario.com.ar/',
    imagen: '/trabajos/ms-estudio-inmobiliario.webp',
    resultado: 'Sitio institucional con catálogo de propiedades en venta y alquiler, desarrollos propios y contacto directo por WhatsApp.',
  },
  {
    nombre: 'Anchus',
    categoria: 'tiendas',
    rubro: 'Indumentaria infantil',
    url: 'https://anchus.com.ar/',
    imagen: '/trabajos/anchus.webp',
    resultado: 'Marca de indumentaria infantil con lookbook, locales, catálogo mayorista con acceso para clientes y tienda minorista.',
  },
  {
    nombre: 'AoMatcha',
    categoria: 'tiendas',
    rubro: 'Tienda online',
    url: 'https://aomatcha.co/',
    imagen: '/trabajos/aomatcha.webp',
    resultado: 'Tienda online de matcha de origen japonés con pagos por Mercado Pago, reseñas y contenido sobre el producto.',
  },
  {
    nombre: 'Bodega Iaccarini',
    categoria: 'institucional',
    rubro: 'Bodega · Mendoza',
    url: 'https://bodegaiaccarini.com.ar/',
    imagen: '/trabajos/bodega-iaccarini.webp',
    resultado: 'Sitio de bodega con experiencias, hospedaje, winebar, eventos, tienda online y mayorista, y fichas técnicas.',
  },
  {
    nombre: 'Cata Argentina',
    categoria: 'institucional',
    rubro: 'Electrodomésticos',
    url: 'https://cata-argentina.com/',
    imagen: '/trabajos/cata-argentina.webp',
    resultado: 'Sitio corporativo de la marca de electrodomésticos con catálogo online y en PDF, productos y servicio técnico.',
  },
];

// Filtros de la sección (orden de aparición)
export const categorias = [
  { key: 'inmobiliarias', label: 'Inmobiliarias' },
  { key: 'tiendas', label: 'Tiendas online' },
  { key: 'servicios', label: 'Servicios' },
  { key: 'software', label: 'Software' },
  { key: 'institucional', label: 'Institucional' },
];
