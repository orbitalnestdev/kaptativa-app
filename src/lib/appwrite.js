import { Client, Databases, Account, ID, Query } from 'appwrite';
import scrapedProspects from '../../scraped_prospects.json';

// 1. Check if Appwrite variables are configured in environment
const ENDPOINT = import.meta.env.PUBLIC_APPWRITE_ENDPOINT || '';
const PROJECT_ID = import.meta.env.PUBLIC_APPWRITE_PROJECT_ID || '';
const DATABASE_ID = import.meta.env.PUBLIC_APPWRITE_DATABASE_ID || 'kaptativa_db';

const isConfigured = ENDPOINT !== '' && PROJECT_ID !== '';

let client = null;
let databases = null;
let account = null;

if (isConfigured) {
  client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  
  // Server-side secret key support for background operations (like Webhooks)
  const SERVER_API_KEY = import.meta.env.APPWRITE_API_KEY || '';
  if (SERVER_API_KEY) {
    client.setKey(SERVER_API_KEY);
  }
  
  databases = new Databases(client);
  account = new Account(client);
}

// 2. Mock LocalStorage DB for offline/local development fallback
class MockDB {
  constructor() {
    this.initMockData();
  }

  initMockData() {
    // Legacy storage format checks (must be valid JSON arrays)
    try {
      const oldChats = localStorage.getItem('mock_whatsapp_chats');
      if (oldChats && !Array.isArray(JSON.parse(oldChats))) {
        localStorage.removeItem('mock_whatsapp_chats');
      }
    } catch (e) {
      localStorage.removeItem('mock_whatsapp_chats');
    }

    try {
      const oldMsgs = localStorage.getItem('mock_whatsapp_messages');
      if (oldMsgs && !Array.isArray(JSON.parse(oldMsgs))) {
        localStorage.removeItem('mock_whatsapp_messages');
      }
    } catch (e) {
      localStorage.removeItem('mock_whatsapp_messages');
    }

    try {
      const oldSettings = localStorage.getItem('mock_whatsapp_settings');
      if (oldSettings) {
        const parsed = JSON.parse(oldSettings);
        const settingsObj = Array.isArray(parsed) ? parsed[0] : parsed;
        if (settingsObj && (settingsObj.bot_prompt?.includes('enlace de reservas') || settingsObj.knowledge_base?.includes('enlace de reservas') || !settingsObj.google_calendar_url || settingsObj.google_calendar_url.includes('holiday') || settingsObj.google_calendar_url.includes('qaDnUXk'))) {
          localStorage.removeItem('mock_whatsapp_settings');
        }
      }
    } catch (e) {
      localStorage.removeItem('mock_whatsapp_settings');
    }

    if (!localStorage.getItem('mock_leads')) {
      localStorage.setItem('mock_leads', JSON.stringify([
        {
          $id: 'lead-test-inmo',
          name: 'Roberto Lepore',
          business: 'Lepore Propiedades',
          whatsapp: '+5491154321098',
          email: 'rlepore@leporeprop.com.ar',
          message: 'Puesto: Director Comercial / Ventas\nSitio Web: https://leporepropiedades.com.ar\nServicios de interés: Web & E-commerce, Agentes IA\n\nDesafío: Buscamos unificar nuestro catálogo inmobiliario con Tokko Broker y WhatsApp con IA.',
          status: 'nuevo',
          notes: 'Solicitud directa de sistema inmobiliario integral.',
          tags: 'Landing Inmobiliarias',
          score: 95,
          recommendations: 'Implementar portal inmobiliario web + sincronización con Tokko Broker API y bot de calificación en WhatsApp.',
          created_at: new Date().toISOString()
        },
        {
          $id: 'lead-test-home',
          name: 'Mariano Rossi',
          business: 'Estudio Rossi & Asoc.',
          whatsapp: '+5491145678901',
          email: 'marianorossi@estudiorossi.com',
          message: 'Puesto: Fundador / CEO / Socio\nSitio Web: https://estudiorossi.com\nServicios de interés: Paid Media, Software\n\nDesafío: Buscamos automatizar la captura de clientes corporativos y optimizar pautas en Meta Ads.',
          status: 'nuevo',
          notes: 'Lead generado desde el formulario unificado de la Home.',
          tags: 'Contacto Home',
          score: 80,
          recommendations: 'Configurar campaña de pauta corporativa e integrar cotizador web automático.',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          $id: 'lead-test-nosotros',
          name: 'Lucía Fernández',
          business: 'Clínica Fernández Salud',
          whatsapp: '+5493804561234',
          email: 'lfernandez@fernandezsalud.com',
          message: 'Puesto: Gerente de Marketing\nSitio Web: https://fernandezsalud.com\nServicios de interés: Agentes IA, Automatización\n\nDesafío: Queremos implementar un bot de WhatsApp para gestionar citas médicas y consultas frecuentes 24/7.',
          status: 'contactado',
          notes: 'Consulta recibida desde la página Nosotros. Requiere demo de bot médico.',
          tags: 'Contacto Nosotros',
          score: 85,
          recommendations: 'Desplegar Agente de IA para WhatsApp entrenado con coberturas médicas y agendamiento de turnos.',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          $id: 'lead-test-proyectos',
          name: 'Federico Gutierrez',
          business: 'Logística Express SRL',
          whatsapp: '+5491132109876',
          email: 'fgutierrez@logisticaexpress.com',
          message: 'Puesto: Operaciones / Administración\nSitio Web: https://logisticaexpress.com\nServicios de interés: Software, Web & E-commerce\n\nDesafío: Necesitamos un portal de seguimiento de envíos con cotizador automático y conexión API.',
          status: 'nuevo',
          notes: 'Interesado en desarrollo de software logístico a medida.',
          tags: 'Contacto Proyectos',
          score: 75,
          recommendations: 'Diseñar arquitectura web con panel de seguimiento de guías y calculadora de tarifas.',
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          $id: 'lead-test-contacto',
          name: 'Gonzalo Peralta',
          business: 'Distribuidora Norte',
          whatsapp: '+5493804987654',
          email: 'gperalta@distribuidoranorte.com',
          message: 'Puesto: Director Comercial / Ventas\nSitio Web: https://distribuidoranorte.com\nServicios de interés: SEO & GEO, Consultoría\n\nDesafío: Requerimos posicionamiento GEO en buscadores de IA y estrategia comercial 360.',
          status: 'calificado',
          notes: 'Evaluando paquete de SEO tradicional y GEO para motores con IA.',
          tags: 'Contacto Directo',
          score: 90,
          recommendations: 'Optimización de esquemas semánticos, velocidad y presencia en ChatGPT/Perplexity.',
          created_at: new Date(Date.now() - 14400000).toISOString()
        },
        {
          $id: 'lead-test-ia',
          name: 'Dra. Valentina Ortiz',
          business: 'Centro Médico Estético Ortiz',
          whatsapp: '+5491167890123',
          email: 'vortiz@centroortiz.com',
          message: 'Puesto: Fundador / CEO / Socio\nServicios de interés: Agentes IA\n\nDesafío: Necesitamos un asistente inteligente que confirme turnos y responda dudas sobre tratamientos.',
          status: 'propuesta_enviada',
          notes: 'Enviada cotización de Agente de IA comercial.',
          tags: 'Servicios Agentes IA',
          score: 88,
          recommendations: 'Configurar bot conversacional de WhatsApp con base de conocimientos de tratamientos.',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          $id: 'lead-test-auto',
          name: 'Hernán Benítez',
          business: 'Benítez & Cía. Seguros',
          whatsapp: '+5491178901234',
          email: 'hbenitez@benitezseguros.com',
          message: 'Puesto: Operaciones / Administración\nServicios de interés: Automatización\n\nDesafío: Queremos automatizar la emisión de pólizas y el recordatorio de vencimientos vía WhatsApp.',
          status: 'nuevo',
          notes: 'Consulta desde la landing de Automatización.',
          tags: 'Servicios Automatización',
          score: 70,
          recommendations: 'Implementar flujos n8n para enviar PDF de pólizas y recordatorios de pago.',
          created_at: new Date(Date.now() - 100000000).toISOString()
        },
        {
          $id: 'lead-test-software',
          name: 'Esteban Morales',
          business: 'Morales FinTech',
          whatsapp: '+5491189012345',
          email: 'emorales@moralesfintech.io',
          message: 'Puesto: Fundador / CEO / Socio\nServicios de interés: Software\n\nDesafío: Desarrollo de un dashboard corporativo con integración de APIs bancarias y métricas en vivo.',
          status: 'negociacion',
          notes: 'Reunión técnica realizada. En negociación de plazos.',
          tags: 'Servicios Software',
          score: 92,
          recommendations: 'Desarrollar frontend en React/Astro con panel analítico y autenticación segura.',
          created_at: new Date(Date.now() - 150000000).toISOString()
        },
        {
          $id: 'lead-test-web',
          name: 'Camila Sola',
          business: 'Sola Arquitectura',
          whatsapp: '+5491190123456',
          email: 'csola@solaarq.com',
          message: 'Puesto: Fundador / CEO / Socio\nServicios de interés: Web & E-commerce\n\nDesafío: Rediseño completo de portafolio web con estética minimalista premium y carga veloz.',
          status: 'cerrado_ganado',
          notes: 'Proyecto adjudicado. Firma de contrato efectuada.',
          tags: 'Servicios Diseño Web',
          score: 100,
          recommendations: 'Construcción de catálogo visual interactivo de obras y proyectos de arquitectura.',
          created_at: new Date(Date.now() - 200000000).toISOString()
        },
        {
          $id: 'lead-test-seo',
          name: 'Ignacio Castro',
          business: 'Castro Abogados',
          whatsapp: '+5491101234567',
          email: 'icastro@castroabogados.com',
          message: 'Puesto: Socio\nServicios de interés: SEO & GEO\n\nDesafío: Optimización para búsquedas en ChatGPT, Perplexity y Google Maps en el sector legal.',
          status: 'nuevo',
          notes: 'Lead interesado en visibilidad en IA.',
          tags: 'Servicios SEO & GEO',
          created_at: new Date(Date.now() - 250000000).toISOString()
        }
      ]));
    }

    try {
      const existingPosts = localStorage.getItem('mock_posts');
      if (existingPosts && JSON.parse(existingPosts).length < 6) {
        localStorage.removeItem('mock_posts');
      }
    } catch (e) {
      localStorage.removeItem('mock_posts');
    }

    if (!localStorage.getItem('mock_posts')) {
      localStorage.setItem('mock_posts', JSON.stringify([
        {
          $id: 'post-inmo-1',
          title: 'Cómo Digitalizar una Inmobiliaria en 2026: Catálogo Web, CRM y WhatsApp con IA',
          slug: 'como-digitalizar-inmobiliaria-catalogo-crm-whatsapp-ia',
          content: `El mercado inmobiliario ha cambiado drásticamente. Los compradores y locatarios ya no visitan oficinas físicas para consultar disponibilidad; buscan propiedades desde sus teléfonos móviles a cualquier hora del día y esperan respuestas inmediatas.

Si tu inmobiliaria todavía depende del envío manual de fichas por WhatsApp o de publicaciones aisladas que se pierden en el feed de Instagram, estás perdiendo más del **50% de tus oportunidades de venta**.

---

## 1. El Portal Web Inmobiliario: Tu Vitrina Digital 24/7

Un sitio web inmobiliario moderno no es un simple folleto estático. Debe actuar como un **centro de operaciones comerciales autónomo** capaz de:

* **Buscador de Propiedades por Filtros**: Permitir a los usuarios buscar por zona (Palermo, Belgrano, Recoleta, etc.), rango de precio en USD o ARS, cantidad de ambientes y tipo de operación (Venta o Alquiler).
* **Fichas Técnicas Atractivas**: Mostrar galerías de imágenes de alta resolución, mapas interactivos, valores de expensas y formularios de contacto directo.
* **Carga Ultra-Rápida en Dispositivos Móviles**: Más del 75% del tráfico proviene de smartphones. Un sitio web que tarda más de 3 segundos en cargar provoca el abandono del usuario.

En Kaptativa desarrollamos el sistema [Inmo-Scale 360°](/inmobiliarias), un desarrollo con **Pago Único** diseñado específicamente para inmobiliarias argentinas y latinoamericanas.

---

## 2. CRM Comercial Integrado con Tablero Kanban

Generar consultas es solo la primera mitad del trabajo; el verdadero desafío es la **calificación y el seguimiento**.

Sin un CRM (Customer Relationship Management), los mensajes de WhatsApp se mezclan y los asesores pierden el rastro de quiénes están listos para visitar una propiedad.

### Ventajas de un CRM Inmobiliario Kanban:
1. **Visibilidad en Tiempo Real**: Visualizá a tus prospectos organizados en columnas (*Consulta Nueva*, *Calificado por IA*, *Visita Coordinada*, *Reserva*, *Cierre*).
2. **Historial de Interacciones**: Guardá las preferencias de búsqueda de cada cliente para enviarles nuevas propiedades cuando ingresen al catálogo.
3. **Métricas de Rendimiento**: Identificá qué canales de pauta publicitaria están generando los compradores de mayor ticket.

Podés probar cómo funciona la interacción en vivo desde nuestro [Simulador Demo Inmobiliario](/inmo-demo).

---

## 3. Agente IA en WhatsApp: Atención y Agendamiento Automatizado

¿Qué sucede cuando un interesado consulta por una propiedad a las 23:00 hs o un domingo por la tarde? Si no recibe respuesta al instante, continuará navegando y consultará a otra inmobiliaria.

Nuestros **Agentes de Inteligencia Artificial en WhatsApp** se integran a tu base de propiedades para:
* Responder preguntas específicas sobre expensas, superficie, cocheras y mascotas.
* Calificar si el usuario cuenta con el presupuesto y la garantía necesaria.
* Coordinar la fecha y hora de la visita presencial agregando el compromiso automáticamente a tu agenda interna.

---

## 💡 Conclusión y Próximos Pasos

Digitalizar tu inmobiliaria no requiere meses de desarrollo ni suscripciones mensuales abusivas. En Kaptativa te entregamos la infraestructura digital completa lista en solo 7 días.

👉 **¿Querés escalar las ventas de tu inmobiliaria?** Conocé los detalles de nuestra plataforma [Inmo-Scale 360°](/inmobiliarias) o comunicate con nuestro equipo por [WhatsApp](https://wa.me/541138830925).`,
          excerpt: 'Guía paso a paso para transformar la operación de tu inmobiliaria con un portal de propiedades autogestionable, CRM de seguimiento y atención 24/7 en WhatsApp.',
          category: 'inmobiliarias',
          tags: 'Inmobiliaria, CRM, WhatsApp IA, Desarrollo Web',
          author: 'Diego de Kaptativa',
          featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
          seo_title: 'Cómo Digitalizar una Inmobiliaria en 2026 | Kaptativa 360°',
          seo_description: 'Guía completa de transformación digital para inmobiliarias. Implementá tu portal web de propiedades, embudo CRM Kanban y Agentes IA en WhatsApp.',
          status: 'published',
          published_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          $id: 'post-inmo-2',
          title: 'Por Qué Depender Solo de Instagram y WhatsApp Arruina las Ventas de tu Inmobiliaria',
          slug: 'porque-depender-solo-de-instagram-y-whatsapp-arruina-ventas-inmobiliarias',
          content: `Instagram es una herramienta extraordinaria para generar visibilidad y atracción inicial, pero confiar en Instagram como la **única plataforma** para gestionar tu inventario de propiedades es un error operativo que frena el crecimiento de tu inmobiliaria.

En este artículo analizamos las 4 fugas de conversión más destructivas que sufren los corredores inmobiliarios que no cuentan con un sitio web y CRM propio.

---

## 1. El "Feed" Oculta tu Inventario Disponible

En Instagram, las publicaciones envejecen en cuestión de horas. Cuando un cliente interesado ingresa a tu perfil buscando un *"Departamento de 3 ambientes en Palermo por menos de USD 180.000"*, se encuentra con una cuadrícula desordenada de reels y fotos antiguas.

### El problema:
El cliente debe scrollear manualmente durante minutos o enviarte un mensaje directo preguntando si tenés algo disponible. Si no respondes de inmediato, el cliente abandona tu perfil.

### La solución:
Tener un [Portal Web Inmobiliario Autogestionable](/inmobiliarias) donde el cliente pueda filtrar en 2 clics exactamente el inmueble que busca y ver la ficha técnica completa.

---

## 2. El Caos de los Mensajes de WhatsApp Desorganizados

Cuando lanzas una campaña publicitaria en Meta Ads hacia tu WhatsApp, recibes decenas de mensajes diarios que dicen: *"Hola, vi esto en Instagram, ¿sigue disponible?"*.

Sin un sistema centralizado:
* Tu equipo pierde horas respondiendo preguntas básicas sobre ubicación o fotos.
* Los contactos quedan guardados en teléfonos personales de los asesores sin control centralizado.
* Se pierden oportunidades de **re-marketing**: no podés filtrar fácilmente a todos los clientes que buscaron 2 ambientes el mes pasado para ofrecerles una nueva captación.

---

## 3. Pérdida de Profesionalismo para Captar Exclusivas

Los propietarios que buscan vender su inmueble analizan la presencia digital de las inmobiliarias antes de firmar una autorización exclusiva.

Si ven que tu marca solo publica en Instagram y no cuenta con un **sitio web profesional con dominio propio (.com.ar)**, dudarán de tu capacidad de inversión y alcance comercial. Presentar una infraestructura digital de vanguardia es el argumento decisivo para ganar la captación frente a competidores tradicionales.

---

## 4. Dependencia de Algoritmos de Terceros

Construir tu negocio exclusivamente sobre plataformas alquiladas (como Instagram o Facebook) significa que estás a la merced de sus cambios de algoritmo y políticas de costos.

Tener tu propio **Portal Web + CRM de Pago Único** te otorga soberanía sobre tu base de datos de clientes y propiedades.

---

## 🚀 Transformá tu Operación Comercial

En Kaptativa desarrollamos soluciones pensadas para resolver estas fugas operativas. Consultá nuestras páginas de [Servicios de Desarrollo Web](/servicios/diseno-web) y nuestra [Propuesta Inmobiliaria Integrada](/inmobiliarias) para elevar el estándar de tu empresa.`,
          excerpt: 'Las redes sociales ayudan a atraer interesados, pero sin una web propia y un CRM organizado pierdes hasta el 60% de tus compradores por falta de seguimiento.',
          category: 'inmobiliarias',
          tags: 'Estrategia, Redes Sociales, CRM, Inmobiliarias',
          author: 'Eliana de Kaptativa',
          featured_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
          seo_title: 'El Riesgo de Depender Solo de Instagram en Inmobiliarias | Kaptativa',
          seo_description: 'Analizamos las 4 fugas operativas más graves de depender solo de Instagram y WhatsApp en tu inmobiliaria y cómo solucionarlas.',
          status: 'published',
          published_at: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
          $id: 'post-inmo-3',
          title: 'Agentes IA en WhatsApp para Inmobiliarias: Responde Consultas y Agenda Visitas 24/7',
          slug: 'agentes-ia-whatsapp-inmobiliarias-atiende-consultas-24-7',
          content: `La Inteligencia Artificial ha dejado de ser una novedad futurista para convertirse en la ventaja competitiva más potente de los equipos comerciales modernos. En el sector inmobiliario, la velocidad de respuesta determina quién se queda con la comisión.

Un **Agente IA de WhatsApp** no es un bot tradicional con menú de opciones rígidas (opción 1, opción 2). Es un modelo conversacional avanzado capaz de entender lenguaje natural, consultar tu catálogo de propiedades en tiempo real y guiar al usuario hasta la coordinación de la visita.

---

## ¿Cómo Funciona un Agente IA Inmobiliario?

### 1. Atención Inmediata en Lenguaje Natural
Cuando un cliente escribe: *"Hola, me interesa el departamento de Av. Libertador pero necesito saber cuánto paga de expensas y si aceptan mascotas"*, la IA analiza la ficha de la propiedad y responde al instante con los datos exactos.

### 2. Calificación Automática de Prospectos (Leads)
La IA realiza preguntas clave de filtro sin resultar invasiva:
* *"¿Buscás comprar para vivienda propia o como inversión?"*
* *"¿Contás con la totalidad del capital o requerís financiación?"*
* *"¿Tenés propiedad para vender como parte de pago?"*

Toda esta información se envía de inmediato a tu [CRM Comercial](/inmobiliarias), asignándole un puntaje al prospecto.

### 3. Agendamiento de Visitas Sincronizado
Una vez calificado el interesado, el Agente IA ofrece los turnos disponibles en la agenda del asesor inmobiliario responsable y reserva la visita notificando a ambas partes.

---

## Casos de Uso Reales en Inmobiliarias

* **Atención Fuera de Horario Hábil**: El 40% de las consultas inmobiliarias ingresan entre las 20:00 hs y las 08:00 am. La IA captura y califica estas oportunidades mientras tu equipo descansa.
* **Envío de Fichas en PDF**: La IA genera el enlace directo al catálogo o envía la ficha del inmueble en formato PDF interactivo.

Conocé más sobre nuestro módulo de [Agentes de Inteligencia Artificial](/servicios/agentes-ia) o probá el funcionamiento en vivo en nuestro [Simulador Demo](/inmo-demo).

---

## 📈 ¿Querés implementar IA en tu Inmobiliaria?

Hablá hoy con nuestro equipo técnico para integrar un Agente de WhatsApp en tu negocio. Escribinos por [WhatsApp](https://wa.me/541138830925) o solicitá un [Diagnóstico Digital Gratuito](/contacto).`,
          excerpt: 'Cómo entrenar un asistente de Inteligencia Artificial para responder valores de expensas, ubicaciones y coordinar visitas presenciales sin intervención humana.',
          category: 'inteligencia-artificial',
          tags: 'IA, WhatsApp Bot, Agentes Virtuales, Inmobiliarias',
          author: 'Nehuén de Kaptativa',
          featured_image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80',
          seo_title: 'Agentes IA de WhatsApp para Inmobiliarias | Kaptativa',
          seo_description: 'Atiende a tus clientes inmobiliarios las 24hs. Califica consultas por expensas y agenda visitas presenciales automáticamente con Inteligencia Artificial.',
          status: 'published',
          published_at: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          $id: 'post-inmo-4',
          title: 'CRM Inmobiliario con Tablero Kanban: Cómo Organizar el Embudo de Ventas de tu Equipo',
          slug: 'crm-inmobiliario-tablero-kanban-embudo-de-ventas',
          content: `La desorganización en el seguimiento comercial es el enemigo silencioso de la rentabilidad inmobiliaria. Cuantas más propiedades tenés en cartera, más difícil resulta recordar qué cliente estaba esperando una tasación, quién visitó un departamento la semana pasada y quién tiene la seña lista.

El **Tablero Kanban** es la metodología visual más efectiva para mantener el control total del pipeline de ventas.

---

## Las Etapas Clave de un Embudo Inmobiliario Exitoso

Un CRM diseñado para inmobiliarias debe estructurarse en columnas claras que reflejen el ciclo de vida del cliente:

1. **Entrada / Consulta Nueva**: Prospectos que ingresaron por la web o portales inmobiliarios.
2. **Calificado por IA / Asesor**: Prospectos validados con presupuesto y requerimiento concreto.
3. **Visita Agendada**: Citas confirmadas en la agenda del equipo.
4. **Propuesta / Reserva**: Inmuebles con oferta formal o seña recibida.
5. **Cierre Exitoso**: Operación concretada y honorarios cobrados.

---

## 3 Razones para Adoptar un CRM Kanban Propio

### 1. Control Operativo Centralizado
El dueño o director de la inmobiliaria puede ver de un vistazo cuántas operaciones activas tiene cada corredor y detectar dónde se traban los negocios.

### 2. Automatización de Tareas
Al mover una tarjeta de *"Visita Agendada"* a *"Propuesta"*, el CRM puede enviar automáticamente un mensaje pre-diseñado por WhatsApp o crear una tarea de recordatorio.

### 3. Integración con Tu Sitio Web
Todas las consultas realizadas en tu [Portal Inmobiliario Web](/inmobiliarias) caen de forma transparente en la columna de entrada del CRM, eliminando la carga manual de datos.

Descubrí cómo integramos el CRM en nuestras soluciones visitando la página de [Automatización de Procesos](/servicios/automatizacion).`,
          excerpt: 'Aprende a estructurar las etapas de tus prospectos desde la primera consulta por portal hasta la firma de reserva y escritura en un CRM ágil.',
          category: 'automatizacion',
          tags: 'CRM, Kanban, Ventas, Automatización, Inmobiliarias',
          author: 'Pedro de Kaptativa',
          featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
          seo_title: 'CRM Inmobiliario Kanban: Gestiona tu Embudo Comercial | Kaptativa',
          seo_description: 'Organiza tu equipo comercial de ventas e inquilinos con un CRM Kanban diseñado para el mercado inmobiliario regional.',
          status: 'published',
          published_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          $id: 'post-inmo-5',
          title: 'SEO Inmobiliario: Cómo Posicionar tu Catálogo de Propiedades en Google y Motores con IA',
          slug: 'seo-inmobiliario-posicionar-catalogo-propiedades-google-ia',
          content: `Aparecer en las primeras posiciones de búsqueda en Google no es casualidad; es el resultado de una estrategia de **SEO (Search Engine Optimization)** y **GEO (Generative Engine Optimization)** técnicamente bien ejecutada.

Cuando un potencial comprador busca *"Departamentos en venta en Belgrano 3 ambientes"* o *"Inmobiliaria recomendada en Palermo"*, tu sitio web debe responder a esa intención de búsqueda de forma prioritaria.

---

## Estrategias Clave de SEO Inmobiliario para 2026

### 1. Estructura de URLs y Títulos Semánticos
Cada ficha de propiedad debe contar con un título optimizado que incluya el tipo de inmueble, la ubicación y las características principales.
* **Mal formato**: \`tudominio.com/propiedad?id=8923\`
* **Buen formato SEO**: \`tudominio.com/propiedades/departamento-3-ambientes-balcon-palermo\`

### 2. Datos Estructurados JSON-LD (Schema.org)
Implementar marcas de datos estructurados para que Google y motores de Inteligencia Artificial (ChatGPT Search, Gemini, Perplexity) comprendan el precio, la moneda, los m² y el tipo de inmueble de forma exacta.

### 3. SEO Local y Google Business Profile
Optimizamos la ficha de Google Maps de tu inmobiliaria conectando las opiniones de clientes satisfechos y geolocalizando tus zonas de captación.

Conocé nuestro servicio especializado en [Posicionamiento SEO & GEO](/servicios/seo-geo) para dominar las búsquedas en tu región.`,
          excerpt: 'Estrategias técnicas para lograr que tus casas y departamentos aparezcan primeros cuando los compradores buscan propiedades en tu zona.',
          category: 'seo',
          tags: 'SEO, GEO, Google Maps, Posicionamiento Web, Inmobiliarias',
          author: 'Serafín de Kaptativa',
          featured_image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80',
          seo_title: 'SEO Inmobiliario: Posiciona tus Propiedades en Google | Kaptativa',
          seo_description: 'Aumenta el tráfico orgánico de tu portal inmobiliario optimizando fichas técnicas para búsquedas locales y respuestas generativas de IA.',
          status: 'published',
          published_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          $id: 'post-inmo-6',
          title: 'Cómo Captar Propiedades Exclusivas Presentando un Portal Web de Vanguardia',
          slug: 'como-captar-propiedades-exclusivas-portal-web-vanguardia',
          content: `En la captación de inmuebles en exclusiva, el propietario no solo evalúa el precio de tasación; evalúa **cómo vas a promocionar y cuidar su patrimonio**.

Presentarte en la reunión de captación mostrando únicamente un folleto impreso o prometiendo publicar en portales tradicionales ya no impresiona a los propietarios exigentes.

---

## La Presentación Comercial que Gana la Exclusiva

Imaginá ingresar a la reunión de captación y mostrarle al propietario desde tu tablet:

1. **Su propiedad renderizada en un Portal Web Exclusivo**: Una ficha técnica interactiva con diseño de nivel internacional, velocidad de carga instantánea y optimización móvil.
2. **Atención Inmediata a los Compradores con IA**: Explicarle que ningún comprador quedará desatendido porque un Agente de IA en WhatsApp responderá dudas las 24 horas.
3. **Seguimiento Transparente en el CRM**: Mostrarle cómo registrarás cada consulta y visita para mantenerlo informado con reportes de avance semanales.

---

## Elevá la Percepción de Valor de tu Marca

El diseño web de alta gama y la tecnología integrada posicionan a tu inmobiliaria como una empresa moderna, profesional y confiable. Esto te permite negociar **honorarios completos (4% al 6%)** sin objeciones por parte del cliente.

Conocé nuestra solución integral [Inmo-Scale 360° para Inmobiliarias](/inmobiliarias) o ponete en contacto con nuestro equipo comercial a través de [Contacto](/contacto).`,
          excerpt: 'Los propietarios eligen inmobiliarias que transmiten confianza y tecnología. Descubrí cómo ganar la captación de exclusivas mostrando tu infraestructura digital.',
          category: 'diseno-web',
          tags: 'Captación, Exclusivas, Branding, Portal Web, Inmobiliarias',
          author: 'Silvia de Kaptativa',
          featured_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
          seo_title: 'Captación Inmobiliaria Exclusiva con Portal Web Premium | Kaptativa',
          seo_description: 'Diferénciate de la competencia y convence a los propietarios para firmar autorizaciones exclusivas con un sitio web inmobiliario de alto impacto.',
          status: 'published',
          published_at: new Date().toISOString()
        }
      ]));
    }

    if (!localStorage.getItem('mock_projects')) {
      localStorage.setItem('mock_projects', JSON.stringify([
        {
          $id: 'project-1',
          name: 'Carlos Mendoza',
          business: 'Estudio Mendoza',
          whatsapp: '+5491133334444',
          email: 'carlos@estudiomendoza.com',
          status: 'mapeo',
          notes: 'Mapeando procesos de facturación inicial.',
          tags: 'Automatización',
          lead_id: 'lead-1',
          created_at: new Date().toISOString()
        }
      ]));
    }

    let mockBudgets = [];
    try {
      mockBudgets = JSON.parse(localStorage.getItem('mock_budgets') || '[]');
    } catch (e) {
      mockBudgets = [];
    }

    const hasRef = mockBudgets.some(b => b.$id === 'budget-ref-1');
    if (!hasRef) {
      const refMeta = {
        serviceType: 'web',
        basePrice: 600,
        features: [
          'Diseño responsivo y adaptado a móviles',
          'Optimización SEO básica on-page',
          'Integración de formularios de contacto',
          'Certificado SSL bonificado de seguridad'
        ],
        blocks: ['block-uiux', 'block-speed'],
        customItems: [
          { id: 'manual-1234', label: 'Módulo de Reserva de Turnos Integrado', billingType: 'flat', price: 150, hours: 0, hourlyRate: 25 }
        ],
        currency: 'USD',
        exchangeRate: 1000,
        enableInstallments: true,
        enableTransferDiscount: true,
        urgency: 0,
        maintenance: 45,
        discount: 50
      };
      
      const refItems = [
        { name: 'Base del Proyecto: Diseño Web', price: 600, qty: 1 },
        { name: 'Módulo: Diseño UI/UX a Medida', price: 200, qty: 1 },
        { name: 'Módulo: WPO (Optimización SEO/Speed)', price: 150, qty: 1 },
        { name: 'Módulo de Reserva de Turnos Integrado', price: 150, qty: 1 }
      ];

      const refBudget = {
        $id: 'budget-ref-1',
        quote_number: 'KP-2026-8899',
        client_name: 'Carlos Mendoza',
        client_business: 'Estudio Mendoza (Referencia)',
        client_email: 'carlos@estudiomendoza.com',
        client_whatsapp: '+5491133334444',
        items: JSON.stringify(refItems),
        subtotal: 1100,
        discount_pct: 5,
        discount_val: 50,
        total: 1050,
        validity_days: 15,
        notes: 'Propuesta comercial de referencia para el rediseño web y reservas autónomas.',
        metadata: JSON.stringify(refMeta),
        status: 'enviado',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      };

      mockBudgets.unshift(refBudget);
      localStorage.setItem('mock_budgets', JSON.stringify(mockBudgets));
    }

    try {
      const currentTemplates = localStorage.getItem('mock_service_templates');
      if (currentTemplates && !currentTemplates.includes('inmobiliaria')) {
        localStorage.removeItem('mock_service_templates');
      }
    } catch (e) {}

    if (!localStorage.getItem('mock_service_templates')) {
      localStorage.setItem('mock_service_templates', JSON.stringify([
        {
          $id: 'web',
          label: 'Diseño Web',
          basePrice: 600,
          icon: '🌐',
          features: [
            'Diseño responsivo y adaptado a móviles',
            'Optimización SEO básica on-page',
            'Integración de formularios de contacto',
            'Certificado SSL bonificado de seguridad'
          ],
          desc: 'Sitio web corporativo o Landing Page profesional',
          status: 'activo'
        },
        {
          $id: 'auto',
          label: 'Automatización',
          basePrice: 500,
          icon: '⚡',
          features: [
            'Mapeo conceptual de procesos inicial',
            'Integración modular en Make o n8n',
            'Sincronización con bases de datos Cloud',
            'Notificaciones autónomas en WhatsApp/Slack'
          ],
          desc: 'Automatización de procesos repetitivos y sincronizaciones',
          status: 'activo'
        },
        {
          $id: 'ia',
          label: 'Agente IA',
          basePrice: 800,
          icon: '🤖',
          features: [
            'Entrenamiento con base de conocimientos de negocio',
            'Conectores de WhatsApp y Webchat integrados',
            'Procesamiento de Lenguaje Natural avanzado',
            'Derivación a agentes humanos inteligente'
          ],
          desc: 'Agentes y chatbots inteligentes entrenados a medida',
          status: 'activo'
        },
        {
          $id: 'sistema',
          label: 'Sistema Completo',
          basePrice: 1500,
          icon: '🛡️',
          features: [
            'Diseño de interfaz a medida (Figma & UX)',
            'Backend robusto con bases de datos estructuradas',
            'Dashboard interno de métricas en tiempo real',
            'Seguridad y encriptado de nivel empresarial'
          ],
          desc: 'Aplicaciones a medida y plataformas web complejas',
          status: 'activo'
        },
        {
          $id: 'inmobiliaria',
          label: 'Plan Inmobiliario',
          basePrice: 360,
          icon: '🏠',
          features: [
            'Web inmobiliaria autogestionable',
            'Buscador avanzado y catálogo de propiedades',
            'CRM inmobiliario integrado',
            'Registro y seguimiento automático de clientes',
            'Dominio .com.ar, hosting y soporte por 12 meses'
          ],
          desc: 'Plataforma completa para inmobiliarias con catálogo y CRM integrado',
          status: 'activo'
        }
      ]));
    }

    if (!localStorage.getItem('mock_modular_blocks')) {
      localStorage.setItem('mock_modular_blocks', JSON.stringify([
        { $id: 'block-uiux', label: 'Diseño UI/UX a Medida', price: 200, category: 'Diseño', status: 'activo' },
        { $id: 'block-api', label: 'Integración de API Externa', price: 300, category: 'Desarrollo', status: 'activo' },
        { $id: 'block-admin', label: 'Panel de Administración', price: 400, category: 'Backoffice', status: 'activo' },
        { $id: 'block-lang', label: 'Soporte Multi-idioma', price: 150, category: 'Desarrollo', status: 'activo' },
        { $id: 'block-speed', label: 'WPO (Optimización SEO/Speed)', price: 150, category: 'Optimización', status: 'activo' },
        { $id: 'block-db', label: 'Base de Datos Cloud', price: 250, category: 'Infraestructura', status: 'activo' },
        { $id: 'block-crm', label: 'Integración CRM', price: 300, category: 'Automatización', status: 'activo' },
        { $id: 'block-vps', label: 'Servidor VPS Dedicado', price: 350, category: 'Infraestructura', status: 'activo' }
      ]));
    }

    if (!localStorage.getItem('mock_session')) {
      localStorage.setItem('mock_session', '');
    }

    // Check if the mock data contains the new La Rioja prospects and Cordoba prospects, and if not, clear it to force re-seeding
    const currentMock = localStorage.getItem('mock_prospectos');
    if (currentMock && (!currentMock.includes("Broker and Brothers") || !currentMock.includes("Inmobiliaria PH Bienes Raices"))) {
      localStorage.removeItem('mock_prospectos');
    }

    // Check if mock_whatsapp_chats has instagram and notes, if not, clear it to force re-seeding
    const currentChats = localStorage.getItem('mock_whatsapp_chats');
    if (currentChats && (!currentChats.includes('"instagram"') || !currentChats.includes('"notes"'))) {
      localStorage.removeItem('mock_whatsapp_chats');
    }

    if (!localStorage.getItem('mock_prospectos')) {
      const generarMensaje = (p) => {
        const sinWeb = !p.web;
        const rubroL = (p.rubro || "Inmobiliaria").toLowerCase();
        
        let intro = "";
        let gancho = "";
        let cierre = "";

        const randomVal = Math.floor(Math.random() * 2);
        if (randomVal === 0) {
          intro = `¡Hola! Soy Diego, de Kaptativa. Estuve viendo lo de ${p.nombre} en ${p.ciudad}`;
        } else {
          intro = `Buenas, ¿cómo andan? Soy Diego de Kaptativa. Vi el perfil de ${p.nombre} de ${p.ciudad}`;
        }

        if (rubroL === "gimnasio") {
          gancho = sinWeb
            ? ` y noté que no tienen una web donde la gente pueda ver las clases y reservar su lugar directamente.`
            : ` y vi que ya tienen presencia armada, pero noté que las reservas de clases y turnos se manejan manuales.`;
          cierre = ` Justo ayudamos a gimnasios a automatizar reservas + agenda + WhatsApp con IA para que no pierdan clientes. ¿Te va un diagnóstico gratuito de 15 min?`;
        } 
        else if (rubroL === "estudio contable") {
          gancho = sinWeb
            ? ` y vi que no tienen un portal web para centralizar clientes ni recibir consultas automáticas.`
            : ` y vi su web. En Kaptativa ayudamos a estudios contables a automatizar la facturación y la agenda.`;
          cierre = ` Vinculamos todo a WhatsApp con asistentes inteligentes para responder dudas frecuentes 24/7. ¿Te interesaría ver un ejemplo rápido?`;
        }
        else if (rubroL === "e-commerce") {
          gancho = sinWeb
            ? ` y noté que venden por Instagram pero no tienen un e-commerce automatizado para facturar y cobrar en automático.`
            : ` y vi su tienda online. Les falta automatizar el recupero de carritos abandonados por WhatsApp con un bot de IA.`;
          cierre = ` Hacemos que la tienda y WhatsApp hablen entre sí para cerrar ventas solas. ¿Te tiro unos ejemplos de cómo aumentamos las conversiones?`;
        }
        else if (rubroL === "centro médico") {
          gancho = sinWeb
            ? ` y vi que no tienen una web informativa ni agenda de turnos online.`
            : ` y vi que ofrecen turnos online, pero noté que no tienen recordatorios automatizados de citas por WhatsApp.`;
          cierre = ` Ayudamos a consultorios médicos a automatizar confirmación y cancelación de turnos, reduciendo ausentismo a la mitad. ¿Te comento cómo funciona?`;
        }
        else if (rubroL === "gastronomía") {
          gancho = sinWeb
            ? ` y noté que no tienen un carta digital integrada para pedidos por WhatsApp.`
            : ` y vi su web. Ayudamos a restaurantes a integrar un bot que toma pedidos y cobra directamente en WhatsApp.`;
          cierre = ` Así tu equipo solo cocina y despacha sin perder tiempo chateando. ¿Te gustaría ver cómo funciona el bot?`;
        }
        else if (rubroL === "distribuidora") {
          gancho = sinWeb
            ? ` y noté que no tienen un portal de pedidos mayoristas autogestionable.`
            : ` y vi su web. Ayudamos a distribuidoras a conectar su catálogo digital con su stock real y WhatsApp de forma autónoma.`;
          cierre = ` Así los clientes compran solos y el pedido entra directo al CRM. ¿Coordinamos un diagnóstico rápido?`;
        }
        else if (rubroL === "estética") {
          gancho = sinWeb
            ? ` y noté que toman turnos a mano por Instagram sin un calendario online.`
            : ` y vi su web. Ayudamos a centros de estética a automatizar su agenda e integrar un bot para reservar y recordar turnos.`;
          cierre = ` Así la agenda se completa sola mientras trabajás. ¿Te muestro cómo se vería para ustedes?`;
        }
        else {
          gancho = sinWeb
            ? ` y noté que manejan todo de manera directa o redes, sin una web propia donde mostrar las propiedades de forma estructurada.`
            : ` y vi que ya tienen presencia online armada.`;
          cierre = sinWeb
            ? ` Justo ayudamos a inmobiliarias a tener catálogo + web + WhatsApp con IA en un solo panel. ¿Te muestro en 5 min cómo se vería para ustedes?`
            : ` Ayudamos a inmobiliarias a unificar catálogo, web, CRM y WhatsApp con IA en un panel. ¿Te tiro un ejemplo rápido?`;
        }

        return `${intro}${gancho}${cierre}`;
      };

      const seedProspectos = [
        { nombre: "Broker and Brothers",            ciudad: "La Rioja",  telefono: "+54 9 380 430-3090", instagram: "brokerandbrothers.lr", web: null, rating: 4.2, rubro: "Inmobiliaria" },
        { nombre: "Inmobiliaria La Rioja",          ciudad: "La Rioja",  telefono: "+54 9 380 494-1742", instagram: "inmobiliarialarioja", web: null, rating: 4.0, rubro: "Inmobiliaria" },
        { nombre: "Inmobiliaria Saavedra",          ciudad: "La Rioja",  telefono: "+54 9 380 423-3552", instagram: "inmobiliariasaavedra", web: null, rating: 3.8, rubro: "Inmobiliaria" },
        { nombre: "Inmobiliaria Chacra'S Negocios", ciudad: "La Rioja",  telefono: "+54 9 380 449-4455", instagram: "chacrasnegocios", web: null, rating: 4.1, rubro: "Inmobiliaria" },
        { nombre: "Metropolitano Sfl",              ciudad: "La Rioja",  telefono: "+54 9 380 451-6102", instagram: "metropolitano.sfl", web: null, rating: 3.9, rubro: "Inmobiliaria" },
        { nombre: "Marchena y Asociados",           ciudad: "La Rioja",  telefono: "+54 9 380 438-5446", instagram: "marchenayasociados", web: null, rating: 4.0, rubro: "Inmobiliaria" },
        { nombre: "Alae Servicios Inmobiliarios",   ciudad: "La Rioja",  telefono: "+54 9 380 442-4624", instagram: "alaeservicios", web: null, rating: 4.3, rubro: "Inmobiliaria" },
        { nombre: "G.Ps. Guzman Propiedades",       ciudad: "Chilecito", telefono: "+54 9 3825 67-2169", instagram: "guzmanpropiedades", web: null, rating: 4.5, rubro: "Inmobiliaria" },
        { nombre: "Inmobiliaria Chilecito",          ciudad: "Chilecito", telefono: "+54 9 3825 58-5854", instagram: "inmobiliariachilecito", web: null, rating: 4.1, rubro: "Inmobiliaria" },
        { nombre: "María Eugenia Díaz Carbel Propiedades", ciudad: "La Rioja", telefono: "+54 9 380 446-6968", instagram: "diazcarbelpropiedades", web: null, rating: 4.4, rubro: "Inmobiliaria" }
      ].map((p, i) => ({
        $id: `p-${i + 1}`,
        nombre: p.nombre,
        ciudad: p.ciudad,
        telefono: p.telefono,
        instagram: p.instagram,
        web: p.web,
        rating: p.rating,
        rubro: p.rubro,
        fuente: "google_maps",
        estado: "nuevo",
        contactado_at: null,
        mensaje: generarMensaje(p),
        created_at: new Date().toISOString()
      }));

      // Append scraped prospects dynamically to mock seed database
      if (Array.isArray(scrapedProspects) && scrapedProspects.length > 0) {
        scrapedProspects.forEach((p, idx) => {
          seedProspectos.push({
            $id: `scraped-${idx + 1}`,
            nombre: p.nombre,
            ciudad: p.ciudad,
            telefono: p.telefono,
            instagram: p.instagram || '-',
            web: p.web,
            rating: p.rating || 4.0,
            rubro: p.rubro || 'Inmobiliaria',
            fuente: p.fuente || 'osm_scraper',
            estado: p.estado || 'nuevo',
            contactado_at: null,
            mensaje: generarMensaje(p),
            created_at: p.created_at || new Date().toISOString()
          });
        });
      }

      localStorage.setItem('mock_prospectos', JSON.stringify(seedProspectos));
    }

    if (!localStorage.getItem('mock_whatsapp_agents')) {
      localStorage.setItem('mock_whatsapp_agents', JSON.stringify([
        { $id: "agent-bot", name: "Bot IA", avatar: "🤖", status: "online" },
        { $id: "agent-diego", name: "Diego", avatar: "👨‍💻", status: "online" },
        { $id: "agent-ana", name: "Ana (Ventas)", avatar: "👩", status: "online" },
        { $id: "agent-carlos", name: "Carlos (Soporte)", avatar: "👨", status: "offline" }
      ]));
    }

    if (!localStorage.getItem('mock_whatsapp_chats')) {
      localStorage.setItem('mock_whatsapp_chats', JSON.stringify([
        { $id: "chat-1", name: "Estudio Mendoza", phone: "+54 9 11 3333-4444", status: "bot", lastMessage: "Quiero agendar la reunión para ver el bot.", time: "10:14", unread: false, rubro: "Estudio Contable", city: "Rosario", assignedAgent: "agent-bot", funnelStage: "qualifying", notes: "Interesado en cotización de bot.", internalNotes: "Calificado por bot. Muestra alto interés.", created_at: new Date(Date.now() - 3600000).toISOString() },
        { $id: "chat-2", name: "Inmobiliaria Saavedra", phone: "+54 9 380 423-3552", status: "humano", lastMessage: "Perfecto, agendado. Saludos.", time: "Ayer", unread: false, rubro: "Inmobiliaria", city: "La Rioja", instagram: "inmobiliariasaavedra", assignedAgent: "agent-diego", funnelStage: "waiting", notes: "Llamar mañana por la tarde.", internalNotes: "Reunión comercial fijada.", created_at: new Date(Date.now() - 86400000).toISOString() },
        { $id: "chat-3", name: "Broker and Brothers", phone: "+54 9 380 430-3090", status: "bot", lastMessage: "Hola, me interesa saber el precio de la web.", time: "Ayer", unread: true, rubro: "Inmobiliaria", city: "La Rioja", instagram: "brokerandbrothers.lr", assignedAgent: "agent-bot", funnelStage: "initial", notes: "", internalNotes: "", created_at: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { $id: "chat-4", name: "G.Ps. Guzman Propiedades", phone: "+54 9 3825 67-2169", status: "closed", lastMessage: "Gracias por la información.", time: "23 Jun", unread: false, rubro: "Inmobiliaria", city: "Chilecito", instagram: "guzmanpropiedades", assignedAgent: "agent-carlos", funnelStage: "closed", notes: "Compra diferida para el próximo trimestre.", internalNotes: "Cerrado por falta de presupuesto actual.", created_at: new Date(Date.now() - 86400000 * 2).toISOString() }
      ]));
    }

    if (!localStorage.getItem('mock_whatsapp_messages')) {
      localStorage.setItem('mock_whatsapp_messages', JSON.stringify([
        { $id: "msg-1", chatId: "chat-1", sender: "client", text: "¡Hola! Vi su publicación sobre agentes de WhatsApp. ¿Cómo funciona?", time: "10:05", created_at: new Date(Date.now() - 3500000).toISOString() },
        { $id: "msg-2", chatId: "chat-1", sender: "bot", text: "¡Hola! Un gusto saludarte. Soy el asistente virtual de Kaptativa. Ayudamos a automatizar reservas, agendas y respuestas 24/7 vinculando todo a WhatsApp con IA. ¿De qué rubro es tu negocio?", time: "10:06", created_at: new Date(Date.now() - 3400000).toISOString() },
        { $id: "msg-3", chatId: "chat-1", sender: "client", text: "Es un estudio contable, Estudio Mendoza.", time: "10:08", created_at: new Date(Date.now() - 3200000).toISOString() },
        { $id: "msg-4", chatId: "chat-1", sender: "bot", text: "Excelente. Justo ayudamos a estudios contables a automatizar la facturación y la agenda, vinculando todo a WhatsApp con asistentes inteligentes para responder dudas de clientes 24/7. ¿Te interesaría agendar un diagnóstico gratuito de 15 minutos para ver cómo funciona?", time: "10:09", created_at: new Date(Date.now() - 3100000).toISOString() },
        { $id: "msg-5", chatId: "chat-1", sender: "client", text: "Sí, me interesa. Quiero agendar la reunión para ver el bot.", time: "10:14", created_at: new Date(Date.now() - 3000000).toISOString() },
        
        { $id: "msg-6", chatId: "chat-2", sender: "client", text: "Buenas tardes, ¿se puede programar una llamada hoy?", time: "Ayer 15:30", created_at: new Date(Date.now() - 86400000).toISOString() },
        { $id: "msg-7", chatId: "chat-2", sender: "bot", text: "¡Hola! Sí, claro. Te transfiero con un consultor del equipo para coordinar la llamada de forma directa. Aguarda unos minutos.", time: "Ayer 15:31", created_at: new Date(Date.now() - 86350000).toISOString() },
        { $id: "msg-8", chatId: "chat-2", sender: "agent", text: "Hola, ¿cómo estás? Soy Diego. ¿Te queda bien hoy a las 18:00 hs?", time: "Ayer 15:35", created_at: new Date(Date.now() - 86300000).toISOString() },
        { $id: "msg-9", chatId: "chat-2", sender: "client", text: "Perfecto, agendado. Saludos.", time: "Ayer 15:40", created_at: new Date(Date.now() - 86200000).toISOString() },
        
        { $id: "msg-10", chatId: "chat-3", sender: "client", text: "Hola, me interesa saber el precio de la web.", time: "Ayer 19:10", created_at: new Date(Date.now() - 86400000 * 1.2).toISOString() },
        
        { $id: "msg-11", chatId: "chat-4", sender: "client", text: "Hola, ¿hacen integraciones con CRM?", time: "23 Jun 11:15", created_at: new Date(Date.now() - 86400000 * 2.1).toISOString() },
        { $id: "msg-12", chatId: "chat-4", sender: "bot", text: "¡Hola! Sí, por supuesto. Conectamos WhatsApp con CRM de forma directa para que los leads entren de manera autónoma. ¿Para qué inmobiliaria sería?", time: "23 Jun 11:16", created_at: new Date(Date.now() - 86400000 * 2.08).toISOString() },
        { $id: "msg-13", chatId: "chat-4", sender: "client", text: "G.Ps. Guzman Propiedades en Chilecito.", time: "23 Jun 11:20", created_at: new Date(Date.now() - 86400000 * 2.05).toISOString() },
        { $id: "msg-14", chatId: "chat-4", sender: "bot", text: "Espectacular. Podemos configurar un bot que califique los interesados en tus propiedades y cree el lead en tu CRM de forma inmediata. ¿Te gustaría agendar un diagnóstico?", time: "23 Jun 11:21", created_at: new Date(Date.now() - 86400000 * 2.04).toISOString() },
        { $id: "msg-15", chatId: "chat-4", sender: "client", text: "Gracias por la información.", time: "23 Jun 11:30", created_at: new Date(Date.now() - 86400000 * 2.01).toISOString() }
      ]));
    }

    if (!localStorage.getItem('mock_whatsapp_meetings')) {
      localStorage.setItem('mock_whatsapp_meetings', JSON.stringify([
        { $id: "meet-1", client: "Estudio Mendoza", date: "Mañana, 11:00 hs", type: "Diagnóstico de Asistente IA" },
        { $id: "meet-2", client: "Inmobiliaria Saavedra", date: "Viernes, 18:00 hs", type: "Reunión Comercial" }
      ]));
    }

    if (!localStorage.getItem('mock_whatsapp_settings')) {
      localStorage.setItem('mock_whatsapp_settings', JSON.stringify([
        {
          $id: 'global_settings',
          bot_active: true,
          bot_prompt: `Eres el asistente virtual inteligente de Kaptativa (empresa de desarrollo de software and automatizaciones con IA).
Tu objetivo es calificar al lead conversando amigablemente y coordinar por chat una videollamada corta de 15 minutos para un diagnóstico gratuito.
Sé breve, profesional y directo. No uses textos largos ni envíes enlaces de reservas.
Si el usuario pregunta precios, menciónale los precios base:
- Diseños web profesionales desde USD 600.
- Automatizaciones de procesos desde USD 500.
- Agentes de WhatsApp con IA entrenados a medida desde USD 800.
Intenta descubrir su rubro de negocio and en qué le gustaría automatizar.`,
          calendar_link: 'https://cal.com/kaptativa/diagnostico',
          typebot_url: 'https://typebot.kaptativa.com',
          typebot_id: 'kaptativa-sales-bot',
          google_calendar_url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2Zw6JkGx-TAa37xXxZWQ-wEo3nHyTd4cN2mBuLtd0lkYR6lGvuqZIzfitpdkCJ6Eg-6NqJwkBa',
          evolution_url: 'https://api.evolution.kaptativa.com',
          evolution_key: 'd25b6a78-9e12-4cfb-81ff-a320c74b126d',
          evolution_instance: 'kaptativa_sales_bot',
          knowledge_base: `# PREGUNTAS FRECUENTES Y SERVICIOS - KAPTATIVA
- **¿Qué es Kaptativa?** Es una consultora tecnológica que automatiza procesos y crea agentes de Inteligencia Artificial para Pymes.
- **Proceso de Trabajo:**
  1. Diagnóstico inicial y mapeo de procesos.
  2. Diseño de propuesta a medida.
  3. Desarrollo e integración (n8n/Make/código).
  4. Capacitación y mantenimiento.
- **¿Cómo agendar el diagnóstico?** Se coordina el día y horario directamente por el chat. Una vez acordado, se generará un enlace de Cal.com automáticamente y se enviará la confirmación.`
        }
      ]));
    }
  }

  // Database operations
  async listDocuments(databaseId, collectionId, queries = []) {
    const key = `mock_${collectionId}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    
    let filtered = [...data];
    
    // Parse simple queries for MockDB
    if (queries && queries.length > 0) {
      queries.forEach(q => {
        if (typeof q === 'string') {
          const equalMatch = q.match(/equal\("([^"]+)",\s*\[?"([^"]+)"\]?\)/);
          if (equalMatch) {
            const field = equalMatch[1];
            const val = equalMatch[2];
            filtered = filtered.filter(doc => doc[field] === val);
          }
        }
      });
    }

    // Sort by created_at descending by default if the field exists
    const sorted = filtered.sort((a, b) => {
      const dateA = a.created_at || a.published_at || '';
      const dateB = b.created_at || b.published_at || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return { documents: sorted, total: sorted.length };
  }

  async getDocument(databaseId, collectionId, documentId) {
    const key = `mock_${collectionId}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const doc = data.find(d => d.$id === documentId || d.slug === documentId);
    if (!doc) throw new Error('Document not found');
    return doc;
  }

  async createDocument(databaseId, collectionId, documentId, documentData) {
    const key = `mock_${collectionId}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const idVal = documentId === 'unique()' || !documentId ? `mock-id-${Date.now()}` : documentId;
    const newDoc = {
      $id: idVal,
      ...documentData,
      created_at: new Date().toISOString()
    };
    data.unshift(newDoc);
    localStorage.setItem(key, JSON.stringify(data));
    return newDoc;
  }

  async updateDocument(databaseId, collectionId, documentId, documentData) {
    const key = `mock_${collectionId}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const index = data.findIndex(d => d.$id === documentId);
    if (index === -1) throw new Error('Document not found');
    
    data[index] = {
      ...data[index],
      ...documentData
    };
    localStorage.setItem(key, JSON.stringify(data));
    return data[index];
  }

  async deleteDocument(databaseId, collectionId, documentId) {
    const key = `mock_${collectionId}`;
    let data = JSON.parse(localStorage.getItem(key) || '[]');
    data = data.filter(d => d.$id !== documentId);
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true };
  }
}

