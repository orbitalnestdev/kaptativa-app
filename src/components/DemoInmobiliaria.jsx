import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── Catálogo ────────────────────────────────────────────────────────────────
const PROP_STATUSES = {
  disponible: { label: "Disponible", color: "#10b981", bg: "rgba(16, 185, 129, 0.14)", border: "rgba(16, 185, 129, 0.3)", icon: "" },
  reservada:  { label: "Reservada",  color: "#f59e0b", bg: "rgba(245, 158, 11, 0.14)", border: "rgba(245, 158, 11, 0.3)", icon: "" },
  vendida:    { label: "Vendida",    color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.14)", border: "rgba(139, 92, 246, 0.3)", icon: "" },
  alquilada:  { label: "Alquilada",  color: "#38bdf8", bg: "rgba(56, 189, 248, 0.14)", border: "rgba(56, 189, 248, 0.3)", icon: "" },
  pausada:    { label: "Pausada",    color: "#94a3b8", bg: "rgba(148, 163, 184, 0.14)", border: "rgba(148, 163, 184, 0.3)", icon: "" },
  borrador:   { label: "Borrador",   color: "#fb923c", bg: "rgba(251, 146, 60, 0.14)", border: "rgba(251, 146, 60, 0.3)", icon: "" },
};

const CATALOGO = [
  { id: "P1", cod: "AUR-1042", tipo: "depto", operacion: "alquiler", estadoProp: "disponible", zona: "Palermo, CABA", precio: "$ 620.000", precioNota: "/mes + $48.000 exp.", m2: 48, amb: 2, dorm: 1, banos: 1, extra: "Espectacular semi-piso a estrenar en Palermo Nuevo. Vista abierta al contrafrente, súper luminoso. Cocina integrada con mesada de granito, barra desayunadora, balcón francés y baño completo de categoría.", photo: "photo-1665249934445-1de680641f50", dias: 4, consultas: 14, destacado: true, fotos: 8, titulo: "Semi-piso de Diseño en Palermo Nuevo" },
  { id: "P2", cod: "AUR-2087", tipo: "casa", operacion: "venta", estadoProp: "disponible", zona: "Nordelta, Tigre", precio: "USD 320.000", precioNota: "", m2: 240, amb: 5, dorm: 3, banos: 3, extra: "Hermosa casa moderna de estilo minimalista en el Barrio La Isla, Nordelta. Desarrollada en dos plantas. Living comedor con doble altura, suite principal con vestidor, jardín parquizado con piscina y quincho con parrilla.", photo: "photo-1531971589569-0d9370cbe1e5", dias: 12, consultas: 9, destacado: true, fotos: 14, titulo: "Casa Minimalista con Piscina en Nordelta" },
  { id: "P3", cod: "AUR-1108", tipo: "depto", operacion: "alquiler", estadoProp: "reservada", zona: "Recoleta, CABA", precio: "$ 480.000", precioNota: "/mes", m2: 38, amb: 1, dorm: 1, banos: 1, extra: "Monoambiente divisible de categoría en Recoleta. Totalmente amoblado y equipado con diseño moderno, aire acondicionado frío/calor, cocina integrada con anafe vitrocerámico y placard empotrado.", photo: "photo-1675279200694-8529c73b1fd0", dias: 2, consultas: 8, destacado: false, fotos: 6, titulo: "Moderno Studio Amoblado en Recoleta" },
  { id: "P4", cod: "AUR-3015", tipo: "PH", operacion: "venta", estadoProp: "disponible", zona: "Palermo Soho, CABA", precio: "USD 185.000", precioNota: "", m2: 95, amb: 3, dorm: 2, banos: 2, extra: "PH antiguo reciclado a nuevo con entrada independiente en Palermo Soho. Sin expensas. Patio propio de 25m² con parrilla, techos de bovedilla vista y entrepiso con terraza propia solárium.", photo: "photo-1583847268964-b28dc8f51f92", dias: 21, consultas: 11, destacado: true, fotos: 12, titulo: "PH de Estilo con Patio y Parrilla" },
  { id: "P5", cod: "AUR-5003", tipo: "local", operacion: "alquiler", estadoProp: "alquilada", zona: "Belgrano, CABA", precio: "$ 1.450.000", precioNota: "/mes", m2: 85, amb: 2, dorm: 0, banos: 2, extra: "Excelente local comercial a la calle sobre Av. Cabildo en zona comercial prime. Planta baja libre de 65 m² y entrepiso de 20 m². Vidriera blindex de doble altura y persiana microperforada motorizada.", photo: "photo-1528698827591-e19ccd7bc23d", dias: 8, consultas: 6, destacado: false, fotos: 5, titulo: "Local Comercial Premium Av. Cabildo" },
  { id: "P6", cod: "AUR-6001", tipo: "lote", operacion: "venta", estadoProp: "pausada", zona: "San Isidro, GBA Norte", precio: "USD 140.000", precioNota: "", m2: 450, amb: 0, dorm: 0, banos: 0, extra: "Espectacular terreno residencial en las Lomas de San Isidro. Frente de 15 metros por 30 de fondo, arbolado y nivelado. Listo para construir, escrituración inmediata con todos los servicios subterráneos.", photo: "photo-1495107334309-fcf20504a5ab", dias: 15, consultas: 5, destacado: false, fotos: 4, titulo: "Lote Residencial en Lomas de San Isidro" },
  { id: "P7", cod: "AUR-7020", tipo: "depto", operacion: "venta", estadoProp: "vendida", zona: "Puerto Madero, CABA", precio: "USD 490.000", precioNota: "", m2: 120, amb: 3, dorm: 2, banos: 2, extra: "Penthouse de gran lujo en Torre Madero Centre. Vista panorámica al dique y la reserva ecológica. Balcón aterrazado con jacuzzi propio, amenities de resort (spa, piscina climatizada y gym).", photo: "photo-1545324418-cc1a3fa10c00", dias: 6, consultas: 18, destacado: true, fotos: 16, titulo: "Penthouse de Lujo con Jacuzzi en Puerto Madero" },
  { id: "P8", cod: "AUR-8012", tipo: "oficina", operacion: "alquiler", estadoProp: "disponible", zona: "Catalinas Norte, CABA", precio: "USD 2.800", precioNota: "/mes + exp.", m2: 160, amb: 4, dorm: 0, banos: 3, extra: "Oficina corporativa AAA en Torre Catalinas. Planta libre alfombrada con divisiones en cristal templado, sala de reuniones ejecutiva, office completo y 3 cocheras fijas en subsuelo.", photo: "photo-1497366216548-37526070297c", dias: 10, consultas: 7, destacado: false, fotos: 9, titulo: "Piso de Oficinas AAA en Catalinas Norte" },
  { id: "P9", cod: "AUR-4050", tipo: "casa", operacion: "venta", estadoProp: "borrador", zona: "San Telmo, CABA", precio: "USD 260.000", precioNota: "", m2: 210, amb: 6, dorm: 4, banos: 3, extra: "Casona histórica de estilo señorial en San Telmo. Techos de 4.5 metros, pisos de pino tea original, carpinterías de cedro tallado, patio central andaluz con aljibe y terraza propia.", photo: "photo-1600585154340-be6161a56a0c", dias: 30, consultas: 10, destacado: false, fotos: 15, titulo: "Casona Histórica de Estilo en San Telmo" },
  { id: "P10", cod: "AUR-9011", tipo: "deposito", operacion: "alquiler", estadoProp: "disponible", zona: "Avellaneda, GBA Sur", precio: "$ 2.100.000", precioNota: "/mes", m2: 500, amb: 2, dorm: 0, banos: 2, extra: "Nave industrial y depósito logístico con cortina metálica para camiones de gran porte. Altura libre de 8 metros, piso de hormigón llaneado de alta resistencia y sector de oficinas administrativas.", photo: "photo-1586528116311-ad8dd3c8310d", dias: 18, consultas: 4, destacado: false, fotos: 7, titulo: "Nave Industrial y Depósito Logístico" }
];

const NOMBRE_INMO = "Grupo Aurora Propiedades";
const imgUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=560&q=70`;

const LEADS_SEED = [
  { id: "L1", nombre: "Carla Méndez", contacto: "+54 9 11 5512-3344", intencion: "alquiler", zona: "Palermo", presupuesto: "USD 500", estado: "calificando", origen: "Instagram", t: "hace 1 h", live: false },
  { id: "L2", nombre: "Roberto Díaz", contacto: "rdiaz@mail.com", intencion: "compra", zona: "Nordelta", presupuesto: "USD 250.000", estado: "calificado", origen: "Web · AUR-2087", t: "hace 3 h", live: false },
  { id: "L3", nombre: "Lucía Fernández", contacto: "+54 9 11 4477-9090", intencion: "alquiler", zona: "Caballito", presupuesto: "—", estado: "nuevo", origen: "WhatsApp", t: "hace 20 min", live: true },
  { id: "L4", nombre: "Marcos Ibáñez", contacto: "+54 9 341 622-1188", intencion: "compra", zona: "Funes", presupuesto: "USD 45.000", estado: "visita_agendada", origen: "Web · AUR-6001", t: "ayer", live: false },
  { id: "L5", nombre: "Sofía Re", contacto: "sofiare@mail.com", intencion: "compra", zona: "Microcentro", presupuesto: "USD 90.000", estado: "cerrado", origen: "Referido", t: "hace 3 días", live: false },
  { id: "L6", nombre: "Matías Kurchan", contacto: "+54 9 11 3344-9988", intencion: "compra", zona: "Puerto Madero", presupuesto: "USD 450.000", estado: "calificado", origen: "WhatsApp", t: "hace 10 min", live: true },
  { id: "L7", nombre: "Mariana Albornoz", contacto: "+54 9 11 8899-7766", intencion: "alquiler", zona: "Recoleta", presupuesto: "$ 500.000", estado: "visita_agendada", origen: "Web · AUR-1108", t: "hace 2 h", live: false }
];

const COLS = [
  { key: "nuevo", label: "Nuevo" }, { key: "calificando", label: "Calificando" }, { key: "calificado", label: "Calificado" },
  { key: "visita_agendada", label: "Visita agendada" }, { key: "cerrado", label: "Cerrado" },
];

const grad = "linear-gradient(135deg, #EA384D, #8b5cf6)";

const featLine = (p) => {
  const parts = [];
  if (p.m2) parts.push(`${p.m2} m²`);
  if (p.amb) parts.push(`${p.amb} amb`);
  if (p.dorm) parts.push(`${p.dorm} dorm`);
  if (p.banos) parts.push(`${p.banos} ${p.banos > 1 ? 'baños' : 'baño'}`);
  return parts.join(" · ");
};

const tagColor = (tag) => {
  const tags = {
    IA: { color: "#8b5cf6", background: "rgba(139, 92, 246, 0.1)" },
    Visita: { color: "#EA384D", background: "rgba(14, 165, 233, 0.1)" },
    Web: { color: "#10b981", background: "rgba(16, 185, 129, 0.1)" },
    Cierre: { color: "#ec4899", background: "rgba(236, 72, 153, 0.1)" }
  };
  return tags[tag] || { color: "#9aa7b5", background: "rgba(154, 167, 181, 0.1)" };
};

const stColor = (estado) => {
  const states = {
    nuevo: { color: "#8A35E5", background: "rgba(59, 130, 246, 0.1)" },
    calificando: { color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" },
    calificado: { color: "#10b981", background: "rgba(16, 185, 129, 0.1)" },
    visita_agendada: { color: "#8b5cf6", background: "rgba(139, 92, 246, 0.1)" },
    cerrado: { color: "#ec4899", background: "rgba(236, 72, 153, 0.1)" }
  };
  return states[estado] || { color: "#9aa7b5", background: "rgba(154, 167, 181, 0.1)" };
};

// ── Blog Inicial ────────────────────────────────────────────────────────────
const INITIAL_POSTS = [
  {
    id: "BLOG-1",
    titulo: "Guía completa de Inversión Inmobiliaria en CABA 2026: Zonas con mayor rentabilidad",
    slug: "guia-inversion-inmobiliaria-caba-2026",
    extracto: "Descubrí cuáles son los barrios de CABA con mejor retorno en dólares para alquileres temporarios y tradicionales este año.",
    contenido: "<h2>¿Dónde conviene invertir en CABA en 2026?</h2><p>El mercado inmobiliario en la Ciudad de Buenos Aires presenta oportunidades excepcionales para inversores que buscan rentabilidad en dólares. Barrios tradicionales como <strong>Palermo, Recoleta y Belgrano</strong> continúan liderando las preferencias.</p><h3>1. Palermo Nuevo & Soho</h3><p>Con un retorno promedio del 6.5% anual en dólares para alquileres temporarios, Palermo sigue siendo el epicentro del interés extranjero y turístico.</p><h3>2. Parque Patricios & Distrito Tecnológico</h3><p>El crecimiento del distrito tecnológico impulsó la demanda de viviendas jóvenes y oficinas corporativas de mediana escala.</p>",
    imagen: "photo-1545324418-cc1a3fa10c00",
    autor: "Mariano Torres",
    categoria: "Inversiones",
    tags: "Inversión, CABA, Rentabilidad, Alquileres",
    estado: "publicado",
    fechaPublicacion: "2026-06-15T10:00",
    ultimaModificacion: "2026-06-15T10:00",
    seoTitulo: "Guía de Inversión Inmobiliaria CABA 2026 | Grupo Aurora",
    seoDescripcion: "Conocé las mejores zonas de Buenos Aires para invertir en bienes raíces este 2026. Análisis de rentabilidad en USD."
  },
  {
    id: "BLOG-2",
    titulo: "Consejos clave para comprar tu primera propiedad sin cometer errores",
    slug: "consejos-comprar-primera-propiedad",
    extracto: "Pasos fundamentales para revisar la documentación legal, gastos de escrituración y negociar el mejor precio.",
    contenido: "<h2>Pasos esenciales antes de firmar la reserva</h2><p>Comprar una vivienda es una de las decisiones financieras más importantes. Tener en cuenta el estado dominial del inmueble y los costos asociados evitará sorpresas desagradables.</p><h3>Verificación de Títulos</h3><p>Asegurate de contar con el informe de dominio e inhibición emitido por el Registro de la Propiedad Inmueble.</p>",
    imagen: "photo-1560518883-ce09059eeffa",
    autor: "Eliana Acosta",
    categoria: "Guías de Compra",
    tags: "Primera Vivienda, Escritura, CUCICBA",
    estado: "publicado",
    fechaPublicacion: "2026-06-10T14:30",
    ultimaModificacion: "2026-06-10T14:30",
    seoTitulo: "Cómo Comprar tu Primera Propiedad en Argentina | Guía 2026",
    seoDescripcion: "Checklist con todo lo que necesitás saber antes de comprar tu primer departamento o casa."
  },
  {
    id: "BLOG-3",
    titulo: "Tendencias de Arquitectura y Diseño Interior en Casas de Nordelta",
    slug: "tendencias-arquitectura-diseno-nordelta",
    extracto: "Estilo minimalista, espacios abiertos interconectados con el agua y eficiencia energética sustentable.",
    contenido: "<h2>El nuevo lujo en desarrollos suburbanos</h2><p>Las casas modernas priorizan la luz natural, la integración de jardines interiores y paneles solares de alta eficiencia.</p>",
    imagen: "photo-1531971589569-0d9370cbe1e5",
    autor: "Gonzalo Rivas",
    categoria: "Mercado",
    tags: "Nordelta, Diseño, Arquitectura, Casas",
    estado: "programado",
    fechaPublicacion: "2026-07-28T09:00",
    ultimaModificacion: "2026-06-20T11:15",
    seoTitulo: "Arquitectura y Diseño en Nordelta 2026 | Grupo Aurora",
    seoDescripcion: "Descubrí las tendencias en casas de lujo en Nordelta: sustentabilidad, piscinas sin fin y espacios integrados."
  },
  {
    id: "BLOG-4",
    titulo: "Análisis del crédito hipotecario UVA y tasa fija en 2026",
    slug: "analisis-credito-hipotecario-uva-2026",
    extracto: "Comparativa entre sistemas de amortización y consejos para calificar al crédito bancario.",
    contenido: "<p>Borrador en preparación por el equipo de consultores de Grupo Aurora...</p>",
    imagen: "photo-1450133064473-71024230f91b",
    autor: "Mariano Torres",
    categoria: "Inversiones",
    tags: "Hipotecario, Crédito, Bancos",
    estado: "borrador",
    fechaPublicacion: "2026-07-01T12:00",
    ultimaModificacion: "2026-06-21T18:00",
    seoTitulo: "Créditos Hipotecarios en Argentina 2026 | Análisis",
    seoDescripcion: "Comparativa detallada de líneas de crédito bancario para la compra de vivienda en Argentina."
  }
];

// ── Proyectos & Emprendimientos Iniciales ──────────────────────────────────
const INITIAL_PROJECTS = [
  {
    id: "PROJ-1",
    titulo: "Torre Libertador Luxury Residences",
    subtitle: "Desarrollo Exclusivo en Belgrano Chico",
    badge: "En Pozo · Entrega 2027",
    category: "Residencial",
    tipo: "Torre de Lujo",
    descripcionBreve: "Torre residencial de 28 pisos con vista panorámica al Río de la Plata y amenities de nivel 5 estrellas.",
    descripcionCompleta: "<h2>Un nuevo estándar de lujo en Buenos Aires</h2><p>Torre Libertador es un ícono arquitectónico diseñado para redefinir el concepto de vida urbana de lujo en Buenos Aires. Unidades de 2, 3 y 4 dormitorios con palier privado, amplios balcones aterrazados y terminaciones importadas de máxima calidad.</p><h3>Amenities Exclusivos</h3><ul><li>Piscina in/out climatizada en piso 28 con vista 360° al río</li><li>SPA, Sauna seco/húmedo y sala de masajes</li><li>Gimnasio equipado con tecnología de vanguardia</li><li>SUM gourmet con cocina profesional para eventos</li><li>Seguridad digital y vigilancia 24hs con control de acceso bioeléctrico</li></ul>",
    image: "photo-1545324418-cc1a3fa10c00",
    gallery: [
      "photo-1545324418-cc1a3fa10c00",
      "photo-1600585154340-be6161a56a0c",
      "photo-1600596542815-ffad4c1539a9",
      "photo-1600607687939-ce8a6c25118c"
    ],
    ubicacion: "Av. del Libertador 5200, Belgrano Chico, CABA",
    fecha: "Diciembre 2027",
    cliente: "Grupo Desarrollador Aurora & Asociados",
    tech: "Piscina In/Out, SPA & Wellness, Seguridad 24hs, Domótica, Helipuerto",
    servicios: "Proyecto Arquitectónico, Dirección de Obra, Comercialización Exclusiva",
    resultados: "85% de las unidades vendidas en etapa de pozo. Rentabilidad estimada del 35% al finalizar la obra.",
    link: "https://grupoaurora.com.ar/brochure-libertador.pdf",
    order: 1,
    destacado: true,
    status: "publicado",
    slug: "torre-libertador-luxury-residences",
    seoTitulo: "Torre Libertador Luxury Residences | Pozo Belgrano CABA",
    seoDescripcion: "Departamentos de lujo en pozo en Av. Libertador. Amenities 5 estrellas y vistas al río. Conocé los planos y precios."
  },
  {
    id: "PROJ-2",
    titulo: "Barrio Privado Los Álamos de Nordelta",
    subtitle: "Masterplan de Casas Sustentables con Lago Propio",
    badge: "Últimos Lotes Disponibles",
    category: "Barrio Privado",
    tipo: "Desarrollo Suburbano",
    descripcionBreve: "Complejo residencial cerrado de 45 hectáreas rodeado de naturaleza, laguna navegable y club house deportivo.",
    descripcionCompleta: "<h2>Naturaleza, deporte y seguridad</h2><p>Los Álamos combina la tranquilidad de la naturaleza con la cercanía a los principales centros comerciales y de salud de Tigre. Casas de diseño moderno con certificación de eficiencia energética.</p>",
    image: "photo-1512917774080-9991f1c4c750",
    gallery: [
      "photo-1512917774080-9991f1c4c750",
      "photo-1600585154526-990dced4db0d",
      "photo-1580587771525-78b9dba3b914"
    ],
    ubicacion: "Ruta 27 Km 8.5, Nordelta, Tigre",
    fecha: "Marzo 2026",
    cliente: "Fideicomiso Nordelta Sur",
    tech: "Laguna Navegable, Canchas de Tenis/Pádel, Seguridad Térmica, Paneles Solares",
    servicios: "Loteo, Infraestructura de Servicios, Venta de Lotes y Casas Llave en Mano",
    resultados: "120 lotes adjudicados. Red de fibra óptica y servicios subterráneos 100% terminados.",
    link: "",
    order: 2,
    destacado: true,
    status: "publicado",
    slug: "barrio-privado-los-alamos-nordelta",
    seoTitulo: "Barrio Privado Los Álamos Nordelta | Lotes y Casas en Venta",
    seoDescripcion: "Lotes y casas de diseño frente a la laguna en Nordelta. Seguridad 24hs y deportes. Consultá disponibilidades."
  },
  {
    id: "PROJ-3",
    titulo: "Madero Sky Commercial & Offices",
    subtitle: "Edificio Corporativo Triple A en Puerto Madero",
    badge: "Entrega Inmediata",
    category: "Comercial",
    tipo: "Oficina Triple A",
    descripcionBreve: "Pisos de oficinas corporativas con certificación LEED Gold, helipuerto y plantas libres de hasta 1.200 m².",
    descripcionCompleta: "<h2>Sede corporativa de alta tecnología</h2><p>Madero Sky es la sede ideal para empresas multinacionales y corporaciones que buscan estándares internacionales de sustentabilidad y seguridad.</p>",
    image: "photo-1486406146926-c627a92ad1ab",
    gallery: [
      "photo-1486406146926-c627a92ad1ab",
      "photo-1497366216548-37526070297c"
    ],
    ubicacion: "Juana Manso 1400, Puerto Madero Este, CABA",
    fecha: "Construido 2025",
    cliente: "Corporate Real Estate Fund",
    tech: "Certificación LEED Gold, Climatización VRV, Control Biométrico, Cargadores Eléctricos",
    servicios: "Project Management, Certificación Verde, Alquiler Corporativo",
    resultados: "Ocupación corporativa del 90% con contratos a largo plazo en dólares.",
    link: "",
    order: 3,
    destacado: false,
    status: "publicado",
    slug: "madero-sky-commercial-offices",
    seoTitulo: "Madero Sky Offices Puerto Madero | Oficinas Triple A",
    seoDescripcion: "Pisos de oficinas corporativas en alquiler y venta en Puerto Madero. Certificación LEED y máxima conectividad."
  }
];

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "pipeline", label: "Pipeline", icon: "pipeline" },
  { key: "agenda", label: "Agenda", icon: "calendar" },
  { key: "props", label: "Propiedades", icon: "props" },
  { key: "contactos", label: "Contactos", icon: "users" },
  { key: "agente", label: "Chats IA ⚡", icon: "bot" },
  { key: "empresa", label: "Mi Empresa", icon: "building" },
  { key: "config", label: "Configuración", icon: "settings" }
];

const TITLES = {
  dashboard: "Dashboard",
  pipeline: "Pipeline de ventas",
  agenda: "Agenda de visitas y citas",
  props: "Catálogo de Propiedades Inmobiliarias",
  proyectos: "Gestión de Proyectos & Emprendimientos",
  blog: "Gestión de Blog & Publicaciones",
  contactos: "Base unificada de contactos",
  agente: "Hub de Chats IA & Intervención Humana (Handoff)",
  asesores: "Equipo comercial y asesores",
  empresa: "Mi empresa · Grupo Aurora Propiedades",
  config: "Configuración e integraciones API"
};



// ── Datos analíticos ────────────────────────────────────────────────────────
const LEADS_DIA = [{ d: "12", v: 3 }, { d: "13", v: 5 }, { d: "14", v: 4 }, { d: "15", v: 6 }, { d: "16", v: 5 }, { d: "17", v: 8 }, { d: "18", v: 7 }, { d: "19", v: 6 }, { d: "20", v: 9 }, { d: "21", v: 8 }, { d: "22", v: 11 }, { d: "23", v: 10 }, { d: "24", v: 12 }, { d: "25", v: 9 }];
const ORIGEN_DATA = [{ name: "Web", value: 42, color: "#EA384D" }, { name: "WhatsApp", value: 28, color: "#ea580c" }, { name: "Instagram", value: 22, color: "#0284c7" }, { name: "Referido", value: 8, color: "#d12237" }];
const FUNNEL = [{ label: "Nuevo", v: 48 }, { label: "Calificando", v: 31 }, { label: "Calificado", v: 19 }, { label: "Visita agendada", v: 11 }, { label: "Cerrado", v: 6 }];
const KPIS = [
  { label: "Leads del mes", value: "48", delta: "+18%", up: true }, { label: "Tasa de conversión", value: "12,5%", delta: "+2,1 pts", up: true },
  { label: "Visitas agendadas", value: "11", delta: "+4", up: true }, { label: "Pipeline (valor)", value: "USD 1,2M", delta: "+9%", up: true },
];
const ACTIVIDAD = [
  { t: "hace 4 min", txt: "Sofía calificó a Carla Méndez · alquiler en Palermo", tag: "IA" },
  { t: "hace 22 min", txt: "Visita agendada: AUR-6001 con Marcos Ibáñez", tag: "Visita" },
  { t: "hace 1 h", txt: "Lead nuevo desde la web: AUR-2087", tag: "Web" },
  { t: "hace 2 h", txt: "Sofía respondió 14 consultas fuera de horario", tag: "IA" },
  { t: "ayer", txt: "Operación cerrada: Sofía Re · USD 90.000", tag: "Cierre" },
];
const AGENTE_STATS = [
  { label: "Conversaciones (mes)", value: "134", sub: "atendidas por la IA" }, { label: "Fuera de horario", value: "61%", sub: "sin tu equipo online" },
  { label: "Tiempo de respuesta", value: "8 s", sub: "vs ~4 h manual" }, { label: "Calificados solos", value: "47", sub: "sin intervención humana" },
];
const CONVOS = [
  { nombre: "Carla Méndez", snippet: "Perfecto, ¿el viernes a las 18 h te queda bien para la visita?", estado: "calificando", t: "hace 4 min" },
  { nombre: "Lucía Fernández", snippet: "Hola! Vi el monoambiente en La Rioja, ¿sigue disponible?", estado: "nuevo", t: "hace 20 min" },
  { nombre: "Diego Ramírez", snippet: "Buenísimo, gracias. Quedo atento por acá.", estado: "cerrado", t: "hace 1 h" },
];
const TOOLS = ["buscar_propiedades", "registrar_lead", "consultar_disponibilidad", "agendar_visita", "handoff_humano"];
const HORAS = [2, 1, 1, 0, 0, 1, 2, 3, 5, 7, 8, 9, 7, 6, 7, 8, 9, 11, 13, 12, 14, 11, 8, 5].map((v, h) => ({ h, v, after: h < 8 || h >= 20 }));
const AGENTE_FUNNEL = [{ label: "Conversaciones atendidas", v: 134 }, { label: "Leads calificados", v: 47 }, { label: "Derivadas a asesor", v: 18 }, { label: "Visitas agendadas", v: 11 }];
const TOOL_CARDS = [
  { name: "buscar_propiedades", desc: "Filtra el catálogo por zona, tipo y presupuesto" },
  { name: "registrar_lead", desc: "Crea y actualiza el lead en el CRM en tiempo real" },
  { name: "consultar_disponibilidad", desc: "Chequea la agenda para proponer horarios" },
  { name: "agendar_visita", desc: "Reserva la visita y la sincroniza con el calendario" },
  { name: "handoff_humano", desc: "Deriva al asesor con el resumen de la charla" },
];
const SAMPLE = [
  { me: true, t: "Hola, busco 2 amb en Palermo para alquilar" },
  { me: false, t: "¡Hola! 👋 Tengo uno a estrenar en Palermo, USD 450/mes + expensas. ¿Te paso la ficha?" },
  { me: true, t: "Sí, dale" },
  { me: false, t: "Te la mando 📎 ¿Coordinamos una visita esta semana?" },
];
const INTEGRACIONES = [{ n: "WhatsApp", s: "Conectado", ok: true }, { n: "Instagram DM", s: "Conectado", ok: true }, { n: "Widget web", s: "Activo", ok: true }];
const VISITAS = [
  { lead: "Marcos Ibáñez", cod: "AUR-6001", zona: "Funes", dia: "Hoy", fecha: "25 jun", hora: "17:00", estado: "confirmada" },
  { lead: "Carla Méndez", cod: "AUR-1042", zona: "Palermo", dia: "Vie", fecha: "27 jun", hora: "18:00", estado: "pendiente" },
  { lead: "Roberto Díaz", cod: "AUR-2087", zona: "Nordelta", dia: "Sáb", fecha: "28 jun", hora: "11:30", estado: "confirmada" },
  { lead: "Ana Soto", cod: "AUR-3015", zona: "Caballito", dia: "Lun", fecha: "30 jun", hora: "16:00", estado: "pendiente" },
];
const SEMANA = [{ d: "L", n: 23, v: 0 }, { d: "M", n: 24, v: 0 }, { d: "M", n: 25, v: 1 }, { d: "J", n: 26, v: 0 }, { d: "V", n: 27, v: 1 }, { d: "S", n: 28, v: 1 }, { d: "D", n: 29, v: 0 }];
const TAREAS = [
  { txt: "Llamar a Roberto Díaz por la oferta de Nordelta", due: "Hoy", lead: "RD" },
  { txt: "Enviar ficha AUR-2087 con planos", due: "Hoy", lead: "RD" },
  { txt: "Confirmar visita del viernes con Carla", due: "Mañana", lead: "CM" },
  { txt: "Seguimiento post-visita: Marcos Ibáñez", due: "Lun", lead: "MI" },
];

const SALUDO = "¡Hola! 👋 Soy Sofía, de " + NOMBRE_INMO + ". Contame, ¿estás buscando para comprar o para alquilar?";
const SUGERENCIAS = ["Busco un depto en alquiler en Palermo", "Quiero comprar una casa", "¿Tenés algo en La Rioja?"];
const TIPOS = [["todos", "Todos"], ["casa", "Casas"], ["depto", "Deptos"], ["PH", "PH"], ["local", "Locales"], ["lote", "Lotes"]];
const SERVICIOS = [
  { ic: "🔑", t: "Compra", d: "Encontrá tu próxima propiedad con asesoramiento en cada paso." },
  { ic: "🏷️", t: "Venta y tasación", d: "Tasamos y publicamos tu propiedad para venderla al mejor precio." },
  { ic: "📄", t: "Alquileres", d: "Gestión de alquileres con contratos y garantías al día." },
  { ic: "🛠️", t: "Administración", d: "Cobranzas, expensas y mantenimiento de tu inmueble." },
];
const ZONAS = [
  { n: "Palermo", c: 42, photo: "photo-1665249934445-1de680641f50" },
  { n: "Nordelta", c: 18, photo: "photo-1531971589569-0d9370cbe1e5" },
  { n: "Caballito", c: 27, photo: "photo-1583847268964-b28dc8f51f92" },
  { n: "Microcentro", c: 15, photo: "photo-1528698827591-e19ccd7bc23d" },
];
const PROCESO = [
  { t: "Encontrá", d: "Filtrá propiedades por zona, tipo y presupuesto." },
  { t: "Consultá", d: "Escribinos por WhatsApp; Sofía te responde al instante, 24/7." },
  { t: "Visitá", d: "Coordinás la visita en la misma conversación." },
  { t: "Cerrá", d: "Te acompañamos hasta la firma, sin vueltas." },
];
const TESTIMONIOS = [
  { q: "Me contestaron a las 11 de la noche y al otro día ya tenía la visita coordinada. Impecable.", n: "Valentina G.", r: "Alquiló en Palermo" },
  { q: "Vendí mi casa en Nordelta más rápido de lo que esperaba. Súper profesionales.", n: "Hernán P.", r: "Vendió en Nordelta" },
  { q: "La atención por WhatsApp es otro nivel, te responden todo al toque.", n: "Carla M.", r: "Compró en Caballito" },
];
function hhmm() { const d = new Date(); return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`; }

