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
