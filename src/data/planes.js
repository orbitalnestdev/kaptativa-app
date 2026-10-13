// Planes de la plataforma: los usan la home (sección Planes) y la página /precios/.
export const planes = [
  { name: 'Presencia', cta: 'Cotizar mi sitio', desc: 'Para emprendedores y profesionales que necesitan una web seria.', features: ['Sitio institucional autoadministrable', 'Hasta 5 secciones', 'Formulario y botón de WhatsApp', 'SEO inicial y Google Analytics', 'Hosting y dominio gestionados'] },
  { name: 'Tienda', cta: 'Cotizar mi tienda', desc: 'Todo para vender online y administrar cada pedido.', popular: true, features: ['Todo lo del plan Presencia', 'Catálogo ilimitado con variantes', 'Cobros con MercadoPago', 'Cálculo de envíos', 'Panel de pedidos, stock y cupones'] },
  { name: 'A medida', cta: 'Contar mi proyecto', desc: 'Para empresas con procesos propios que hay que digitalizar.', features: ['Todo lo del plan Tienda', 'Módulos y flujos a medida', 'Integraciones vía API', 'Automatizaciones e IA', 'Soporte prioritario e infraestructura dedicada'] },
];

// Qué incluye cada plan (Presencia, Tienda, A medida). true = incluido, false = no, texto = detalle.
export const comparativa = [
  { item: 'Sitio institucional autoadministrable', planes: [true, true, true] },
  { item: 'Secciones', planes: ['Hasta 5', 'Ilimitadas', 'Ilimitadas'] },
  { item: 'Formulario y botón de WhatsApp', planes: [true, true, true] },
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
  { question: '¿Puedo empezar con Presencia y pasar a Tienda más adelante?', answer: 'Sí. Los planes son acumulativos: Tienda incluye todo lo de Presencia y A medida incluye todo lo de Tienda. Se activan módulos sobre la misma plataforma, sin rehacer el sitio.' },
  { question: '¿Qué incluye la cotización?', answer: 'Diseño, desarrollo, carga inicial de contenidos, capacitación de uso del panel y puesta en marcha. Hosting y dominio gestionados están contemplados en todos los planes.' },
  { question: '¿Cuánto tarda en estar online?', answer: 'Depende del plan y de los módulos. La propuesta incluye un cronograma por etapas: primero lo que vende (sitio, tienda o WhatsApp) y después la gestión.' },
  { question: '¿Cómo pido la cotización?', answer: 'Solicitá una demo por WhatsApp o escribinos desde contacto con el plan que te interesa. Coordinamos una videollamada de 30 minutos y te enviamos la propuesta.' },
];

// Extras: servicios por suscripción que se activan sobre cualquier plan y se cobran según el uso.
export const extras = [
  { key: 'asistente', icon: 'bot', title: 'Asistente con IA', niveles: ['Responde', 'Vende', 'Opera'], desc: 'Atiende tu sitio y tu WhatsApp las 24 horas, entrenado con la información real de tu negocio.', features: ['Responde con tus productos, precios y horarios', 'Guarda los datos de quien consulta en tu panel', 'Deriva a tu equipo con un resumen de la charla', 'En el nivel Opera consulta pedidos y turnos reales'] },
  { key: 'contenido', icon: 'edit', title: 'Contenido con IA', desc: 'Textos e imágenes generados desde el mismo panel, con el tono de tu marca.', features: ['Descripciones de producto y novedades en un clic', 'Mejora y variantes de fotos de producto', 'Banners y piezas para redes sin salir del panel'] },
  { key: 'correo', icon: 'message', title: 'Correo con tu dominio', desc: 'Casillas profesionales del tipo vos@tunegocio.com.ar, administradas por nosotros.', features: ['Casillas con tu dominio propio', 'Alta, migración y soporte incluidos', 'Packs según el tamaño del equipo'] },
  { key: 'campanas', icon: 'megaphone', title: 'Campañas de email y WhatsApp', desc: 'Novedades, promociones y avisos a tu base de clientes desde el mismo sistema.', features: ['Newsletters y campañas segmentadas', 'Métricas de apertura y clics', 'Se cobra por tramos según cuánto envíes'] },
  { key: 'facturacion', icon: 'receipt', title: 'Facturación electrónica', desc: 'Comprobantes válidos ante ARCA emitidos desde cada venta, sin salir del panel.', features: ['Factura A, B y C y notas de crédito', 'Punto de venta y numeración automática', 'Comprobante enviado al cliente por email o WhatsApp'] },
  { key: 'mantenimiento', icon: 'shield', title: 'Mantenimiento y evolución', desc: 'Tu plataforma al día y con horas para seguir mejorándola.', features: ['Monitoreo, copias de seguridad y actualizaciones', 'Soporte con tiempos de respuesta acordados', 'Packs de horas para funciones nuevas'] },
];