class MockAccount {
  async get() {
    const session = localStorage.getItem('mock_session');
    if (!session) throw new Error('No active session');
    return JSON.parse(session);
  }

  async createEmailPasswordSession(email, password) {
    if (email === 'admin@kaptativa.com' && password === 'admin123') {
      const user = { email, name: 'Administrador Kaptativa', $id: 'admin-user' };
      localStorage.setItem('mock_session', JSON.stringify(user));
      return user;
    }
    throw new Error('Credenciales inválidas. Usa admin@kaptativa.com / admin123');
  }

  async deleteSession(sessionId) {
    localStorage.setItem('mock_session', '');
    return { success: true };
  }
}

// 3. Unified Exports API
export const api = {
  isConfigured,
  
  // Account services
  account: isConfigured ? {
    get: () => account.get(),
    login: (email, password) => account.createEmailPasswordSession(email, password),
    logout: () => account.deleteSession('current')
  } : {
    get: async () => new MockAccount().get(),
    login: async (email, password) => new MockAccount().createEmailPasswordSession(email, password),
    logout: async () => new MockAccount().deleteSession()
  },

  // Databases services
  db: isConfigured ? {
    listLeads: () => databases.listDocuments(DATABASE_ID, 'leads'),
    createLead: (data) => databases.createDocument(DATABASE_ID, 'leads', ID.unique(), data),
    updateLead: (id, data) => databases.updateDocument(DATABASE_ID, 'leads', id, data),
    deleteLead: (id) => databases.deleteDocument(DATABASE_ID, 'leads', id),

    listProjects: () => databases.listDocuments(DATABASE_ID, 'projects'),
    createProject: (data) => databases.createDocument(DATABASE_ID, 'projects', ID.unique(), data),
    updateProject: (id, data) => databases.updateDocument(DATABASE_ID, 'projects', id, data),
    deleteProject: (id) => databases.deleteDocument(DATABASE_ID, 'projects', id),

    listPosts: () => databases.listDocuments(DATABASE_ID, 'blog_posts'),
    getPost: (idOrSlug) => {
      if (idOrSlug.includes('-')) {
        return databases.listDocuments(DATABASE_ID, 'blog_posts', [Query.equal('slug', idOrSlug)]).then(res => res.documents[0] || null);
      }
      return databases.getDocument(DATABASE_ID, 'blog_posts', idOrSlug);
    },
    createPost: (data) => databases.createDocument(DATABASE_ID, 'blog_posts', ID.unique(), data),
    updatePost: (id, data) => databases.updateDocument(DATABASE_ID, 'blog_posts', id, data),
    deletePost: (id) => databases.deleteDocument(DATABASE_ID, 'blog_posts', id),

    listBudgets: () => databases.listDocuments(DATABASE_ID, 'budgets'),
    getBudget: (id) => databases.getDocument(DATABASE_ID, 'budgets', id),
    createBudget: (data) => databases.createDocument(DATABASE_ID, 'budgets', ID.unique(), data),
    updateBudget: (id, data) => databases.updateDocument(DATABASE_ID, 'budgets', id, data),
    deleteBudget: (id) => databases.deleteDocument(DATABASE_ID, 'budgets', id),

    listServiceTemplates: () => databases.listDocuments(DATABASE_ID, 'service_templates'),
    createServiceTemplate: (data) => databases.createDocument(DATABASE_ID, 'service_templates', ID.unique(), data),
    updateServiceTemplate: (id, data) => databases.updateDocument(DATABASE_ID, 'service_templates', id, data),
    deleteServiceTemplate: (id) => databases.deleteDocument(DATABASE_ID, 'service_templates', id),

    listModularBlocks: () => databases.listDocuments(DATABASE_ID, 'modular_blocks'),
    createModularBlock: (data) => databases.createDocument(DATABASE_ID, 'modular_blocks', ID.unique(), data),
    updateModularBlock: (id, data) => databases.updateDocument(DATABASE_ID, 'modular_blocks', id, data),
    deleteModularBlock: (id) => databases.deleteDocument(DATABASE_ID, 'modular_blocks', id),

    listProspects: () => databases.listDocuments(DATABASE_ID, 'prospectos'),
    createProspect: (data) => databases.createDocument(DATABASE_ID, 'prospectos', ID.unique(), data),
    updateProspect: (id, data) => databases.updateDocument(DATABASE_ID, 'prospectos', id, data),
    deleteProspect: (id) => databases.deleteDocument(DATABASE_ID, 'prospectos', id),

    listChats: () => databases.listDocuments(DATABASE_ID, 'whatsapp_chats'),
    createChat: (data) => databases.createDocument(DATABASE_ID, 'whatsapp_chats', ID.unique(), data),
    updateChat: (id, data) => databases.updateDocument(DATABASE_ID, 'whatsapp_chats', id, data),
    deleteChat: (id) => databases.deleteDocument(DATABASE_ID, 'whatsapp_chats', id),

    // Opt-out from storing WhatsApp message history in Appwrite (avoids db bloating).
    // In production, we query these directly from Evolution API on client side, or mock them locally.
    listMessages: (chatId) => new MockDB().listDocuments(DATABASE_ID, 'whatsapp_messages', [`equal("chatId", ["${chatId}"])`]),
    createMessage: (data) => new MockDB().createDocument(DATABASE_ID, 'whatsapp_messages', 'unique()', data),

    listMeetings: () => databases.listDocuments(DATABASE_ID, 'whatsapp_meetings'),
    createMeeting: (data) => databases.createDocument(DATABASE_ID, 'whatsapp_meetings', ID.unique(), data),
    updateMeeting: (id, data) => databases.updateDocument(DATABASE_ID, 'whatsapp_meetings', id, data),
    deleteMeeting: (id) => databases.deleteDocument(DATABASE_ID, 'whatsapp_meetings', id),

    listAgents: () => databases.listDocuments(DATABASE_ID, 'whatsapp_agents'),
    updateAgent: (id, data) => databases.updateDocument(DATABASE_ID, 'whatsapp_agents', id, data),

    getSettings: () => databases.getDocument(DATABASE_ID, 'whatsapp_settings', 'global_settings'),
    updateSettings: (data) => databases.updateDocument(DATABASE_ID, 'whatsapp_settings', 'global_settings', data)
  } : {
    listLeads: async () => new MockDB().listDocuments(DATABASE_ID, 'leads'),
    createLead: async (data) => new MockDB().createDocument(DATABASE_ID, 'leads', 'unique()', data),
    updateLead: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'leads', id, data),
    deleteLead: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'leads', id),
 
    listProjects: async () => new MockDB().listDocuments(DATABASE_ID, 'projects'),
    createProject: async (data) => new MockDB().createDocument(DATABASE_ID, 'projects', 'unique()', data),
    updateProject: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'projects', id, data),
    deleteProject: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'projects', id),
 
    listPosts: async () => new MockDB().listDocuments(DATABASE_ID, 'posts'),
    getPost: async (idOrSlug) => {
      const db = new MockDB();
      const posts = await db.listDocuments(DATABASE_ID, 'posts');
      return posts.documents.find(p => p.$id === idOrSlug || p.slug === idOrSlug) || null;
    },
    createPost: async (data) => new MockDB().createDocument(DATABASE_ID, 'posts', 'unique()', data),
    updatePost: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'posts', id, data),
    deletePost: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'posts', id),

    listBudgets: async () => new MockDB().listDocuments(DATABASE_ID, 'budgets'),
    getBudget: async (id) => new MockDB().getDocument(DATABASE_ID, 'budgets', id),
    createBudget: async (data) => new MockDB().createDocument(DATABASE_ID, 'budgets', 'unique()', data),
    updateBudget: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'budgets', id, data),
    deleteBudget: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'budgets', id),

    listServiceTemplates: async () => new MockDB().listDocuments(DATABASE_ID, 'service_templates'),
    createServiceTemplate: async (data) => new MockDB().createDocument(DATABASE_ID, 'service_templates', 'unique()', data),
    updateServiceTemplate: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'service_templates', id, data),
    deleteServiceTemplate: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'service_templates', id),

    listModularBlocks: async () => new MockDB().listDocuments(DATABASE_ID, 'modular_blocks'),
    createModularBlock: async (data) => new MockDB().createDocument(DATABASE_ID, 'modular_blocks', 'unique()', data),
    updateModularBlock: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'modular_blocks', id, data),
    deleteModularBlock: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'modular_blocks', id),

    listProspects: async () => new MockDB().listDocuments(DATABASE_ID, 'prospectos'),
    createProspect: async (data) => new MockDB().createDocument(DATABASE_ID, 'prospectos', 'unique()', data),
    updateProspect: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'prospectos', id, data),
    deleteProspect: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'prospectos', id),

    listChats: async () => new MockDB().listDocuments(DATABASE_ID, 'whatsapp_chats'),
    createChat: async (data) => new MockDB().createDocument(DATABASE_ID, 'whatsapp_chats', 'unique()', data),
    updateChat: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'whatsapp_chats', id, data),
    deleteChat: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'whatsapp_chats', id),

    listMessages: async (chatId) => {
      const db = new MockDB();
      // Appwrite Query.equal('chatId', chatId) will be processed by listDocuments
      return db.listDocuments(DATABASE_ID, 'whatsapp_messages', [`equal("chatId", ["${chatId}"])`]);
    },
    createMessage: async (data) => new MockDB().createDocument(DATABASE_ID, 'whatsapp_messages', 'unique()', data),

    listMeetings: async () => new MockDB().listDocuments(DATABASE_ID, 'whatsapp_meetings'),
    createMeeting: async (data) => new MockDB().createDocument(DATABASE_ID, 'whatsapp_meetings', 'unique()', data),
    updateMeeting: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'whatsapp_meetings', id, data),
    deleteMeeting: async (id) => new MockDB().deleteDocument(DATABASE_ID, 'whatsapp_meetings', id),

    listAgents: async () => new MockDB().listDocuments(DATABASE_ID, 'whatsapp_agents'),
    updateAgent: async (id, data) => new MockDB().updateDocument(DATABASE_ID, 'whatsapp_agents', id, data),

    getSettings: async () => new MockDB().getDocument(DATABASE_ID, 'whatsapp_settings', 'global_settings'),
    updateSettings: async (data) => new MockDB().updateDocument(DATABASE_ID, 'whatsapp_settings', 'global_settings', data)
  }
};
