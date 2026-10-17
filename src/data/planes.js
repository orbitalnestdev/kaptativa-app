// Planes de la plataforma: los usan la home (sección Planes) y la página /precios/.
// Un ítem de features puede ser texto o { text, nuevo: true } para mostrarlo con la etiqueta "Nuevo".
export const planes = [
  { name: 'Presencia', etapa: 'Para empezar a estar online', cta: 'Cotizar mi sitio', desc: 'Para emprendedores y profesionales que necesitan una web seria.', features: ['Sitio institucional autoadministrable', { text: 'Agente de WhatsApp que atiende solo', nuevo: true }, 'Hasta 5 secciones', 'Formulario y botón de WhatsApp', 'SEO inicial y Google Analytics', 'Hosting y dominio gestionados'] },
  { name: 'E-commerce', etapa: 'Para vender todos los días', cta: 'Cotizar mi e-commerce', desc: 'Todo para vender online y administrar cada pedido.', popular: true, features: ['Todo lo del plan Presencia', { text: 'Agente de WhatsApp que atiende solo', nuevo: true }, 'Catálogo ilimitado con variantes', 'Cobros con MercadoPago', 'Cálculo de envíos', 'Panel de pedidos, stock y cupones'] },
  { name: 'Corporativo', etapa: 'Para ordenar y escalar la operación', cta: 'Contar mi proyecto', desc: 'Para empresas con procesos propios que hay que digitalizar.', features: ['Todo lo del plan E-commerce', { text: 'Agente de WhatsApp que atiende solo', nuevo: true }, 'Módulos y flujos a medida', 'Integraciones vía API', 'Automatizaciones e IA', 'Soporte prioritario e infraestructura dedicada'] },
];

// Qué incluye cada plan (Presencia, E-commerce, Corporativo). true = incluido, false = no, texto = detalle; nuevo = etiqueta "Nuevo".
export const comparativa = [
  { item: 'Sitio institucional autoadministrable', planes: [true, true, true] },
  { item: 'Secciones', planes: ['Hasta 5', 'Ilimitadas', 'Ilimitadas'] },
  { item: 'Formulario y botón de WhatsApp', planes: [true, true, true] },
  { item: 'Agente de WhatsApp que atiende solo', nuevo: true, planes: [true, true, true] },
  { item: 'SEO inicial y Google Analytics', planes: [true, true, true] },
  { item: 'Hosting y dominio gestionados', planes: [true, true, true] },
  { item: 'Capacitación de uso del panel', planes: [true, true, true] },
  { item: 'Catálogo con variantes', planes: [false, true, true] },
  { item: 'Cobros con MercadoPago', planes: [false, true, true] },
  { item: 'Cálculo de envíos', planes: [false, true, true] },
  { item: 'Panel de pedidos, stock y cupones', planes: [false, true, true] },
  { item: 'Módulos y flujos a medida', planes: [false, false, true] },
  { item: 'Integraciones vía API', planes: [false, false, true] },
  { item: 'Automatizaciones e IA', planes: [false, false, true] },
  { item: 'Soporte prioritario e infraestructura dedicada', planes: [false, false, true] },
];

export const faqsPrecios = [
  { question: '¿Por qué no hay precios publicados?', answer: 'Porque cada proyecto combina módulos, integraciones y plazos distintos. Después de la demo te pasamos una cotización cerrada en 24 hs hábiles, con el detalle de qué incluye cada etapa.' },
  { question: '¿Puedo empezar con Presencia y pasar a E-commerce más adelante?', answer: 'Sí. Los planes son acumulativos: E-commerce incluye todo lo de Presencia y Corporativo incluye todo lo de E-commerce. Se activan módulos sobre la misma plataforma, sin rehacer el sitio.' },
  { question: '¿Qué incluye la cotización?', answer: 'Diseño, desarrollo, carga inicial de contenidos, capacitación de uso del panel y puesta en marcha. Hosting y dominio gestionados están contemplados en todos los planes.' },
  { question: '¿Cuánto tarda en estar online?', answer: 'Depende del plan y de los módulos. La propuesta incluye un cronograma por etapas: primero lo que vende (sitio, tienda o WhatsApp) y después la gestión.' },
  { question: '¿Cómo pido la cotización?', answer: 'Solicitá una demo por WhatsApp o escribinos desde contacto con el plan que te interesa. Coordinamos una videollamada de 30 minutos y te enviamos la propuesta.' },
];

// Extras: servicios por suscripción que se activan sobre cualquier plan y se cobran según el uso.
// big = tile doble con mini-interfaz (FeatureVisual por ícono); solid = tile en violeta.
export const extras = [
  { key: 'asistente', icon: 'bot', title: 'Asistente con IA', big: true, solid: true, niveles: ['Responde', 'Vende', 'Opera'], desc: 'Atiende tu sitio y tu WhatsApp las 24 horas con la información real de tu negocio: responde, toma los datos de quien consulta y deriva a tu equipo con un resumen.', detalle: 'En el nivel Opera también consulta pedidos y turnos reales.' },
  { key: 'contenido', icon: 'edit', title: 'Contenido con IA', desc: 'Textos e imágenes desde el mismo panel, con el tono de tu marca.', detalle: 'Descripciones de producto, novedades, banners y mejora de fotos.' },
  { key: 'correo', icon: 'message', title: 'Correo con tu dominio', desc: 'Casillas profesionales del tipo vos@tunegocio.com.ar, administradas por nosotros.', detalle: 'Alta, migración y soporte incluidos. Packs según el equipo.' },
  { key: 'facturacion', icon: 'receipt', title: 'Facturación electrónica', desc: 'Comprobantes válidos ante ARCA desde cada venta, sin salir del panel.', detalle: 'Factura A, B y C, notas de crédito y envío al cliente.' },
  { key: 'mantenimiento', icon: 'shield', title: 'Mantenimiento y evolución', desc: 'Tu plataforma al día y con horas para seguir mejorándola.', detalle: 'Monitoreo, copias de seguridad, actualizaciones y packs de horas.' },
  { key: 'campanas', icon: 'megaphone', title: 'Campañas de email y WhatsApp', big: true, desc: 'Novedades, promociones y avisos a tu base de clientes desde el mismo sistema, con métricas de apertura y clics.', detalle: 'Se cobra por tramos según cuánto envíes.' },
];
