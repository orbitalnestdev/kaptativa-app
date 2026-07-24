export const BLOG_POSTS = [
  {
    id: 'post-inmo-1',
    title: 'Cómo Digitalizar la Operación de una Inmobiliaria: Catálogo Web, CRM y WhatsApp',
    slug: 'como-digitalizar-inmobiliaria-catalogo-crm-whatsapp-ia',
    excerpt: 'Guía práctica integral para estructurar la gestión de propiedades, organizar el seguimiento comercial de prospectos y automatizar respuestas en WhatsApp sin perder el control operativo.',
    category: 'inmobiliarias',
    categoryLabel: 'Inmobiliaria Digital',
    tags: ['digitalización inmobiliaria', 'crm inmobiliario', 'whatsapp para inmobiliarias', 'gestión de propiedades', 'operación inmobiliaria'],
    author: 'Kaptativa',
    authorRole: 'Compañía de Transformación Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Panel de gestión de propiedades y seguimiento comercial en computadora',
    seoTitle: 'Cómo Digitalizar una Inmobiliaria: Catálogo Web, CRM y WhatsApp',
    seoDescription: 'Guía paso a paso para estructurar la gestión de inmuebles, organizar el seguimiento comercial y automatizar consultas frecuentes por WhatsApp.',
    publishedAt: '2026-07-18',
    modifiedAt: '2026-07-23',
    readingTime: '9 min de lectura',
    primaryKeyword: 'digitalizar inmobiliaria',
    secondaryKeywords: ['crm inmobiliario argentina', 'software de propiedades', 'whatsapp inmobiliarias', 'catalogo web inmobiliario'],
    searchIntent: 'Informativa y de resolución de problemas operativos para corredores y dueños de inmobiliarias.',
    keyTakeaways: [
      'Centralizar el inventario en un catálogo autogestionable propio evita la dispersión de fichas técnicas en chats individuales.',
      'Un embudo CRM Kanban adaptado al rubro permite clasificar prospectos según urgencia, zona geográfica y presupuesto disponible.',
      'La automatización en WhatsApp debe resolver datos específicos de fichas técnicas y derivar los casos complejos a asesores humanos.'
    ],
    faq: [
      {
        question: '¿Qué diferencia existe entre un portal de propiedades y un sitio web propio?',
        answer: 'Los portales inmobiliarios tradicionales concentran oferta de múltiples agencias en un entorno compartido. Un sitio web propio otorga control sobre la marca, permite personalizar la experiencia de búsqueda y no comparte prospectos con la competencia.'
      },
      {
        question: '¿Es conveniente utilizar sistemas de pago único o licencias mensuales?',
        answer: 'Depende del modelo de negocio. Los esquemas de suscripción mensual aumentan sus costos a medida que crece el catálogo o el equipo. El modelo de pago único implica una inversión inicial en infraestructura propia que elimina costos recurrentes por propiedad.'
      },
      {
        question: '¿Cómo se integran las consultas de WhatsApp con el sistema central?',
        answer: 'Mediante webhooks conectados a la API oficial de WhatsApp Business. Cada mensaje entrante registra la ficha del inmueble consultado y genera un contacto en el CRM asignado al corredor responsable.'
      }
    ],
    content: `La gestión diaria de una agencia inmobiliaria abarca múltiples tareas complejas en simultáneo: la captación de nuevas propiedades, la tasación profesional, la atención de consultas de compradores e inquilinos, la coordinación de muestras presenciales y el seguimiento legal hasta el cierre de boleto o contrato.

Cuando la operación crece, depender exclusivamente de notas manuscritas, planillas de cálculo dispersas o chats de WhatsApp en los teléfonos personales de cada colaborador genera cuellos de botella operativos. Esto deriva en respuestas tardías, fichas desactualizadas y pérdida directa de operaciones comerciales.

---

## Diagnóstico Inicial: Señales de Desorganización Operativa

Antes de implementar herramientas digitales, es fundamental identificar los síntomas de fricción más habituales en la oficina:

* **Demoras en el envío de fichas técnicas**: El asesor tarda horas en buscar el PDF o las fotos de una propiedad solicitada por un interesado.
* **Consultas repetitivas sobre datos básicos**: El equipo dedica gran parte de la jornada a responder valores de expensas, m² cubiertos o requisitos de garantía.
* **Pérdida de trazabilidad de prospectos**: El dueño de la inmobiliaria desconoce cuántas visitas se realizaron en la semana o qué asesor está a cargo de cada consulta.
* **Falta de reactivación del catálogo**: Cuando ingresa una nueva propiedad en venta, no se cuenta con un registro rápido para notificar a los clientes que buscaron características similares el mes anterior.

---

## Los Tres Pilares de la Infraestructura Digital Inmobiliaria

Para consolidar un flujo comercial eficiente y predecible, una empresa inmobiliaria requiere integrar tres componentes en un mismo ecosistema operativo.

### 1. El Catálogo Web Autogestionable

El sitio web de la inmobiliaria debe actuar como un centro de operaciones y búsqueda autónoma donde el usuario pueda explorar el inventario sin barreras.

Un catálogo técnico de alto nivel requiere:
* **Buscador con Filtros Múltiples**: Permite filtrar por tipo de operación (Venta / Alquiler), tipología de inmueble (Departamento, Casa, Lote, Local, PH), barrio o localidad (ej. Palermo, Belgrano, Recoleta, Zona Norte, Córdoba Centro), cantidad de ambientes y rango de precio en USD o ARS.
* **Fichas Técnicas Estructuradas**: Información transparente sobre superficie cubierta y descubierta, disposición (frente, contrafrente, interno), orientación solar, expensas actualizadas, estado de ocupación, aptitud para crédito bancario y reglamentos del consorcio (admisión de mascotas).
* **Galerías de Alta Definición y Mapas**: Integración de fotos profesionales, planos de distribución y mapa de ubicación aproximada para proteger la privacidad del propietario.
* **Optimización Móvil (Core Web Vitals)**: Más del 78% del tráfico inmobiliario en Argentina proviene de teléfonos celulares. Si la página demora más de 2 segundos en cargar, el interesado abandona el sitio.

---

## 2. El CRM Comercial y la Gestión del Embudo Kanban

El CRM (Customer Relationship Management) es la herramienta organizativa donde se registran las oportunidades comerciales y se asignan responsabilidades al equipo de corredores.

### Estructura de Columnas del Embudo Inmobiliario:

1. **Entrada / Consulta Nueva**: Contacto ingresado desde el buscador web, portales o campañas de publicidad.
2. **Prospecto Calificado**: Cliente contactado cuyo presupuesto, plazo de compra y requerimiento específico han sido validados.
3. **Visita Coordinada**: Cita presencial confirmada en la propiedad con fecha, hora y asesor responsable.
4. **Reserva / Oferta Formal**: Propuesta por escrito o seña recibida para iniciar la negociación con el propietario.
5. **Cierre de Operación**: Firma de boleto de compraventa, contrato de locación o escritura traslativa de dominio.

El uso de un CRM centralizado garantiza que la información pertenezca a la institución y no a los dispositivos individuales de los vendedores.

---

## 3. Automatización de Consultas en WhatsApp

WhatsApp es el canal primario de contacto en el mercado regional. Sin embargo, atender de forma manual mensajes fuera del horario comercial (noches y fines de semana) resulta impracticable sin apoyo tecnológico.

### Criterios de Configuración de Asistentes en WhatsApp:

* **Atención inmediata de fichas de propiedades**: Al recibir el código de referencia de un inmueble, el sistema envía los datos técnicos, valor de expensas y enlace a la ficha web.
* **Validación de requisitos para alquileres**: Verificar si el interesado cuenta con garantía propietaria, recibos de sueldo o seguro de caución antes de otorgar un turno de visita.
* **Derivación transparente a corredores**: Ante pedidos de quita de precio, ofertas de permuta o dudas legales sobre el dominio, el sistema transfiere de inmediato la conversación al asesor asignado.

---

## Matriz de Decisión: Desarrollo a Medida vs. Portales Tradicionales

| Criterio Operativo | Portales Inmobiliarios Compartidos | Plataforma Web + CRM Propio |
| :--- | :--- | :--- |
| **Control de Marca** | Compartido con competidores en el mismo listado | 100% exclusivo bajo tu propio dominio (.com.ar) |
| **Destino de los Leads** | El portal sugiere propiedades similares de otras agencias | Cada consulta ingresa de forma directa a tu CRM interno |
| **Modelo de Costos** | Cuotas mensuales fijas o variables según cantidad de avisos | **Pago Único** de infraestructura sin mensualidades recurrentes |
| **Personalización de Filtros** | Filtros genéricos estándar | Filtros adaptados a la tipología de tus captaciones locales |

---

## Errores Frecuentes en el Proceso de Digitalización

* **Publicar propiedades sin datos clave**: Omitir el valor de expensas o la ubicación aproximada genera un alto volumen de consultas de baja calidad que no convierten.
* **Mezclar consultas de ventas y alquileres en el mismo flujo**: Los plazos de decisión de un comprador (de 3 a 6 meses) son muy distintos a los de un inquilino (de 1 a 2 semanas), por lo que requieren seguimientos diferenciados.
* **No actualizar el estado del inventario**: Mantener en la web propiedades ya reservadas o vendidas genera desconfianza en los usuarios y pérdida de tiempo en el equipo.

---

Si querés evaluar la implementación de un portal web de propiedades y un CRM adaptado a tu inmobiliaria, podés conocer las características del sistema [Inmo-Scale 360°](/inmobiliarias) o comunicarte con nuestro equipo comercial a través de la sección de [Contacto](/contacto).`
  },
  {
    id: 'post-inmo-2',
    title: 'Limitaciones de Operar una Inmobiliaria Solo con Redes Sociales y WhatsApp',
    slug: 'porque-depender-solo-de-instagram-y-whatsapp-arruina-ventas-inmobiliarias',
    excerpt: 'Análisis de los problemas de organización, pérdida de clientes y falta de trazabilidad que surgen al utilizar perfiles de redes como única herramienta comercial.',
    category: 'inmobiliarias',
    categoryLabel: 'Inmobiliaria Digital',
    tags: ['estrategia inmobiliaria', 'crm inmobiliario', 'captación de propiedades', 'ventas inmobiliarias'],
    author: 'Kaptativa',
    authorRole: 'Compañía de Transformación Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80',
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Reunión de equipo comercial analizando estrategia de ventas e inventario',
    seoTitle: 'Limitaciones de Operar una Inmobiliaria Solo con Redes Sociales',
    seoDescription: 'Análisis sobre las dificultades de búsqueda, desorganización de contactos y pérdida de profesionalismo al no contar con web y CRM propio.',
    publishedAt: '2026-07-19',
    modifiedAt: '2026-07-23',
    readingTime: '8 min de lectura',
    primaryKeyword: 'desventajas instagram inmobiliaria',
    secondaryKeywords: ['vender propiedades sin web', 'crm para inmobiliarias', 'captar inmuebles en exclusiva'],
    searchIntent: 'Evaluativa e informativa para corredores que analizan problemas en su flujo de ventas actual.',
    keyTakeaways: [
      'El feed de las redes sociales desordena el inventario disponible y dificulta la búsqueda específica por precio y zona.',
      'Los chats sueltos de WhatsApp dificultan la realización de campañas de seguimiento a clientes que buscaron propiedades semanas atrás.',
      'La falta de una plataforma web institucional disminuye la confianza de los propietarios al momento de otorgar exclusivas.'
    ],
    faq: [
      {
        question: '¿Es necesario dejar de publicar en redes sociales si se implementa un sitio web?',
        answer: 'No. Las redes sociales son canales efectivos para generar difusión inicial. La estrategia recomendada es utilizarlas para atraer tráfico y derivar a los interesados al portal web, donde pueden ver la ficha completa y filtrar el inventario.'
      },
      {
        question: '¿Por qué los propietarios solicitan ver el sitio web de la inmobiliaria?',
        answer: 'Porque los propietarios buscan evaluar la inversión en marketing y la seriedad institucional de la agencia que administrará su patrimonio antes de firmar una autorización de venta.'
      }
    ],
    content: `Las redes sociales constituyen canales de visibilidad valiosos para difundir imágenes y videos de inmuebles. Sin embargo, utilizarlas como la **única herramienta de gestión comercial** presenta serias limitaciones operativas a medida que el catálogo de propiedades y el volumen de consultas aumentan.

A continuación, analizamos las principales dificultades de depender exclusivamente de perfiles sociales y chats de mensajería para administrar un negocio inmobiliario.

---

## 1. Dificultad para Encontrar Inmuebles Específicos

Las plataformas como Instagram o Facebook ordenan sus publicaciones por orden cronológico o según algoritmos de interacción. Esto genera dos inconvenientes principales:

* **Invisibilidad del inventario anterior**: Una propiedad publicada hace tres semanas queda relegada al final del perfil, aunque continúe disponible para la venta.
* **Ausencia de filtros de búsqueda**: Cuando un potencial comprador ingresa buscando un departamento de 2 ambientes en una zona y rango de precio específicos, no dispone de un buscador dentro del perfil para filtrar el catálogo. Debe revisar cada publicación de forma manual o enviar un mensaje genérico.

Un [sitio web de propiedades](/servicios/diseno-web) resuelve esta limitación ofreciendo buscadores dinámicos que muestran el inventario disponible actualizado al instante.

---

## 2. Fragmentación de Contactos y Falta de Seguimiento

Cuando las consultas ingresan directamente a cuentas de WhatsApp personales de los asesores:
* No existe un registro unificado del historial de búsquedas de los clientes.
* Resulta complejo realizar campañas de reactivación cuando ingresa un nuevo inmueble al catálogo (por ejemplo, notificar a todos los interesados que buscaron 3 ambientes en los últimos 60 días).
* En caso de rotación de personal, la información de los contactos en negociación corre el riesgo de perderse.

La implementación de un sistema de [automatización y CRM](/servicios/automatizacion) permite centralizar la base de contactos y mantener el control institucional del pipeline comercial.

---

## 3. Impacto en la Captación de Propiedades en Exclusiva

Al momento de elegir qué inmobiliaria comercializará un inmueble, los propietarios analizan la infraestructura de difusión de cada empresa.

Presentar una plataforma web profesional con dominio propio (.com.ar), fichas técnicas detalladas y procesos estructurados de atención brinda una imagen de solvencia institucional que favorece la obtención de autorizaciones de venta en exclusiva frente a agencias que solo publican en redes sociales.

---

## Buenas Prácticas para Articular Redes Sociales y Sitio Web

Para maximizar el rendimiento comercial sin abandonar las redes sociales:

1. **Utilizar las redes como canal de atracción**: Publicar reels y placas enfocados en generar curiosidad y destacar los atributos del inmueble.
2. **Incluir llamadas a la acción hacia el catálogo**: Agregar enlaces directos a la ficha web en las historias y biografía (\`tudominio.com/propiedades/codigo-102\`).
3. **Centralizar la conversión en el sitio web**: Permitir que el usuario filtre opciones similares en tu propia plataforma sin distraerse con publicaciones de otras agencias.

---

Para conocer cómo estructurar un canal web independiente y centralizar la atención de tu empresa, podés explorar nuestra propuesta para [Inmobiliarias](/inmobiliarias) o comunicarte con nuestro equipo desde la página de [Contacto](/contacto).`
  },
  {
    id: 'post-inmo-3',
    title: 'Agentes de Inteligencia Artificial en WhatsApp para Inmobiliarias: Alcances y Configuración',
    slug: 'agentes-ia-whatsapp-inmobiliarias-atiende-consultas-24-7',
    excerpt: 'Explicación técnica y operativa sobre cómo funcionan los asistentes conversacionales en WhatsApp, qué consultas pueden responder y cómo derivar casos a asesores.',
    category: 'inteligencia-artificial',
    categoryLabel: 'Inteligencia Artificial',
    tags: ['inteligencia artificial inmobiliaria', 'whatsapp inmobiliarias', 'automatización de consultas', 'gestión comercial'],
    author: 'Kaptativa',
    authorRole: 'Compañía de Transformación Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=200&q=80',
    featuredImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Dispositivo móvil mostrando pantalla de conversación de WhatsApp con asistente virtual',
    seoTitle: 'Agentes de IA en WhatsApp para Inmobiliarias: Guía Técnica',
    seoDescription: 'Cómo funcionan los asistentes de Inteligencia Artificial en WhatsApp para responder consultas técnicas de inmuebles y agendar visitas.',
    publishedAt: '2026-07-20',
    modifiedAt: '2026-07-23',
    readingTime: '8 min de lectura',
    primaryKeyword: 'agentes ia whatsapp inmobiliarias',
    secondaryKeywords: ['chatbot inmobiliario', 'automatizar expensas whatsapp', 'atención 24hs inmobiliaria'],
    searchIntent: 'Informativa y técnica para dueños de inmobiliarias que buscan automatizar la atención sin perder calidad conversacional.',
    keyTakeaways: [
      'A diferencia de los bots de menú rígido, los modelos conversacionales de IA interpretan preguntas formuladas en lenguaje natural.',
      'Su función principal es responder datos concretos de fichas técnicas y pre-calificar al usuario.',
      'Deben contar con reglas claras para derivar la atención a un corredor humano ante pedidos de negociación o consultas complejas.'
    ],
    faq: [
      {
        question: '¿El agente de IA puede inventar datos de las propiedades?',
        answer: 'No si está correctamente configurado. Los agentes se vinculan mediante API a la base de datos estructurada del catálogo de la inmobiliaria y responden únicamente con los campos validados (precio, m², expensas, fotos).'
      },
      {
        question: '¿Qué ocurre si un usuario escribe con errores de ortografía o notas de voz?',
        answer: 'Los modelos de procesamiento de lenguaje natural (NLP) modernos interpretan variaciones lingüísticas, modismos locales y pueden procesar notas de voz convirtiéndolas a texto antes de generar la respuesta.'
      }
    ],
    content: `La atención al cliente en el sector inmobiliario requiere inmediatez. Un porcentaje significativo de las consultas sobre propiedades en alquiler o venta ingresan fuera del horario de oficina o durante los fines de semana.

Los sistemas tradicionales de respuestas automáticas basados en menús de opciones ("Marque 1 para Ventas, Marque 2 para Alquileres") suelen resultar frustrantes para los usuarios. La incorporación de **Agentes de Inteligencia Artificial basados en procesadores de lenguaje natural** permite mantener conversaciones fluidas en WhatsApp respondiendo consultas específicas en tiempo real.

---

## Diferencias entre Menús Rígidos y Agentes de IA

| Característica | Bot Tradicional de Menú | Agente de IA Conversacional |
| :--- | :--- | :--- |
| **Interacción** | Requiere presionar números o botones predefinidos | Comprende frases completas y preguntas en lenguaje natural |
| **Acceso a Datos** | Respuestas estáticas pre-cargadas | Consulta la base de datos del catálogo web en tiempo real |
| **Flexibilidad** | Si el usuario hace una pregunta fuera del menú, falla | Interpreta variaciones, sinónimos y contexto de la consulta |
| **Derivación** | Deriva por horario o de forma indiscriminada | Evalúa la intención del cliente antes de transferir al asesor |

---

## Funciones Principales de un Agente IA en Inmobiliarias

### 1. Respuesta Inmediata a Fichas Técnicas
Cuando un usuario consulta por un inmueble específico en WhatsApp (enviando el código de referencia o el enlace de la web), la IA lee la información registrada en el sistema y responde datos puntuales:
* Superficie cubierta y balcones.
* Valor actualizado de expensas y tasas.
* Apto profesional o apto crédito bancario.
* Disponibilidad de cocheras y baulera.

### 2. Pre-calificación del Cliente
El agente puede realizar preguntas clave de manera conversacional para determinar el perfil del interesado:
* *"¿Buscás comprar para vivienda familiar o como inversión?"*
* *"¿Necesitás vender una propiedad previamente?"*
* *"¿En qué plazo estimás concretar la mudanza?"*

Esta información se guarda automáticamente en la ficha del contacto dentro del [CRM comercial](/servicios/automatizacion).

### 3. Agendamiento de Visitas Presenciales
Si el interesado cumple con las condiciones y manifiesta intención de conocer el inmueble, la IA consulta la disponibilidad de agenda del asesor asignado a la propiedad y propone turnos para coordinar la muestra.

---

## Criterios de Seguridad y Límites de la IA

Es fundamental establecer límites operativos en la configuración del agente:
* **Negociaciones de precio**: La IA no debe acordar quitas ni valores de oferta. Ante una propuesta de precio, debe registrar la cifra y notificar al corredor responsable.
* **Aspectos legales y dominiales**: Dudas sobre escrituración, usufructos o condiciones de contratos de locación deben derivarse siempre al profesional matriculado.

---

Si querés conocer más sobre el desarrollo de asistentes virtuales e integraciones con IA, podés visitar nuestro apartado de [Agentes de Inteligencia Artificial](/servicios/agentes-ia) o probar el funcionamiento en el [Simulador Demo](/inmo-demo).`
  },
  {
    id: 'post-inmo-4',
    title: 'Cómo Estructurar un Embudo de Ventas Inmobiliario con Tablero Kanban',
    slug: 'crm-inmobiliario-tablero-kanban-embudo-de-ventas',
    excerpt: 'Pasos para organizar las etapas comerciales de una inmobiliaria, desde la recepción de la consulta hasta la firma de reserva o contrato.',
    category: 'automatizacion',
    categoryLabel: 'Automatización',
    tags: ['crm inmobiliario', 'embudo de ventas', 'gestión comercial', 'procesos inmobiliarios'],
    author: 'Kaptativa',
    authorRole: 'Compañía de Transformación Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Tablero de seguimiento de proyectos comerciales organizado en columnas de avance',
    seoTitle: 'Cómo Estructurar un Embudo de Ventas Inmobiliario Kanban',
    seoDescription: 'Guía para organizar las etapas comerciales de tu inmobiliaria con un CRM Kanban visual, desde la consulta hasta la firma.',
    publishedAt: '2026-07-21',
    modifiedAt: '2026-07-23',
    readingTime: '7 min de lectura',
    primaryKeyword: 'crm inmobiliario kanban',
    secondaryKeywords: ['embudo de ventas inmobiliario', 'pipeline de propiedades', 'gestion de clientes inmobiliaria'],
    searchIntent: 'Informativa y de gestión de procesos para estructurar el trabajo del equipo de ventas.',
    keyTakeaways: [
      'El método Kanban divide el proceso comercial en columnas visibles que reflejan el estado real de cada oportunidad.',
      'Permite detectar en qué etapa se traban las operaciones (por ejemplo, alta cantidad de visitas pero pocas reservas).',
      'Centraliza el historial de interacciones para que cualquier integrante del equipo pueda dar seguimiento.'
    ],
    faq: [
      {
        question: '¿Cuál es la diferencia entre un CRM genérico y uno adaptado a inmobiliarias?',
        answer: 'Los CRM genéricos están diseñados para venta de productos estándar. Un CRM inmobiliario necesita vincular cada prospecto a fichas de inmuebles específicas, registrar valores en USD/ARS, administrar datos de expensas y coordinar visitas presenciales.'
      }
    ],
    content: `En la comercialización de bienes raíces, el ciclo de venta suele extenderse por varios meses. Durante ese período, un corredor administra decenas de conversaciones en paralelo con compradores, vendedores, inquilinos y propietarios.

Sin un método visual de organización, resulta habitual que se olviden llamados de seguimiento, se retrasen envíos de documentación o se pierda el rastro de clientes que realizaron visitas semanas atrás. La metodología **Kanban** ofrece una estructura visual en columnas que facilita el control de cada oportunidad de negocio.

---

## Las 5 Etapas Esenciales del Pipeline Inmobiliario

Para que el tablero sea efectivo, las columnas deben reflejar estados de avance objetivos y verificables:

### 1. Entrada / Consulta Nueva
En esta etapa caen de forma automática todos los contactos generados desde el [sitio web inmobiliario](/inmobiliarias), formularios o WhatsApp. La prioridad en esta columna es contactar al interesado en un lapso menor a 24 horas.

### 2. Calificado / En Búsqueda
El cliente ha sido contactado y se han validado sus requerimientos básicos: tipo de inmueble, zona de preferencia, presupuesto disponible y plazo de concreción.

### 3. Visita Agendada
Se ha fijado día y hora para mostrar la propiedad. En esta etapa es recomendable activar recordatorios automáticos por WhatsApp 24 horas antes de la cita para reducir el ausentismo.

### 4. Reserva / Negociación
El interesado presentó una propuesta de compra o seña formal por escrito. La tarjeta permanece en esta etapa mientras se evalúa la oferta con el propietario y se confecciona el boleto o contrato.

### 5. Cierre / Firma
La operación se ha concretado de manera exitosa (escritura realizada o contrato de locación firmado) y se procede a la entrega de llaves y liquidación de honorarios.

---

## Indicadores Clave para Evaluar el Embudo

Organizar la gestión en un tablero Kanban permite medir métricas operativas concretas:
* **Tiempo promedio de permanencia por columna**: Identificar cuántos días permanece un cliente en etapa de "Visita Agendada" antes de pasar a "Reserva".
* **Tasa de conversión Visita -> Reserva**: Si se realizan muchas visitas pero pocas reservas, puede señalar deficiencias en la fijación del precio de lista o en la presentación del inmueble.
* **Motivos de pérdida**: Registrar la razón por la cual se descarta una oportunidad (precio alto, falta de financiación, zona no deseada) para ajustar la estrategia de captación futura.

---

Para explorar cómo implementar un embudo comercial visual en tu empresa, podés revisar nuestras soluciones de [Automatización de Procesos](/servicios/automatizacion).`
  },
  {
    id: 'post-inmo-5',
    title: 'SEO y GEO Inmobiliario: Cómo Posicionar un Catálogo de Propiedades en Google y Motores de IA',
    slug: 'seo-inmobiliario-posicionar-catalogo-propiedades-google-ia',
    excerpt: 'Conceptos de optimización técnica, estructuras de URL y datos estructurados Schema.org para lograr visibilidad en búsquedas locales y buscadores conversacionales.',
    category: 'seo',
    categoryLabel: 'SEO & GEO',
    tags: ['seo inmobiliario', 'geo ia inmobiliarias', 'posicionamiento web', 'datos estructurados'],
    author: 'Kaptativa',
    authorRole: 'Compañía de Transformación Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=200&q=80',
    featuredImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Gráfico interactivo representando posicionamiento de catálogo en buscadores web',
    seoTitle: 'SEO y GEO Inmobiliario: Posicionamiento de Propiedades en Google e IA',
    seoDescription: 'Estrategias técnicas para posicionar tu catálogo inmobiliario en Google y buscadores de Inteligencia Artificial.',
    publishedAt: '2026-07-22',
    modifiedAt: '2026-07-23',
    readingTime: '8 min de lectura',
    primaryKeyword: 'seo inmobiliario google',
    secondaryKeywords: ['geo ia inmobiliarias', 'posicionar inmuebles en google', 'schema org real estate'],
    searchIntent: 'Técnica e informativa para optimizar la visibilidad orgánica del catálogo inmobiliario.',
    keyTakeaways: [
      'Las URLs semánticas limpias con ubicación y características facilitan la indexación en motores de búsqueda.',
      'Los datos estructurados (Schema.org) permiten que buscadores generativos de IA lean precio, m² y ubicación de forma precisa.',
      'El SEO local a través de Google Business Profile refuerza las consultas geolocalizadas en mapas.'
    ],
    faq: [
      {
        question: '¿Qué es GEO (Generative Engine Optimization)?',
        answer: 'Es la disciplina de optimización web enfocada en lograr que motores de búsqueda basados en inteligencia artificial (como ChatGPT Search, Perplexity o Gemini) comprendan y citen el contenido de un sitio al responder preguntas conversacionales de los usuarios.'
      }
    ],
    content: `El comportamiento de búsqueda de los usuarios al buscar inmuebles ha evolucionado. Además de las búsquedas tradicionales en Google mediante palabras clave como *"departamento 3 ambientes Belgrano"*, cada vez más personas realizan consultas conversacionales en buscadores impulsados por Inteligencia Artificial.

Para competir por visibilidad orgánica sin depender exclusivamente del pago de pauta publicitaria, un sitio web inmobiliario debe aplicar criterios de **SEO (Search Engine Optimization)** y **GEO (Generative Engine Optimization)**.

---

## 1. Estructura Semántica de URLs y Encabezados

Cada propiedad del catálogo debe contar con una dirección URL limpia que describa el contenido de la ficha de forma legible tanto para usuarios como para los bots de rastreo.

* **Estructura poco efectiva**: \`tudominio.com/propiedad.php?id=7821\`
* **Estructura semántica recomendada**: \`tudominio.com/propiedades/departamento-3-ambientes-balcon-palermo\`

Asimismo, la ficha debe organizar su contenido respetando la jerarquía HTML nativa: un único título **H1** principal, secciones **H2** para características generales, ubicación y expensas, e imágenes con etiquetas \`alt\` descriptivas (por ejemplo: *"Living comedor amplio con ventanal al frente en departamento de Palermo"*).

---

## 2. Implementación de Datos Estructurados Schema.org (JSON-LD)

Los datos estructurados son código estandarizado que se inyecta en el HTML de la página para indicarle a los motores de búsqueda exactamente qué tipo de información contiene cada bloque.

En el rubro inmobiliario, se utilizan principalmente dos esquemas de Schema.org:
* **RealEstateAgent**: Identifica los datos institucionales de la inmobiliaria (nombre, dirección de la oficina, teléfono de contacto, horario de atención y zona de cobertura).
* **SingleFamilyResidence / Residence**: Describe los atributos del inmueble (precio de venta/alquiler, moneda, superficie cubierta, cantidad de dormitorios y baños).

Al contar con datos estructurados, los motores de Inteligencia Artificial pueden interpretar la ficha y mostrar el inmueble cuando un usuario pregunta: *"¿Qué opciones de departamentos de 3 ambientes en venta hay disponibles en la zona de Belgrano por menos de 180 mil dólares?"*.

---

## 3. Optimización para SEO Local

La captación de clientes e inmuebles en una zona determinada depende en gran medida del posicionamiento local. Para reforzar este aspecto:
* Mantener actualizada la ficha de **Google Business Profile** con la dirección física exacta de la oficina inmobiliaria.
* Vincular las reseñas y opiniones de clientes verificados.
* Incluir mapas interactivos embebidos en las fichas del portal web.

---

Podés conocer más sobre nuestras metodologías de desarrollo técnico y posicionamiento en la sección de [Servicios SEO & GEO](/servicios/seo-geo).`
  },
  {
    id: 'post-inmo-6',
    title: 'Estrategias de Presentación Comercial para la Captación de Propiedades en Exclusiva',
    slug: 'como-captar-propiedades-exclusivas-portal-web-vanguardia',
    excerpt: 'Criterios de propuesta de valor, transparencia en la difusión y presentación tecnológica para fundamentar la firma de autorizaciones de venta exclusivas.',
    category: 'diseno-web',
    categoryLabel: 'Diseño Web',
    tags: ['captación de propiedades', 'exclusivas inmobiliarias', 'propuesta de valor', 'gestión inmobiliaria'],
    author: 'Kaptativa',
    authorRole: 'Compañía de Transformación Digital',
    authorAvatar: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80',
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Corredor inmobiliario presentando plan de comercialización a propietarios',
    seoTitle: 'Captación Inmobiliaria Exclusiva: Estrategia de Presentación',
    seoDescription: 'Criterios para fundamentar la captación de propiedades en exclusiva mediante una propuesta de difusión sólida y transparente.',
    publishedAt: '2026-07-23',
    modifiedAt: '2026-07-23',
    readingTime: '7 min de lectura',
    primaryKeyword: 'captar propiedades exclusivas',
    secondaryKeywords: ['captacion inmobiliaria', 'autorizacion de venta exclusiva', 'honorarios inmobiliarios'],
    searchIntent: 'Informativa y comercial para corredores que buscan mejorar su tasa de captación en exclusiva.',
    keyTakeaways: [
      'Los propietarios otorgan autorizaciones exclusivas cuando perciben un plan de marketing profesional y diferencial.',
      'Demostrar capacidad de respuesta inmediata (web + WhatsApp) brinda seguridad sobre el cuidado del activo.',
      'Presentar informes periódicos de avance mantiene la confianza durante todo el período de comercialización.'
    ],
    faq: [
      {
        question: '¿Por qué algunos propietarios se resisten a firmar contratos de exclusiva?',
        answer: 'La resistencia suele deberse al temor de que la inmobiliaria publique el inmueble y no realice acciones activas de difusión. Fundamentar la presentación con un plan de marketing concreto y reportes periódicos disipa esa desconfianza.'
      }
    ],
    content: `La captación de inmuebles en exclusiva es uno de los objetivos más valiosos para un corredor profesional. Obtener la representación exclusiva de una propiedad permite destinar recursos de difusión con la certeza de que el trabajo comercial se traducirá en el cobro de los honorarios correspondientes.

Sin embargo, los propietarios suelen manifestar reticencias a firmar autorizaciones en exclusiva si perciben que la agencia realizará el mismo proceso que cualquier otro competidor.

---

## Tres Argumentos Clave en la Reunión de Captación

Para fundamentar el pedido de exclusiva frente a un cliente vendedor, la propuesta de valor debe respaldarse con elementos concretos:

### 1. Plan de Difusión y Presentación del Inmueble
Explicar en detalle cómo se promocionará la propiedad:
* Publicación en la [plataforma web de la empresa](/inmobiliarias) con fotografías profesionales de alta calidad, plano de distribución y ficha técnica detallada.
* Segmentación en canales digitales para alcanzar al perfil de comprador objetivo.
* Recorridos virtuales o material audiovisual optimizado para exhibir los puntos fuertes del inmueble.

### 2. Canales de Atención Inmediata para Interesados
Demostrar que ninguna consulta sobre su propiedad quedará sin responder:
* Presentar los flujos de atención automatizados en WhatsApp que responden dudas sobre expensas y superficie las 24 horas.
* Explicar el filtro de pre-calificación que se realiza antes de coordinar muestras presenciales en la vivienda.

### 3. Reportes de Avance y Transparencia
El propietario busca estar informado sobre la evolución de la venta:
* Establecer la entrega de informes quincenales que detallen la cantidad de visualizaciones en la web, consultas recibidas por WhatsApp y visitas presenciales concretadas.
* Compartir los comentarios de los visitantes para evaluar si es necesario realizar ajustes en la estrategia o en la fijación del precio de lista.

---

## Conclusión

La obtención de exclusivas se basa en la confianza y en la capacidad demostrable de comercializar un patrimonio con profesionalismo. Contar con herramientas tecnológicas claras permite respaldar la propuesta de valor de la firma inmobiliaria ante cada nuevo propietario.

Si querés conocer más sobre cómo estructurar la presencia digital de tu agencia, podés consultar nuestros [Servicios de Desarrollo Web](/servicios/diseno-web) o ponerte en contacto desde la sección de [Contacto](/contacto).`
  }
];

export function getPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug);
}
