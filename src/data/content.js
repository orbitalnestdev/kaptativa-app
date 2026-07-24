export const faqsData = [
  {
    question: "¿Necesito tener conocimientos técnicos previos?",
    answer: "No, en absoluto. En Kaptativa nos encargamos de todo el proceso técnico: desde la configuración del hosting y dominio hasta la programación de integraciones y el entrenamiento de los agentes de IA. Además, al finalizar el proyecto, te brindamos una videoguía simple y personalizada para que vos o tu equipo puedan gestionar textos e información básica sin depender de nosotros."
  },
  {
    question: "¿Pueden automatizar los flujos de mi WhatsApp actual?",
    answer: "Sí, integramos herramientas que se conectan de forma oficial con la API de WhatsApp Business. Esto nos permite diseñar flujos de respuesta automáticos, derivar conversaciones por departamentos (ventas, soporte) y guardar toda la información estructurada que envíe el usuario en una base de datos centralizada."
  },
  {
    question: "¿Desarrollan tiendas online con pasarelas de pago (E-commerce)?",
    answer: "Sí. Desarrollamos tiendas web profesionales con un catálogo ordenado de productos, integraciones de pago automáticas (como Mercado Pago, Stripe o tarjetas de crédito) y conexiones directas con sistemas de logística para calcular costos de envío en tiempo real y emitir etiquetas automáticas de despacho."
  },
  {
    question: "¿La página web queda optimizada para aparecer en Google y en buscadores de Inteligencia Artificial?",
    answer: "Sí, optimizamos tu sitio desde la base tanto para SEO tradicional (motores como Google) como para GEO (buscadores con IA como ChatGPT, Perplexity y Gemini). Esto incluye velocidad de carga ultra rápida, etiquetas semánticas y la estructura técnica necesaria para que tu negocio sea recomendado por las inteligencias artificiales."
  },
  {
    question: "¿Puedo actualizar y agregar contenido a mi sitio después?",
    answer: "Totalmente. Diseñamos las estructuras de forma modular para que sea simple editarlas. Podrás cargar nuevos proyectos, modificar precios, cambiar descripciones de servicios o subir artículos de blog a través de un panel autogestionable muy intuitivo sin necesidad de tocar código de programación."
  },
  {
    question: "¿Qué necesito tener listo para empezar a trabajar con Kaptativa?",
    answer: "No necesitás nada estructurado. Solo agendar la asesoría inicial. Durante esa charla, te guiaremos con preguntas sencillas sobre tu modelo comercial y necesidades de tu negocio. Si ya tenés material gráfico (logos, paleta de colores) u hojas informativas, nos servirá como base, pero de lo contrario, nosotros te ayudamos a construirlo."
  },
  {
    question: "¿Trabajan con comercios pequeños o solo con grandes empresas?",
    answer: "Trabajamos con negocios de todos los tamaños. Entendemos que un comercio local o un profesional independiente no requiere la misma estructura de software que una multinacional. Diseñamos soluciones escalables: podés empezar con una landing de conversión básica e ir sumando integraciones y módulos de IA a medida que tu negocio crezca."
  },
  {
    question: "¿La Inteligencia Artificial va a reemplazar por completo a mis empleados?",
    answer: "No, la IA actúa como un asistente inicial estratégico. Se encarga de contestar dudas básicas 24/7 y precalificar a los clientes mediante preguntas estructuradas. Una vez que el prospecto está listo para comprar o necesita una cotización personalizada de alta complejidad, el bot deriva la conversación de forma transparente a un miembro humano de tu equipo con todo el historial de la conversación listo."
  }
];