export default function App({ openDirect = false }) {
  const [isOpen, setIsOpen] = useState(openDirect);
  const [view, setView] = useState("web");
  const [messages, setMessages] = useState([{ role: "agent", text: SALUDO, hora: "09:24" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState({ nombre: null, contacto: null, intencion: null, tipo: null, zona: null, presupuesto: null, plazo: null });
  const [calif, setCalif] = useState(0);
  const [estado, setEstado] = useState("nuevo");
  const [sugeridas, setSugeridas] = useState([]);
  const [quickReplies, setQuickReplies] = useState(["Quiero Alquilar 🔑", "Quiero Comprar 🏡", "Ver Zonas 🌴"]);
  const [visita, setVisita] = useState(null);
  const [handoff, setHandoff] = useState(false);
  const [origen, setOrigen] = useState("WhatsApp");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [filterOp, setFilterOp] = useState("todas");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [detail, setDetail] = useState(null);
  const scrollRef = useRef(null);
  const lastCards = useRef("");
  const handoffShown = useRef(false);

  // Máquina de estados conversacional y personalización de marca
  const [brandName, setBrandName] = useState(NOMBRE_INMO);
  const [brandColor, setBrandColor] = useState("#EA384D");
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [chatStage, setChatStage] = useState("start");
  const [selectedProp, setSelectedProp] = useState(null);
  const [showConversionModal, setShowConversionModal] = useState(false);

  // Bloqueo de scroll en el body cuando la demo está activa (UX premium)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleFormSubmit = (e) => {
      if (!e.data) return;
      const { type, data } = e.data;
      if (type === 'CONTACT_SUBMIT') {
        setLead({
          nombre: data.name,
          contacto: `${data.phone} / ${data.email}`,
          intencion: "contacto",
          tipo: "consulta",
          zona: "Palermo, CABA",
          presupuesto: "—",
          plazo: null
        });
        setEstado("calificado");
        setOrigen("Formulario Web");
      }
    };
    window.addEventListener('message', handleFormSubmit);
    return () => window.removeEventListener('message', handleFormSubmit);
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading, view]);

  function mergeLead(prev, incoming) {
    const out = { ...prev };
    for (const k of Object.keys(prev)) if (incoming[k] !== null && incoming[k] !== undefined && incoming[k] !== "") out[k] = incoming[k];
    return out;
  }

  async function send(textArg) {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;
    setQuickReplies([]);
    
    // 1. Añadir mensaje de usuario
    const next = [...messages, { role: "user", text, hora: hhmm() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    
    // 2. Simulador inteligente offline de Sofía (IA Agent)
    setTimeout(() => {
      setLoading(false);
      let replyText = "";
      let newLead = { ...lead };
      let newCalif = calif;
      let newEstado = estado;
      let newSugeridas = [...sugeridas];
      let newQuickReplies = [];
      let newVisita = visita;
      let newHandoff = handoff;
      let nextStage = chatStage;
      
      const lowerText = text.toLowerCase();

      // Permitir reiniciar el chat
      if (lowerText === "reiniciar" || lowerText.includes("nueva consulta") || lowerText.includes("inicial")) {
        setChatStage("start");
        setSelectedProp(null);
        setLead({ nombre: null, contacto: null, intencion: null, tipo: null, zona: null, presupuesto: null, plazo: null });
        setCalif(0);
        setEstado("nuevo");
        setSugeridas([]);
        setQuickReplies(["Quiero Alquilar 🔑", "Quiero Comprar 🏡", "Ver Zonas 🌴"]);
        setVisita(null);
        setHandoff(false);
        handoffShown.current = false;
        setMessages([{ role: "agent", text: SALUDO, hora: hhmm() }]);
        return;
      }
      
      // Máquina de estados conversacional
      switch (chatStage) {
        case "start":
          if (lowerText.includes("alquilar") || lowerText.includes("alquiler") || lowerText.includes("rentar") || lowerText.includes("🔑")) {
            replyText = "¡Bárbaro! Buscás alquiler. ¿En qué zona estás interesado principalmente? Contamos con opciones en Palermo, Caballito, Nordelta, Microcentro o Funes.";
            newLead.intencion = "alquiler";
            newCalif = 20;
            newEstado = "calificando";
            newQuickReplies = ["Palermo 🌴", "Caballito 📐", "Microcentro 🏢", "Funes 🌳"];
            nextStage = "zone";
          } else if (lowerText.includes("comprar") || lowerText.includes("compra") || lowerText.includes("venta") || lowerText.includes("🏡")) {
            replyText = "¡Excelente! Para compra. ¿En qué zona tenías pensado buscar? Contamos con propiedades destacadas en Nordelta, Palermo, Caballito o Funes.";
            newLead.intencion = "compra";
            newCalif = 20;
            newEstado = "calificando";
            newQuickReplies = ["Nordelta 🌊", "Palermo 🌴", "Caballito 📐", "Funes 🌳"];
            nextStage = "zone";
          } else if (lowerText.includes("zona") || lowerText.includes("🌴")) {
            replyText = "¡Perfecto! Te puedo mostrar las zonas destacadas. Decime, ¿buscás más bien comprar o alquilar?";
            newQuickReplies = ["Quiero Alquilar 🔑", "Quiero Comprar 🏡"];
            nextStage = "start";
          } else {
            replyText = "Entendido. Para poder asesorarte mejor, decime: ¿estás buscando comprar una propiedad o preferís alquilar?";
            newQuickReplies = ["Quiero Alquilar 🔑", "Quiero Comprar 🏡"];
            nextStage = "start";
          }
          break;

        case "zone":
          let detectedZone = "";
          if (lowerText.includes("palermo")) detectedZone = "Palermo, CABA";
          else if (lowerText.includes("nordelta")) detectedZone = "Nordelta, Tigre";
          else if (lowerText.includes("caballito")) detectedZone = "Caballito, CABA";
          else if (lowerText.includes("la rioja") || lowerText.includes("rioja")) detectedZone = "Centro, La Rioja";
          else if (lowerText.includes("funes")) detectedZone = "Funes, Santa Fe";
          else if (lowerText.includes("microcentro")) detectedZone = "Microcentro, CABA";

          if (detectedZone) {
            newLead.zona = detectedZone;
            newCalif = 40;
            newEstado = "calificando";
            replyText = `Buenísimo, ${detectedZone.split(",")[0]}. Para filtrar el catálogo en tiempo real, ¿qué tipo de propiedad buscás (depto, casa, PH, lote) y qué presupuesto mensual estimado tenés?`;
            
            if (newLead.intencion === "alquiler") {
              newQuickReplies = ["Depto 2 amb (hasta USD 500)", "Depto 3 amb (hasta USD 800)", "Ver monoambientes"];
            } else {
              newQuickReplies = ["Casa 4 amb (hasta USD 250k)", "PH 3 amb (hasta USD 150k)", "Lote residencial"];
            }
            nextStage = "specs";
          } else {
            replyText = "Por el momento trabajamos en: Palermo, Nordelta, Caballito, La Rioja, Microcentro o Funes. ¿Cuál de estas zonas preferís?";
            newQuickReplies = ["Palermo 🌴", "Nordelta 🌊", "Caballito 📐", "La Rioja ⛰️", "Funes 🌳"];
            nextStage = "zone";
          }
          break;

        case "specs":
          let propType = "depto";
          let budget = "USD 450";
          let matchedIds = [];

          if (lowerText.includes("casa")) {
            propType = "casa";
            budget = "USD 220.000";
          } else if (lowerText.includes("ph")) {
            propType = "PH";
            budget = "USD 135.000";
          } else if (lowerText.includes("lote") || lowerText.includes("terreno")) {
            propType = "lote";
            budget = "USD 45.000";
          } else if (lowerText.includes("monoambiente") || lowerText.includes("1 amb")) {
            propType = "depto";
            budget = "$ 180.000";
          }

          newLead.tipo = propType;
          newLead.presupuesto = budget;
          newCalif = 60;
          newEstado = "calificando";

          // Buscar propiedad coincidente en catálogo
          const zoneKey = (newLead.zona || "").toLowerCase();
          const match = CATALOGO.find(p => 
            zoneKey.includes(p.zona.split(",")[0].toLowerCase()) && 
            p.tipo.toLowerCase() === propType.toLowerCase()
          ) || CATALOGO[0];

          matchedIds = [match.id];
          newSugeridas = matchedIds;
          setSelectedProp(match);

          replyText = `¡Excelente! Encontré esta opción destacada en nuestro sistema que coincide con lo que buscás:`;
          newQuickReplies = ["Ver ficha técnica 📎", "Sí, agendar visita 📅", "Ver otras propiedades"];
          nextStage = "offer_decision";
          break;

        case "offer_decision":
          if (lowerText.includes("ficha") || lowerText.includes("📎")) {
            replyText = "¡Perfecto! Te comparto la ficha técnica en pantalla. Para enviarte además los planos constructivos por email y agendarte en la base de datos, ¿me dirías tu nombre completo y correo electrónico?";
            newQuickReplies = ["Carlos Díaz, carlos@mail.com", "Prefiero no ingresarlo"];
            newCalif = 75;
            newEstado = "calificado";
            nextStage = "contact";
          } else if (lowerText.includes("visita") || lowerText.includes("agendar") || lowerText.includes("📅") || lowerText.includes("sí") || lowerText.includes("si")) {
            replyText = "¡Espectacular! La agenda para esta propiedad está abierta. Para registrarte en el sistema y coordinar la cita, ¿me dirías tu nombre completo y correo electrónico?";
            newQuickReplies = ["Carlos Díaz, carlos@mail.com", "Prefiero no ingresarlo"];
            newCalif = 80;
            newEstado = "calificado";
            nextStage = "contact";
          } else {
            replyText = "Entendido. ¿Preferís que te envíe los planos y la ficha por mail o querés que coordinemos una visita guiada directamente?";
            newQuickReplies = ["Ver ficha técnica 📎", "Coordinar visita 📅", "Ver otras propiedades"];
            nextStage = "offer_decision";
          }
          break;

        case "contact":
          let name = "Carlos Díaz";
          let contactInfo = "carlos@mail.com";
          
          if (text.includes(",")) {
            const parts = text.split(",");
            name = parts[0].trim();
            contactInfo = parts[1].trim();
          } else if (text.split(" ").length >= 2) {
            name = text;
          }

          newLead.nombre = name;
          newLead.contacto = contactInfo;
          newCalif = 90;
          newEstado = "calificado";

          replyText = `¡Excelente, ${name}! Ya registré tus datos. Para agendar la visita guiada en persona a la propiedad, tengo disponibles los siguientes turnos esta semana:`;
          newQuickReplies = ["Viernes a las 18:00 h 📅", "Sábado a las 11:30 h 📅"];
          nextStage = "visit";
          break;

        case "visit":
          let visitTime = "Viernes 18:00 h";
          let isConfirmed = false;

          if (lowerText.includes("viernes") || lowerText.includes("18")) {
            newVisita = { fecha: "Viernes 27 Jun", hora: "18:00" };
            isConfirmed = true;
          } else if (lowerText.includes("sábado") || lowerText.includes("11") || lowerText.includes("sabado")) {
            newVisita = { fecha: "Sábado 28 Jun", hora: "11:30" };
            isConfirmed = true;
            visitTime = "Sábado 11:30 h";
          }

          if (isConfirmed) {
            replyText = `¡Listo, agendado! Visita confirmada para el ${visitTime}. Eliana A. (nuestra asesora comercial) te esperará en la propiedad. Te llegará un correo de confirmación con la ubicación exacta en este instante. ¡Muchas gracias!`;
            newEstado = "visita_agendada";
            newCalif = 100;
            newHandoff = true;
            newQuickReplies = ["Iniciar nueva consulta 🔄"];
            nextStage = "confirmed";
            setTimeout(() => {
              setShowConversionModal(true);
            }, 1800);
          } else {
            replyText = "Por favor, elegí uno de los horarios disponibles en agenda para coordinar la cita automáticamente:";
            newQuickReplies = ["Viernes a las 18:00 h 📅", "Sábado a las 11:30 h 📅"];
            nextStage = "visit";
          }
          break;

        case "confirmed":
          setChatStage("start");
          setSelectedProp(null);
          setLead({ nombre: null, contacto: null, intencion: null, tipo: null, zona: null, presupuesto: null, plazo: null });
          setCalif(0);
          setEstado("nuevo");
          setSugeridas([]);
          setQuickReplies(["Quiero Alquilar 🔑", "Quiero Comprar 🏡", "Ver Zonas 🌴"]);
          setVisita(null);
          setHandoff(false);
          handoffShown.current = false;
          setShowConversionModal(false);
          setMessages([{ role: "agent", text: SALUDO, hora: hhmm() }]);
          return;

        default:
          replyText = "Entendido. ¿Cómo te puedo ayudar hoy?";
          newQuickReplies = ["Quiero Alquilar 🔑", "Quiero Comprar 🏡"];
          nextStage = "start";
      }

      setChatStage(nextStage);
      setLead(newLead);
      setCalif(newCalif);
      setEstado(newEstado);
      setSugeridas(newSugeridas);
      setQuickReplies(newQuickReplies);
      setVisita(newVisita);
      setHandoff(newHandoff);
      
      setMessages((prev) => [...prev, { role: "agent", text: replyText, hora: hhmm() }]);
      
      if (newSugeridas.length > 0 && JSON.stringify(newSugeridas) !== lastCards.current) {
        lastCards.current = JSON.stringify(newSugeridas);
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "cards", ids: newSugeridas }]);
        }, 300);
      }
      
      if (newHandoff && !handoffShown.current) {
        handoffShown.current = true;
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "system", text: "Sofía derivó la conversación a un asesor del equipo." }]);
        }, 600);
      }
      
    }, 1000);
  }

  function consultarPorWhatsApp(p) {
    setDetail(null);
    setShowConversionModal(true);
  }

  const [adminLeads, setAdminLeads] = useState(LEADS_SEED);

  const handleUpdateStatus = (leadId, newStatus) => {
    setAdminLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, estado: newStatus } : l))
    );
    if (leadId === "LIVE" || (liveLead && liveLead.id === leadId)) {
      setEstado(newStatus);
    }
  };

  const handleAddLead = (newLead) => {
    setAdminLeads((prev) => [newLead, ...prev]);
  };

  const liveLead = lead.nombre || estado !== "nuevo"
    ? { id: "LIVE", nombre: lead.nombre || "Lead en vivo", contacto: lead.contacto || "—", intencion: lead.intencion || "—", zona: lead.zona || "—", presupuesto: lead.presupuesto || "—", estado, origen, t: "ahora", live: true, handoff }
    : null;
  const allLeads = liveLead ? [liveLead, ...adminLeads.filter(l => l.id !== "LIVE")] : adminLeads;

  const modalContent = (
    <div style={openDirect ? { ...S.modalOverlay, position: 'relative', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', padding: 0, background: 'transparent', backdropFilter: 'none', zIndex: 1 } : S.modalOverlay}>
      <style>{css}</style>
      <div style={openDirect ? { ...S.modalContainer, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none' } : S.modalContainer} className="kap-modal-container">
        <header style={S.topbar} className="kap-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Logo Kaptativa Original */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 8 215 44" style={{ height: 26, width: 'auto', display: 'block' }} aria-label="Kaptativa Logo">
              <defs>
                <linearGradient id="logo-gradient-demo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EA384D" />
                  <stop offset="100%" stopColor="#8A35E5" />
                </linearGradient>
              </defs>
              <g>
                <path d="M 6 13 L 6 47" stroke="url(#logo-gradient-demo)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <path d="M 28 47 C 18 41 11 36 11 30 C 11 24 18 19 26 13" stroke="url(#logo-gradient-demo)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                <path d="M 15 13 L 26 13 L 26 24" stroke="url(#logo-gradient-demo)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              <text x="44" y="39" font-family="'Lexend', 'Inter', sans-serif" fontSize="27" fontWeight="600" fill="#0f172a" letterSpacing="0.3">
                kaptativa<tspan fill="#EA384D">.</tspan>
              </text>
            </svg>

            {/* Badge de Demo */}
            <span style={{ fontSize: '0.72rem', background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', padding: '3px 9px', borderRadius: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Demo Interactiva
            </span>
          </div>

          <nav style={S.nav}>
            {[["web", "Web pública"], ["admin", "Panel Admin"]].map(([k, l]) => (
              <button key={k} onClick={() => setView(k)} className={`kap-navbtn ${view === k ? 'kap-navbtn-active' : ''}`} style={{ ...S.navBtn, ...(view === k ? S.navBtnOn : {}) }}>{l}</button>
            ))}
          </nav>
        </header>
        <main style={{ ...S.main, overflow: view === 'web' ? 'hidden' : 'auto' }} className={view === 'web' ? 'kap-main' : 'kap-scroll kap-main'}>
          {view === "web" && <WebView filterOp={filterOp} setFilterOp={setFilterOp} filterTipo={filterTipo} setFilterTipo={setFilterTipo} onDetail={setDetail} onWhatsApp={consultarPorWhatsApp} goAgente={() => setView("agent")} />}
          {view === "agent" && (
            <AgentView
              messages={messages}
              input={input}
              setInput={setInput}
              send={send}
              loading={loading}
              lead={lead}
              calif={calif}
              estado={estado}
              sugeridas={sugeridas}
              quickReplies={quickReplies}
              visita={visita}
              handoff={handoff}
              scrollRef={scrollRef}
              onDetail={setDetail}
            />
          )}
          {view === "admin" && (
            <AdminView
              tab={adminTab}
              setTab={setAdminTab}
              leads={allLeads}
              onUpdateStatus={handleUpdateStatus}
              onAddLead={handleAddLead}
              messages={messages}
            />
          )}
        </main>
        {detail && <DetailModal p={detail} onClose={() => setDetail(null)} onWhatsApp={consultarPorWhatsApp} />}
        {showBrandModal && (
          <BrandModal
            onClose={() => setShowBrandModal(false)}
            brandName={brandName}
            setBrandName={setBrandName}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
          />
        )}
        {showConversionModal && (
          <ConversionModal 
            onClose={() => setShowConversionModal(false)} 
            onConfirm={() => {
              const contactSection = document.getElementById('contacto');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
              setIsOpen(false);
            }} 
            onBuy={() => {
              const planesSection = document.getElementById('planes');
              if (planesSection) {
                planesSection.scrollIntoView({ behavior: 'smooth' });
              }
              setIsOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );

  if (openDirect) {
    return modalContent;
  }

  return (
    <>
      {!isOpen ? (
        <div style={S.promoContainer} className="kap-tile">
          <style>{css}</style>
          <div style={S.promoGlow} />
          <div style={S.promoContent}>
            <span style={S.promoBadge}>● SIMULADOR MULTI-PANTALLA EN VIVO</span>
            <h3 style={S.promoTitle}>Ecosistema de Ventas Inmo-Scale</h3>
            <p style={S.promoDesc}>
              Experimentá en tiempo real cómo interactúa tu Panel de Control (CRM) con el Catálogo Web público y tu Agente IA de WhatsApp. Agendá visitas, cargá propiedades y mira la automatización de leads en vivo.
            </p>
            <button style={S.promoBtn} className="kap-cta" onClick={() => setIsOpen(true)}>
              💻 Abrir Demo del Sistema
            </button>
          </div>
        </div>
      ) : (
        <div style={S.promoContainer} className="kap-tile">
          <style>{css}</style>
          <div style={S.promoGlow} />
          <div style={S.promoContent}>
            <span style={S.promoBadge}>● SIMULADOR MULTI-PANTALLA EN VIVO</span>
            <h3 style={S.promoTitle}>Ecosistema de Ventas Inmo-Scale</h3>
            <p style={S.promoDesc}>
              Simulador abierto en pantalla completa. Podés continuar explorándolo en la ventana flotante.
            </p>
            <button style={{ ...S.promoBtn, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} className="kap-cta" onClick={() => setIsOpen(false)}>
              Cerrar Simulador
            </button>
          </div>
        </div>
      )}
      {isOpen && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}

// ── Foto con fallback ────────────────────────────────────────────────────────
function Photo({ p, height, iconSize = 40, zoom, children }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: "relative", height, background: photoGrad(p.tipo), display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {!err
        ? <img src={imgUrl(p.photo)} loading="lazy" decoding="async" onError={() => setErr(true)} alt={`${p.tipo} en ${p.zona}`} className={zoom ? "kap-zoomimg" : undefined} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .45s ease" }} />
        : <span style={{ fontSize: iconSize, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.3))" }}>{iconFor(p.tipo)}</span>}
      {children}
    </div>
  );
}
function Heart() {
  const [on, setOn] = useState(false);
  return <button onClick={(e) => { e.stopPropagation(); setOn(!on); }} className="kap-heart" style={{ ...S.heart, color: on ? "#EA384D" : "#fff" }}>{on ? "♥" : "♡"}</button>;
}
function WaGlyph({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4.5 3.2V17H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" />
    </svg>
  );
}

// ── WEB PÚBLICA (premium) ────────────────────────────────────────────────────
function WebView({ filterOp, setFilterOp, filterTipo, setFilterTipo, onDetail, onWhatsApp, goAgente }) {
  const [selectedPublicProject, setSelectedPublicProject] = useState(null);
  const [selectedPublicPost, setSelectedPublicPost] = useState(null);
  const list = CATALOGO.filter((p) => (filterOp === "todas" || p.operacion === filterOp) && (filterTipo === "todos" || p.tipo === filterTipo));

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;
      const { type, id, value } = e.data;
      if (type === 'DETAIL') {
        const p = CATALOGO.find((prop) => prop.id === id);
        if (p) onDetail(p);
      }
      if (type === 'PROJECT_DETAIL') {
        const proj = INITIAL_PROJECTS.find((p) => p.id === id);
        if (proj) setSelectedPublicProject(proj);
      }
      if (type === 'BLOG_DETAIL') {
        const post = INITIAL_POSTS.find((p) => p.id === id);
        if (post) setSelectedPublicPost(post);
      }
      if (type === 'WHATSAPP') {
        const p = CATALOGO.find((prop) => prop.id === id);
        if (p) onWhatsApp(p);
      }
      if (type === 'FILTER_OP') {
        setFilterOp(value);
      }
      if (type === 'FILTER_TIPO') {
        setFilterTipo(value);
      }
      if (type === 'GO_AGENTE') {
        goAgente();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onDetail, onWhatsApp, setFilterOp, setFilterTipo, goAgente]);

  // Memoize HTML content generation to avoid unnecessary iframe reloads
  const htmlContent = useMemo(() => {
    // Generar tarjetas de propiedades estilo Domus Propiedades
    const propertiesCardsHtml = list.map((p, idx) => {
      const isGoldBadge = idx % 2 === 0;
      const badgeClass = isGoldBadge ? "bg-[#c49a45] text-white" : "bg-[#1b1b1b] text-white";
      const badgeText = isGoldBadge ? "DESTACADA" : "NUEVA";
      return `
        <article class="bg-white border border-[#eaeaea] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer" onclick="window.parent.postMessage({ type: 'DETAIL', id: '${p.id}' }, '*')">
          <div class="relative aspect-[4/3] overflow-hidden bg-[#f4f4f4]">
            <img src="${imgUrl(p.photo)}" alt="${p.titulo}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
            <span class="absolute top-3 left-3 ${badgeClass} text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm">${badgeText}</span>
          </div>
          <div class="p-5 space-y-2">
            <h4 class="font-bold text-sm text-[#1b1b1b] group-hover:text-[#c49a45] transition-colors leading-snug line-clamp-1">${p.titulo}</h4>
            <p class="text-[11px] text-[#777777]">${p.zona}</p>
            <div class="flex items-center gap-4 text-[#888888] text-xs py-2 border-t border-[#f0f0f0] my-2 font-mono">
              <span>🛏 ${p.dorm}</span>
              <span>🛁 ${p.banos}</span>
              <span>📐 ${p.m2} m²</span>
            </div>
            <div class="text-sm font-extrabold text-[#1b1b1b]">${p.precio}</div>
          </div>
        </article>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html class="light" lang="es">
      <head>
        <meta charset="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <title>DOMUS PROPIEDADES | Encontrá la propiedad ideal</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>
          * {
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .font-serif {
            font-family: 'Cormorant Garamond', Georgia, serif !important;
          }
          .bg-domus-gold {
            background-color: #c49a45;
          }
          .bg-domus-gold:hover {
            background-color: #b08736;
          }
          .text-domus-gold {
            color: #c49a45;
          }
          .domus-hero-bg {
            background-image: linear-gradient(180deg, rgba(15,16,18,0.6) 0%, rgba(15,16,18,0.85) 100%), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80');
            background-size: cover;
            background-position: center;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cccccc;
            border-radius: 4px;
          }
        </style>
      </head>
      <body class="bg-[#fcfbf9] text-[#1b1b1b] antialiased overflow-x-hidden custom-scrollbar">

        <!-- Top Header Navbar -->
        <nav class="fixed top-0 w-full z-50 bg-[#0f1012]/80 backdrop-blur-md border-b border-white/10 text-white">
          <div class="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
            <a href="#" class="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <path d="M20 4L4 16V36H16V24H24V36H36V16L20 4Z" stroke="#c49a45" stroke-width="3" stroke-linejoin="round"/>
              </svg>
              <div class="flex flex-col">
                <span class="font-bold text-base tracking-[0.2em] leading-none text-white">DOMUS</span>
                <span class="text-[9px] tracking-[0.3em] text-[#c49a45] font-semibold">PROPIEDADES</span>
              </div>
            </a>
            
            <div class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-white/80">
              <a href="javascript:void(0)" class="text-[#c49a45]">INICIO</a>
              <a href="javascript:void(0)" class="hover:text-[#c49a45] transition-colors">PROPIEDADES</a>
              <a href="javascript:void(0)" class="hover:text-[#c49a45] transition-colors">SERVICIOS</a>
              <a href="javascript:void(0)" class="hover:text-[#c49a45] transition-colors">NOSOTROS</a>
              <a href="javascript:void(0)" class="hover:text-[#c49a45] transition-colors">CONTACTO</a>
            </div>

            <button onclick="window.parent.postMessage({ type: 'GO_AGENTE' }, '*')" class="bg-domus-gold text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-lg hover:shadow-xl transition-all">
              PUBLICÁ TU PROPIEDAD
            </button>
          </div>
        </nav>

        <!-- Hero Section -->
        <header class="relative min-h-[90vh] flex items-center domus-hero-bg pt-28 pb-16 px-6 md:px-12 text-white">
          <div class="max-w-6xl mx-auto w-full">
            <div class="max-w-2xl space-y-6">
              <h1 class="font-serif text-5xl md:text-7xl font-normal leading-[1.1] text-white">
                Encontrá la propiedad ideal con <span class="text-domus-gold italic font-serif">atención personalizada</span>
              </h1>
              <p class="text-white/80 text-sm md:text-base font-light max-w-lg leading-relaxed">
                Te acompañamos en cada paso para que encuentres el lugar perfecto para vos.
              </p>

              <!-- Buscador Flotante -->
              <div class="bg-white text-[#1b1b1b] p-4 md:p-5 rounded-lg shadow-2xl mt-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-1">OPERACIÓN</label>
                    <select onchange="window.parent.postMessage({ type: 'FILTER_OP', value: this.value }, '*')" class="w-full bg-[#f6f6f6] border-[#e0e0e0] rounded text-xs py-2.5 px-3 font-medium">
                      <option value="todas">Venta / Alquiler</option>
                      <option value="venta" ${filterOp === 'venta' ? 'selected' : ''}>Venta</option>
                      <option value="alquiler" ${filterOp === 'alquiler' ? 'selected' : ''}>Alquiler</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-1">TIPO</label>
                    <select onchange="window.parent.postMessage({ type: 'FILTER_TIPO', value: this.value }, '*')" class="w-full bg-[#f6f6f6] border-[#e0e0e0] rounded text-xs py-2.5 px-3 font-medium">
                      <option value="todos">Casa / Depto / Lote</option>
                      <option value="casa">Casa</option>
                      <option value="depto">Departamento</option>
                      <option value="PH">PH / Dúplex</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-1">UBICACIÓN</label>
                    <select class="w-full bg-[#f6f6f6] border-[#e0e0e0] rounded text-xs py-2.5 px-3 font-medium">
                      <option value="cordoba">Córdoba, Argentina</option>
                      <option value="nueva-cordoba">Nueva Córdoba</option>
                      <option value="valle-escondido">Valle Escondido</option>
                      <option value="villa-belgrano">Villa Belgrano</option>
                    </select>
                  </div>
                  <div class="pt-4 sm:pt-0 sm:col-span-2 md:col-span-1">
                    <button onclick="window.parent.postMessage({ type: 'GO_AGENTE' }, '*')" class="w-full bg-[#1b1b1b] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider py-3 px-3 rounded transition-all">
                      BUSCAR PROPIEDADES →
                    </button>
                  </div>
                </div>
              </div>

              <!-- Stats Band -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/15 text-white">
                <div>
                  <div class="font-bold text-2xl md:text-3xl text-[#c49a45]">+1.200</div>
                  <div class="text-[10px] uppercase tracking-widest text-white/70 font-semibold">PROPIEDADES</div>
                </div>
                <div>
                  <div class="font-bold text-2xl md:text-3xl text-[#c49a45]">+850</div>
                  <div class="text-[10px] uppercase tracking-widest text-white/70 font-semibold">CLIENTES FELICES</div>
                </div>
                <div>
                  <div class="font-bold text-2xl md:text-3xl text-[#c49a45]">+10</div>
                  <div class="text-[10px] uppercase tracking-widest text-white/70 font-semibold">AÑOS DE EXPERIENCIA</div>
                </div>
                <div>
                  <div class="font-bold text-2xl md:text-3xl text-[#c49a45]">100%</div>
                  <div class="text-[10px] uppercase tracking-widest text-white/70 font-semibold">COMPROMISO</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Propiedades Destacadas -->
        <section id="propiedades" class="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span class="text-[11px] uppercase tracking-[0.25em] font-bold text-[#c49a45] block mb-1">PROPIEDADES DESTACADAS</span>
              <h2 class="font-serif text-3xl md:text-4xl text-[#1b1b1b] font-normal">Explorá las mejores oportunidades</h2>
            </div>
            <button onclick="window.parent.postMessage({ type: 'GO_AGENTE' }, '*')" class="text-xs font-bold tracking-widest text-[#1b1b1b] hover:text-[#c49a45] transition-colors uppercase">
              VER TODAS LAS PROPIEDADES →
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${propertiesCardsHtml}
          </div>

          <div class="text-center mt-12">
            <button onclick="window.parent.postMessage({ type: 'GO_AGENTE' }, '*')" class="border-2 border-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white text-[#1b1b1b] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded transition-all">
              VER MÁS PROPIEDADES →
            </button>
          </div>
        </section>

        <!-- ¿Por qué elegir Domus Propiedades? -->
        <section id="servicios" class="py-20 bg-[#f4f2ee] border-y border-[#e5e2db]">
          <div class="max-w-7xl mx-auto px-6 md:px-12">
            <h2 class="font-serif text-3xl md:text-4xl text-center text-[#1b1b1b] mb-14 font-normal">
              ¿Por qué elegir Domus Propiedades?
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white p-8 rounded-lg shadow-sm space-y-4 border border-[#e8e6df]">
                <div class="w-12 h-12 rounded-full bg-[#f7f3e8] border border-[#c49a45]/30 flex items-center justify-center text-xl">🏠</div>
                <h3 class="font-bold text-xs uppercase tracking-wider text-[#1b1b1b]">ATENCIÓN PERSONALIZADA</h3>
                <p class="text-xs text-[#666666] leading-relaxed">
                  Te acompañamos en cada paso del proceso para que la experiencia sea simple y segura.
                </p>
              </div>

              <div class="bg-white p-8 rounded-lg shadow-sm space-y-4 border border-[#e8e6df]">
                <div class="w-12 h-12 rounded-full bg-[#f7f3e8] border border-[#c49a45]/30 flex items-center justify-center text-xl">💼</div>
                <h3 class="font-bold text-xs uppercase tracking-wider text-[#1b1b1b]">ASESORAMIENTO PROFESIONAL</h3>
                <p class="text-xs text-[#666666] leading-relaxed">
                  Contamos con un equipo de expertos en el mercado inmobiliario.
                </p>
              </div>

              <div class="bg-white p-8 rounded-lg shadow-sm space-y-4 border border-[#e8e6df]">
                <div class="w-12 h-12 rounded-full bg-[#f7f3e8] border border-[#c49a45]/30 flex items-center justify-center text-xl">⚖️</div>
                <h3 class="font-bold text-xs uppercase tracking-wider text-[#1b1b1b]">TRANSPARENCIA Y CONFIANZA</h3>
                <p class="text-xs text-[#666666] leading-relaxed">
                  Operaciones claras, seguras y con total compromiso.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Conocé más sobre nosotros -->
        <section id="nosotros" class="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Video / Image Container -->
            <div class="lg:col-span-6 relative aspect-[16/10] bg-[#1b1b1b] rounded-lg overflow-hidden group cursor-pointer shadow-xl">
              <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" alt="Nosotros" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"/>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-[#c49a45] text-white flex items-center justify-center text-xl shadow-2xl group-hover:scale-110 transition-transform">
                  ▶
                </div>
              </div>
            </div>

            <div class="lg:col-span-6 space-y-6">
              <span class="text-[11px] uppercase tracking-[0.25em] font-bold text-[#c49a45] block">CONOCÉ MÁS SOBRE NOSOTROS</span>
              <h2 class="font-serif text-4xl text-[#1b1b1b] font-normal leading-tight">
                Más que una inmobiliaria, <span class="text-domus-gold italic font-serif">somos tu aliado.</span>
              </h2>
              <p class="text-xs text-[#666666] leading-relaxed">
                En Domus Propiedades nos enfocamos en brindarte las mejores oportunidades del mercado, con un servicio cercano, transparente y profesional.
              </p>

              <div class="grid grid-cols-2 gap-6 pt-4 border-t border-[#e0e0e0]">
                <div>
                  <div class="font-bold text-2xl text-[#1b1b1b]">+10</div>
                  <div class="text-[10px] uppercase font-bold tracking-wider text-[#888888]">AÑOS DE EXPERIENCIA</div>
                </div>
                <div>
                  <div class="font-bold text-2xl text-[#1b1b1b]">+850</div>
                  <div class="text-[10px] uppercase font-bold tracking-wider text-[#888888]">CLIENTES SATISFECHOS</div>
                </div>
              </div>

              <button onclick="window.parent.postMessage({ type: 'GO_AGENTE' }, '*')" class="border border-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white text-[#1b1b1b] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded transition-all">
                CONOCER MÁS
              </button>
            </div>
          </div>
        </section>

        <!-- Formulario de Contacto -->
        <section id="contacto" class="py-20 bg-[#151719] text-white">
          <div class="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div class="lg:col-span-5 space-y-6">
              <h2 class="font-serif text-4xl text-white font-normal leading-tight">
                ¿Tenés dudas? Estamos para ayudarte
              </h2>
              <p class="text-xs text-white/70 leading-relaxed font-light">
                Contactanos y recibí asesoramiento personalizado.
              </p>

              <div class="space-y-4 pt-4 text-xs font-medium text-white/90">
                <div class="flex items-center gap-3">
                  <span class="text-[#c49a45]">📞</span> +54 351 123 4567
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-[#c49a45]">✉️</span> hola@domuspropiedades.com
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-[#c49a45]">📍</span> Córdoba, Argentina
                </div>
              </div>
            </div>

            <div class="lg:col-span-7 bg-[#1c1f22] p-8 rounded-lg border border-white/10 shadow-2xl">
              <form onsubmit="event.preventDefault(); alert('¡Gracias por comunicarte con Domus Propiedades! Te contactaremos a la brevedad.');" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input required type="text" placeholder="Tu nombre" class="w-full bg-[#151719] border-white/15 text-white text-xs py-3 px-4 rounded focus:ring-0 focus:border-[#c49a45]"/>
                  <input required type="email" placeholder="Tu email" class="w-full bg-[#151719] border-white/15 text-white text-xs py-3 px-4 rounded focus:ring-0 focus:border-[#c49a45]"/>
                  <input required type="tel" placeholder="Tu teléfono" class="w-full bg-[#151719] border-white/15 text-white text-xs py-3 px-4 rounded focus:ring-0 focus:border-[#c49a45]"/>
                </div>

                <select required class="w-full bg-[#151719] border-white/15 text-white text-xs py-3 px-4 rounded focus:ring-0 focus:border-[#c49a45]">
                  <option value="" class="text-black">¿En qué podemos ayudarte?</option>
                  <option value="comprar" class="text-black">Quiero comprar una propiedad</option>
                  <option value="vender" class="text-black">Quiero vender / publicar mi propiedad</option>
                  <option value="tasar" class="text-black">Quiero tasar mi propiedad</option>
                </select>

                <textarea required placeholder="Contanos tu consulta..." class="w-full bg-[#151719] border-white/15 text-white text-xs py-3 px-4 rounded h-28 focus:ring-0 focus:border-[#c49a45]"></textarea>

                <button type="submit" class="w-full bg-domus-gold text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded shadow-lg hover:shadow-xl transition-all">
                  ENVIAR CONSULTA →
                </button>
              </form>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-[#0f1012] text-white/60 py-16 px-6 md:px-12 text-xs border-t border-white/10">
          <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
            <div class="md:col-span-4 space-y-4">
              <a href="#" class="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                  <path d="M20 4L4 16V36H16V24H24V36H36V16L20 4Z" stroke="#c49a45" stroke-width="3" stroke-linejoin="round"/>
                </svg>
                <div class="flex flex-col">
                  <span class="font-bold text-sm tracking-[0.2em] text-white">DOMUS</span>
                  <span class="text-[8px] tracking-[0.3em] text-[#c49a45] font-semibold">PROPIEDADES</span>
                </div>
              </a>
              <p class="text-white/50 text-xs font-light max-w-xs">
                Encontrá la propiedad ideal con la confianza y el respaldo de un equipo profesional.
              </p>
            </div>

            <div class="md:col-span-2 space-y-3">
              <h4 class="text-white font-bold uppercase tracking-widest text-[10px]">NAVEGACIÓN</h4>
              <ul class="space-y-2">
                <li><a href="#" class="hover:text-white">Inicio</a></li>
                <li><a href="#propiedades" class="hover:text-white">Propiedades</a></li>
                <li><a href="#servicios" class="hover:text-white">Servicios</a></li>
                <li><a href="#nosotros" class="hover:text-white">Nosotros</a></li>
                <li><a href="#contacto" class="hover:text-white">Contacto</a></li>
              </ul>
            </div>

            <div class="md:col-span-3 space-y-3">
              <h4 class="text-white font-bold uppercase tracking-widest text-[10px]">SERVICIOS</h4>
              <ul class="space-y-2">
                <li><a href="#" class="hover:text-white">Tasaciones</a></li>
                <li><a href="#" class="hover:text-white">Administración</a></li>
                <li><a href="#" class="hover:text-white">Venta</a></li>
                <li><a href="#" class="hover:text-white">Alquileres</a></li>
              </ul>
            </div>

            <div class="md:col-span-3 space-y-3">
              <h4 class="text-white font-bold uppercase tracking-widest text-[10px]">NEWSLETTER</h4>
              <p class="text-white/50 text-xs">Suscribite para recibir nuestras novedades y oportunidades.</p>
              <form onsubmit="event.preventDefault(); alert('¡Gracias por suscribirte!');" class="flex gap-2">
                <input required type="email" placeholder="Tu email" class="w-full bg-[#1c1f22] border-white/15 text-white text-xs py-2.5 px-3 rounded focus:ring-0 focus:border-[#c49a45]"/>
                <button type="submit" class="bg-[#c49a45] text-white px-4 py-2.5 rounded font-bold">→</button>
              </form>
            </div>
          </div>

          <div class="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-white/40 text-[11px] gap-4">
            <div>© 2026 Domus Propiedades. Todos los derechos reservados.</div>
            <div>Desarrollado por Domus Digital.</div>
          </div>
        </footer>

      </body>
      </html>
    `;
  }, [filterOp, filterTipo, list]);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <iframe
        src="/Realstate/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#0f1012"
        }}
        title="Inmobiliaria Real Estate Web Demo"
      />

      {selectedPublicProject && (
        <ProjectPreviewModal
          project={selectedPublicProject}
          onClose={() => setSelectedPublicProject(null)}
        />
      )}

      {selectedPublicPost && (
        <PostPreviewModal
          post={selectedPublicPost}
          onClose={() => setSelectedPublicPost(null)}
        />
      )}
    </div>
  );
}

function ConversionModal({ onClose, onConfirm, onBuy }) {
  return (
    <div style={S.convModalOverlay}>
      <div style={S.convModalCard}>
        <div style={S.convModalGlow} />
        <button style={S.convModalClose} onClick={onClose}>✕</button>
        <div style={S.convModalEmoji}>🎯</div>
        <h3 style={S.convModalTitle}>¡Así de rápido captarás clientes en piloto automático!</h3>
        <p style={S.convModalDesc}>
          El simulador de Sofía calificó al interesado, lo registró en tu CRM y agendó la visita en tu agenda de forma autónoma.
        </p>
        <div style={S.convModalPromoBox}>
          <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff', marginBottom: 4 }}>¿Querés tener este sistema en tu Inmobiliaria?</strong>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>Adquirí tu Web + CRM hoy por ARS $360.000 (o en 3 cuotas sin interés con Mercado Pago) con 1 año de hosting gratis. El agente IA es opcional.</p>
        </div>
        <div style={S.convModalActions}>
          <button style={S.convModalBtnPrimary} onClick={() => { onBuy(); onClose(); }}>
            Contratar Plataforma Web
          </button>
          <button style={S.convModalBtnOutline} onClick={() => { onConfirm(); onClose(); }}>
            Solicitar Demo de mi Marca Gratis
          </button>
          <button style={S.convModalBtnSecondary} onClick={onClose}>
            Seguir explorando la demo
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandModal({ onClose, brandName, setBrandName, brandColor, setBrandColor }) {
  const [tempName, setTempName] = useState(brandName);
  const [tempColor, setTempColor] = useState(brandColor);

  const colors = [
    { name: "Carmesí (Predeterminado)", hex: "#EA384D" },
    { name: "Cian Tecnológico", hex: "#0284c7" },
    { name: "Verde Esmeralda", hex: "#10b981" },
    { name: "Morado Real", hex: "#8b5cf6" },
    { name: "Dorado Luxe", hex: "#d97706" }
  ];

  return (
    <div style={S.convModalOverlay} onClick={onClose}>
      <div style={{ ...S.convModalCard, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <button style={S.convModalClose} onClick={onClose}>✕</button>
        <div style={S.convModalEmoji}>🎨</div>
        <h3 style={S.convModalTitle}>Probar con tu Propia Marca</h3>
        <p style={S.convModalDesc}>
          Personalizá el nombre de tu inmobiliaria y el color institucional para simular cómo lucirá tu sistema en vivo.
        </p>

        <div style={{ margin: '18px 0', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Nombre de tu Inmobiliaria
          </label>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: '0.95rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
            placeholder="Ej: Valdez Propiedades"
          />
        </div>

        <div style={{ margin: '18px 0', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Color Institucional Primario
          </label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setTempColor(c.hex)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: c.hex,
                  border: tempColor === c.hex ? '3px solid #ffffff' : '2px solid transparent',
                  cursor: 'pointer',
                  boxShadow: tempColor === c.hex ? '0 0 12px ' + c.hex : 'none',
                  transition: 'all 0.2s'
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div style={S.convModalActions}>
          <button
            style={{ ...S.convModalBtnPrimary, background: tempColor }}
            onClick={() => {
              if (tempName.trim()) setBrandName(tempName.trim());
              setBrandColor(tempColor);
              onClose();
            }}
          >
            Aplicar Marca al Simulador ✨
          </button>
          <button style={S.convModalBtnSecondary} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ p, onClose, onWhatsApp }) {
  const [activeTab, setActiveTab] = useState("ficha");
  const [cuotasPlazo, setCuotasPlazo] = useState(24);

  const getAmenities = (tipo) => {
    if (tipo === "casa") return ["Piscina", "Parrilla", "Jardín", "Cochera Doble", "Seguridad"];
    if (tipo === "depto") return ["Balcón Terraza", "Cocina Equipada", "Seguridad 24h", "Cochera Fija", "Luminoso"];
    if (tipo === "PH") return ["Sin Expensas", "Patio Propio", "Terraza", "Parrilla"];
    if (tipo === "local") return ["Vidriera Amplia", "Baño Privado", "Depósito", "Alto Tránsito"];
    return ["Servicios al Día", "Apto Construcción", "Excelente Acceso"];
  };

  const numStr = p.precio.replace(/[^0-9]/g, '');
  const basePrice = parseInt(numStr, 10) || 150000;
  const isUsd = p.precio.toUpperCase().includes("USD");
  const currencySymbol = isUsd ? "USD $" : "ARS $";
  
  const sena = Math.round(basePrice * 0.10);
  const boleto = Math.round(basePrice * 0.40);
  const saldoFinanciar = Math.round(basePrice * 0.50);
  const cuotaMensual = Math.round(saldoFinanciar / cuotasPlazo);
  const rentaEstimada = Math.round(basePrice * 0.0055);
  const roiAnual = ((rentaEstimada * 12) / basePrice * 100).toFixed(1);

  return (
    <div style={S.modalOv} className="kap-modal-overlay" onClick={onClose}>
      <div style={S.modal} className="kap-scroll kap-modal-body" onClick={(e) => e.stopPropagation()}>
        <button style={S.modalX} onClick={onClose} className="kap-x modalX">✕</button>
        <Photo p={p} height="240px" iconSize={64}>
          <span style={S.propBadge}>{p.operacion}</span>
          {p.destacado && <span style={S.ribbon}>★ Destacado</span>}
          <span style={S.fotosBadge}>◳ {p.fotos} fotos</span>
        </Photo>
        
        {/* Selector de Pestañas Ficha vs Calculadora */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 12px' }}>
          <button
            onClick={() => setActiveTab("ficha")}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === "ficha" ? '3px solid #1b1c1c' : '3px solid transparent',
              fontWeight: activeTab === "ficha" ? 700 : 500,
              color: activeTab === "ficha" ? '#1b1c1c' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.82rem'
            }}
          >
            📋 Ficha Técnica & Fotos
          </button>
          <button
            onClick={() => setActiveTab("finanzas")}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === "finanzas" ? '3px solid #0284c7' : '3px solid transparent',
              fontWeight: activeTab === "finanzas" ? 700 : 500,
              color: activeTab === "finanzas" ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🧮 Calculadora de Financiamiento & Renta
          </button>
        </div>

        <div style={S.modalBody}>
          {activeTab === "ficha" ? (
            <>
              <div style={S.propPriceRow}>
                <div>
                  <span style={S.modalPrice} className="modalPrice">
                    {p.precio}
                    <span style={S.propPriceNota} className="propPriceNota">{p.precioNota}</span>
                  </span>
                  {(() => {
                    try {
                      if (isUsd) {
                        const ars = (basePrice * 1400).toLocaleString('es-AR', { maximumFractionDigits: 0 }).replace(/,/g, '.');
                        return <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>ARS $ {ars} {p.precioNota || ''}</span>;
                      } else {
                        const usd = Math.round(basePrice / 1400).toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.');
                        return <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>USD $ {usd} {p.precioNota || ''}</span>;
                      }
                    } catch (e) {
                      return null;
                    }
                  })()}
                </div>
                <span style={S.propTipoTag} className="propTipoTag">{p.tipo.toUpperCase()}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1b1c1c', margin: '14px 0 6px 0', fontFamily: 'Lexend' }}>
                {p.titulo}
              </h3>

              <div style={S.modalZona} className="modalZona">{p.zona}</div>
              
              <div style={S.modalFeats} className="modalFeats">
                {p.dorm > 0 && <Feat n={p.dorm} l={p.dorm > 1 ? "dormitorios" : "dormitorio"} />}
                {p.banos > 0 && <Feat n={p.banos} l={p.banos > 1 ? "baños" : "baño"} />}
                <Feat n={p.m2} l="m² totales" />
                {p.amb > 0 && <Feat n={p.amb} l="ambientes" />}
              </div>

              <div style={{marginTop: 18}}>
                <div style={S.modalSectionTitle} className="modalSectionTitle">Características & Servicios</div>
                <div style={S.amenitiesGrid}>
                  {getAmenities(p.tipo).map(am => (
                    <span key={am} style={S.amenityBadge} className="amenityBadge">{am}</span>
                  ))}
                </div>
              </div>

              <p style={S.modalDesc} className="modalDesc">{p.extra}</p>

              <div style={S.modalMapBox} className="modalMapBox">
                <div style={S.modalMapHeader} className="modalMapHeader">Ubicación aproximada</div>
                <div style={S.modalMapCanvas} className="modalMapCanvas">
                  <div style={S.modalMapGlow} />
                  <span style={S.modalMapPin}>
                    <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24" style={{ zIndex: 2 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                  <span style={S.modalMapLabel} className="modalMapLabel">{p.zona}</span>
                </div>
              </div>

              <div style={S.modalMetaRow} className="modalMetaRow"><span>Código {p.cod}</span><span>Publicado hace {p.dias} días</span></div>
            </>
          ) : (
            <div style={{ padding: '6px 0' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: 14, borderRadius: 10, marginBottom: 18 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>💡 Simulador de Financiamiento Inmobiliario</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.4 }}>
                  Plan estimado para la adquisición de <strong>{p.titulo}</strong> ({p.precio}).
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Seña Inicial (10%)</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{currencySymbol} {sena.toLocaleString()}</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Boleto Compraventa (40%)</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{currencySymbol} {boleto.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 16, borderRadius: 10, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>Saldo a Financiar (50%): {currencySymbol} {saldoFinanciar.toLocaleString()}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[12, 24, 36].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCuotasPlazo(c)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: cuotasPlazo === c ? '1px solid #0284c7' : '1px solid #cbd5e1',
                          background: cuotasPlazo === c ? '#0284c7' : '#ffffff',
                          color: cuotasPlazo === c ? '#ffffff' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {c} mes{c > 1 ? 'es' : ''}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>
                  {cuotasPlazo} cuotas fijas de {currencySymbol} {cuotaMensual.toLocaleString()} / mes
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 10, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>📈 Proyección de Alquiler / Renta Mensual</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', marginTop: 2 }}>{currencySymbol} {rentaEstimada.toLocaleString()} / mes</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Rentabilidad Anual (ROI)</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534' }}>{roiAnual}% Anual</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={S.modalCtas}>
            <button style={{ ...S.ctaPrimary, background: '#1b1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1.5, fontFamily: '"Lexend", sans-serif', height: 44, borderRadius: 8 }} className="kap-cta" onClick={() => onWhatsApp(p)}>
              <span style={{ fontSize: 18 }} className="material-symbols-outlined">calendar_month</span>
              Agendar visita con Sofía (IA)
            </button>
            <a href="tel:+5491122862000" style={{ ...S.ctaGhost, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1b1c1c', border: '1px solid #1b1c1c', borderRadius: 8, height: 44, padding: '0 16px', fontSize: '0.85rem', fontWeight: 700, flex: 1, fontFamily: '"Lexend", sans-serif' }} className="kap-ghost">
              Llamar Oficina
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
function Feat({ n, l }) { return <div style={S.featBox} className="featBox"><span style={S.featN} className="featN">{n}</span><span style={S.featL} className="featL">{l}</span></div>; }

// ── PANEL ADMIN ──────────────────────────────────────────────────────────────
function Icon({ name }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    pipeline: <><rect x="3" y="4" width="4" height="16" rx="1.5" /><rect x="10" y="4" width="4" height="11" rx="1.5" /><rect x="17" y="4" width="4" height="7" rx="1.5" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>,
    props: <><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /></>,
    projects: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    blog: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /><path d="M16 6.5a2.8 2.8 0 0 1 0 5.5" /><path d="M20.5 20c0-2.2-1.3-4-3.3-4.7" /></>,
    bot: <><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 4v4M8.5 13h.01M15.5 13h.01M9.5 16.5h5" /></>,
    team: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    building: <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12h12" /><path d="M6 7h12" /><path d="M6 17h12" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>
  };
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.dashboard}</svg>;
}

function LeadDrawer({ lead, onClose, onUpdateStatus, messages }) {
  if (!lead) return null;
  const prop = CATALOGO.find((p) => p.zona?.toLowerCase().includes(lead.zona?.toLowerCase())) || CATALOGO[0];
  const score = lead.estado === 'ganado' ? 98 : (lead.estado === 'visita_agendada' || lead.estado === 'calificado') ? 92 : 75;

  return (
    <div style={S.drawerBackdrop} onClick={onClose}>
      <div style={S.drawerContent} onClick={(e) => e.stopPropagation()}>
        <div style={S.drawerHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ ...S.rowDot, background: grad, width: 44, height: 44, fontSize: 18, borderRadius: 12 }}>
              {(lead.nombre[0] || "?").toUpperCase()}
            </div>
            <div>
              <div style={S.drawerTitle}>{lead.nombre} {lead.live && <span style={S.inlineLive}>· en vivo</span>}</div>
              <div style={S.drawerSub}>{lead.contacto} · {lead.origen}</div>
            </div>
          </div>
          <button style={S.drawerCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div style={S.drawerScoreCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Lead Scoring (IA)</span>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>{score} / 100 · Alta Intención</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${score}%`, background: 'linear-gradient(90deg, #38bdf8, #8b5cf6)', borderRadius: 3 }} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Estado en Pipeline:</span>
            <select
              value={lead.estado}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
              style={S.drawerSelect}
            >
              {COLS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={S.drawerSection}>
          <div style={S.drawerSecTitle}>Propiedad de Interés</div>
          <div style={S.drawerPropCard}>
            <Photo p={prop} height="60px" iconSize={18} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{prop.titulo || `${prop.tipo} en ${prop.zona}`}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{prop.precio} · {prop.m2} m² · {prop.amb} amb.</div>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: 4, fontWeight: 600 }}>Cód: {prop.cod}</div>
            </div>
          </div>
        </div>

        <div style={S.drawerSection}>
          <div style={S.drawerSecTitle}>Conversación WhatsApp (Sofía IA)</div>
          <div style={S.drawerChatBox}>
            {messages && messages.length > 0 ? (
              messages.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: m.role === 'user' ? '#075e54' : '#1f2c34', color: '#e9edef', padding: '8px 12px', borderRadius: 10, fontSize: '0.78rem', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>{m.hora || 'Reciente'}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                Atendido automáticamente por Sofía (Agente IA 24/7).
              </div>
            )}
          </div>
        </div>

        <div style={S.drawerActions}>
          <a
            href={`https://wa.me/${lead.contacto?.replace(/\D/g, '') || '5491138830925'}?text=Hola%20${encodeURIComponent(lead.nombre || '')},%20te%20contacto%20de%20Grupo%20Aurora`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...S.drawerBtnWa, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Abrir en WhatsApp
          </a>
          <button style={{ ...S.drawerBtnSec, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => { onUpdateStatus(lead.id, 'visita_agendada'); onClose(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Agendar Visita
          </button>
        </div>
      </div>
    </div>
  );
}

function AddLeadModal({ onClose, onAddLead }) {
  const [form, setForm] = useState({ nombre: '', contacto: '', intencion: 'alquiler', zona: 'Palermo', presupuesto: 'USD 500' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onAddLead({
      id: `L_${Date.now()}`,
      nombre: form.nombre,
      contacto: form.contacto || '+54 9 11 5555-0000',
      intencion: form.intencion,
      zona: form.zona,
      presupuesto: form.presupuesto,
      estado: 'nuevo',
      origen: 'Manual Admin',
      t: 'ahora mismo',
      live: true
    });
    onClose();
  };

  return (
    <div style={S.drawerBackdrop} onClick={onClose}>
      <div style={{ ...S.drawerContent, width: 400, height: 'auto', maxHeight: '90vh', borderRadius: 16, padding: 24, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700 }}>+ Nuevo Prospecto / Lead</h3>
          <button style={S.drawerCloseBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={S.formLabel}>Nombre completo</label>
            <input type="text" required placeholder="Ej: Mariano Torres" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} style={S.formInput} />
          </div>
          <div>
            <label style={S.formLabel}>Contacto (WhatsApp / Email)</label>
            <input type="text" placeholder="Ej: +54 9 11 4455-6677" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} style={S.formInput} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={S.formLabel}>Intención</label>
              <select value={form.intencion} onChange={(e) => setForm({ ...form, intencion: e.target.value })} style={S.formInput}>
                <option value="alquiler">Alquiler</option>
                <option value="compra">Compra</option>
              </select>
            </div>
            <div>
              <label style={S.formLabel}>Zona</label>
              <input type="text" placeholder="Palermo, Belgrano..." value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })} style={S.formInput} />
            </div>
          </div>
          <div>
            <label style={S.formLabel}>Presupuesto aproximado</label>
            <input type="text" placeholder="Ej: USD 150.000 / $ 400.000" value={form.presupuesto} onChange={(e) => setForm({ ...form, presupuesto: e.target.value })} style={S.formInput} />
          </div>
          <button type="submit" style={S.drawerBtnWa}>Guardar Lead</button>
        </form>
      </div>
    </div>
  );
}

function PropertyFormPage({ onClose, onSaveProperty, initialProperty = null }) {
  const isEdit = !!initialProperty;
  const [activeStep, setActiveStep] = useState('basicos');
  const [toastMsg, setToastMsg] = useState('');

  const [form, setForm] = useState(() => {
    if (initialProperty) {
      return {
        id: initialProperty.id,
        cod: initialProperty.cod || `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
        titulo: initialProperty.titulo || '',
        tipo: initialProperty.tipo || 'depto',
        operacion: initialProperty.operacion || 'venta',
        estadoProp: initialProperty.estadoProp || 'disponible',
        precio: initialProperty.precio || 'USD 180.000',
        precioNota: initialProperty.precioNota || '',
        moneda: initialProperty.precio?.includes('$') ? 'ARS' : 'USD',
        zona: initialProperty.zona || 'Palermo, CABA',
        direccion: initialProperty.direccion || '',
        ciudad: initialProperty.ciudad || 'CABA',
        provincia: initialProperty.provincia || 'Buenos Aires',
        cp: initialProperty.cp || '1425',
        mapaUrl: initialProperty.mapaUrl || '',
        m2: initialProperty.m2 || 65,
        m2Cubiertos: initialProperty.m2Cubiertos || 58,
        amb: initialProperty.amb || 3,
        dorm: initialProperty.dorm || 2,
        banos: initialProperty.banos || 1,
        cocheras: initialProperty.cocheras || 1,
        expensas: initialProperty.expensas || '$ 45.000',
        antiguedad: initialProperty.antiguedad || 5,
        disposicion: initialProperty.disposicion || 'Frente',
        orientacion: initialProperty.orientacion || 'Norte',
        extra: initialProperty.extra || '',
        photo: initialProperty.photo || 'photo-1545324418-cc1a3fa10c00',
        fotosCount: initialProperty.fotos || 6,
        matricula: initialProperty.matricula || 'CUCICBA 7840',
        escritura: initialProperty.escritura || 'Apta Crédito / Al día',
        notasAgente: initialProperty.notasAgente || '',
        seoTitulo: initialProperty.seoTitulo || '',
        seoDescripcion: initialProperty.seoDescripcion || '',
        amenities: initialProperty.amenities || { parrilla: true, pileta: true, sum: true, balcon: true, seguridad: true, gimnasio: false, ascensor: true }
      };
    }
    return {
      cod: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      titulo: '',
      tipo: 'depto',
      operacion: 'venta',
      estadoProp: 'disponible',
      precio: 'USD 180.000',
      precioNota: '',
      moneda: 'USD',
      zona: 'Palermo, CABA',
      direccion: 'Av. Santa Fe 3200',
      ciudad: 'CABA',
      provincia: 'Buenos Aires',
      cp: '1425',
      mapaUrl: 'https://maps.google.com',
      m2: 65,
      m2Cubiertos: 58,
      amb: 3,
      dorm: 2,
      banos: 1,
      cocheras: 1,
      expensas: '$ 45.000',
      antiguedad: 0,
      disposicion: 'Frente',
      orientacion: 'Norte',
      extra: 'Excelente propiedad luminosa con terminaciones de primera categoría.',
      photo: 'photo-1545324418-cc1a3fa10c00',
      fotosCount: 8,
      matricula: 'CUCICBA 7840',
      escritura: 'Apta Crédito / Al día',
      notasAgente: 'Cliente dispuesto a escuchar ofertas al contado.',
      seoTitulo: '',
      seoDescripcion: '',
      amenities: { parrilla: true, pileta: true, sum: true, balcon: true, seguridad: true, gimnasio: false, ascensor: true }
    };
  });

  const handleSave = (targetStatus = form.estadoProp) => {
    if (!form.titulo.trim()) {
      setToastMsg('Por favor ingresá un título comercial para la propiedad.');
      return;
    }
    if (!form.zona.trim()) {
      setToastMsg('Por favor ingresá la zona o barrio de la propiedad.');
      return;
    }

    onSaveProperty({
      id: isEdit ? initialProperty.id : `P_${Date.now()}`,
      cod: form.cod,
      tipo: form.tipo,
      operacion: form.operacion,
      estadoProp: targetStatus,
      zona: form.zona,
      direccion: form.direccion,
      ciudad: form.ciudad,
      provincia: form.provincia,
      cp: form.cp,
      mapaUrl: form.mapaUrl,
      precio: form.precio,
      precioNota: form.precioNota,
      m2: Number(form.m2),
      m2Cubiertos: Number(form.m2Cubiertos),
      amb: Number(form.amb),
      dorm: Number(form.dorm),
      banos: Number(form.banos),
      cocheras: Number(form.cocheras),
      disposicion: form.disposicion,
      orientacion: form.orientacion,
      extra: form.extra,
      photo: form.photo,
      dias: isEdit ? (initialProperty.dias || 1) : 1,
      consultas: isEdit ? (initialProperty.consultas || 0) : 0,
      destacado: true,
      fotos: Number(form.fotosCount) || 6,
      titulo: form.titulo,
      expensas: form.expensas,
      antiguedad: form.antiguedad,
      matricula: form.matricula,
      escritura: form.escritura,
      notasAgente: form.notasAgente,
      seoTitulo: form.seoTitulo,
      seoDescripcion: form.seoDescripcion,
      amenities: form.amenities
    });
    onClose();
  };

  const stepsList = [
    { id: 'basicos', label: '1. Información principal', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4 6 3v15M9 9h2M9 13h2M9 17h2M15 9h2M15 13h2M15 17h2"/></svg> },
    { id: 'ubicacion', label: '2. Ubicación', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    { id: 'medidas', label: '3. Características', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.3 15.3l-9.6-9.6a2 2 0 0 0-2.8 0L2.7 12a2 2 0 0 0 0 2.8l9.6 9.6a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.9zM14.5 12.5l-2-2M11.5 15.5l-2-2M8.5 18.5l-2-2"/></svg> },
    { id: 'amenities', label: '4. Imágenes y servicios', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { id: 'legal', label: '5. Publicación y SEO', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '10px 0 20px 0' }}>
      
      {/* Header Bar Simplificado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc',
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          <div>
            <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Lexend', sans-serif" }}>
              {isEdit ? `Editar propiedad · ${form.cod}` : 'Cargar nueva propiedad'}
            </h2>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Referencia: <strong style={{ color: '#38bdf8' }}>{form.cod}</strong></span>
          </div>
        </div>
        
        <span style={{ background: PROP_STATUSES[form.estadoProp]?.bg || 'rgba(16,185,129,0.15)', color: PROP_STATUSES[form.estadoProp]?.color || '#10b981', border: `1px solid ${PROP_STATUSES[form.estadoProp]?.border || 'rgba(16,185,129,0.3)'}`, padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem' }}>
          {PROP_STATUSES[form.estadoProp]?.label || form.estadoProp}
        </span>
      </div>

      {toastMsg && (
        <div style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '12px 16px', borderRadius: 10, fontSize: '0.85rem' }}>
          {toastMsg}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 280px', gap: 16, alignItems: 'start' }}>
          
          {/* Left Vertical Step Sidebar */}
          <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, position: 'sticky', top: 10 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '6px 10px 8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
              Pasos de carga
            </div>
            {stepsList.map(tab => {
              const isActive = activeStep === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStep(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    background: isActive ? 'linear-gradient(135deg, rgba(234,56,77,0.25), rgba(139,92,246,0.25))' : 'transparent',
                    border: isActive ? '1px solid rgba(234,56,77,0.4)' : '1px solid transparent',
                    borderRadius: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ color: isActive ? '#EA384D' : '#64748b' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Form Fields Panel */}
          <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* STEP 1: INFORMACION PRINCIPAL */}
            {activeStep === 'basicos' && (
              <>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4 6 3v15M9 9h2M9 13h2M9 17h2M15 9h2M15 13h2M15 17h2"/></svg>
                  Información principal
                </div>

                <div>
                  <label style={S.formLabel}>Título comercial de la publicación *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Semipiso Moderno con Balcón Aterrazado en Palermo Nuevo"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    style={{ ...S.formInput, fontSize: '0.95rem', fontWeight: 600 }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>Título visible en catálogo y portales inmobiliarios.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.formLabel}>Tipo de inmueble *</label>
                    <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} style={S.formInput}>
                      <option value="depto">Departamento</option>
                      <option value="casa">Casa</option>
                      <option value="PH">PH</option>
                      <option value="lote">Lote / Terreno</option>
                      <option value="local">Local Comercial</option>
                      <option value="oficina">Oficina</option>
                      <option value="deposito">Depósito / Galpón</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.formLabel}>Tipo de operación *</label>
                    <select value={form.operacion} onChange={(e) => setForm({ ...form, operacion: e.target.value })} style={S.formInput}>
                      <option value="venta">Venta</option>
                      <option value="alquiler">Alquiler</option>
                      <option value="temporario">Alquiler Temporario</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.formLabel}>Moneda</label>
                    <select value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value })} style={S.formInput}>
                      <option value="USD">Dólares (USD)</option>
                      <option value="ARS">Pesos Argentinos (ARS)</option>
                    </select>
                  </div>
                  <div>
                    <label style={S.formLabel}>Precio publicado *</label>
                    <input type="text" required placeholder="Ej: USD 180.000 o $ 550.000" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} style={S.formInput} />
                  </div>
                  <div>
                    <label style={S.formLabel}>Expensas mensuales</label>
                    <input type="text" placeholder="Ej: $ 45.000" value={form.expensas} onChange={(e) => setForm({ ...form, expensas: e.target.value })} style={S.formInput} />
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: UBICACION */}
            {activeStep === 'ubicacion' && (
              <>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Ubicación
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.formLabel}>Barrio / Zona *</label>
                    <input type="text" required placeholder="Ej. Palermo Soho, CABA" value={form.zona} onChange={(e) => setForm({ ...form, zona: e.target.value })} style={S.formInput} />
                  </div>
                  <div>
                    <label style={S.formLabel}>Dirección exacta</label>
                    <input type="text" placeholder="Ej. Av. Santa Fe 3200" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} style={S.formInput} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.formLabel}>Ciudad</label>
                    <input type="text" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} style={S.formInput} />
                  </div>
                  <div>
                    <label style={S.formLabel}>Provincia</label>
                    <input type="text" value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} style={S.formInput} />
                  </div>
                  <div>
                    <label style={S.formLabel}>Código postal</label>
                    <input type="text" value={form.cp} onChange={(e) => setForm({ ...form, cp: e.target.value })} style={S.formInput} />
                  </div>
                </div>

                <div>
                  <label style={S.formLabel}>Enlace a Google Maps / Coordenadas GPS (Opcional)</label>
                  <input type="url" placeholder="https://maps.google.com/..." value={form.mapaUrl} onChange={(e) => setForm({ ...form, mapaUrl: e.target.value })} style={S.formInput} />
                </div>
              </>
            )}

            {/* STEP 3: CARACTERISTICAS */}
            {activeStep === 'medidas' && (
              <>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M21.3 15.3l-9.6-9.6a2 2 0 0 0-2.8 0L2.7 12a2 2 0 0 0 0 2.8l9.6 9.6a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.9zM14.5 12.5l-2-2M11.5 15.5l-2-2M8.5 18.5l-2-2"/></svg>
                  Características
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div><label style={S.formLabel}>m² Totales</label><input type="number" value={form.m2} onChange={(e) => setForm({ ...form, m2: e.target.value })} style={S.formInput} /></div>
                  <div><label style={S.formLabel}>m² Cubiertos</label><input type="number" value={form.m2Cubiertos} onChange={(e) => setForm({ ...form, m2Cubiertos: e.target.value })} style={S.formInput} /></div>
                  <div><label style={S.formLabel}>Ambientes</label><input type="number" value={form.amb} onChange={(e) => setForm({ ...form, amb: e.target.value })} style={S.formInput} /></div>
                  <div><label style={S.formLabel}>Dormitorios</label><input type="number" value={form.dorm} onChange={(e) => setForm({ ...form, dorm: e.target.value })} style={S.formInput} /></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div><label style={S.formLabel}>Baños</label><input type="number" value={form.banos} onChange={(e) => setForm({ ...form, banos: e.target.value })} style={S.formInput} /></div>
                  <div><label style={S.formLabel}>Cocheras</label><input type="number" value={form.cocheras} onChange={(e) => setForm({ ...form, cocheras: e.target.value })} style={S.formInput} /></div>
                  <div><label style={S.formLabel}>Disposición</label><select value={form.disposicion} onChange={(e) => setForm({ ...form, disposicion: e.target.value })} style={S.formInput}><option value="Frente">Frente</option><option value="Contrafrente">Contrafrente</option><option value="Lateral">Lateral</option><option value="Interno">Interno</option></select></div>
                  <div><label style={S.formLabel}>Orientación</label><select value={form.orientacion} onChange={(e) => setForm({ ...form, orientacion: e.target.value })} style={S.formInput}><option value="Norte">Norte</option><option value="Sur">Sur</option><option value="Este">Este</option><option value="Oeste">Oeste</option><option value="Noreste">Noreste</option><option value="Noroeste">Noroeste</option></select></div>
                </div>

                <div>
                  <label style={S.formLabel}>Antigüedad (años)</label>
                  <input type="number" value={form.antiguedad} onChange={(e) => setForm({ ...form, antiguedad: e.target.value })} style={S.formInput} />
                </div>
              </>
            )}

            {/* STEP 4: IMAGENES Y SERVICIOS */}
            {activeStep === 'amenities' && (
              <>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Imágenes y servicios
                </div>

                <div>
                  <label style={S.formLabel}>Servicios & Comodidades / Amenities</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, background: '#0d131f', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                    {[
                      { key: 'parrilla', label: 'Parrilla / BBQ' },
                      { key: 'pileta', label: 'Piscina / Pool' },
                      { key: 'sum', label: 'SUM / Eventos' },
                      { key: 'balcon', label: 'Balcón Aterrazado' },
                      { key: 'seguridad', label: 'Seguridad 24 hs' },
                      { key: 'gimnasio', label: 'Gimnasio' },
                      { key: 'ascensor', label: 'Ascensor' }
                    ].map(item => (
                      <label key={item.key} style={{ fontSize: '0.82rem', color: '#ececf2', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={!!form.amenities[item.key]}
                          onChange={(e) => setForm({
                            ...form,
                            amenities: { ...form.amenities, [item.key]: e.target.checked }
                          })}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={S.formLabel}>Descripción comercial detallada</label>
                  <textarea
                    rows={4}
                    value={form.extra}
                    onChange={(e) => setForm({ ...form, extra: e.target.value })}
                    style={{ ...S.formInput, resize: 'vertical' }}
                    placeholder="Detalles de categoría, terminaciones de calidad, luminosidad, cocina integrada..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.formLabel}>ID de imagen Unsplash / URL Principal</label>
                    <input type="text" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} style={S.formInput} placeholder="photo-1545324418-cc1a3fa10c00" />
                  </div>
                  <div>
                    <label style={S.formLabel}>Cantidad de fotos en galería</label>
                    <input type="number" value={form.fotosCount} onChange={(e) => setForm({ ...form, fotosCount: e.target.value })} style={S.formInput} />
                  </div>
                </div>
              </>
            )}

            {/* STEP 5: PUBLICACION Y SEO */}
            {activeStep === 'legal' && (
              <>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Publicación y SEO
                </div>

                <div style={{ background: '#0d131f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                  <label style={{ ...S.formLabel, fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>Estado comercial de la propiedad *</label>
                  <select
                    value={form.estadoProp}
                    onChange={(e) => setForm({ ...form, estadoProp: e.target.value })}
                    style={{ ...S.formInput, color: PROP_STATUSES[form.estadoProp]?.color || '#fff', fontWeight: 700, fontSize: '0.9rem' }}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservada">Reservada</option>
                    <option value="vendida">Vendida</option>
                    <option value="alquilada">Alquilada</option>
                    <option value="pausada">Pausada</option>
                    <option value="borrador">Borrador</option>
                  </select>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>Define la visibilidad y estado dentro del CRM y sitio web.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={S.formLabel}>Matrícula habilitante (CUCICBA / Colegio)</label>
                    <input type="text" value={form.matricula} onChange={(e) => setForm({ ...form, matricula: e.target.value })} style={S.formInput} placeholder="Ej. CUCICBA 7840" />
                  </div>
                  <div>
                    <label style={S.formLabel}>Estado dominial / Escritura</label>
                    <input type="text" value={form.escritura} onChange={(e) => setForm({ ...form, escritura: e.target.value })} style={S.formInput} placeholder="Ej. Escritura al día / Apto Crédito" />
                  </div>
                </div>

                <div>
                  <label style={S.formLabel}>Notas confidenciales para agentes (Uso interno)</label>
                  <textarea rows={3} value={form.notasAgente} onChange={(e) => setForm({ ...form, notasAgente: e.target.value })} style={{ ...S.formInput, resize: 'vertical' }} placeholder="Información confidencial, porcentaje de comisión acordado, datos del propietario..." />
                </div>

                <div style={{ background: '#090d16', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: 10 }}>Posicionamiento SEO en buscadores</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <label style={S.formLabel}>Meta Título SEO</label>
                      <input type="text" value={form.seoTitulo || form.titulo} onChange={(e) => setForm({ ...form, seoTitulo: e.target.value })} style={S.formInput} placeholder="Título en Google..." />
                    </div>
                    <div>
                      <label style={S.formLabel}>Meta Descripción SEO</label>
                      <input type="text" value={form.seoDescripcion || form.extra} onChange={(e) => setForm({ ...form, seoDescripcion: e.target.value })} style={S.formInput} placeholder="Descripción en Google..." />
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Right Column Preview & Actions Panel */}
          <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 10 }}>
            
            {/* Actions Box BEFORE preview image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {activeStep !== 'legal' ? (
                <button
                  type="button"
                  onClick={() => {
                    const idx = stepsList.findIndex(s => s.id === activeStep);
                    if (idx < stepsList.length - 1) setActiveStep(stepsList[idx + 1].id);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #EA384D, #8B5CF6)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(234,56,77,0.3)'
                  }}
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                  }}
                >
                  {isEdit ? 'Guardar cambios' : 'Publicar propiedad'}
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSave('borrador')}
                style={{
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#f59e0b',
                  borderRadius: 8,
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                Guardar borrador
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94a3b8',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                Cancelar
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              Previsualización
            </div>

            <div style={{ borderRadius: 12, overflow: 'hidden', background: '#070a12', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ height: 140, width: '100%', background: '#000', overflow: 'hidden', position: 'relative' }}>
                <img src={form.photo?.startsWith('http') ? form.photo : `https://images.unsplash.com/${form.photo || 'photo-1545324418-cc1a3fa10c00'}?auto=format&fit=crop&w=400&q=80`}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy" decoding="async" />
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(15,23,42,0.85)', color: '#38bdf8', padding: '2px 6px', borderRadius: 4, fontSize: '0.62rem', fontWeight: 700 }}>
                  {form.cod}
                </span>
                <span style={{ position: 'absolute', top: 8, right: 8, background: PROP_STATUSES[form.estadoProp]?.bg || 'rgba(16,185,129,0.85)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.62rem', fontWeight: 700 }}>
                  {PROP_STATUSES[form.estadoProp]?.label || form.estadoProp}
                </span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                  {form.tipo} · {form.operacion}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: 4, lineHeight: 1.3 }}>
                  {form.titulo || 'Título Comercial'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8 }}>
                  {form.zona || 'Zona'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
                  {form.precio || '$ 0'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}


function Dashboard({ leads, onSelectLead }) {
  const maxF = FUNNEL[0].v;
  const topProps = [...CATALOGO].sort((a, b) => b.consultas - a.consultas).slice(0, 4);
  const maxC = topProps[0].consultas;
  return (
    <div style={S.dashWrap}>
      <div style={S.kpiRow}>
        {KPIS.map((k) => (
          <div key={k.label} style={S.kpiCard} className="kap-kpi-card">
            <div style={S.kpiLabel} className="kpiLabel">{k.label}</div>
            <div style={S.kpiValue} className="kpiValue">{k.value}</div>
            <div style={{ ...S.kpiDelta, color: k.up ? "#16a34a" : "#ea580c" }}>{k.up ? "▲" : "▼"} {k.delta} <span style={S.kpiVs} className="kpiSub">vs mes ant.</span></div>
          </div>
        ))}
      </div>

      <div style={S.dashGrid2}>
        <div style={S.card} className="kap-admin-card">
          <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Leads por día</span><span style={S.cardHint} className="cardHint">últimos 14 días</span></div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={LEADS_DIA} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                <defs><linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EA384D" stopOpacity={0.55} /><stop offset="100%" stopColor="#EA384D" stopOpacity={0.02} /></linearGradient></defs>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} itemStyle={{ color: "#f8fafc" }} labelFormatter={(d) => `${d}/06`} formatter={(v) => [v, "leads"]} />
                <Area type="monotone" dataKey="v" stroke="#EA384D" strokeWidth={2} fill="url(#gLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={S.card} className="kap-admin-card">
          <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Embudo de conversión</span><span style={S.cardHint} className="cardHint">este mes</span></div>
          <div style={S.funnel}>
            {FUNNEL.map((f, i) => {
              const pct = Math.round((f.v / maxF) * 100), conv = i === 0 ? 100 : Math.round((f.v / FUNNEL[i - 1].v) * 100);
              return <div key={f.label} style={S.funRow}><span style={S.funLabel} className="funLabel">{f.label}</span><div style={S.funBarBg}><div style={{ ...S.funBarFill, width: `${pct}%` }} /></div><span style={S.funV} className="funV">{f.v}</span><span style={S.funConv} className="funConv">{conv}%</span></div>;
            })}
          </div>
        </div>
      </div>

      <div style={S.dashGrid2}>
        <div style={S.card} className="kap-admin-card">
          <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Leads por origen</span><span style={S.cardHint} className="cardHint">atribución</span></div>
          <div style={S.originWrap}>
            <div style={{ width: 150, height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ORIGEN_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="none">
                    {ORIGEN_DATA.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} itemStyle={{ color: "#f8fafc" }} formatter={(v, n) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={S.originLegend}>{ORIGEN_DATA.map((e) => <div key={e.name} style={S.legRow}><span style={{ ...S.legDot, background: e.color }} /><span style={S.legName} className="legName">{e.name}</span><span style={S.legPct} className="legPct">{e.value}%</span></div>)}</div>
          </div>
        </div>
        <div style={{ ...S.card, ...S.agentMini }} className="kap-admin-card">
          <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Rendimiento del agente IA</span><span style={S.liveDot2}><i className="kap-pulse" /> 24/7</span></div>
          <div style={S.agentMiniGrid}>{AGENTE_STATS.map((s) => <div key={s.label} style={S.agentStat}><div style={S.agentStatV} className="agentStatV">{s.value}</div><div style={S.agentStatL} className="agentStatL">{s.label}</div><div style={S.agentStatS} className="agentStatS">{s.sub}</div></div>)}</div>
        </div>
      </div>

      <div style={S.dashGrid2}>
        <div style={S.card} className="kap-admin-card">
          <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Top propiedades</span><span style={S.cardHint} className="cardHint">por consultas</span></div>
          {topProps.map((p) => (
            <div key={p.id} style={S.topRow}>
              <div style={S.topThumb}><Photo p={p} height="40px" iconSize={15} /></div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={S.topName} className="topName">{p.tipo} · {p.zona}</div><div style={S.topBarBg}><div style={{ ...S.topBarFill, width: `${(p.consultas / maxC) * 100}%` }} /></div></div>
              <span style={S.topC} className="topC">{p.consultas}</span>
            </div>
          ))}
        </div>
        <div style={S.card} className="kap-admin-card">
          <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Tareas pendientes</span><span style={S.cardHint} className="cardHint">{TAREAS.length} por hacer</span></div>
          {TAREAS.map((t, i) => (
            <div key={i} style={S.taskRow}>
              <span style={S.taskBox} className="kap-task">✓</span>
              <span style={S.taskTxt}>{t.txt}</span>
              <span style={{ ...S.taskDue, ...(t.due === "Hoy" ? S.taskDueHot : {}) }}>{t.due}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card} className="kap-admin-card">
        <div style={S.cardHead}><span style={S.cardTitle} className="cardTitle">Actividad reciente</span></div>
        <div style={S.activity}>{ACTIVIDAD.map((a, i) => <div key={i} style={S.actRow}><span style={{ ...S.actTag, ...tagColor(a.tag) }}>{a.tag}</span><span style={S.actTxt}>{a.txt}</span><span style={S.actTime}>{a.t}</span></div>)}</div>
      </div>
    </div>
  );
}

function Pipeline({ leads, onSelectLead, onUpdateStatus, dragOverCol, setDragOverCol }) {
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  };

  const handleDrop = (e, colKey) => {
    e.preventDefault();
    setDragOverCol(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId && onUpdateStatus) {
      onUpdateStatus(leadId, colKey);
    }
  };

  return (
    <div style={S.kanban} className="kap-scroll">
      {COLS.map((c) => {
        const cards = leads.filter((l) => l.estado === c.key);
        const isHovered = dragOverCol === c.key;
        return (
          <div
            key={c.key}
            style={{
              ...S.kCol,
              ...(isHovered ? { border: '2px dashed #38bdf8', background: 'rgba(56,189,248,0.06)' } : {})
            }}
            className="kap-kanban-col"
            onDragOver={(e) => handleDragOver(e, c.key)}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, c.key)}
          >
            <div style={S.kColHead}><span>{c.label}</span><span style={S.kCount}>{cards.length}</span></div>
            {cards.map((l) => (
              <div
                key={l.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, l.id)}
                onClick={() => onSelectLead(l)}
                style={{ ...S.kCard, ...(l.live ? S.kCardLive : {}), cursor: 'grab' }}
                className="kap-kanban-card"
              >
                {l.live && <div style={S.liveTag}><i className="kap-pulse" /> lead en vivo</div>}
                <div style={S.kCardTop}><div style={{ ...S.rowDot, background: grad, width: 26, height: 26, fontSize: 11, borderRadius: 8 }}>{(l.nombre[0] || "?").toUpperCase()}</div><div style={S.kName}>{l.nombre}</div></div>
                <div style={S.kMeta}><span style={S.kChip}>{l.intencion}</span> {l.zona}</div>
                <div style={S.kBudget}>{l.presupuesto}</div>
                <div style={S.kFoot}><span style={S.kOrigen}>{l.origen}</span><span>{l.t}</span></div>
                {l.handoff && <div style={S.kHandoff}>⚡ listo para vendedor</div>}
              </div>
            ))}
            {cards.length === 0 && <div style={S.kEmpty}>Arrastrar lead aquí</div>}
          </div>
        );
      })}
    </div>
  );
}

function ProjectsAdminView({ projects, searchTerm, onOpenAdd, onEditProject, onDuplicateProject, onPreviewProject, onDeleteProject, onReorderProject, onToggleFeatured }) {
  const [statusFilter, setStatusFilter] = useState('todos');
  const [catFilter, setCatFilter] = useState('todas');

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== 'todos' && p.status !== statusFilter) return false;
    if (catFilter !== 'todas' && p.category !== catFilter) return false;
    if (!searchTerm?.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.titulo?.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.ubicacion?.toLowerCase().includes(q) ||
      p.cliente?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q)
    );
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  const totalPublicados = projects.filter(p => p.status === 'publicado').length;
  const totalDestacados = projects.filter(p => p.destacado).length;
  const totalBorradores = projects.filter(p => p.status === 'borrador').length;

  return (
    <div style={S.dashWrap}>
      {/* Top Stats */}
      <div style={S.kpiRow}>
        <div style={S.kpiCard}>
          <div style={S.kpiLabel}>Total Proyectos</div>
          <div style={S.kpiValue}>{projects.length}</div>
          <div style={S.kpiSub}>desarrollos y emprendimientos</div>
        </div>
        <div style={S.kpiCard}>
          <div style={S.kpiLabel}>Publicados en Web</div>
          <div style={{ ...S.kpiValue, color: '#10b981' }}>{totalPublicados}</div>
          <div style={S.kpiSub}>visibles en catálogo</div>
        </div>
        <div style={S.kpiCard}>
          <div style={S.kpiLabel}>Destacados en Portada</div>
          <div style={{ ...S.kpiValue, color: '#f59e0b' }}>{totalDestacados}</div>
          <div style={S.kpiSub}>en portada principal</div>
        </div>
        <div style={S.kpiCard}>
          <div style={S.kpiLabel}>Borradores</div>
          <div style={{ ...S.kpiValue, color: '#94a3b8' }}>{totalBorradores}</div>
          <div style={S.kpiSub}>en preparación</div>
        </div>
      </div>

      {/* Filters and Action Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#0b0f19', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>Gestor de Emprendimientos & Proyectos</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Administrá masterplans, torres, loteos y obras comerciales con ficha técnica y SEO</div>
          </div>
          <button onClick={onOpenAdd} style={S.addLeadBtn}>
            + Nuevo Proyecto
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          <div>
            <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: 2 }}>Estado</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={S.formInput}>
              <option value="todos">Todos los estados</option>
              <option value="publicado">Publicado</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: 2 }}>Categoría</label>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={S.formInput}>
              <option value="todas">Todas las categorías</option>
              <option value="Residencial">Residencial</option>
              <option value="Barrio Privado">Barrio Privado</option>
              <option value="Comercial">Comercial</option>
              <option value="Mixto">Mixto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Projects Table */}
      <div style={S.tableWrap} className="kap-admin-table-wrap">
        <div style={{ ...S.tHead, display: 'grid', gridTemplateColumns: '60px 1fr 140px 80px 110px 150px', gap: 10, alignItems: 'center' }}>
          <span>Orden</span>
          <span>Proyecto</span>
          <span>Categoría / Tipo</span>
          <span>Destacado</span>
          <span>Estado</span>
          <span style={{ textAlign: 'center' }}>Acciones</span>
        </div>

        {filteredProjects.map((proj, idx) => {
          const isPub = proj.status === 'publicado';
          const img = proj.image?.startsWith('http') ? proj.image : `https://images.unsplash.com/${proj.image}?auto=format&fit=crop&w=120&q=80`;

          return (
            <div key={proj.id} style={{ ...S.row, display: 'grid', gridTemplateColumns: '60px 1fr 140px 80px 110px 150px', gap: 10, alignItems: 'center' }} className="kap-admin-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>#{proj.order || idx + 1}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button onClick={() => onReorderProject(proj.id, 'up')} title="Subir orden" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}>▲</button>
                  <button onClick={() => onReorderProject(proj.id, 'down')} title="Bajar orden" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}>▼</button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <img src={img} alt={proj.titulo} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#090d16', border: '1px solid rgba(255,255,255,0.08)' }} loading="lazy" decoding="async" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ ...S.rowTitle, fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }} className="kap-admin-row-title">{proj.titulo}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{proj.subtitle || proj.ubicacion}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>{proj.category}</div>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '1px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2 }}>{proj.tipo}</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => onToggleFeatured(proj.id)}
                  title="Cambiar estado destacado"
                  style={{
                    background: proj.destacado ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                    color: proj.destacado ? '#f59e0b' : '#64748b',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {proj.destacado ? 'Sí' : 'No'}
                </button>
              </div>

              <div>
                <span style={{ background: isPub ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: isPub ? '#10b981' : '#f59e0b', border: isPub ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)', padding: '4px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>
                  {isPub ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              <div style={{ textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button onClick={() => onEditProject(proj)} title="Editar proyecto" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => onDuplicateProject(proj)} title="Duplicar proyecto" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button onClick={() => onPreviewProject(proj)} title="Previsualizar proyecto" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#c084fc', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button onClick={() => onDeleteProject(proj.id)} title="Eliminar proyecto" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
            No se encontraron proyectos con los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectEditorModal({ onClose, onSaveProject, onPreviewProject, initialProject = null }) {
  const isEdit = !!initialProject;

  const [form, setForm] = useState(() => {
    if (initialProject) {
      return {
        id: initialProject.id,
        titulo: initialProject.titulo || '',
        subtitle: initialProject.subtitle || '',
        badge: initialProject.badge || 'En Pozo',
        category: initialProject.category || 'Residencial',
        tipo: initialProject.tipo || 'Torre de Lujo',
        descripcionBreve: initialProject.descripcionBreve || '',
        descripcionCompleta: initialProject.descripcionCompleta || '',
        image: initialProject.image || 'photo-1545324418-cc1a3fa10c00',
        galleryText: Array.isArray(initialProject.gallery) ? initialProject.gallery.join(', ') : (initialProject.gallery || ''),
        ubicacion: initialProject.ubicacion || '',
        fecha: initialProject.fecha || '',
        cliente: initialProject.cliente || '',
        tech: initialProject.tech || '',
        servicios: initialProject.servicios || '',
        resultados: initialProject.resultados || '',
        link: initialProject.link || '',
        order: initialProject.order || 1,
        destacado: !!initialProject.destacado,
        status: initialProject.status || 'publicado',
        slug: initialProject.slug || '',
        seoTitulo: initialProject.seoTitulo || '',
        seoDescripcion: initialProject.seoDescripcion || ''
      };
    }
    return {
      titulo: '',
      subtitle: '',
      badge: 'En Pozo · Entrega 2027',
      category: 'Residencial',
      tipo: 'Torre de Lujo',
      descripcionBreve: '',
      descripcionCompleta: '<h2>Desarrollo inmobiliario de vanguardia</h2><p>Descripción detallada de la arquitectura, ubicación y ventajas de inversión...</p>',
      image: 'photo-1545324418-cc1a3fa10c00',
      galleryText: 'photo-1545324418-cc1a3fa10c00, photo-1600585154340-be6161a56a0c',
      ubicacion: 'Belgrano Chico, CABA',
      fecha: 'Diciembre 2027',
      cliente: 'Grupo Desarrollador Aurora',
      tech: 'Piscina In/Out, SPA, Seguridad 24hs, Domótica',
      servicios: 'Proyecto Arquitectónico, Dirección de Obra, Comercialización',
      resultados: 'Excelente rentabilidad proyectada en pozo.',
      link: '',
      order: 1,
      destacado: true,
      status: 'publicado',
      slug: '',
      seoTitulo: '',
      seoDescripcion: ''
    };
  });

  const handleTitleChange = (val) => {
    const autoSlug = val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    setForm((prev) => ({
      ...prev,
      titulo: val,
      slug: prev.slug && isEdit ? prev.slug : autoSlug,
      seoTitulo: prev.seoTitulo ? prev.seoTitulo : (val ? `${val} | Grupo Aurora` : '')
    }));
  };

  const insertFormatting = (tagStart, tagEnd = '') => {
    setForm((prev) => ({
      ...prev,
      descripcionCompleta: prev.descripcionCompleta + `\n${tagStart}Texto nuevo${tagEnd || tagStart.replace('<', '</')}`
    }));
  };

  const handleSubmit = (e, targetStatus) => {
    if (e) e.preventDefault();
    if (!form.titulo.trim()) return;

    const galleryArray = form.galleryText
      ? form.galleryText.split(',').map(s => s.trim()).filter(Boolean)
      : [form.image];

    const projectData = {
      id: form.id || `PROJ-${Date.now()}`,
      titulo: form.titulo,
      subtitle: form.subtitle,
      badge: form.badge,
      category: form.category,
      tipo: form.tipo,
      descripcionBreve: form.descripcionBreve,
      descripcionCompleta: form.descripcionCompleta,
      image: form.image,
      gallery: galleryArray,
      ubicacion: form.ubicacion,
      fecha: form.fecha,
      cliente: form.cliente,
      tech: form.tech,
      servicios: form.servicios,
      resultados: form.resultados,
      link: form.link,
      order: parseInt(form.order) || 1,
      destacado: form.destacado,
      status: targetStatus || form.status,
      slug: form.slug || form.titulo.toLowerCase().replace(/\s+/g, '-'),
      seoTitulo: form.seoTitulo || `${form.titulo} | Grupo Aurora`,
      seoDescripcion: form.seoDescripcion || form.descripcionBreve
    };

    onSaveProject(projectData);
    onClose();
  };

  const currentImg = form.image?.startsWith('http') ? form.image : `https://images.unsplash.com/${form.image}?auto=format&fit=crop&w=600&q=80`;

  return (
    <div style={S.drawerBackdrop} onClick={onClose}>
      <div style={{ ...S.drawerContent, width: 900, height: '92vh', borderRadius: 16, padding: 24, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700 }}>
              {isEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto / Emprendimiento'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Ficha técnica, galería de renders y optimización SEO</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button type="button" onClick={() => onPreviewProject && onPreviewProject({ ...form, gallery: form.galleryText.split(',').map(s => s.trim()).filter(Boolean) })} style={{ ...S.drawerBtnSec, padding: '6px 12px', fontSize: '0.78rem' }}>
              Previsualizar
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, 'borrador')} style={{ ...S.drawerBtnSec, padding: '6px 12px', fontSize: '0.78rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              Guardar Borrador
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, form.status)} style={S.addLeadBtn}>
              {isEdit ? 'Guardar Cambios' : 'Publicar Proyecto'}
            </button>
            <button style={S.drawerCloseBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 18, overflowY: 'auto', maxHeight: '78vh', paddingRight: 6 }}>
          
          {/* Left Main Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div>
                <label style={S.formLabel}>Título del Proyecto / Desarrollo *</label>
                <input type="text" required placeholder="Ej. Torre Libertador Luxury Residences" value={form.titulo} onChange={(e) => handleTitleChange(e.target.value)} style={{ ...S.formInput, fontSize: '1.05rem', fontWeight: 700 }} />
              </div>
              <div>
                <label style={S.formLabel}>Badge de Estado / Etiqueta</label>
                <input type="text" placeholder="Ej. En Pozo · Entrega 2027" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} style={S.formInput} />
              </div>
            </div>

            <div>
              <label style={S.formLabel}>Subtítulo / Bajada Atractiva</label>
              <input type="text" placeholder="Ej. Desarrollo Exclusivo de 28 pisos en Belgrano Chico" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} style={S.formInput} />
            </div>

            <div>
              <label style={S.formLabel}>Descripción Breve (Aparece en tarjetas del catálogo)</label>
              <textarea rows={2} value={form.descripcionBreve} onChange={(e) => setForm({ ...form, descripcionBreve: e.target.value })} style={{ ...S.formInput, resize: 'none' }} placeholder="Resumen conciso para el front-end..." />
            </div>

            <div>
              <label style={S.formLabel}>Descripción Detallada / Memoria Descriptiva (HTML o Texto)</label>
              {/* Rich Editor Toolbar */}
              <div style={{ display: 'flex', gap: 4, background: '#090d16', padding: '6px 8px', borderRadius: '8px 8px 0 0', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => insertFormatting('<strong>', '</strong>')} style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: 4, padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 800 }}>B</button>
                <button type="button" onClick={() => insertFormatting('<h2>', '</h2>')} style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: 4, padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>H2</button>
                <button type="button" onClick={() => insertFormatting('<h3>', '</h3>')} style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: 4, padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}>H3</button>
                <button type="button" onClick={() => insertFormatting('<ul><li>', '</li></ul>')} style={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: 4, padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>• Lista</button>
              </div>
              <textarea
                rows={6}
                value={form.descripcionCompleta}
                onChange={(e) => setForm({ ...form, descripcionCompleta: e.target.value })}
                style={{ ...S.formInput, borderRadius: '0 0 8px 8px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.5 }}
              />
            </div>

            {/* Ficha Técnica & Detalles */}
            <div style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>Ficha Técnica & Especificaciones</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={S.formLabel}>Ubicación Física</label>
                  <input type="text" value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} style={S.formInput} placeholder="Av. del Libertador 5200, CABA" />
                </div>
                <div>
                  <label style={S.formLabel}>Fecha de Entrega / Plazo</label>
                  <input type="text" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} style={S.formInput} placeholder="Diciembre 2027" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                <div>
                  <label style={S.formLabel}>Desarrollador / Cliente</label>
                  <input type="text" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} style={S.formInput} placeholder="Grupo Desarrollador Aurora" />
                </div>
                <div>
                  <label style={S.formLabel}>Tipo Específico</label>
                  <input type="text" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} style={S.formInput} placeholder="Torre de Lujo / Barrio Privado" />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={S.formLabel}>Características / Amenities Clave (separados por coma)</label>
                <input type="text" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} style={S.formInput} placeholder="Piscina In/Out, SPA, Helipuerto, Domótica" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                <div>
                  <label style={S.formLabel}>Servicios Realizados</label>
                  <input type="text" value={form.servicios} onChange={(e) => setForm({ ...form, servicios: e.target.value })} style={S.formInput} placeholder="Proyecto, Dirección de Obra, Venta" />
                </div>
                <div>
                  <label style={S.formLabel}>Resultados / Avances</label>
                  <input type="text" value={form.resultados} onChange={(e) => setForm({ ...form, resultados: e.target.value })} style={S.formInput} placeholder="85% vendido en pozo" />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={S.formLabel}>Enlace Externo (Brochure PDF / Tour 3D)</label>
                <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} style={S.formInput} placeholder="https://..." />
              </div>
            </div>

            {/* SEO SECTION */}
            <div style={{ background: '#090d16', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>Posicionamiento SEO en Google</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={S.formLabel}>Título SEO (Meta Title)</label>
                  <input type="text" value={form.seoTitulo} onChange={(e) => setForm({ ...form, seoTitulo: e.target.value })} style={S.formInput} placeholder="Torre Libertador Luxury Residences | Pozo Belgrano CABA" />
                </div>
                <div>
                  <label style={S.formLabel}>Descripción SEO (Meta Description)</label>
                  <textarea rows={2} value={form.seoDescripcion} onChange={(e) => setForm({ ...form, seoDescripcion: e.target.value })} style={{ ...S.formInput, resize: 'none' }} placeholder="Descripción corta para buscadores..." />
                </div>

                <div>
                  <label style={{ ...S.formLabel, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>Snippet Preview Google</label>
                  <div style={{ background: '#ffffff', color: '#1a0dab', padding: 12, borderRadius: 8, fontFamily: 'arial, sans-serif' }}>
                    <div style={{ fontSize: '0.75rem', color: '#4d5156' }}>https://grupoaurora.com.ar › proyectos › {form.slug || 'slug-del-proyecto'}</div>
                    <div style={{ fontSize: '0.95rem', color: '#1a0dab', fontWeight: 500, textDecoration: 'underline' }}>{form.seoTitulo || form.titulo || 'Título del proyecto'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#4d5156' }}>{form.seoDescripcion || form.descripcionBreve || 'Descripción en Google...'}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#090d16', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6 }}>
              Ajustes de Publicación
            </div>

            <div>
              <label style={S.formLabel}>Estado</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={S.formInput}>
                <option value="publicado">Publicado</option>
                <option value="borrador">Borrador</option>
              </select>
            </div>

            <div>
              <label style={S.formLabel}>Orden de Aparición (Numérico)</label>
              <input type="number" min="1" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} style={S.formInput} />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#f8fafc', cursor: 'pointer', marginTop: 4 }}>
                <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} />
                Destacar en Portada Principal
              </label>
            </div>

            <div>
              <label style={S.formLabel}>Categoría General</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={S.formInput}>
                <option value="Residencial">Residencial</option>
                <option value="Barrio Privado">Barrio Privado</option>
                <option value="Comercial">Comercial</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>

            <div>
              <label style={S.formLabel}>URL / Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={S.formInput} placeholder="torre-libertador" />
            </div>

            <div>
              <label style={S.formLabel}>Imagen Principal (Portada)</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={S.formInput} />
              <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', height: 100, background: '#070a12' }}>
                <img src={currentImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
              </div>
            </div>

            <div>
              <label style={S.formLabel}>Galería (URLs separadas por comas)</label>
              <textarea rows={3} value={form.galleryText} onChange={(e) => setForm({ ...form, galleryText: e.target.value })} style={{ ...S.formInput, resize: 'vertical' }} placeholder="photo-1, photo-2, photo-3" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ProjectPreviewModal({ project, onClose }) {
  if (!project) return null;
  const mainImg = project.image?.startsWith('http') ? project.image : `https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1000&q=80`;
  const gallery = Array.isArray(project.gallery) ? project.gallery : [project.image];

  return (
    <div style={S.drawerBackdrop} onClick={onClose}>
      <div style={{ ...S.drawerContent, width: 840, height: '90vh', borderRadius: 16, padding: 0, margin: 'auto', overflow: 'hidden', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Top Preview Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#070a12', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>Previsualización de Ficha de Proyecto · /proyectos/{project.slug}</div>
          <button style={S.drawerCloseBtn} onClick={onClose}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', height: 'calc(90vh - 50px)', padding: 24 }}>
          {/* Hero Banner */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 320, marginBottom: 20 }}>
            <img src={mainImg} alt={project.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,15,25,0.95), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', background: '#EA384D', color: '#fff', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{project.category}</span>
                {project.badge && <span style={{ fontSize: '0.72rem', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{project.badge}</span>}
              </div>
              <h1 style={{ fontSize: '1.8rem', color: '#fff', margin: 0, fontWeight: 800 }}>{project.titulo}</h1>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '4px 0 0 0' }}>{project.subtitle || project.ubicacion}</p>
            </div>
          </div>

          {/* Grid Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div>
              <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>Descripción del Emprendimiento</h3>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: project.descripcionCompleta || project.descripcionBreve }} />

              {/* Gallery Grid */}
              <h4 style={{ color: '#f8fafc', fontSize: '0.95rem', fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Galería de Fotos & Renders</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {gallery.map((imgKey, i) => {
                  const src = imgKey?.startsWith('http') ? imgKey : `https://images.unsplash.com/${imgKey}?auto=format&fit=crop&w=400&q=80`;
                  return <img key={i} src={src} alt="Gallery item" style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8, background: '#090d16' }} loading="lazy" decoding="async" />;
                })}
              </div>
            </div>

            {/* Sidebar Specs */}
            <div style={{ background: '#090d16', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', height: 'fit-content' }}>
              <h4 style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 6 }}>
                Datos del Proyecto
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8rem' }}>
                <div><span style={{ color: '#64748b', display: 'block' }}>Ubicación:</span><strong style={{ color: '#f8fafc' }}>{project.ubicacion}</strong></div>
                <div><span style={{ color: '#64748b', display: 'block' }}>Entrega / Plazo:</span><strong style={{ color: '#38bdf8' }}>{project.fecha}</strong></div>
                <div><span style={{ color: '#64748b', display: 'block' }}>Desarrollador:</span><strong style={{ color: '#f8fafc' }}>{project.cliente}</strong></div>
                <div><span style={{ color: '#64748b', display: 'block' }}>Amenities Clave:</span><strong style={{ color: '#10b981' }}>{project.tech}</strong></div>
              </div>
              <button onClick={onClose} style={{ ...S.addLeadBtn, width: '100%', marginTop: 20, justifyContent: 'center' }}>
                Consultar sobre este Desarrollo
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


function AdminView({ tab, setTab, leads, onUpdateStatus, onAddLead, messages }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddProp, setShowAddProp] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState(INITIAL_POSTS);

  // Proyectos State
  const [projectsList, setProjectsList] = useState(INITIAL_PROJECTS);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);

  const [toastMsg, setToastMsg] = useState('');
  const [dragOverCol, setDragOverCol] = useState(null);
  const [propList, setPropList] = useState(CATALOGO);
  const [logoutNotice, setLogoutNotice] = useState(false);

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const filteredLeads = leads.filter((l) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      l.nombre?.toLowerCase().includes(q) ||
      l.contacto?.toLowerCase().includes(q) ||
      l.zona?.toLowerCase().includes(q) ||
      l.intencion?.toLowerCase().includes(q) ||
      l.estado?.toLowerCase().includes(q)
    );
  });

  const handleSaveProp = (propData) => {
    const exists = propList.some(p => p.id === propData.id);
    if (exists) {
      setPropList(propList.map(p => p.id === propData.id ? propData : p));
      showNotification(`✨ Propiedad ${propData.cod} actualizada exitosamente`);
    } else {
      setPropList([propData, ...propList]);
      showNotification(`🎉 Propiedad ${propData.cod} creada y publicada`);
    }
  };

  const handleDeleteProp = (id) => {
    setPropList(propList.filter(p => p.id !== id));
    showNotification(`🗑️ Propiedad eliminada del catálogo`);
  };

  const handleChangePropStatus = (id, newStatus) => {
    setPropList(propList.map(p => p.id === id ? { ...p, estadoProp: newStatus } : p));
    showNotification(`🟢 Estado de propiedad actualizado a ${newStatus}`);
  };

  const handleBulkPropAction = (ids, action) => {
    if (action === 'delete') {
      setPropList(propList.filter(p => !ids.includes(p.id)));
      showNotification(`🗑️ ${ids.length} propiedades eliminadas`);
    } else {
      setPropList(propList.map(p => ids.includes(p.id) ? { ...p, estadoProp: action } : p));
      showNotification(`⚡ ${ids.length} propiedades actualizadas a ${action}`);
    }
  };

  const handleSavePost = (savedPost) => {
    const exists = blogPosts.some(p => p.id === savedPost.id);
    if (exists) {
      setBlogPosts(blogPosts.map(p => p.id === savedPost.id ? savedPost : p));
      showNotification(`✨ Artículo "${savedPost.titulo.slice(0, 24)}..." actualizado`);
    } else {
      setBlogPosts([savedPost, ...blogPosts]);
      showNotification(`🎉 Publicación creada exitosamente`);
    }
  };

  const handleDuplicatePost = (post) => {
    const copy = {
      ...post,
      id: `BLOG-${Date.now()}`,
      titulo: `${post.titulo} (Copia)`,
      slug: `${post.slug}-copia`,
      estado: 'borrador',
      fechaPublicacion: new Date().toISOString().slice(0, 16),
      ultimaModificacion: new Date().toISOString().slice(0, 16)
    };
    setBlogPosts([copy, ...blogPosts]);
    showNotification(`📋 Publicación duplicada como Borrador`);
  };

  const handleDeletePost = (id) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
    showNotification(`🗑️ Publicación eliminada del blog`);
  };

  // Projects Handlers
  const handleSaveProject = (projData) => {
    const exists = projectsList.some(p => p.id === projData.id);
    if (exists) {
      setProjectsList(projectsList.map(p => p.id === projData.id ? projData : p));
      showNotification(`✨ Proyecto "${projData.titulo.slice(0, 24)}..." actualizado`);
    } else {
      setProjectsList([projData, ...projectsList]);
      showNotification(`🎉 Proyecto creado exitosamente`);
    }
  };

  const handleDuplicateProject = (proj) => {
    const copy = {
      ...proj,
      id: `PROJ-${Date.now()}`,
      titulo: `${proj.titulo} (Copia)`,
      slug: `${proj.slug}-copia`,
      status: 'borrador',
      order: (proj.order || 0) + 1
    };
    setProjectsList([...projectsList, copy]);
    showNotification(`📋 Proyecto duplicado como Borrador`);
  };

  const handleDeleteProject = (id) => {
    setProjectsList(projectsList.filter(p => p.id !== id));
    showNotification(`🗑️ Proyecto eliminado del sistema`);
  };

  const handleReorderProject = (id, direction) => {
    const sorted = [...projectsList].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex(p => p.id === id);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const tempOrder = sorted[idx].order;
      sorted[idx].order = sorted[idx - 1].order;
      sorted[idx - 1].order = tempOrder;
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const tempOrder = sorted[idx].order;
      sorted[idx].order = sorted[idx + 1].order;
      sorted[idx + 1].order = tempOrder;
    }

    setProjectsList([...sorted]);
    showNotification(`⬆️ Order del proyecto actualizado`);
  };

  const handleToggleFeaturedProject = (id) => {
    setProjectsList(projectsList.map(p => p.id === id ? { ...p, destacado: !p.destacado } : p));
    showNotification(`⭐ Estado destacado actualizado`);
  };

  const handleLogout = () => {
    setLogoutNotice(true);
    setTimeout(() => setLogoutNotice(false), 3000);
  };

  return (
    <div style={S.adminShell} className="kap-admin">
      <aside style={S.sidebar} className="kap-sidebar">
        <div style={S.sbBrand}><div style={S.sbLogo}>A</div><div><div style={S.sbName}>Grupo Aurora</div><div style={S.sbPlan}>Panel Inmobiliario</div></div></div>
        <nav style={S.sbNav} className="kap-sbnav">
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setTab(n.key)} className={`kap-sbitem ${tab === n.key ? 'kap-sbitem-active' : ''}`} style={{ ...S.sbItem, ...(tab === n.key ? S.sbItemOn : {}) }}><Icon name={n.icon} /><span>{n.label}</span></button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={S.sbUser}>
            <div style={S.sbAvatar}>AG</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.sbUserName} className="sbUserName">Admin General</div>
              <div style={S.sbUserRole} className="sbUserRole">Grupo Aurora Prop.</div>
            </div>
            <button onClick={handleLogout} title="Cerrar sesión" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
          {logoutNotice && <div style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '4px 8px', borderRadius: 4, textAlign: 'center' }}>Sesión activa en modo Demo</div>}
        </div>
      </aside>

      <div style={S.adminContent} className="kap-scroll">
        
        {toastMsg && (
          <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#0f172a', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.4)', borderRadius: 10, padding: '12px 18px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            {toastMsg}
          </div>
        )}

        {!(tab === "props" && (showAddProp || editingProp)) && (
          <div style={S.adminTopbar} className="kap-admin-topbar">
            <div><h2 style={S.adminH2}>{TITLES[tab]}</h2><div style={S.adminCrumb}>Grupo Aurora · {TITLES[tab]}</div></div>
            <div style={S.adminTools}>
              <div style={S.searchBoxWrap}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Buscar lead, propiedad, proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={S.realSearchInput}
                />
              </div>
              {tab === "props" ? (
                <button onClick={() => setShowAddProp(true)} style={S.addLeadBtn}>
                  + Nueva Propiedad
                </button>
              ) : (
                <button onClick={() => setShowAddLead(true)} style={S.addLeadBtn}>
                  + Nuevo Lead
                </button>
              )}
              <div style={S.bell} className="kap-bell">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.04 9.04 0 01-1.697 1.48C12.383 19.162 11.233 20 10 20c-1.233 0-2.383-.838-3.16-1.438a9.04 9.04 0 01-1.697-1.48m11.514-4.5V11c0-2.761-2.239-5-5-5s-5 2.239-5 5v1.582M18 9.75a6 6 0 00-6-6M6 9.75a6 6 0 016-6" />
                </svg>
                <span style={S.bellDot}>3</span>
              </div>
              <div style={S.datePill} className="datePill">Junio 2026</div>
            </div>
          </div>
        )}

        {tab === "dashboard" && <Dashboard leads={filteredLeads} onSelectLead={setSelectedLead} />}
        {tab === "pipeline" && (
          <Pipeline
            leads={filteredLeads}
            onSelectLead={setSelectedLead}
            onUpdateStatus={onUpdateStatus}
            dragOverCol={dragOverCol}
            setDragOverCol={setDragOverCol}
          />
        )}
        {tab === "agenda" && <CalendarAgenda />}
        {tab === "props" && (
          (showAddProp || editingProp) ? (
            <PropertyFormPage
              initialProperty={editingProp}
              onClose={() => {
                setShowAddProp(false);
                setEditingProp(null);
              }}
              onSaveProperty={handleSaveProp}
            />
          ) : (
            <PropsTable
              propList={propList}
              searchTerm={searchTerm}
              onOpenAdd={() => setShowAddProp(true)}
              onEditProp={(p) => setEditingProp(p)}
              onDeleteProp={handleDeleteProp}
              onChangeStatus={handleChangePropStatus}
              onBulkAction={handleBulkPropAction}
            />
          )
        )}
        {tab === "contactos" && <Contactos leads={filteredLeads} onSelectLead={setSelectedLead} />}
        {tab === "agente" && <ChatsHubView leads={leads} messages={messages} onSelectLead={setSelectedLead} />}
        {tab === "empresa" && <EmpresaView />}
        {tab === "config" && <ConfigView />}
      </div>

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStatus={(id, st) => {
            if (onUpdateStatus) onUpdateStatus(id, st);
            setSelectedLead((prev) => (prev ? { ...prev, estado: st } : null));
          }}
          messages={messages}
        />
      )}

      {showAddLead && (
        <AddLeadModal
          onClose={() => setShowAddLead(false)}
          onAddLead={onAddLead}
        />
      )}


      {(showAddProject || editingProject) && (
        <ProjectEditorModal
          initialProject={editingProject}
          onClose={() => {
            setShowAddProject(false);
            setEditingProject(null);
          }}
          onSaveProject={handleSaveProject}
          onPreviewProject={(proj) => setPreviewProject(proj)}
        />
      )}

      {previewProject && (
        <ProjectPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      )}

      {(showAddPost || editingPost) && (
        <PostEditorModal
          initialPost={editingPost}
          onClose={() => {
            setShowAddPost(false);
            setEditingPost(null);
          }}
          onSavePost={handleSavePost}
          onPreviewPost={(post) => setPreviewPost(post)}
        />
      )}

      {previewPost && (
        <PostPreviewModal
          post={previewPost}
          onClose={() => setPreviewPost(null)}
        />
      )}
    </div>
  );
}



function CalendarAgenda() {
  const [viewMode, setViewMode] = useState("calendar");

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const visitsByDay = {
    4: [{ lead: "Carla Méndez", prop: "AUR-1042", time: "11:00 hs", status: "confirmada" }],
    12: [{ lead: "Roberto Díaz", prop: "AUR-2087", time: "15:30 hs", status: "confirmada" }],
    18: [{ lead: "Mariana Albornoz", prop: "AUR-1108", time: "10:00 hs", status: "pendiente" }],
    22: [{ lead: "Matías Kurchan", prop: "AUR-7020", time: "17:00 hs", status: "confirmada" }],
    25: [{ lead: "Marcos Ibáñez", prop: "AUR-6001", time: "16:00 hs", status: "confirmada" }]
  };

  return (
    <div style={S.dashWrap}>
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={S.cardTitle}>Agenda de Visitas · Junio 2026</span>
            <span style={{ ...S.cardHint, marginLeft: 10 }}>5 citas agendadas</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setViewMode("calendar")}
              style={{
                ...S.drawerBtnSec,
                padding: '6px 12px',
                fontSize: '0.75rem',
                background: viewMode === "calendar" ? "rgba(56,189,248,0.15)" : "transparent",
                color: viewMode === "calendar" ? "#38bdf8" : "#94a3b8",
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Vista Calendario
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                ...S.drawerBtnSec,
                padding: '6px 12px',
                fontSize: '0.75rem',
                background: viewMode === "list" ? "rgba(56,189,248,0.15)" : "transparent",
                color: viewMode === "list" ? "#38bdf8" : "#94a3b8",
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Vista Lista
            </button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8, textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
              <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {daysInMonth.map((d) => {
                const visits = visitsByDay[d] || [];
                const isToday = d === 25;
                return (
                  <div key={d} style={{ background: isToday ? 'rgba(56,189,248,0.1)' : '#0d131f', border: isToday ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 8, minHeight: 70, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isToday ? '#38bdf8' : '#94a3b8' }}>{d}</span>
                    {visits.map((v, idx) => (
                      <div key={idx} style={{ marginTop: 4, background: v.status === "confirmada" ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', border: v.status === "confirmada" ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(245,158,11,0.4)', borderRadius: 4, padding: '2px 4px', fontSize: '0.65rem', color: '#f8fafc' }}>
                        <div style={{ fontWeight: 700 }}>{v.time} · {v.prop}</div>
                        <div style={{ color: '#cbd5e1' }}>{v.lead}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {VISITAS.map((v, i) => (
              <div key={i} style={S.visitRow}>
                <div style={S.visitWhen}><span style={S.visitDia}>{v.dia}</span><span style={S.visitHora}>{v.hora}</span></div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={S.visitLead}>{v.lead}</div><div style={S.visitProp}>{v.cod} · {v.zona} · {v.fecha}</div></div>
                <span style={{ ...S.visitState, ...(v.estado === "confirmada" ? S.visitOk : S.visitPend) }}>{v.estado}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatsHubView({ leads, messages, onSelectLead }) {
  const [activeChatId, setActiveChatId] = useState(leads[0]?.id || "L1");
  const [humanControl, setHumanControl] = useState(false);
  const activeLead = leads.find((l) => l.id === activeChatId) || leads[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: 16, height: 'calc(100vh - 140px)' }}>
      <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
          Conversaciones WhatsApp
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {leads.map((l) => (
            <div
              key={l.id}
              onClick={() => setActiveChatId(l.id)}
              style={{
                padding: 12,
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                background: l.id === activeChatId ? 'rgba(56,189,248,0.1)' : 'transparent',
                borderLeft: l.id === activeChatId ? '3px solid #38bdf8' : '3px solid transparent'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>{l.nombre}</span>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{l.t}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {l.contacto} · {l.zona}
              </div>
              <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                <span style={{ fontSize: '0.62rem', background: 'rgba(139,92,246,0.15)', color: '#c084fc', padding: '1px 6px', borderRadius: 4 }}>Sofía IA</span>
                {l.live && <span style={{ fontSize: '0.62rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '1px 6px', borderRadius: 4 }}>en vivo</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{activeLead?.nombre}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{activeLead?.contacto} · WhatsApp Business API</div>
          </div>
          <button
            onClick={() => setHumanControl(!humanControl)}
            style={{
              background: humanControl ? 'linear-gradient(135deg, #ea580c, #ef4444)' : 'linear-gradient(135deg, #0284c7, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {humanControl ? "Asesor Humano en Control" : "Tomar Control (Handoff)"}
          </button>
        </div>

        <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#070a12', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ alignSelf: 'flex-start', background: '#1f2c34', color: '#e9edef', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem', maxWidth: '75%' }}>
            Hola, quisiera saber si sigue disponible el departamento en {activeLead?.zona || "Palermo"}.
          </div>
          <div style={{ alignSelf: 'flex-end', background: '#075e54', color: '#e9edef', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem', maxWidth: '75%' }}>
            ¡Hola {activeLead?.nombre}! Sí, sigue totalmente disponible. Soy Sofía de Grupo Aurora. ¿Te gustaría coordinar una visita presencial?
          </div>
          {messages && messages.map((m, idx) => (
            <div key={idx} style={{ alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end', background: m.role === 'user' ? '#1f2c34' : '#075e54', color: '#e9edef', padding: '8px 12px', borderRadius: 10, fontSize: '0.8rem', maxWidth: '75%' }}>
              {m.text}
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
          <input type="text" placeholder={humanControl ? "Escribir como Asesor Humano..." : "Modo Sofía IA activo (Escribir para intervenir)..."} style={{ ...S.formInput, flex: 1 }} />
          <button style={{ ...S.drawerBtnWa, flex: 'none', padding: '8px 14px' }}>Enviar</button>
        </div>
      </div>

      <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
          Detalles del Lead
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Lead Score IA</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>94 / 100 · Alta Intención</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Intención & Zona</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{activeLead?.intencion} · {activeLead?.zona}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Presupuesto</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#10b981' }}>{activeLead?.presupuesto}</div>
        </div>
        <button onClick={() => onSelectLead(activeLead)} style={{ ...S.drawerBtnSec, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Ver Ficha 360° Completa
        </button>
      </div>
    </div>
  );
}

function AsesoresView() {
  const [equipo, setEquipo] = useState([
    { id: "A1", nombre: "Mariano Torres", rol: "Corredor Inmobiliario", mat: "CUCICBA 7412", email: "mtorres@grupoaurora.com.ar", tel: "+54 9 11 4455-6677", props: 12, leads: 18, ventas: "USD 1,4M", status: "online", activo: true, zona: "Palermo & Recoleta" },
    { id: "A2", nombre: "Eliana Acosta", rol: "Agente Comercial", mat: "CUCICBA 8102", email: "eacosta@grupoaurora.com.ar", tel: "+54 9 11 5566-7788", props: 8, leads: 14, ventas: "USD 920K", status: "en visita", activo: true, zona: "Belgrano & Nuñez" },
    { id: "A3", nombre: "Gonzalo Rivas", rol: "Corredor Inmobiliario", mat: "CMCPSI 6120", email: "grivas@grupoaurora.com.ar", tel: "+54 9 11 6677-8899", props: 15, leads: 22, ventas: "USD 1,8M", status: "online", activo: true, zona: "Nordelta & San Isidro" },
    { id: "A4", nombre: "Sofía (Agente IA)", rol: "Atención Virtual 24/7", mat: "Robot IA Meta API", email: "ia@grupoaurora.com.ar", tel: "WhatsApp Bot", props: 45, leads: 134, ventas: "11 Visitas", status: "online", activo: true, zona: "Global CABA & GBA" }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [toast, setToast] = useState('');

  const [newAgent, setNewAgent] = useState({
    nombre: '',
    rol: 'Agente Comercial',
    mat: 'CUCICBA 9900',
    email: '',
    tel: '',
    zona: 'Palermo'
  });

  const handleAddAgent = (e) => {
    e.preventDefault();
    if (!newAgent.nombre.trim()) return;
    const added = {
      id: `A_${Date.now()}`,
      nombre: newAgent.nombre,
      rol: newAgent.rol,
      mat: newAgent.mat,
      email: newAgent.email || `${newAgent.nombre.toLowerCase().replace(/\s+/g, '')}@grupoaurora.com.ar`,
      tel: newAgent.tel || '+54 9 11 0000-0000',
      props: 0,
      leads: 0,
      ventas: 'USD 0',
      status: 'online',
      activo: true,
      zona: newAgent.zona
    };
    setEquipo([...equipo, added]);
    setShowAddModal(false);
    setToast(`Asesor ${added.nombre} agregado con éxito`);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleAgentStatus = (id) => {
    setEquipo(equipo.map(a => a.id === id ? { ...a, activo: !a.activo } : a));
  };

  return (
    <div style={S.dashWrap}>
      {toast && <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem' }}>{toast}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Equipo Comercial & Permisos de Usuario</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Gestión de asesores, matrículas y niveles de acceso al sistema</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowRolesModal(true)} style={{ ...S.drawerBtnSec, padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Matriz de Permisos por Rol
          </button>
          <button onClick={() => setShowAddModal(true)} style={S.addLeadBtn}>
            + Nuevo Asesor
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {equipo.map((a) => (
          <div key={a.id} style={{ ...S.card, opacity: a.activo ? 1 : 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                  {a.nombre[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>{a.nombre}</div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>{a.rol}</div>
                </div>
              </div>
              <button
                onClick={() => toggleAgentStatus(a.id)}
                title={a.activo ? "Desactivar usuario" : "Activar usuario"}
                style={{
                  background: a.activo ? 'rgba(16,185,129,0.15)' : 'rgba(148,163,184,0.15)',
                  color: a.activo ? '#10b981' : '#94a3b8',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {a.activo ? '● Activo' : '○ Inactivo'}
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Matrícula: <strong style={{ color: '#cbd5e1' }}>{a.mat}</strong></div>
              <div>Email: <strong style={{ color: '#cbd5e1' }}>{a.email}</strong></div>
              <div>Zona asignada: <strong style={{ color: '#cbd5e1' }}>{a.zona}</strong></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, fontSize: '0.72rem', background: '#0d131f', padding: 8, borderRadius: 8, textAlign: 'center' }}>
              <div><div style={{ color: '#64748b' }}>Propiedades</div><strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{a.props}</strong></div>
              <div><div style={{ color: '#64748b' }}>Leads</div><strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{a.leads}</strong></div>
              <div><div style={{ color: '#64748b' }}>Ventas</div><strong style={{ color: '#10b981', fontSize: '0.85rem' }}>{a.ventas}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL AGREGAR ASESOR */}
      {showAddModal && (
        <div style={S.drawerBackdrop} onClick={() => setShowAddModal(false)}>
          <div style={{ ...S.drawerContent, width: 480, height: 'auto', borderRadius: 16, padding: 24, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>+ Agregar Nuevo Asesor Comercial</h3>
              <button style={S.drawerCloseBtn} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddAgent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={S.formLabel}>Nombre Completo</label><input type="text" required value={newAgent.nombre} onChange={(e) => setNewAgent({ ...newAgent, nombre: e.target.value })} style={S.formInput} placeholder="Ej. Camila Soler" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={S.formLabel}>Rol & Acceso</label>
                  <select value={newAgent.rol} onChange={(e) => setNewAgent({ ...newAgent, rol: e.target.value })} style={S.formInput}>
                    <option value="Administrador">Administrador General</option>
                    <option value="Corredor Inmobiliario">Corredor Inmobiliario</option>
                    <option value="Agente Comercial">Agente Comercial</option>
                    <option value="Asistente">Asistente Administrativo</option>
                  </select>
                </div>
                <div><label style={S.formLabel}>Matrícula Habilitante</label><input type="text" value={newAgent.mat} onChange={(e) => setNewAgent({ ...newAgent, mat: e.target.value })} style={S.formInput} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={S.formLabel}>Email Corporativo</label><input type="email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} style={S.formInput} placeholder="csoler@grupoaurora.com.ar" /></div>
                <div><label style={S.formLabel}>Teléfono / WhatsApp</label><input type="text" value={newAgent.tel} onChange={(e) => setNewAgent({ ...newAgent, tel: e.target.value })} style={S.formInput} placeholder="+54 9 11 5566-0000" /></div>
              </div>
              <div><label style={S.formLabel}>Zona Asignada</label><input type="text" value={newAgent.zona} onChange={(e) => setNewAgent({ ...newAgent, zona: e.target.value })} style={S.formInput} placeholder="Palermo, Caballito, etc." /></div>
              <button type="submit" style={{ ...S.drawerBtnWa, marginTop: 10 }}>Guardar Asesor</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MATRIZ ROLES */}
      {showRolesModal && (
        <div style={S.drawerBackdrop} onClick={() => setShowRolesModal(false)}>
          <div style={{ ...S.drawerContent, width: 620, height: 'auto', borderRadius: 16, padding: 24, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>Permisos y Matriz de Roles</h3>
              <button style={S.drawerCloseBtn} onClick={() => setShowRolesModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.8rem' }}>
              {[
                { r: 'Administrador General', d: 'Acceso irrestricto a CRM, Propiedades, Configuración de Empresa, Presupuestos y Usuarios.', p: 'Acceso Total', c: '#ef4444' },
                { r: 'Corredor Inmobiliario', d: 'Carga, edición y publicación de propiedades. Gestión de tasaciones y firmas de reserva.', p: 'Edición & Publicación', c: '#8b5cf6' },
                { r: 'Agente Comercial', d: 'Gestión de leads asignados, agendamiento de visitas y respuesta de consultas.', p: 'Comercial & Agenda', c: '#38bdf8' },
                { r: 'Asistente Administrativo', d: 'Lectura de propiedades y toma de datos de contacto.', p: 'Solo Lectura', c: '#94a3b8' }
              ].map((item, idx) => (
                <div key={idx} style={{ background: '#0d131f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{item.r}</strong>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', color: item.c, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{item.p}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmpresaView() {
  const [savedNotice, setSavedNotice] = useState(false);

  const [empresa, setEmpresa] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('inmo_empresa_config');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      logoPrincipal: "/logo.svg",
      logoOscuro: "/logo.svg",
      favicon: "/favicon.ico",
      nombreComercial: "Grupo Aurora Propiedades",
      razonSocial: "Grupo Aurora Propiedades S.A.",
      cuit: "30-71449982-4",
      telefono: "+54 11 4800-9000",
      whatsapp: "+54 9 11 3883-0925",
      email: "contacto@grupoaurora.com.ar",
      direccion: "Av. del Libertador 4800, Piso 12",
      barrio: "Palermo",
      ciudad: "CABA",
      provincia: "Buenos Aires",
      cp: "C1426BWW",
      horarios: "Lunes a Viernes de 09:00 a 19:00 hs · Sábados de 10:00 a 14:00 hs",
      sitioWeb: "https://kaptativa.com/inmo-demo",
      instagram: "@grupoaurora.propiedades",
      facebook: "/grupoauroraprop",
      linkedin: "/company/grupo-aurora-propiedades",
      youtube: "/@grupoauroraprop",
      descripcion: "Firma líder en consultoría inmobiliaria, desarrollos urbanos y comercialización de inmuebles de categoría en CABA y GBA.",
      datosLegales: "Sociedad Anónima inscripta en la IGJ bajo el N° 182390 del Libro de Sociedades por Acciones. Registro RPI N° 84920.",
      colorPrimary: "#EA384D",
      colorSecondary: "#8b5cf6",
      colorAccent: "#38bdf8",
      monedaDefault: "USD",
      datosContactoPublicos: { mostrarTelefono: true, mostrarWhatsapp: true, mostrarEmail: true, mostrarDireccion: true, mostrarHorarios: true },
      notificaciones: { emailLeads: true, whatsappVisitas: true, resumenDiario: true, alertasPortales: false }
    };
  });

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('inmo_empresa_config', JSON.stringify(empresa));
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div style={{ ...S.dashWrap, gap: 18 }}>
      {savedNotice && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '12px 16px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600 }}>
          Configuración institucional guardada correctamente.
        </div>
      )}

      {/* Header Card */}
      <div style={{ ...S.card, background: 'linear-gradient(135deg, rgba(234,56,77,0.12), rgba(139,92,246,0.12)), #0b0f19', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Lexend', sans-serif" }}>Configuración Institucional de la Empresa</div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>Administrá la marca, datos fiscales, ubicación y canales de contacto.</div>
        </div>
        <button onClick={handleSave} style={{ ...S.addLeadBtn, padding: '10px 18px', fontSize: '0.84rem' }}>
          Guardar Cambios
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        
        {/* SECTION 1: BRANDING */}
        <div style={S.card}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            Identidad Visual & Marca
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div>
              <label style={S.formLabel}>Logo Principal (URL o Path)</label>
              <input type="text" value={empresa.logoPrincipal} onChange={(e) => setEmpresa({ ...empresa, logoPrincipal: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Logo Fondo Oscuro (URL)</label>
              <input type="text" value={empresa.logoOscuro} onChange={(e) => setEmpresa({ ...empresa, logoOscuro: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Favicon (URL)</label>
              <input type="text" value={empresa.favicon} onChange={(e) => setEmpresa({ ...empresa, favicon: e.target.value })} style={S.formInput} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 14 }}>
            <div>
              <label style={S.formLabel}>Color Primario</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="color" value={empresa.colorPrimary} onChange={(e) => setEmpresa({ ...empresa, colorPrimary: e.target.value })} style={{ width: 40, height: 38, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
                <input type="text" value={empresa.colorPrimary} onChange={(e) => setEmpresa({ ...empresa, colorPrimary: e.target.value })} style={S.formInput} />
              </div>
            </div>
            <div>
              <label style={S.formLabel}>Color Secundario</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="color" value={empresa.colorSecondary} onChange={(e) => setEmpresa({ ...empresa, colorSecondary: e.target.value })} style={{ width: 40, height: 38, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
                <input type="text" value={empresa.colorSecondary} onChange={(e) => setEmpresa({ ...empresa, colorSecondary: e.target.value })} style={S.formInput} />
              </div>
            </div>
            <div>
              <label style={S.formLabel}>Color Acento</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="color" value={empresa.colorAccent} onChange={(e) => setEmpresa({ ...empresa, colorAccent: e.target.value })} style={{ width: 40, height: 38, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
                <input type="text" value={empresa.colorAccent} onChange={(e) => setEmpresa({ ...empresa, colorAccent: e.target.value })} style={S.formInput} />
              </div>
            </div>
            <div>
              <label style={S.formLabel}>Moneda Predeterminada</label>
              <select value={empresa.monedaDefault} onChange={(e) => setEmpresa({ ...empresa, monedaDefault: e.target.value })} style={S.formInput}>
                <option value="USD">Dólares Estadounidenses (USD)</option>
                <option value="ARS">Pesos Argentinos (ARS)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DATOS FISCALES & LEGALES */}
        <div style={S.card}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
            Datos Fiscales, Comerciales & Registros
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={S.formLabel}>Nombre Comercial</label>
              <input type="text" value={empresa.nombreComercial} onChange={(e) => setEmpresa({ ...empresa, nombreComercial: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Razón Social</label>
              <input type="text" value={empresa.razonSocial} onChange={(e) => setEmpresa({ ...empresa, razonSocial: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>CUIT</label>
              <input type="text" value={empresa.cuit} onChange={(e) => setEmpresa({ ...empresa, cuit: e.target.value })} style={S.formInput} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={S.formLabel}>Descripción Institucional / Quiénes Somos</label>
            <textarea rows={3} value={empresa.descripcion} onChange={(e) => setEmpresa({ ...empresa, descripcion: e.target.value })} style={{ ...S.formInput, resize: 'vertical' }} />
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={S.formLabel}>Datos Legales & Registro Público de Comercio</label>
            <textarea rows={2} value={empresa.datosLegales} onChange={(e) => setEmpresa({ ...empresa, datosLegales: e.target.value })} style={{ ...S.formInput, resize: 'vertical' }} />
          </div>
        </div>

        {/* SECTION 3: CANALES DE CONTACTO & UBICACION */}
        <div style={S.card}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
            Canales de Contacto & Ubicación Física
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={S.formLabel}>Teléfono Fijo Central</label>
              <input type="text" value={empresa.telefono} onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>WhatsApp de la Agencia</label>
              <input type="text" value={empresa.whatsapp} onChange={(e) => setEmpresa({ ...empresa, whatsapp: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Correo Electrónico Corporativo</label>
              <input type="email" value={empresa.email} onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })} style={S.formInput} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
            <div>
              <label style={S.formLabel}>Dirección (Calle y Número)</label>
              <input type="text" value={empresa.direccion} onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Barrio</label>
              <input type="text" value={empresa.barrio} onChange={(e) => setEmpresa({ ...empresa, barrio: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Ciudad</label>
              <input type="text" value={empresa.ciudad} onChange={(e) => setEmpresa({ ...empresa, ciudad: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Provincia & CP</label>
              <input type="text" value={empresa.provincia} onChange={(e) => setEmpresa({ ...empresa, provincia: e.target.value })} style={S.formInput} />
            </div>
          </div>
        </div>

        {/* SECTION 4: HORARIOS DE ATENCION & REDES SOCIALES */}
        <div style={S.card}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
            Horarios de Atención, Sitio Web & Redes Sociales
          </div>
          <div>
            <label style={S.formLabel}>Horarios de Atención Comercial</label>
            <input type="text" value={empresa.horarios} onChange={(e) => setEmpresa({ ...empresa, horarios: e.target.value })} style={S.formInput} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <label style={S.formLabel}>Sitio Web Oficial</label>
              <input type="url" value={empresa.sitioWeb} onChange={(e) => setEmpresa({ ...empresa, sitioWeb: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>Instagram</label>
              <input type="text" value={empresa.instagram} onChange={(e) => setEmpresa({ ...empresa, instagram: e.target.value })} style={S.formInput} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <label style={S.formLabel}>Facebook</label>
              <input type="text" value={empresa.facebook} onChange={(e) => setEmpresa({ ...empresa, facebook: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>LinkedIn</label>
              <input type="text" value={empresa.linkedin} onChange={(e) => setEmpresa({ ...empresa, linkedin: e.target.value })} style={S.formInput} />
            </div>
            <div>
              <label style={S.formLabel}>YouTube</label>
              <input type="text" value={empresa.youtube} onChange={(e) => setEmpresa({ ...empresa, youtube: e.target.value })} style={S.formInput} />
            </div>
          </div>
        </div>

        {/* SECTION 5: NOTIFICACIONES & ALERTAS */}
        <div style={S.card}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
            Notificaciones & Alertas del Sistema
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'emailLeads', label: 'Notificar por email ante nuevos leads ingresados' },
              { key: 'whatsappVisitas', label: 'Enviar recordatorio por WhatsApp 2hs antes de cada visita' },
              { key: 'resumenDiario', label: 'Enviar reporte analítico diario al director general' },
              { key: 'alertasPortales', label: 'Notificar errores de sincronización con portales' }
            ].map((item) => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#ececf2', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!empresa.notificaciones[item.key]}
                  onChange={(e) => setEmpresa({
                    ...empresa,
                    notificaciones: { ...empresa.notificaciones, [item.key]: e.target.checked }
                  })}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" style={{ ...S.addLeadBtn, padding: '12px 24px', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
          Guardar Configuración Institucional
        </button>
      </form>
    </div>
  );
}

function ConfigView() {
  return (
    <div style={S.dashWrap}>
      <div style={S.card}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>Integraciones API & Portales Inmobiliarios</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d131f', padding: 12, borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Meta WhatsApp Business API</div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Número +54 9 11 3883-0925 · Evolution API Client Engine</div>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>● Conectado</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d131f', padding: 12, borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Zonaprop API Multi-posting</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Sync automático de fichas, imágenes y consultas recibidas</div>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>● Activo</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d131f', padding: 12, borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Argenprop & MercadoLibre Inmuebles</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Publicación automatizada con actualización de precios en vivo</div>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>● Conectado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropsTable({ propList, searchTerm, onOpenAdd, onEditProp, onDeleteProp, onChangeStatus, onBulkAction }) {
  const list = propList || CATALOGO;
  
  const [statusFilter, setStatusFilter] = useState('todos');
  const [opFilter, setOpFilter] = useState('todos');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('recientes');
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredProps = list.filter((p) => {
    // Status filter
    if (statusFilter !== 'todos' && (p.estadoProp || 'disponible') !== statusFilter) return false;
    // Op filter
    if (opFilter !== 'todos' && p.operacion !== opFilter) return false;
    // Tipo filter
    if (tipoFilter !== 'todos' && p.tipo !== tipoFilter) return false;
    // Search term
    if (!searchTerm?.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.tipo?.toLowerCase().includes(q) ||
      p.zona?.toLowerCase().includes(q) ||
      p.cod?.toLowerCase().includes(q) ||
      p.precio?.toLowerCase().includes(q) ||
      p.operacion?.toLowerCase().includes(q) ||
      p.titulo?.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    if (sortBy === 'consultas') return (b.consultas || 0) - (a.consultas || 0);
    return 0;
  });

  const allSelected = filteredProps.length > 0 && selectedIds.length === filteredProps.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProps.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkState = (newStatus) => {
    if (onBulkAction) {
      onBulkAction(selectedIds, newStatus);
      setSelectedIds([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      
      {/* Top Action Bar & Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#0b0f19', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Mostrando <strong style={{ color: '#f8fafc' }}>{filteredProps.length}</strong> de {list.length} propiedades en catálogo
          </div>
        </div>

        {/* Filter Selects */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          <div>
            <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: 2 }}>Estado Comercial</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={S.formInput}>
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="reservada">Reservada</option>
              <option value="vendida">Vendida</option>
              <option value="alquilada">Alquilada</option>
              <option value="pausada">Pausada</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: 2 }}>Operación</label>
            <select value={opFilter} onChange={(e) => setOpFilter(e.target.value)} style={S.formInput}>
              <option value="todos">Todas las op.</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="temporario">Temporario</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: 2 }}>Tipo de Inmueble</label>
            <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} style={S.formInput}>
              <option value="todos">Todos los tipos</option>
              <option value="depto">Departamento</option>
              <option value="casa">Casa</option>
              <option value="PH">PH</option>
              <option value="lote">Lote</option>
              <option value="local">Local</option>
              <option value="oficina">Oficina</option>
              <option value="deposito">Depósito</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: 2 }}>Ordenar por</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={S.formInput}>
              <option value="recientes">Más recientes</option>
              <option value="consultas">Más consultados</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem' }}>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>⚡ Acciones masivas ({selectedIds.length} seleccionadas):</span>
            <button onClick={() => handleBulkState('disponible')} style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>🟢 Marcar Disponibles</button>
            <button onClick={() => handleBulkState('reservada')} style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>🟠 Marcar Reservadas</button>
            <button onClick={() => handleBulkState('pausada')} style={{ background: 'rgba(148,163,184,0.2)', color: '#94a3b8', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>⚪ Pausar</button>
            <button onClick={() => handleBulkState('delete')} style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>🗑️ Eliminar</button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div style={S.tableWrap} className="kap-admin-table-wrap">
        <div style={{ ...S.tHead, display: 'grid', gridTemplateColumns: '40px 1fr 110px 130px 110px 80px 100px', gap: 10, alignItems: 'center' }}>
          <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} title="Seleccionar todas" />
          <span>Propiedad</span>
          <span>Operación</span>
          <span>Estado Comercial</span>
          <span style={{ textAlign: 'right' }}>Precio</span>
          <span style={{ textAlign: 'center' }}>Consultas</span>
          <span style={{ textAlign: 'center' }}>Acciones</span>
        </div>

        {filteredProps.map((p) => {
          const stInfo = PROP_STATUSES[p.estadoProp || 'disponible'] || PROP_STATUSES.disponible;
          const isSelected = selectedIds.includes(p.id);

          return (
            <div key={p.id} style={{ ...S.row, display: 'grid', gridTemplateColumns: '40px 1fr 110px 130px 110px 80px 100px', gap: 10, alignItems: 'center', background: isSelected ? 'rgba(56,189,248,0.06)' : 'transparent' }} className="kap-admin-row">
              <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(p.id)} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={S.thumb}><Photo p={p} height="44px" iconSize={16} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={S.rowTitle} className="kap-admin-row-title">{p.titulo || `${p.tipo} en ${p.zona}`}</div>
                  <div style={S.rowSub} className="kap-admin-row-sub">{p.cod} · {featLine(p)} · {p.zona}</div>
                </div>
              </div>

              <span><span className={`rowOp ${p.operacion === 'venta' ? 'kap-admin-row-op-venta' : 'kap-admin-row-op-alquiler'}`} style={S.rowOp}>{p.operacion}</span></span>
              
              <span>
                <select
                  value={p.estadoProp || 'disponible'}
                  onChange={(e) => onChangeStatus && onChangeStatus(p.id, e.target.value)}
                  style={{
                    background: stInfo.bg,
                    color: stInfo.color,
                    border: `1px solid ${stInfo.border}`,
                    borderRadius: 6,
                    padding: '4px 6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservada">Reservada</option>
                  <option value="vendida">Vendida</option>
                  <option value="alquilada">Alquilada</option>
                  <option value="pausada">Pausada</option>
                  <option value="borrador">Borrador</option>
                </select>
              </span>

              <span style={{ textAlign: 'right' }}><span style={S.rowPrice} className="kap-admin-row-price">{p.precio}<span style={S.rowPriceNota}>{p.precioNota}</span></span></span>
              
              <span style={{ textAlign: 'center' }}><span style={S.consultaPill}>{p.consultas || 0}</span></span>

              <span style={{ textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button onClick={() => onEditProp && onEditProp(p)} title="Editar propiedad" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => onDeleteProp && onDeleteProp(p.id)} title="Eliminar propiedad" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </span>
            </div>
          );
        })}

        {filteredProps.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
            No se encontraron propiedades que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}


function Contactos({ leads, onSelectLead }) {
  return (
    <div style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Table Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr', padding: '12px 20px', background: '#070a12', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <div>Contacto</div>
        <div>Intención</div>
        <div>Zona asignada</div>
        <div style={{ textAlign: 'right' }}>Estado</div>
      </div>

      {/* Table Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {leads.map((l) => (
          <div
            key={l.id}
            onClick={() => onSelectLead(l)}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.2fr 1.5fr 1fr',
              alignItems: 'center',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            className="kap-admin-row"
          >
            {/* Contacto Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                {(l.nombre[0] || "?").toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {l.nombre}
                  {l.live && <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>● en vivo</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {l.contacto} · {l.origen}
                </div>
              </div>
            </div>

            {/* Intención */}
            <div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(56,189,248,0.12)', color: '#38bdf8', padding: '4px 10px', borderRadius: 6, fontWeight: 600, textTransform: 'capitalize' }}>
                {l.intencion}
              </span>
            </div>

            {/* Zona */}
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              {l.zona}
            </div>

            {/* Estado */}
            <div style={{ textAlign: 'right' }}>
              <span style={{ ...S.stBadge, ...stColor(l.estado) }}>
                {COLS.find((c) => c.key === l.estado)?.label || l.estado}
              </span>
            </div>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          No se encontraron contactos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}

function AgentePanel() {
  const maxF = AGENTE_FUNNEL[0].v;
  return (
    <div style={S.dashWrap}>
      <div style={S.aHero} className="kap-agent-hero">
        <div style={S.aHeroGlow} />
        <div style={S.aHeroTop}>
          <div style={S.agentHeroL}><div style={S.avatarLg}>S</div><div><div style={S.agentHeroName} className="agentHeroName">Sofía · Agente de ventas IA</div><div style={S.agentHeroSub} className="agentHeroSub">WhatsApp · Evolution API · cerebro Claude</div></div></div>
          <div style={S.aSwitchWrap}><span style={S.aSwitchLbl}>Activo</span><div style={S.aSwitch}><div style={S.aSwitchKnob} /></div></div>
        </div>
        <div style={S.aHeroTagline}>Sostiene conversaciones, califica y agenda visitas <strong>las 24 horas</strong>, también cuando tu equipo está offline.</div>
        <div style={S.aHeroChips}>
          {INTEGRACIONES.map((it) => <span key={it.n} style={S.intChip}><i style={{ ...S.intDot, background: it.ok ? "#16a34a" : "#9aa7b5" }} />{it.n} · {it.s}</span>)}
        </div>
      </div>

      <div style={S.kpiRow}>{AGENTE_STATS.map((s) => <div key={s.label} style={S.kpiCard}><div style={S.kpiLabel}>{s.label}</div><div style={S.kpiValue}>{s.value}</div><div style={S.kpiSub}>{s.sub}</div></div>)}</div>

      <div style={S.dashGrid2}>
        <div style={S.card}>
          <div style={S.cardHead}><span style={S.cardTitle}>Actividad por hora</span><span style={S.cardHint}>fuera de horario en coral</span></div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HORAS} margin={{ top: 8, right: 6, left: -26, bottom: 0 }} barCategoryGap={2}>
                <XAxis dataKey="h" tick={{ fontSize: 9, fill: "#9aa7b5" }} axisLine={false} tickLine={false} interval={2} tickFormatter={(h) => `${h}h`} />
                <YAxis tick={{ fontSize: 10, fill: "#9aa7b5" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip cursor={{ fill: "rgba(14,165,233,.08)" }} contentStyle={{ background: "#f1f5f9", border: "1px solid #dde4ec", borderRadius: 8, fontSize: 12 }} itemStyle={{ color: "#16202e" }} labelFormatter={(h) => `${h}:00 hs`} formatter={(v) => [v, "conversaciones"]} />
                <Bar dataKey="v" radius={[3, 3, 0, 0]}>{HORAS.map((e) => <Cell key={e.h} fill={e.after ? "#ea580c" : "#EA384D"} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={S.aHourNote}>61% de las conversaciones ocurren fuera del horario laboral.</div>
        </div>

        <div style={S.card}>
          <div style={S.cardHead}><span style={S.cardTitle}>Embudo del agente</span><span style={S.cardHint}>este mes</span></div>
          <div style={S.funnel}>
            {AGENTE_FUNNEL.map((f) => {
              const pct = Math.round((f.v / maxF) * 100);
              return <div key={f.label} style={S.aFunRow}><span style={S.aFunLabel}>{f.label}</span><div style={S.funBarBg}><div style={{ ...S.funBarFill, width: `${pct}%` }} /></div><span style={S.funV}>{f.v}</span></div>;
            })}
          </div>
          <div style={S.aFunFoot}><span>Conversión atendidas → visita</span><strong>8,2%</strong></div>
        </div>
      </div>

      <div style={S.dashGrid2}>
        <div style={S.card}>
          <div style={S.cardHead}><span style={S.cardTitle}>Conversaciones recientes</span><span style={S.cardHint}>en vivo</span></div>
          {CONVOS.map((c, i) => (
            <div key={i} style={S.convoRow}>
              <div style={{ ...S.rowDot, background: grad, width: 34, height: 34, fontSize: 13 }}>{c.nombre[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div style={S.convoName}>{c.nombre}</div><div style={S.convoSnippet}>{c.snippet}</div></div>
              <div style={S.convoMeta}><span style={{ ...S.stBadge, ...stColor(c.estado) }}>{COLS.find((x) => x.key === c.estado)?.label}</span><span style={S.convoT}>{c.t}</span></div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.cardHead}><span style={S.cardTitle}>Vista previa de una conversación</span><span style={S.aQualityTag}>★ calidad</span></div>
          <div style={S.previewBody}>
            {SAMPLE.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start" }}><div style={m.me ? S.pvUser : S.pvAgent}>{m.t}</div></div>)}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHead}><span style={S.cardTitle}>Herramientas conectadas</span><span style={S.cardHint}>{TOOL_CARDS.length} activas</span></div>
        <div style={S.toolGrid}>
          {TOOL_CARDS.map((t) => (
            <div key={t.name} style={S.toolCard}>
              <div style={S.toolName}>{t.name}</div>
              <div style={S.toolDesc}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AgentView Component ──────────────────────────────────────────────────────
function AgentView({
  messages,
  input,
  setInput,
  send,
  loading,
  lead,
  calif,
  estado,
  sugeridas,
  quickReplies,
  visita,
  handoff,
  scrollRef,
  onDetail
}) {
  return (
    <div style={S.agentShell}>
      {/* WhatsApp Chat Simulator */}
      <div style={S.phoneContainer} className="kap-phone-container">
        <div style={S.phoneHeader} className="kap-phone-header">
          <div style={S.phoneStatus}>
            <div style={S.phoneBack}>←</div>
            <div style={S.phoneAvatar}>S</div>
            <div>
              <div style={S.phoneName}>Sofía (IA)</div>
              <div style={S.phoneOnline}>● En línea</div>
            </div>
          </div>
        </div>
        <div ref={scrollRef} style={S.phoneMessages} className="kap-scroll kap-phone-messages">
          {messages.map((m, idx) => {
            if (m.role === 'cards') {
              return (
                <div key={idx} style={S.cardsContainer} className="kap-scroll">
                  {m.ids.map((id) => {
                    const p = CATALOGO.find((prop) => prop.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} style={S.chatCard} className="chatCard" onClick={() => onDetail(p)}>
                        <div style={S.chatCardImg}><img src={imgUrl(p.photo)} loading="lazy" decoding="async" style={{width:'100%', height:'100%', objectFit:'cover'}} /></div>
                        <div style={S.chatCardBody}>
                          <div style={S.chatCardPrice}>{p.precio}</div>
                          <div style={S.chatCardTitle} className="chatCardTitle">{p.tipo} · {p.zona}</div>
                          <button style={S.chatCardBtn}>Ver ficha</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (m.role === 'system') {
              return (
                <div key={idx} style={S.msgSystem}>
                  <span style={S.msgSystemText}>{m.text}</span>
                </div>
              );
            }
            const isUser = m.role === 'user';
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                <div style={isUser ? S.msgUser : S.msgAgent} className={isUser ? 'kap-msg-user' : 'kap-msg-agent'}>
                  <div>{m.text}</div>
                  <div style={S.msgTime} className="kap-msg-time">{m.hora}</div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
              <div style={S.msgAgent} className="kap-msg-agent">
                <div style={S.typingDots}>
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={S.phoneFooter} className="kap-phone-input-bar">
          {quickReplies.length > 0 && (
            <div style={S.qrContainer} className="kap-phone-quickreplies">
              {quickReplies.map((r, i) => (
                <button key={i} style={S.qrChip} onClick={() => send(r)}>{r}</button>
              ))}
            </div>
          )}
          <div style={S.phoneInputRow}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Escribe un mensaje..."
              style={S.phoneInput}
              className="kap-phone-input"
            />
            <button onClick={() => send()} style={S.phoneSendBtn}>Enviar</button>
          </div>
        </div>
      </div>

      {/* CRM Agent Monitor */}
      <div style={S.crmMonitor} className="kap-admin-card">
        <div style={S.crmMonitorHeader}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>CRM Lead Copilot</h3>
          <span style={S.crmLiveBadge}>● En tiempo real</span>
        </div>
        
        <div style={S.crmScoreSection} className="kap-crm-score">
          <div style={S.crmScoreCircle}>
            <div style={S.crmScoreText}>
              <div style={S.crmScoreVal}>{calif}%</div>
              <div style={S.crmScoreLabel}>Calificación</div>
            </div>
          </div>
          <div style={S.crmStateIndicator}>
            <div style={S.crmStateLabel}>Estado actual</div>
            <div style={{ ...S.crmStateVal, ...stColor(estado) }}>
              {COLS.find(c => c.key === estado)?.label || estado}
            </div>
          </div>
        </div>

        <div style={S.crmLeadFields}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Perfil del Lead</h4>
          <div style={S.crmFieldGrid}>
            <div style={S.crmField}>
              <label style={S.crmFieldLabel}>Nombre</label>
              <div style={S.crmFieldVal}>{lead.nombre || '—'}</div>
            </div>
            <div style={S.crmField}>
              <label style={S.crmFieldLabel}>Contacto</label>
              <div style={S.crmFieldVal}>{lead.contacto || '—'}</div>
            </div>
            <div style={S.crmField}>
              <label style={S.crmFieldLabel}>Intención</label>
              <div style={S.crmFieldVal}>{lead.intencion || '—'}</div>
            </div>
            <div style={S.crmField}>
              <label style={S.crmFieldLabel}>Presupuesto</label>
              <div style={S.crmFieldVal}>{lead.presupuesto || '—'}</div>
            </div>
            <div style={S.crmField}>
              <label style={S.crmFieldLabel}>Zona de interés</label>
              <div style={S.crmFieldVal}>{lead.zona || '—'}</div>
            </div>
            <div style={S.crmField}>
              <label style={S.crmFieldLabel}>Plazo</label>
              <div style={S.crmFieldVal}>{lead.plazo || '—'}</div>
            </div>
          </div>
        </div>

        {visita && (
          <div style={S.crmVisitCard}>
            <div style={S.crmVisitTitle}>📅 Visita Coordinada</div>
            <div style={S.crmVisitTime}>
              {visita.fecha} a las {visita.hora}
            </div>
          </div>
        )}

        {handoff && (
          <div style={S.crmHandoffNotification}>
            ⚡ Traspaso a asesor humano listo
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const photoGrad = (tipo) => {
  const grads = {
    depto: "linear-gradient(135deg, #1e293b, #334155)",
    casa: "linear-gradient(135deg, #0f172a, #1e293b)",
    PH: "linear-gradient(135deg, #111827, #1f2937)",
    local: "linear-gradient(135deg, #020617, #0f172a)",
    lote: "linear-gradient(135deg, #090d16, #111827)"
  };
  return grads[tipo] || "linear-gradient(135deg, #1e293b, #334155)";
};

const iconFor = (tipo) => {
  const icons = {
    depto: "🏢",
    casa: "🏠",
    PH: "📐",
    local: "🏪",
    lote: "🌳"
  };
  return icons[tipo] || "🏠";
};

// ── Styles & CSS ─────────────────────────────────────────────────────────────
const css = `
  .kap-navbtn {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .kap-navbtn:hover {
    color: #0f172a !important;
    background: #f1f5f9 !important;
  }
  .kap-cta {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .kap-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(6, 182, 212, 0.25);
  }
  .kap-tile {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .kap-tile:hover {
    transform: translateY(-6px);
    border-color: rgba(14, 165, 233, 0.3) !important;
    box-shadow: 0 12px 30px rgba(14, 165, 233, 0.1) !important;
  }
  .kap-zoomimg:hover {
    transform: scale(1.04);
  }
  .kap-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .kap-scroll::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
  }
  .kap-scroll::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .kap-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.24);
  }
  .kap-pulse {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    animation: kap-pulse-anim 1.6s infinite;
    margin-right: 6px;
  }
  .kap-closebtn:hover {
    background: rgba(239, 68, 68, 0.1) !important;
    color: #ef4444 !important;
    border-color: rgba(239, 68, 68, 0.2) !important;
  }
  .kap-sel, .kap-input {
    transition: all 0.2s ease;
  }
  .kap-sel:focus, .kap-input:focus {
    border-color: #EA384D !important;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15) !important;
    background: #ffffff !important;
  }
  @keyframes kap-pulse-anim {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }

  /* ── REGLES LIGHT MODE GENERIQUE (REVIEWS DE AUDITORIA) ── */
  .kap-modal-container {
    background: #0b0f19 !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
  }
  .kap-topbar {
    background: #ffffff !important;
    border-bottom: 1px solid #e2e8f0 !important;
    color: #0f172a !important;
  }
  .kap-tooltip-wrap .kap-tooltip-popup {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);
    transition: all 0.2s ease;
  }
  .kap-tooltip-wrap:hover .kap-tooltip-popup {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .kap-topbar .brandName {
    color: #0f172a !important;
  }
  .kap-topbar .brandTag {
    color: #64748b !important;
  }
  .kap-navbtn {
    color: #475569 !important;
    background: transparent !important;
    border: 1px solid transparent !important;
  }
  .kap-navbtn:hover {
    color: #0f172a !important;
    background: #f1f5f9 !important;
  }
  .kap-navbtn-active {
    background: #e0f2fe !important;
    color: #0284c7 !important;
    border-color: #7dd3fc !important;
  }
  .kap-main {
    background: #f8fafc !important;
  }

  /* WEB VIEW */
  .kap-weblink {
    color: #475569 !important;
  }
  .kap-weblink:hover {
    color: #0284c7 !important;
  }
  .kap-search-panel {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(226, 232, 240, 0.8) !important;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05) !important;
  }
  .kap-search-panel label {
    color: #475569 !important;
  }
  .kap-search-panel select, .kap-search-panel input {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(203, 213, 225, 0.8) !important;
    color: #0f172a !important;
  }
  .kap-stats-band {
    background: #ffffff !important;
    border-top: 1px solid #e2e8f0 !important;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .kap-stats-band .statN {
    color: #0f172a !important;
  }
  .kap-stats-band .statL {
    color: #64748b !important;
  }
  .kap-sec-title {
    color: #0f172a !important;
  }
  .kap-svc {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-svc div {
    color: #0f172a !important;
  }
  .kap-svc .svcDesc {
    color: #475569 !important;
  }
  .kap-filter {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    color: #475569 !important;
  }
  .kap-filter:hover {
    border-color: #cbd5e1 !important;
    color: #0f172a !important;
  }
  .kap-filter-active {
    background: #0284c7 !important;
    color: #ffffff !important;
    border-color: #0284c7 !important;
  }
  .kap-tile {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-tile .propPrice {
    color: #0284c7 !important;
  }
  .kap-tile .propPriceNota {
    color: #64748b !important;
  }
  .kap-tile .propZonaW {
    color: #0f172a !important;
  }
  .kap-tile .propFeatsRow span {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #475569 !important;
  }
  .kap-tile .verBtn {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #475569 !important;
  }
  .kap-tile .verBtn:hover {
    background: #f1f5f9 !important;
    color: #0f172a !important;
  }
  .kap-proc-step .procTitle {
    color: #0f172a !important;
  }
  .kap-proc-step .procDesc {
    color: #475569 !important;
  }
  .kap-test-card {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-test-card .testQuote {
    color: #334155 !important;
  }
  .kap-test-card .testName {
    color: #0f172a !important;
  }
  .kap-test-card .testAv {
    background: #f1f5f9 !important;
    color: #475569 !important;
  }
  .kap-cta-band {
    background: radial-gradient(circle at top left, rgba(14,165,233,0.06), transparent), #ffffff !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-cta-band .ctaTitle {
    color: #0f172a !important;
  }
  .kap-cta-band .ctaSub {
    color: #475569 !important;
  }
  .kap-cta-band .ctaBandBtn {
    background: #0284c7 !important;
    color: #ffffff !important;
  }
  .kap-footer {
    background: #ffffff !important;
    border-top: 1px solid #e2e8f0 !important;
  }
  .kap-footer .footH {
    color: #0f172a !important;
  }
  .kap-footer .footSub {
    color: #475569 !important;
  }
  .kap-footer .footL {
    color: #64748b !important;
  }
  .kap-footer .footL:hover {
    color: #0284c7 !important;
  }
  .kap-footer-bottom {
    background: #f8fafc !important;
    border-top: 1px solid #e2e8f0 !important;
    color: #64748b !important;
  }

  /* DETAIL MODAL */
  .kap-modal-overlay {
    background: rgba(15, 23, 42, 0.4) !important;
    backdrop-filter: blur(8px) !important;
  }
  .kap-modal-body {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) !important;
  }
  .kap-modal-body .modalPrice {
    color: #0284c7 !important;
  }
  .kap-modal-body .propTipoTag {
    background: #f1f5f9 !important;
    color: #475569 !important;
  }
  .kap-modal-body .modalZona {
    color: #0f172a !important;
  }
  .kap-modal-body .featBox {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-modal-body .featN {
    color: #0f172a !important;
  }
  .kap-modal-body .featL {
    color: #64748b !important;
  }
  .kap-modal-body .modalSectionTitle {
    color: #475569 !important;
  }
  .kap-modal-body .amenityBadge {
    background: #f0f9ff !important;
    border: 1px solid #bae6fd !important;
    color: #0369a1 !important;
  }
  .kap-modal-body .modalDesc {
    color: #475569 !important;
  }
  .kap-modal-body .modalMapHeader {
    color: #475569 !important;
  }
  .kap-modal-body .modalMapCanvas {
    background: radial-gradient(circle at 50% 50%, rgba(14,165,233,0.08), transparent), #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-modal-body .modalMapLabel {
    background: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-modal-body .modalMetaRow {
    color: #64748b !important;
  }
  .kap-modal-body .ctaGhost {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #475569 !important;
  }
  .kap-modal-body .ctaGhost:hover {
    background: #f1f5f9 !important;
    color: #0f172a !important;
  }
  .kap-modal-body .modalX {
    background: #f1f5f9 !important;
    color: #475569 !important;
  }
  .kap-modal-body .modalX:hover {
    background: #fee2e2 !important;
    color: #ef4444 !important;
  }

  /* ADMIN GENERAL (DARK THEME PREMIUM) */
  .kap-admin {
    background: #070a12 !important;
    color: #f8fafc !important;
  }
  .kap-sidebar {
    background: #0b0f19 !important;
    border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
  }
  .kap-sidebar .sbName {
    color: #f8fafc !important;
  }
  .kap-sidebar .sbPlan {
    color: #64748b !important;
  }
  .kap-sidebar .sbUserName {
    color: #f8fafc !important;
  }
  .kap-sidebar .sbUserRole {
    color: #64748b !important;
  }
  .kap-sbitem {
    color: #94a3b8 !important;
    background: transparent !important;
  }
  .kap-sbitem:hover {
    color: #f8fafc !important;
    background: rgba(255, 255, 255, 0.04) !important;
  }
  .kap-sbitem-active {
    background: rgba(56, 189, 248, 0.12) !important;
    color: #38bdf8 !important;
    border-left: 3px solid #38bdf8 !important;
  }
  .kap-admin-topbar {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
    color: #f8fafc !important;
  }
  .kap-admin-topbar h2 {
    color: #f8fafc !important;
  }
  .kap-admin-topbar .fakeSearch {
    background: #131926 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    color: #94a3b8 !important;
  }
  .kap-admin-topbar .bell {
    background: #131926 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  .kap-admin-topbar .datePill {
    background: #131926 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    color: #94a3b8 !important;
  }
  .kap-kpi-card {
    background: #0b0f19 !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    color: #f8fafc !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  }
  .kap-kpi-card .kpiLabel {
    color: #64748b !important;
  }
  .kap-kpi-card .kpiValue {
    color: #f8fafc !important;
  }
  .kap-kpi-card .kpiSub {
    color: #64748b !important;
  }
  .kap-admin-card {
    background: #0b0f19 !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    color: #f8fafc !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  }
  .kap-admin-card .cardTitle {
    color: #f8fafc !important;
  }
  .kap-admin-card .cardHint {
    color: #64748b !important;
  }
  .kap-admin-card .funLabel {
    color: #94a3b8 !important;
  }
  .kap-admin-card .funV {
    color: #f8fafc !important;
  }
  .kap-admin-card .funConv {
    color: #38bdf8 !important;
  }
  .kap-admin-card .legName {
    color: #94a3b8 !important;
  }
  .kap-admin-card .legPct {
    color: #f8fafc !important;
  }
  .kap-admin-card .agentStatV {
    color: #f8fafc !important;
  }
  .kap-admin-card .agentStatL {
    color: #94a3b8 !important;
  }
  .kap-admin-card .agentStatS {
    color: #64748b !important;
  }
  .kap-admin-card .topName {
    color: #cbd5e1 !important;
  }
  .kap-admin-card .topC {
    color: #f8fafc !important;
  }
  .kap-admin th {
    background: #0d131f !important;
    color: #94a3b8 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
  }
  .kap-admin td {
    color: #f8fafc !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  }
  .kap-admin-table-wrap {
    background: #0b0f19 !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 12px !important;
  }
  .kap-admin-row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
    color: #f8fafc !important;
  }
  .kap-admin-row:hover {
    background: rgba(255, 255, 255, 0.03) !important;
  }
  .kap-admin-row-title {
    color: #f8fafc !important;
  }
  .kap-admin-row-sub {
    color: #64748b !important;
  }
  .kap-admin-row-price {
    color: #38bdf8 !important;
  }
  .kap-admin-row-op-venta {
    background: rgba(139, 92, 246, 0.15) !important;
    color: #c084fc !important;
    border: 1px solid rgba(139, 92, 246, 0.3) !important;
  }
  .kap-admin-row-op-alquiler {
    background: rgba(56, 189, 248, 0.15) !important;
    color: #38bdf8 !important;
    border: 1px solid rgba(56, 189, 248, 0.3) !important;
  }

  /* KANBAN PIPELINE (DARK THEME) */
  .kap-kanban-col {
    background: #0d131f !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 12px !important;
  }
  .kap-kanban-col .kColHead {
    color: #f8fafc !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
  }
  .kap-kanban-col .kCount {
    background: rgba(255, 255, 255, 0.06) !important;
    color: #38bdf8 !important;
  }
  .kap-kanban-card {
    background: #131a29 !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    color: #f8fafc !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  }
  .kap-kanban-card:hover {
    border-color: rgba(56, 189, 248, 0.4) !important;
    transform: translateY(-2px);
  }
  .kap-kanban-card .kName {
    color: #f8fafc !important;
  }
  .kap-kanban-card .kMeta {
    color: #94a3b8 !important;
  }
  .kap-kanban-card .kChip {
    background: rgba(255, 255, 255, 0.06) !important;
    color: #cbd5e1 !important;
  }
  .kap-kanban-card .kBudget {
    color: #10b981 !important;
  }
  .kap-kanban-card .kFoot {
    color: #64748b !important;
  }
  .kap-kanban-card .kOrigen {
    background: rgba(56, 189, 248, 0.12) !important;
    color: #38bdf8 !important;
  }

  /* AGENTE PANEL (DARK THEME) */
  .kap-agent-hero {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1)), #0b0f19 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    color: #f8fafc !important;
  }
  .kap-agent-hero .agentHeroName {
    color: #f8fafc !important;
  }
  .kap-agent-hero .agentHeroSub {
    color: #94a3b8 !important;
  }
  .kap-agent-hero .aHeroTagline {
    color: #cbd5e1 !important;
  }
  .kap-agent-hero .intChip {
    background: rgba(255, 255, 255, 0.05) !important;
    color: #cbd5e1 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  .kap-agent-card-hint {
    color: #64748b !important;
  }

  /* AGENT CHAT CELLPHONE SCREEN */
  .kap-phone-container {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05) !important;
  }
  .kap-phone-header {
    background: #f8fafc !important;
    border-bottom: 1px solid #e2e8f0 !important;
    color: #0f172a !important;
  }
  .kap-phone-header .phoneName {
    color: #0f172a !important;
  }
  .kap-phone-header .phoneOnline {
    color: #10b981 !important;
  }
  .kap-phone-messages {
    background: #f1f5f9 !important;
  }
  .kap-msg-agent {
    background: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #e2e8f0 !important;
  }
  .kap-msg-user {
    background: #dcfce7 !important;
    color: #14532d !important;
  }
  .kap-msg-time {
    color: #94a3b8 !important;
  }
  .kap-phone-input-bar {
    background: #ffffff !important;
    border-top: 1px solid #e2e8f0 !important;
  }
  .kap-phone-input {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #0f172a !important;
  }
  .kap-phone-input:focus {
    border-color: #cbd5e1 !important;
  }
  .kap-phone-quickreplies button {
    background: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    color: #475569 !important;
  /* ── RESPONSIVE & UX OPTIMIZATIONS ── */
  @media (max-width: 768px) {
    .kap-admin {
      flex-direction: column !important;
    }
    .kap-sidebar {
      width: 100% !important;
      height: auto !important;
      padding: 10px 14px !important;
      border-right: none !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      flex-direction: row !important;
      align-items: center !important;
      justifyContent: space-between !important;
    }
    .kap-sbnav {
      display: flex !important;
      flex-direction: row !important;
      gap: 4px !important;
      overflow-x: auto !important;
      padding: 4px 0 !important;
      margin: 0 !important;
    }
    .kap-sbitem span {
      display: inline-block !important;
    }
    .kap-admin-topbar {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }
    .kap-kanban {
      flex-direction: column !important;
      overflow-y: auto !important;
    }
    .kap-kanban-col {
      min-width: 100% !important;
      max-width: 100% !important;
    }
  }

  /* ACCESSIBILITY & INTERACTION ENHANCEMENTS */
  button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
    outline: 2px solid #38bdf8 !important;
    outline-offset: 2px !important;
  }
  .kap-sbitem {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .kap-sbitem:hover {
    transform: translateX(3px) !important;
  }
  @media (max-width: 768px) {
    .kap-sbitem:hover {
      transform: none !important;
    }
  }
`;

const S = {
  root: {
    fontFamily: '"Lexend", "Inter", sans-serif',
    background: '#080a0e',
    color: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  promoContainer: {
    padding: '60px 40px',
    borderRadius: 24,
    background: 'radial-gradient(circle at top left, rgba(14,165,233,0.12), transparent), #0b0f19',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 40
  },
  promoGlow: {
    position: 'absolute',
    bottom: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'rgba(217,70,239,0.08)',
    filter: 'blur(70px)'
  },
  promoContent: {
    maxWidth: 600,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  promoBadge: {
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#a78bfa',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
    border: '1px solid rgba(139, 92, 246, 0.2)'
  },
  promoTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 16
  },
  promoDesc: {
    fontSize: '1rem',
    color: '#94a3b8',
    lineHeight: 1.6,
    marginBottom: 30
  },
  promoBtn: {
    border: 'none',
    color: '#fff',
    padding: '14px 36px',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 8px 30px rgba(6, 182, 212, 0.3)'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5,7,12,0.85)',
    backdropFilter: 'blur(16px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2vh 2vw'
  },
  modalContainer: {
    background: '#080a0e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    width: '96vw',
    height: '92vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
  },
  closeBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '6px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginLeft: 16,
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#090d16',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 10
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#EA384D',
    boxShadow: '0 0 10px #EA384D',
    marginRight: 10
  },
  brandName: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#fff',
    letterSpacing: '-0.02em',
    marginRight: 6
  },
  brandTag: {
    fontSize: '0.8rem',
    color: '#475569',
    fontWeight: 500
  },
  nav: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 4,
    background: '#f1f5f9',
    padding: 3,
    borderRadius: 20,
    border: '1px solid #e2e8f0'
  },
  navBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    padding: '6px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    outline: 'none'
  },
  navBtnOn: {
    background: 'linear-gradient(135deg, #EA384D, #d946ef)',
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: '#070a12',
    overflow: 'hidden'
  },
  webNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 30px',
    background: 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  webLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  webLogoMark: {
    width: 32,
    height: 32,
    background: '#EA384D',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    color: '#fff',
    fontSize: '1.1rem'
  },
  webLogoName: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#fff',
    lineHeight: 1.2
  },
  webLogoSub: {
    fontSize: '0.65rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  webLinks: {
    display: 'flex',
    gap: 24
  },
  webLink: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    cursor: 'pointer',
    fontWeight: 500
  },
  webWa: {
    background: '#10b981',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 30,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  webHero: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 30px 100px 30px',
    textAlign: 'center',
    position: 'relative'
  },
  webHeroInner: {
    maxWidth: 700,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  webBadge: {
    background: 'rgba(14, 165, 233, 0.1)',
    color: '#38bdf8',
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: 20,
    border: '1px solid rgba(14, 165, 233, 0.2)'
  },
  webTitle: {
    fontSize: '3rem',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.15,
    marginBottom: 20
  },
  webSub: {
    fontSize: '1.05rem',
    color: '#94a3b8',
    marginBottom: 35,
    maxWidth: 550,
    lineHeight: 1.5
  },
  searchPanel: {
    width: '100%',
    maxWidth: 800,
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 12,
    display: 'flex',
    gap: 12,
    textAlign: 'left',
    alignItems: 'center'
  },
  searchField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  searchLbl: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  searchSel: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none'
  },
  searchInput: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: '0.85rem',
    outline: 'none'
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #EA384D, #8b5cf6)',
    border: 'none',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 8,
    fontWeight: 700,
    cursor: 'pointer',
    height: '100%',
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  statsBand: {
    display: 'flex',
    justifyContent: 'space-around',
    background: '#090d16',
    padding: '30px 20px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  },
  statItem: {
    textAlign: 'center'
  },
  statN: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4
  },
  statL: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: 500
  },
  webSection: {
    padding: '60px 30px'
  },
  secHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: 12
  },
  secTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fff'
  },
  secCount: {
    fontSize: '0.8rem',
    color: '#64748b'
  },
  svcGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20
  },
  svcCard: {
    padding: 24,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  svcIcon: {
    fontSize: '1.75rem',
    marginBottom: 12
  },
  svcTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8
  },
  svcDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: 1.4
  },
  tipoChips: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap'
  },
  chip: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    padding: '6px 14px',
    borderRadius: 30,
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    outline: 'none'
  },
  chipOn: {
    background: '#EA384D',
    color: '#fff',
    borderColor: '#EA384D'
  },
  webGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20
  },
  propTile: {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer'
  },
  propBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'rgba(15,23,42,0.85)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  fotosBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    background: 'rgba(15,23,42,0.8)',
    color: '#fff',
    padding: '4px 6px',
    borderRadius: 4,
    fontSize: '0.65rem'
  },
  ribbon: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
    color: '#000',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: '0.7rem',
    fontWeight: 800
  },
  propBody: {
    padding: 16
  },
  propPriceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  propPrice: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#EA384D'
  },
  propPriceNota: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  propCodB: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 600
  },
  propZonaW: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: 10
  },
  propFeatRow: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginBottom: 16
  },
  propActions: {
    display: 'flex',
    gap: 8
  },
  verBtn: {
    flex: 1,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#fff',
    padding: '8px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 600
  },
  waIcon: {
    background: '#10b981',
    border: 'none',
    color: '#fff',
    width: 34,
    height: 34,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  zonaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16
  },
  zonaCard: {
    height: 120,
    borderRadius: 16,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 16,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  zonaName: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#fff',
    zIndex: 2
  },
  zonaCount: {
    fontSize: '0.7rem',
    color: '#cbd5e1',
    zIndex: 2
  },
  procGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 24
  },
  procStep: {
    textAlign: 'left'
  },
  procNum: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #EA384D, #8b5cf6)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    marginBottom: 12,
    fontSize: '0.85rem'
  },
  procTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 6
  },
  procDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: 1.4
  },
  testGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 20
  },
  testCard: {
    padding: 24,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  testStars: {
    color: '#fbbf24',
    fontSize: '0.85rem'
  },
  testQuote: {
    fontSize: '0.85rem',
    color: '#cbd5e1',
    lineHeight: 1.4,
    fontStyle: 'italic',
    flex: 1
  },
  testWho: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  testAv: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#1e293b',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.8rem'
  },
  testName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff'
  },
  testRole: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  ctaBand: {
    margin: '30px',
    padding: '40px 30px',
    borderRadius: 20,
    background: 'radial-gradient(circle at top left, rgba(14,165,233,0.12), transparent), #0b0f19',
    border: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  ctaBandGlow: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: '50%',
    background: 'rgba(217,70,239,0.06)',
    filter: 'blur(50px)'
  },
  ctaTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 6
  },
  ctaSub: {
    fontSize: '0.85rem',
    color: '#94a3b8'
  },
  ctaBandBtn: {
    border: 'none',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 10,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  footer: {
    background: '#06080e',
    padding: '40px 30px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    justifyContent: 'space-between'
  },
  footBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  footSub: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  footCols: {
    display: 'flex',
    gap: 40
  },
  footH: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#fff',
    marginBottom: 12
  },
  footL: {
    fontSize: '0.8rem',
    color: '#64748b',
    display: 'block',
    marginBottom: 8,
    cursor: 'pointer'
  },
  footBottom: {
    padding: '16px 30px',
    background: '#04050a',
    borderTop: '1px solid rgba(255,255,255,0.02)',
    textAlign: 'center',
    fontSize: '0.7rem',
    color: '#475569'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    background: '#10b981',
    border: 'none',
    color: '#fff',
    width: 50,
    height: 50,
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 99,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(16,185,129,0.3)'
  },
  fabRing: {
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    border: '2px solid #10b981',
    opacity: 0.3
  },
  fabIcon: {
    zIndex: 2
  },
  fabLabel: {
    position: 'absolute',
    right: 64,
    background: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '6px 12px',
    borderRadius: 8,
    color: '#fff',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 120,
    pointerEvents: 'none'
  },
  fabLabelSub: {
    fontSize: '0.6rem',
    color: '#10b981'
  },
  fabDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    background: '#ef4444',
    borderRadius: '50%',
    border: '2px solid #10b981'
  },
  modalOv: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.4)',
    backdropFilter: 'blur(10px)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  modal: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    width: '100%',
    maxWidth: 520,
    overflowY: 'auto',
    maxHeight: '90vh',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(15,23,42,0.12)',
    fontFamily: '"Lexend", "Inter", sans-serif'
  },
  photoStrip: {
    display: 'flex',
    gap: 8,
    padding: '10px 24px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  photoStripThumb: {
    width: 60,
    height: 45,
    borderRadius: 6,
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid #cbd5e1'
  },
  propFeatsRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 16
  },
  propFeatBadge: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: '0.7rem',
    color: '#475569',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  modalSectionTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  amenitiesGrid: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 20
  },
  amenityBadge: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: '0.75rem',
    color: '#475569',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4
  },
  modalMapBox: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  modalMapHeader: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  modalMapCanvas: {
    height: 120,
    borderRadius: 12,
    background: 'radial-gradient(circle at 50% 50%, rgba(15,23,42,0.03), transparent), #f1f5f9',
    border: '1px solid #e2e8f0',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  modalMapGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: 'rgba(15,23,42,0.05)',
    filter: 'blur(20px)'
  },
  modalMapPin: {
    fontSize: '1.5rem',
    zIndex: 2,
    filter: 'drop-shadow(0 4px 6px rgba(15,23,42,0.15))'
  },
  modalMapLabel: {
    position: 'absolute',
    bottom: 8,
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '4px 10px',
    borderRadius: 6,
    color: '#0f172a',
    fontSize: '0.65rem',
    border: '1px solid #cbd5e1',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  modalX: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(15,23,42,0.08)',
    border: 'none',
    color: '#0f172a',
    width: 28,
    height: 28,
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    transition: 'background 0.2s'
  },
  modalBody: {
    padding: 24
  },
  modalPrice: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0f172a'
  },
  propTipoTag: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
    padding: '3px 8px',
    borderRadius: 4
  },
  modalZona: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#64748b',
    margin: '4px 0 16px 0'
  },
  modalFeats: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 20
  },
  featBox: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    padding: '8px 12px',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 80
  },
  featN: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#0f172a'
  },
  featL: {
    fontSize: '0.65rem',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  modalDesc: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 24
  },
  modalMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: '#94a3b8',
    marginBottom: 24
  },
  modalCtas: {
    display: 'flex',
    gap: 10
  },
  ctaPrimary: {
    flex: 1,
    border: 'none',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  ctaGhost: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  adminShell: {
    display: 'flex',
    background: '#070a12',
    height: '100%',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  },
  sidebar: {
    width: 200,
    background: '#0b0f19',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column'
  },
  sbBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24
  },
  sbLogo: {
    width: 26,
    height: 26,
    background: 'linear-gradient(135deg, #EA384D, #8b5cf6)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    color: '#fff',
    fontSize: '0.9rem'
  },
  sbName: {
    fontWeight: 800,
    color: '#fff',
    fontSize: '0.875rem'
  },
  sbPlan: {
    fontSize: '0.6rem',
    color: '#64748b'
  },
  sbNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  sbItem: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    textAlign: 'left',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  sbItemOn: {
    background: 'rgba(56,189,248,0.12)',
    color: '#38bdf8',
    borderLeft: '3px solid #38bdf8'
  },
  searchBoxWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#131926',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '4px 10px'
  },
  realSearchInput: {
    background: 'transparent',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.8rem',
    outline: 'none',
    width: 160
  },
  addLeadBtn: {
    background: 'linear-gradient(135deg, #0284c7, #8b5cf6)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(2,132,199,0.25)',
    transition: 'all 0.2s ease'
  },
  drawerBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5,7,12,0.7)',
    backdropFilter: 'blur(6px)',
    zIndex: 99999,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  drawerContent: {
    width: 440,
    maxWidth: '90vw',
    height: '100vh',
    background: '#0b0f19',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    overflowY: 'auto',
    boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  drawerTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f8fafc'
  },
  drawerSub: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: 2
  },
  drawerCloseBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    width: 32,
    height: 32,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem'
  },
  drawerScoreCard: {
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 14,
    margin: '16px 0'
  },
  drawerSelect: {
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc',
    borderRadius: 6,
    padding: '4px 8px',
    fontSize: '0.78rem',
    outline: 'none',
    cursor: 'pointer'
  },
  drawerSection: {
    marginBottom: 18
  },
  drawerSecTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#64748b',
    marginBottom: 8
  },
  drawerPropCard: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 10
  },
  drawerChatBox: {
    background: '#0d131a',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    maxHeight: 200,
    overflowY: 'auto'
  },
  drawerActions: {
    marginTop: 'auto',
    display: 'flex',
    gap: 10,
    paddingTop: 16,
    borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  drawerBtnWa: {
    flex: 1,
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.82rem',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
  },
  drawerBtnSec: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  formLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: 6
  },
  formInput: {
    width: '100%',
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  sbUser: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  sbAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.75rem'
  },
  sbUserName: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff'
  },
  sbUserRole: {
    fontSize: '0.6rem',
    color: '#64748b'
  },
  adminContent: {
    flex: 1,
    padding: 24,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto'
  },
  adminTopbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  adminH2: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#fff'
  },
  adminCrumb: {
    fontSize: '0.7rem',
    color: '#64748b',
    marginTop: 2
  },
  adminTools: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  fakeSearch: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: '0.8rem',
    color: '#64748b',
    width: 160
  },
  bell: {
    position: 'relative',
    cursor: 'pointer',
    fontSize: '0.95rem'
  },
  bellDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    background: '#ef4444',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '0.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800
  },
  datePill: {
    background: 'rgba(255,255,255,0.04)',
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#cbd5e1'
  },
  dashWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16
  },
  kpiCard: {
    background: '#0b0f19',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 16
  },
  kpiLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 6
  },
  kpiValue: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 6
  },
  kpiDelta: {
    fontSize: '0.7rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 3
  },
  kpiVs: {
    color: '#64748b'
  },
  dashGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20
  },
  card: {
    background: '#0b0f19',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 16
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#fff'
  },
  cardHint: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  funnel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  funRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  funLabel: {
    width: 80,
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontWeight: 500
  },
  funBarBg: {
    flex: 1,
    height: 8,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  funBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #EA384D, #8b5cf6)',
    borderRadius: 4
  },
  funV: {
    width: 24,
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff',
    textAlign: 'right'
  },
  funConv: {
    width: 36,
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#64748b',
    textAlign: 'right'
  },
  originWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  originLegend: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  legRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  legDot: {
    width: 6,
    height: 6,
    borderRadius: '50%'
  },
  legName: {
    fontSize: '0.8rem',
    color: '#cbd5e1',
    fontWeight: 500
  },
  legPct: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff'
  },
  agentMini: {
    position: 'relative'
  },
  liveDot2: {
    fontSize: '0.7rem',
    color: '#10b981',
    fontWeight: 600
  },
  agentMiniGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  agentStat: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 8
  },
  agentStatV: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: 2
  },
  agentStatL: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    fontWeight: 600,
    marginBottom: 2
  },
  agentStatS: {
    fontSize: '0.6rem',
    color: '#64748b'
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12
  },
  topThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
    overflow: 'hidden'
  },
  topName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: 2
  },
  topBarBg: {
    height: 4,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden'
  },
  topBarFill: {
    height: '100%',
    background: '#EA384D',
    borderRadius: 2
  },
  topC: {
    fontSize: '0.8rem',
    fontWeight: 800,
    color: '#fff'
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  taskBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    color: '#10b981',
    cursor: 'pointer'
  },
  taskTxt: {
    flex: 1,
    fontSize: '0.8rem',
    color: '#cbd5e1'
  },
  taskDue: {
    fontSize: '0.65rem',
    padding: '1px 6px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
    color: '#94a3b8',
    fontWeight: 600
  },
  taskDueHot: {
    background: 'rgba(239,68,68,0.08)',
    color: '#f87171'
  },
  activity: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  actRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: '0.8rem'
  },
  actTag: {
    padding: '1px 6px',
    borderRadius: 3,
    fontSize: '0.65rem',
    fontWeight: 700
  },
  actTxt: {
    color: '#cbd5e1',
    flex: 1
  },
  actTime: {
    color: '#64748b'
  },
  weekStrip: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8
  },
  weekDay: {
    flex: 1,
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: '8px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    position: 'relative'
  },
  weekToday: {
    borderColor: '#EA384D',
    background: 'rgba(14,165,233,0.04)'
  },
  weekD: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 600
  },
  weekN: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#fff'
  },
  weekDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: '#8b5cf6',
    position: 'absolute',
    bottom: 4
  },
  visitRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  visitWhen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  visitDia: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  visitHora: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#fff'
  },
  visitLead: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 2
  },
  visitProp: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  visitState: {
    fontSize: '0.65rem',
    padding: '3px 8px',
    borderRadius: 20,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  visitOk: {
    background: 'rgba(16,185,129,0.08)',
    color: '#10b981'
  },
  visitPend: {
    background: 'rgba(245,158,11,0.08)',
    color: '#f59e0b'
  },
  kanban: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    paddingBottom: 8
  },
  kCol: {
    width: 220,
    minWidth: 220,
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  kColHead: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff'
  },
  kCount: {
    color: '#64748b',
    background: 'rgba(255,255,255,0.04)',
    padding: '1px 6px',
    borderRadius: 8,
    fontSize: '0.7rem'
  },
  kCard: {
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    position: 'relative'
  },
  kCardLive: {
    borderColor: '#10b981',
    boxShadow: '0 0 8px rgba(16,185,129,0.08)'
  },
  liveTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: '0.6rem',
    color: '#10b981',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  kCardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  rowDot: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.85rem'
  },
  kName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff'
  },
  kMeta: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  kChip: {
    background: 'rgba(255,255,255,0.04)',
    padding: '1px 4px',
    borderRadius: 3,
    fontWeight: 600,
    color: '#cbd5e1'
  },
  kBudget: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#EA384D'
  },
  kFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem',
    color: '#64748b'
  },
  kOrigen: {
    fontWeight: 600
  },
  kHandoff: {
    background: 'rgba(245,158,11,0.08)',
    color: '#f59e0b',
    padding: '4px',
    borderRadius: 4,
    fontSize: '0.7rem',
    fontWeight: 700,
    textAlign: 'center'
  },
  kEmpty: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '0.75rem',
    padding: '15px 0'
  },
  tableWrap: {
    background: '#0b0f19',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    overflow: 'hidden'
  },
  tHead: {
    display: 'flex',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.01)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#64748b'
  },
  tCol: {
    width: 100
  },
  tColR: {
    width: 120,
    textAlign: 'right'
  },
  tColC: {
    width: 80,
    textAlign: 'center'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.02)',
    fontSize: '0.8rem'
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12
  },
  rowMain: {
    flex: 1
  },
  rowTitle: {
    fontWeight: 700,
    color: '#fff',
    marginBottom: 2
  },
  rowSub: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  rowOp: {
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: 3,
    background: 'rgba(255,255,255,0.04)',
    color: '#cbd5e1'
  },
  rowPrice: {
    fontWeight: 800,
    color: '#EA384D'
  },
  rowPriceNota: {
    fontSize: '0.65rem',
    color: '#64748b'
  },
  consultaPill: {
    background: 'rgba(14,165,233,0.08)',
    color: '#EA384D',
    padding: '3px 8px',
    borderRadius: 20,
    fontWeight: 700,
    fontSize: '0.7rem'
  },
  pubBadge: {
    color: '#10b981',
    fontSize: '0.7rem',
    fontWeight: 600
  },
  rowSub2: {
    color: '#cbd5e1',
    fontWeight: 600
  },
  stBadge: {
    padding: '3px 8px',
    borderRadius: 20,
    fontWeight: 700,
    fontSize: '0.7rem'
  },
  inlineLive: {
    color: '#10b981',
    fontWeight: 600,
    fontSize: '0.7rem'
  },
  aHero: {
    padding: 24,
    borderRadius: 20,
    background: 'radial-gradient(circle at top left, rgba(139,92,246,0.12), transparent), #0b0f19',
    border: '1px solid rgba(255,255,255,0.04)',
    position: 'relative',
    overflow: 'hidden'
  },
  aHeroGlow: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(14,165,233,0.05)',
    filter: 'blur(40px)'
  },
  aHeroTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  agentHeroL: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  avatarLg: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1rem'
  },
  agentHeroName: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#fff'
  },
  agentHeroSub: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: 2
  },
  aSwitchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  aSwitchLbl: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#cbd5e1'
  },
  aSwitch: {
    width: 36,
    height: 20,
    background: '#10b981',
    borderRadius: 10,
    position: 'relative',
    cursor: 'pointer'
  },
  aSwitchKnob: {
    width: 14,
    height: 14,
    background: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: 3,
    right: 3,
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  },
  aHeroTagline: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    marginBottom: 16,
    lineHeight: 1.4
  },
  aHeroChips: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  intChip: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '4px 10px',
    borderRadius: 30,
    fontSize: '0.7rem',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  intDot: {
    width: 5,
    height: 5,
    borderRadius: '50%'
  },
  aHourNote: {
    fontSize: '0.7rem',
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center'
  },
  aFunRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  aFunLabel: {
    width: 110,
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontWeight: 500
  },
  aFunFoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.03)',
    fontSize: '0.8rem',
    color: '#64748b'
  },
  convoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  convoName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 2
  },
  convoSnippet: {
    fontSize: '0.7rem',
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  convoMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4
  },
  convoT: {
    fontSize: '0.6rem',
    color: '#475569'
  },
  aQualityTag: {
    fontSize: '0.65rem',
    background: 'rgba(234,179,8,0.08)',
    color: '#eab308',
    padding: '1px 6px',
    borderRadius: 3,
    fontWeight: 700
  },
  previewBody: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.02)',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    height: 160,
    overflowY: 'auto'
  },
  pvUser: {
    background: 'linear-gradient(135deg, #EA384D, #0284c7)',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: '10px 10px 0 10px',
    fontSize: '0.75rem',
    maxWidth: '85%'
  },
  pvAgent: {
    background: 'rgba(255,255,255,0.04)',
    color: '#cbd5e1',
    padding: '6px 10px',
    borderRadius: '10px 10px 10px 0',
    fontSize: '0.75rem',
    maxWidth: '85%'
  },
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 10
  },
  toolCard: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 8
  },
  toolName: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#38bdf8',
    fontFamily: 'monospace',
    marginBottom: 4
  },
  toolDesc: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    lineHeight: 1.3
  },
  agentShell: {
    display: 'flex',
    gap: 20,
    padding: 24,
    background: '#070a12'
  },
  phoneContainer: {
    flex: 1.1,
    background: '#0b141a',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    height: 520,
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
  },
  phoneHeader: {
    background: '#1f2c34',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  },
  phoneStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  phoneBack: {
    fontSize: '1.1rem',
    color: '#475569',
    cursor: 'pointer'
  },
  phoneAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#8b5cf6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.85rem'
  },
  phoneName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.2
  },
  phoneOnline: {
    fontSize: '0.65rem',
    color: '#10b981'
  },
  phoneMessages: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  msgUser: {
    background: '#005c4b',
    color: '#e9edef',
    padding: '6px 10px',
    borderRadius: '10px 10px 0 10px',
    fontSize: '0.8rem',
    maxWidth: '85%',
    wordBreak: 'break-word'
  },
  msgAgent: {
    background: '#202c33',
    color: '#e9edef',
    padding: '6px 10px',
    borderRadius: '10px 10px 10px 0',
    fontSize: '0.8rem',
    maxWidth: '85%',
    wordBreak: 'break-word'
  },
  msgTime: {
    fontSize: '0.55rem',
    color: '#8696a0',
    textAlign: 'right',
    marginTop: 3
  },
  msgSystem: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 0'
  },
  msgSystemText: {
    background: '#182229',
    color: '#ffd279',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: '0.7rem',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  phoneFooter: {
    background: '#1f2c34',
    padding: 10,
    borderTop: '1px solid rgba(255,255,255,0.04)'
  },
  phoneInputRow: {
    display: 'flex',
    gap: 6
  },
  phoneInput: {
    flex: 1,
    background: '#2a3942',
    border: 'none',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 20,
    fontSize: '0.8rem',
    outline: 'none'
  },
  phoneSendBtn: {
    background: '#00a884',
    border: 'none',
    color: '#fff',
    padding: '0 16px',
    borderRadius: 20,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  qrContainer: {
    display: 'flex',
    gap: 6,
    marginBottom: 8,
    overflowX: 'auto',
    paddingBottom: 2
  },
  qrChip: {
    background: '#2a3942',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#00a884',
    padding: '4px 10px',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    outline: 'none'
  },
  typingDots: {
    display: 'flex',
    gap: 3
  },
  cardsContainer: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 6,
    margin: '8px 0'
  },
  chatCard: {
    background: '#1f2c34',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.06)',
    width: 150,
    minWidth: 150,
    overflow: 'hidden',
    cursor: 'pointer'
  },
  chatCardImg: {
    height: 75,
    background: '#2a3942'
  },
  chatCardBody: {
    padding: 10
  },
  chatCardPrice: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#00a884',
    marginBottom: 2
  },
  chatCardTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#e9edef',
    marginBottom: 6
  },
  chatCardBtn: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#fff',
    padding: '4px',
    borderRadius: 4,
    fontSize: '0.65rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  crmMonitor: {
    flex: 0.9,
    background: '#ffffff',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    height: 520,
    overflowY: 'auto'
  },
  crmMonitorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  crmLiveBadge: {
    fontSize: '0.7rem',
    color: '#10b981',
    fontWeight: 700
  },
  crmScoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    background: '#f8fafc',
    borderRadius: 12,
    border: '1px solid #e2e8f0'
  },
  crmScoreCircle: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    border: '3px solid #EA384D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(14,165,233,0.15)'
  },
  crmScoreText: {
    textAlign: 'center'
  },
  crmScoreVal: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#0f172a'
  },
  crmScoreLabel: {
    fontSize: '0.5rem',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  crmStateIndicator: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  crmStateLabel: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: 600
  },
  crmStateVal: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 16,
    textTransform: 'uppercase'
  },
  crmLeadFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  crmFieldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  crmField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  crmFieldLabel: {
    fontSize: '0.65rem',
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: 700
  },
  crmFieldVal: {
    fontSize: '0.8rem',
    color: '#1e293b',
    fontWeight: 600
  },
  crmVisitCard: {
    background: 'rgba(139,92,246,0.08)',
    border: '1px solid rgba(139,92,246,0.15)',
    padding: 12,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  crmVisitTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#8b5cf6'
  },
  crmVisitTime: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#6d28d9'
  },
  crmHandoffNotification: {
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.15)',
    padding: 10,
    borderRadius: 8,
    color: '#f59e0b',
    fontWeight: 700,
    textAlign: 'center',
    fontSize: '0.8rem'
  },
  convModalOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(5,7,12,0.92)',
    backdropFilter: 'blur(8px)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  convModalCard: {
    background: '#0c0f19',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 30,
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  convModalGlow: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  },
  convModalClose: {
    position: 'absolute',
    top: 15,
    right: 20,
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1.1rem',
    cursor: 'pointer',
    outline: 'none',
    zIndex: 10
  },
  convModalEmoji: {
    fontSize: '2.5rem',
    marginBottom: 15
  },
  convModalTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.3,
    marginBottom: 10
  },
  convModalDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.5,
    marginBottom: 20
  },
  convModalPromoBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '100%'
  },
  convModalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%'
  },
  convModalBtnPrimary: {
    background: 'linear-gradient(135deg, #EA384D, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(14,165,233,0.2)'
  },
  convModalBtnOutline: {
    background: 'rgba(255,255,255,0.03)',
    color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '12px 24px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none'
  },
  convModalBtnSecondary: {
    background: 'transparent',
    color: '#64748b',
    border: 'none',
    borderRadius: 10,
    padding: '8px',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    outline: 'none'
  }
};