export const casesData = [
  {
    category: "web",
    image: "/project_b2b.png",
    alt: "Plataforma Corporativa B2B de Servicios",
    tag: "Web & SEO",
    industry: "Servicios B2B",
    title: "Plataforma Corporativa de Servicios B2B",
    problem: "Consultora financiera perdiendo prospectos cualificados por una web desactualizada sin formularios estructurados.",
    solution: "Plataforma web ultra rápida con arquitectura SEO, calculadora de retorno y cotizador interactivo.",
    result: "+40% de agendas calificadas y reducción del 60% en ciclo de prospección.",
    details: [
      { label: "Plazo", value: "3 Semanas" },
      { label: "Conversión", value: "+18%" }
    ],
    stack: ["Astro", "Tailwind", "SEO Local", "Node.js"]
  },
  {
    category: "web",
    image: "/project_b2b.png",
    alt: "Portal Inmobiliario Web + CRM Integrado",
    tag: "Web & SEO",
    industry: "Inmobiliaria",
    title: "Portal Inmobiliario Web + Sincronización CRM",
    problem: "Catálogo desactualizado entre portales inmobiliarios y pérdida de leads por demoras en respuesta.",
    solution: "Portal web de alta velocidad con buscador multivariable y sincronización automática vía API Tokko.",
    result: "+120% en consultas directas y actualización de catálogo en tiempo real.",
    details: [
      { label: "Plazo", value: "4 Semanas" },
      { label: "Consultas", value: "+120%" }
    ],
    stack: ["Tokko API", "Next.js", "React", "WhatsApp"]
  },
  {
    category: "auto",
    image: "/project_ecommerce.png",
    alt: "E-commerce Minorista Automatizado",
    tag: "Automatizaciones",
    industry: "E-commerce",
    title: "E-commerce & Logística Automatizada",
    problem: "Ventas manuales coordinando pagos y envíos uno por uno vía chats de Instagram.",
    solution: "Tienda web con pasarela de pago integrada y emisión automática de etiquetas de despacho postal.",
    result: "Facturación procesada 100% de forma autónoma. Ahorro de 15 hs/semana.",
    details: [
      { label: "Operación", value: "Autónoma" },
      { label: "Ahorro", value: "15 hs/sem" }
    ],
    stack: ["WooCommerce", "MercadoPago", "Webhooks", "Make"]
  },
  {
    category: "ia",
    image: "/project_chatbot.png",
    alt: "Asistente Conversacional Inteligente",
    tag: "Agentes IA",
    industry: "Salud & Clínicas",
    title: "Asistente IA para Clínicas y Consultorios",
    problem: "Línea telefónica colapsada y chats perdiendo turnos por demoras fuera del horario comercial.",
    solution: "Agente de WhatsApp con IA entrenado para responder cobertura médica y agendar citas 24/7.",
    result: "Respuestas inmediatas 24/7 y reducción del 55% en llamadas administrativas.",
    details: [
      { label: "Atención", value: "24/7 Real-time" },
      { label: "Llamadas", value: "-55%" }
    ],
    stack: ["OpenAI GPT-4o", "WhatsApp API", "Node.js", "Python"]
  },
  {
    category: "auto",
    image: "/project_ecommerce.png",
    alt: "Sistema de Lead Scoring & Notificaciones",
    tag: "Automatizaciones",
    industry: "Software B2B",
    title: "Lead Scoring & Router Comercial Automatizado",
    problem: "Prospectos calificados esperando horas para ser atendidos por el equipo comercial.",
    solution: "Sistema de scoring automático que evalúa el perfil del lead y notifica a ventas vía Slack/WhatsApp.",
    result: "Tiempo de primera respuesta reducido de 4 horas a 90 segundos.",
    details: [
      { label: "Respuesta", value: "< 90 seg" },
      { label: "Cierres", value: "+25%" }
    ],
    stack: ["n8n", "Appwrite", "Slack API", "Webhooks"]
  },
  {
    category: "ia",
    image: "/project_chatbot.png",
    alt: "Agente IA Inmobiliario",
    tag: "Agentes IA",
    industry: "Desarrollos Inmobiliarios",
    title: "Agente IA Cualificador de Inversores",
    problem: "Incapacidad de responder consultas nocturnas de inversores internacionales en lanzamientos.",
    solution: "Bot IA multilingüe en WhatsApp que envía brochures, simula cuotas y califica inversores.",
    result: "35 captaciones de inversores cualificados por mes sin intervención humana previa.",
    details: [
      { label: "Leads VIP", value: "+35/mes" },
      { label: "Idiomas", value: "Español / Inglés" }
    ],
    stack: ["LangChain", "OpenAI", "WhatsApp Business", "CRM"]
  }
];

export const servicesData = [
  {
    category: "web",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "Diseño Web Profesional",
    description: "Desarrollamos sitios corporativos, landing pages de captación de leads y tiendas virtuales rápidas, intuitivas y optimizadas para móviles, enfocadas en generar confianza en tu marca.",
    features: [
      "Estructura optimizada para conversión de leads",
      "Diseño 100% responsivo y rápido",
      "Arquitectura SEO inicial para Google"
    ]
  },
  {
    category: "auto",
    iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5",
    title: "Automatización: Tu equipo trabajando en piloto automático",
    description: "Conectamos las herramientas que ya usás diariamente. Creamos flujos automatizados para que las consultas de tus formularios viajen directo a planillas de Excel, WhatsApp, correos o CRMs.",
    features: [
      "Respuestas e emails automatizados inmediatos",
      "Sincronización de consultas en tiempo real",
      "Sistemas de reservas y agendamiento sin intermediarios"
    ]
  },
  {
    category: "ia",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Asistentes IA que venden por vos 24/7",
    description: "Integramos asistentes de IA y chatbots conversacionales entrenados con los datos específicos de tu negocio. Califican prospectos, responden dudas técnicas frecuentes y agendan llamadas comerciales.",
    features: [
      "Chatbots de WhatsApp entrenados con tus PDFs",
      "Soporte automatizado 24/7 sin perder el tono humano",
      "Clasificación de llamadas de venta por interés"
    ]
  },
  {
    category: "opt",
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z",
    title: "Optimización Digital",
    description: "Auditoría y mejora técnica sobre sitios web existentes. Aceleramos la velocidad de carga de tus páginas, optimizamos la navegación UX/UI y mejoramos el SEO para que aparezcas más arriba en Google.",
    features: [
      "Auditoría de velocidad y optimización técnica",
      "Mejora de redacción comercial y UX Writing",
      "Correcciones SEO estructuradas en el backend"
    ]
  }
];
