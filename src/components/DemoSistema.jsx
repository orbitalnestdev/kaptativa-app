import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// ── ICONOS SVG (SHADCN/LUCIDE STYLE) ─────────────────────────────────────────

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Properties: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14M8 10h2M8 14h2M14 10h2M14 14h2" />
    </svg>
  ),
  Leads: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Contracts: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  Blog: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  Agent: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M8 5h8M8 11V9a4 4 0 118 0v2" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.99l1.004.831c.455.377.562 1.01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.83c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.831a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

// ── MOCK DATA INICIAL ────────────────────────────────────────────────────────

const INITIAL_CATALOGO = [
  { id: "P1", cod: "AUR-1042", titulo: "Semipiso Moderno Aterrazado", tipo: "Departamento", operacion: "Alquiler", zona: "Palermo", barrio: "Palermo, CABA", direccion: "Av. Coronel Díaz 1800", precio: "USD 450", expensas: "48.000", m2: 48, supCubierta: 42, amb: 2, dorm: 1, banos: 1, cocheras: 0, estado: "Publicado", consultas: 14 },
  { id: "P2", cod: "AUR-2087", titulo: "Casa Minimalista con Piscina", tipo: "Casa", operacion: "Venta", zona: "Nordelta", barrio: "Nordelta, Tigre", direccion: "Barrio Los Castores Lote 45", precio: "USD 220.000", expensas: "95.000", m2: 180, supCubierta: 162, amb: 5, dorm: 3, banos: 2, cocheras: 2, estado: "Publicado", consultas: 8 },
  { id: "P3", cod: "AUR-1108", titulo: "Monoambiente Amoblado a Estrenar", tipo: "Departamento", operacion: "Alquiler", zona: "Centro", barrio: "Centro, La Rioja", direccion: "San Martín 432", precio: "$ 180.000", expensas: "12.000", m2: 35, supCubierta: 35, amb: 1, dorm: 1, banos: 1, cocheras: 0, estado: "Publicado", consultas: 5 }
];

const INITIAL_LEADS = [
  { id: "L1", nombre: "Carla Méndez", contacto: "+54 9 11 5512-3344", intencion: "Alquiler", zona: "Palermo", presupuesto: "USD 500", estado: "nuevo", origen: "WhatsApp" },
  { id: "L2", nombre: "Roberto Díaz", contacto: "rdiaz@mail.com", intencion: "Compra", zona: "Nordelta", presupuesto: "USD 250.000", estado: "calificado", origen: "Web" },
  { id: "L3", nombre: "Lucía Fernández", contacto: "+54 9 11 4477-9090", intencion: "Alquiler", zona: "Caballito", presupuesto: "$ 200.000", estado: "calificando", origen: "WhatsApp" },
  { id: "L4", nombre: "Marcos Ibáñez", contacto: "+54 9 341 622-1188", intencion: "Compra", zona: "Funes", presupuesto: "USD 45.000", estado: "visita_agendada", origen: "Web" }
];

const INITIAL_CONTRATOS = [
  { id: "C1", inquilino: "Juan Pérez", propietario: "María Gómez", prop: "AUR-1042 (Depto 2 amb Palermo)", monto: "$350.000 ARS", inicio: "15/01/2025", fin: "15/01/2027", estado: "vigente", ajuste: "IPC Trimestral" },
  { id: "C2", inquilino: "Diego Sosa", propietario: "Carlos Ruiz", prop: "AUR-1108 (Monoambiente Centro)", monto: "$180.000 ARS", inicio: "01/06/2025", fin: "01/06/2026", estado: "por_vencer", ajuste: "ICL Semestral" }
];

const INITIAL_BLOG = [
  { id: "B1", titulo: "5 Consejos para comprar tu primera propiedad en Buenos Aires", visitas: 342, estado: "Publicado", fecha: "14/06/2026", seoScore: "95%" },
  { id: "B2", titulo: "Tendencias del mercado inmobiliario en Nordelta 2026", visitas: 215, estado: "Publicado", fecha: "10/06/2026", seoScore: "88%" }
];

const LEADS_DIA = [
  { d: "12", v: 3 }, { d: "13", v: 5 }, { d: "14", v: 4 }, { d: "15", v: 6 },
  { d: "16", v: 5 }, { d: "17", v: 8 }, { d: "18", v: 7 }, { d: "19", v: 6 },
  { d: "20", v: 9 }, { d: "21", v: 8 }, { d: "22", v: 11 }, { d: "23", v: 10 }
];

const ORIGEN_DATA = [
  { name: "Web", value: 42, color: "#0284c7" },
  { name: "WhatsApp", value: 38, color: "#10b981" },
  { name: "Instagram", value: 20, color: "#8b5cf6" }
];

const COLS = [
  { key: "nuevo", label: "Nuevo" },
  { key: "calificando", label: "Calificando" },
  { key: "calificado", label: "Calificado" },
  { key: "visita_agendada", label: "Visita Agendada" }
];

// ── SISTEMA DE DISEÑO DELICADO Y PROLIJO (LIGHT MODE) ────────────────────────
const S = {
  adminShell: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: '"Lexend", "Inter", sans-serif',
    overflow: "hidden"
  },
  sidebar: {
    width: "260px",
    background: "#ffffff",
    borderRight: "1px solid #edf2f7",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 16px"
  },
  sbBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 8px 24px 8px",
    borderBottom: "1px solid #f1f5f9"
  },
  sbLogo: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#0284c7",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "1.2rem"
  },
  sbName: {
    fontWeight: "700",
    fontSize: "1rem",
    color: "#0f172a"
  },
  sbPlan: {
    fontSize: "0.75rem",
    color: "#64748b",
    fontWeight: "500"
  },
  sbNav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "24px",
    flex: 1
  },
  sbItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#475569",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  sbItemOn: {
    background: "#f0f9ff",
    color: "#0284c7"
  },
  sbUser: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9"
  },
  sbAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#e0f2fe",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "0.9rem"
  },
  sbUserName: {
    fontWeight: "700",
    fontSize: "0.85rem",
    color: "#0f172a"
  },
  sbUserRole: {
    fontSize: "0.75rem",
    color: "#64748b"
  },
  adminContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "30px 40px"
  },
  adminTopbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  adminH2: {
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0
  },
  adminCrumb: {
    fontSize: "0.8rem",
    color: "#64748b",
    marginTop: "4px"
  },
  adminTools: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  fakeSearch: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "0.85rem",
    width: "240px",
    cursor: "text"
  },
  bell: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative"
  },
  bellDot: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#ef4444"
  },
  datePill: {
    padding: "8px 16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    color: "#475569",
    fontSize: "0.85rem",
    fontWeight: "600"
  },
  dashWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },
  kpiCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  kpiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  kpiIcon: {
    color: "#0284c7",
    background: "#f0f9ff",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center"
  },
  kpiLabel: {
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  kpiValue: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: "4px 0"
  },
  kpiDelta: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#10b981",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  dashGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px"
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#0f172a"
  },
  cardHint: {
    fontSize: "0.75rem",
    color: "#94a3b8"
  },
  btnPrimary: {
    background: "#0284c7",
    color: "#ffffff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "0.85rem",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s"
  },
  label: {
    fontSize: "0.78rem",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "6px",
    display: "block"
  },
  badgeVigente: { background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" },
  badgeVencer: { background: "#fef9c3", color: "#854d0e", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" },
  badgeVencido: { background: "#fee2e2", color: "#991b1b", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" }
};

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DemoSistema() {
  const [tab, setTab] = useState("dashboard");
  const [properties, setProperties] = useState(INITIAL_CATALOGO);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [contratos, setContratos] = useState(INITIAL_CONTRATOS);
  const [posts, setPosts] = useState(INITIAL_BLOG);

  // States para Formularios ERP
  const [showPropForm, setShowPropForm] = useState(false);
  const [newProp, setNewProp] = useState({
    titulo: "",
    cod: "",
    tipo: "Departamento",
    operacion: "Alquiler",
    zona: "Palermo",
    barrio: "Palermo, CABA",
    direccion: "",
    precio: "",
    expensas: "",
    m2: "",
    supCubierta: "",
    amb: "2",
    dorm: "1",
    banos: "1",
    cocheras: "0",
    video: "",
    estado: "Publicado"
  });

  const [showContratoForm, setShowContratoForm] = useState(false);
  const [newContrato, setNewContrato] = useState({ inquilino: "", propietario: "", prop: "", monto: "", ajuste: "IPC Trimestral" });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newPost, setNewPost] = useState({ titulo: "", seoScore: "90%" });

  const [botSettings, setBotSettings] = useState({ nombre: "Sofía", saludo: "¡Hola! 👋 Soy Sofía de Aurora Propiedades. ¿Qué tipo de propiedad estás buscando?", autoSeo: true, evolutionQr: true });

  // Manejadores de Carga ERP
  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!newProp.titulo || !newProp.direccion || !newProp.precio) {
      alert("Por favor, completa los campos requeridos (Título, Dirección y Precio).");
      return;
    }
    const item = {
      id: "P" + (properties.length + 1),
      cod: newProp.cod || "AUR-" + Math.floor(1000 + Math.random() * 9000),
      titulo: newProp.titulo,
      tipo: newProp.tipo,
      operacion: newProp.operacion,
      zona: newProp.zona,
      barrio: newProp.barrio,
      direccion: newProp.direccion,
      precio: newProp.precio,
      expensas: newProp.expensas || "0",
      m2: Number(newProp.m2) || 45,
      supCubierta: Number(newProp.supCubierta) || Number(newProp.m2) || 40,
      amb: Number(newProp.amb) || 2,
      dorm: Number(newProp.dorm) || 1,
      banos: Number(newProp.banos) || 1,
      cocheras: Number(newProp.cocheras) || 0,
      estado: newProp.estado,
      consultas: 0
    };
    setProperties([item, ...properties]);
    setShowPropForm(false);
    // Reset Form
    setNewProp({
      titulo: "", cod: "", tipo: "Departamento", operacion: "Alquiler", zona: "Palermo", barrio: "Palermo, CABA",
      direccion: "", precio: "", expensas: "", m2: "", supCubierta: "", amb: "2", dorm: "1", banos: "1", cocheras: "0", video: "", estado: "Publicado"
    });
  };

  const handleAddContrato = (e) => {
    e.preventDefault();
    if (!newContrato.inquilino || !newContrato.propietario) return;
    const item = {
      id: "C" + (contratos.length + 1),
      inquilino: newContrato.inquilino,
      propietario: newContrato.propietario,
      prop: newContrato.prop || "AUR-1042 (Depto Palermo)",
      monto: newContrato.monto,
      inicio: "16/07/2026",
      fin: "16/07/2028",
      estado: "vigente",
      ajuste: newContrato.ajuste
    };
    setContratos([item, ...contratos]);
    setShowContratoForm(false);
    setNewContrato({ inquilino: "", propietario: "", prop: "", monto: "", ajuste: "IPC Trimestral" });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.titulo) return;
    const item = {
      id: "B" + (posts.length + 1),
      titulo: newPost.titulo,
      visitas: 0,
      estado: "Borrador",
      fecha: "16/07/2026",
      seoScore: newPost.seoScore
    };
    setPosts([item, ...posts]);
    setShowBlogForm(false);
    setNewPost({ titulo: "", seoScore: "90%" });
  };

  const handleDeleteProp = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const moveLead = (id) => {
    setLeads(leads.map(l => {
      if (l.id === id) {
        const nextMap = { nuevo: "calificando", calificando: "calificado", calificado: "visita_agendada", visita_agendada: "nuevo" };
        return { ...l, estado: nextMap[l.estado] };
      }
      return l;
    }));
  };

  return (
    <div style={S.adminShell}>
      <style>{`
        /* Custom Premium CSS Overrides for DemoSistema */
        .kap-sbitem {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .kap-sbitem:hover {
          background: #f1f5f9 !important;
          color: #0f172a !important;
        }
        .kap-lead-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
        }
        .kap-lead-card:hover {
          transform: translateY(-3px) scale(1.01) !important;
          border-color: #0284c7 !important;
          box-shadow: 0 10px 20px -5px rgba(2, 132, 199, 0.12) !important;
        }
        .kap-erp-input {
          transition: all 0.2s ease !important;
        }
        .kap-erp-input:focus {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15) !important;
          background: #ffffff !important;
          outline: none !important;
        }
        .kap-table-row {
          transition: background-color 0.15s ease !important;
        }
        .kap-table-row:hover {
          background-color: #f8fafc !important;
        }
        .kap-btn-action {
          transition: all 0.2s ease !important;
        }
        .kap-btn-action:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* ── SIDEBAR NAV Cloro/Limpio ── */}
      <aside style={S.sidebar}>
        <div>
          <div style={S.sbBrand}>
            <div style={S.sbLogo}>K</div>
            <div>
              <div style={S.sbName}>Kaptativa CRM</div>
              <div style={S.sbPlan}>Panel Inmobiliario Premium</div>
            </div>
          </div>
          
          <nav style={S.sbNav}>
            <button onClick={() => setTab("dashboard")} className="kap-sbitem" style={{ ...S.sbItem, ...(tab === "dashboard" ? S.sbItemOn : {}) }}>
              <Icons.Dashboard />
              <span>Dashboard General</span>
            </button>
            <button onClick={() => setTab("properties")} className="kap-sbitem" style={{ ...S.sbItem, ...(tab === "properties" ? S.sbItemOn : {}) }}>
              <Icons.Properties />
              <span>Propiedades (ERP)</span>
            </button>
            <button onClick={() => setTab("leads")} className="kap-sbitem" style={{ ...S.sbItem, ...(tab === "leads" ? S.sbItemOn : {}) }}>
              <Icons.Leads />
              <span>Embudo CRM</span>
            </button>
            <button onClick={() => setTab("contratos")} className="kap-sbitem" style={{ ...S.sbItem, ...(tab === "contratos" ? S.sbItemOn : {}) }}>
              <Icons.Contracts />
              <span>Alquileres y Contratos</span>
            </button>
            <button onClick={() => setTab("blog")} className="kap-sbitem" style={{ ...S.sbItem, ...(tab === "blog" ? S.sbItemOn : {}) }}>
              <Icons.Blog />
              <span>Blog Inmobiliario SEO</span>
            </button>
            <button onClick={() => setTab("agente")} className="kap-sbitem" style={{ ...S.sbItem, ...(tab === "agente" ? S.sbItemOn : {}) }}>
              <Icons.Agent />
              <span>Conexión Agente IA</span>
            </button>
          </nav>
        </div>

        <div style={S.sbUser}>
          <div style={S.sbAvatar}>EA</div>
          <div>
            <div style={S.sbUserName}>Estela A.</div>
            <div style={S.sbUserRole}>Administradora</div>
          </div>
        </div>
      </aside>

      {/* ── CENTRAL CONTENT ── */}
      <main style={S.adminContent}>
        {/* Topbar */}
        <div style={S.adminTopbar}>
          <div>
            <h2 style={S.adminH2}>
              {tab === "dashboard" && "Dashboard de Control"}
              {tab === "properties" && "Cartera de Propiedades (ERP)"}
              {tab === "leads" && "Embudo de Conversión Leads CRM"}
              {tab === "contratos" && "Administración de Alquileres"}
              {tab === "blog" && "Contenido & Artículos SEO"}
              {tab === "agente" && "Configuración de Agente IA (WhatsApp)"}
            </h2>
            <div style={S.adminCrumb}>Kaptativa CRM · {tab.toUpperCase()}</div>
          </div>
          <div style={S.adminTools}>
            <div style={S.fakeSearch}>
              <Icons.Search />
              <span>Buscar registros...</span>
            </div>
            <div style={S.bell}>
              <div style={S.bellDot}></div>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.04 9.04 0 01-1.697 1.48C12.383 19.162 11.233 20 10 20c-1.233 0-2.383-.838-3.16-1.438a9.04 9.04 0 01-1.697-1.48m11.514-4.5V11c0-2.761-2.239-5-5-5s-5 2.239-5 5v1.582M18 9.75a6 6 0 00-6-6M6 9.75a6 6 0 016-6" />
              </svg>
            </div>
            <div style={S.datePill}>Julio 2026</div>
          </div>
        </div>

        {/* ── TAB CONTENT ── */}

        {/* 1. DASHBOARD */}
        {tab === "dashboard" && (
          <div style={S.dashWrap}>
            <div style={S.kpiRow}>
              <div style={S.kpiCard}>
                <div style={S.kpiHeader}>
                  <div style={S.kpiLabel}>Leads del Mes</div>
                  <div style={S.kpiIcon}><Icons.Leads /></div>
                </div>
                <div style={S.kpiValue}>48</div>
                <div style={S.kpiDelta}>▲ +18% <span style={{ color: "#94a3b8", fontWeight: "400" }}>vs mes anterior</span></div>
              </div>
              <div style={S.kpiCard}>
                <div style={S.kpiHeader}>
                  <div style={S.kpiLabel}>Alquileres Activos</div>
                  <div style={{ ...S.kpiIcon, background: "#e8fdf5", color: "#10b981" }}><Icons.Contracts /></div>
                </div>
                <div style={S.kpiValue}>{contratos.length}</div>
                <div style={S.kpiDelta}>Vigentes en sistema</div>
              </div>
              <div style={S.kpiCard}>
                <div style={S.kpiHeader}>
                  <div style={S.kpiLabel}>Visitas Agendadas</div>
                  <div style={{ ...S.kpiIcon, background: "#fdf4ff", color: "#d946ef" }}><Icons.Agent /></div>
                </div>
                <div style={S.kpiValue}>11</div>
                <div style={S.kpiDelta}>▲ +4 por Agente IA</div>
              </div>
              <div style={S.kpiCard}>
                <div style={S.kpiHeader}>
                  <div style={S.kpiLabel}>Tasa de Conversión</div>
                  <div style={{ ...S.kpiIcon, background: "#fef3c7", color: "#d97706" }}><Icons.Dashboard /></div>
                </div>
                <div style={S.kpiValue}>12.5%</div>
                <div style={S.kpiDelta}>▲ +2.1 pts <span style={{ color: "#94a3b8", fontWeight: "400" }}>vs promedio</span></div>
              </div>
            </div>

            <div style={S.dashGrid2}>
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={S.cardTitle}>Consultas Registradas por Día</span>
                  <span style={S.cardHint}>últimos 12 días</span>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LEADS_DIA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="v" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={S.cardTitle}>Atribución de Consultas</span>
                  <span style={S.cardHint}>este mes</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: 200 }}>
                  <div style={{ width: 140, height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ORIGEN_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} stroke="none">
                          {ORIGEN_DATA.map((e, index) => <Cell key={`cell-${index}`} fill={e.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    {ORIGEN_DATA.map((o) => (
                      <div key={o.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.85rem" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: o.color, display: "inline-block" }} />
                        <span style={{ fontWeight: "700" }}>{o.name}:</span>
                        <span>{o.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROPERTIES ERP */}
        {tab === "properties" && (
          <div style={S.dashWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Lista completa de propiedades en cartera conectadas con el portal</span>
              <button onClick={() => setShowPropForm(true)} style={S.btnPrimary}>
                <Icons.Plus />
                <span>+ Cargar Propiedad</span>
              </button>
            </div>

            {/* Modal de Carga de Propiedad ERP Completo */}
            {showPropForm && (
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", color: "#0284c7" }}>
                  <Icons.Properties />
                  <span>Módulo ERP: Cargar Nueva Ficha de Propiedad</span>
                </h3>
                
                <form onSubmit={handleAddProperty}>
                  {/* Grid de Formulario */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                    
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={S.label}>Título Comercial / Nombre de la Publicación *</label>
                      <input type="text" placeholder="Ej: Semipiso con balcón aterrazado muy luminoso" value={newProp.titulo} onChange={(e) => setNewProp({ ...newProp, titulo: e.target.value })} style={S.input} className="kap-erp-input" required />
                    </div>

                    <div>
                      <label style={S.label}>Código Único (Ficha/Ref)</label>
                      <input type="text" placeholder="Ej: AUR-1045 (Dejar vacío para auto)" value={newProp.cod} onChange={(e) => setNewProp({ ...newProp, cod: e.target.value })} style={S.input} className="kap-erp-input" />
                    </div>

                    <div>
                      <label style={S.label}>Tipo de Operación</label>
                      <select value={newProp.operacion} onChange={(e) => setNewProp({ ...newProp, operacion: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="Alquiler">Alquiler</option>
                        <option value="Venta">Venta</option>
                        <option value="Alquiler Temporal">Alquiler Temporal</option>
                      </select>
                    </div>

                    <div>
                      <label style={S.label}>Tipo de Propiedad</label>
                      <select value={newProp.tipo} onChange={(e) => setNewProp({ ...newProp, tipo: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="Departamento">Departamento</option>
                        <option value="Casa">Casa</option>
                        <option value="PH">PH</option>
                        <option value="Oficina">Oficina</option>
                        <option value="Local">Local Comercial</option>
                        <option value="Terreno / Lote">Terreno / Lote</option>
                      </select>
                    </div>

                    <div>
                      <label style={S.label}>Precio (USD o AR$) *</label>
                      <input type="text" placeholder="Ej: USD 450 o $320.000" value={newProp.precio} onChange={(e) => setNewProp({ ...newProp, precio: e.target.value })} style={S.input} className="kap-erp-input" required />
                    </div>

                    <div>
                      <label style={S.label}>Expensas (Solo número AR$)</label>
                      <input type="text" placeholder="Ej: 24000" value={newProp.expensas} onChange={(e) => setNewProp({ ...newProp, expensas: e.target.value })} style={S.input} className="kap-erp-input" />
                    </div>

                    <div>
                      <label style={S.label}>Dirección y Altura *</label>
                      <input type="text" placeholder="Ej: Av. Santa Fe 3400 4°B" value={newProp.direccion} onChange={(e) => setNewProp({ ...newProp, direccion: e.target.value })} style={S.input} className="kap-erp-input" required />
                    </div>

                    <div>
                      <label style={S.label}>Barrio / Localidad (Zona)</label>
                      <input type="text" placeholder="Ej: Palermo, CABA" value={newProp.barrio} onChange={(e) => setNewProp({ ...newProp, barrio: e.target.value })} style={S.input} className="kap-erp-input" />
                    </div>

                    <div>
                      <label style={S.label}>Superficie Total (m²)</label>
                      <input type="number" placeholder="Ej: 60" value={newProp.m2} onChange={(e) => setNewProp({ ...newProp, m2: e.target.value })} style={S.input} className="kap-erp-input" />
                    </div>

                    <div>
                      <label style={S.label}>Superficie Cubierta (m²)</label>
                      <input type="number" placeholder="Ej: 52" value={newProp.supCubierta} onChange={(e) => setNewProp({ ...newProp, supCubierta: e.target.value })} style={S.input} className="kap-erp-input" />
                    </div>

                    <div>
                      <label style={S.label}>Ambientes</label>
                      <select value={newProp.amb} onChange={(e) => setNewProp({ ...newProp, amb: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="1">1 (Monoambiente)</option>
                        <option value="2">2 Ambientes</option>
                        <option value="3">3 Ambientes</option>
                        <option value="4">4 Ambientes</option>
                        <option value="5">5+ Ambientes</option>
                      </select>
                    </div>

                    <div>
                      <label style={S.label}>Dormitorios</label>
                      <select value={newProp.dorm} onChange={(e) => setNewProp({ ...newProp, dorm: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="0">0 (Estudio/Mono)</option>
                        <option value="1">1 Dormitorio</option>
                        <option value="2">2 Dormitorios</option>
                        <option value="3">3 Dormitorios</option>
                        <option value="4">4+ Dormitorios</option>
                      </select>
                    </div>

                    <div>
                      <label style={S.label}>Baños</label>
                      <select value={newProp.banos} onChange={(e) => setNewProp({ ...newProp, banos: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="1">1 Baño</option>
                        <option value="2">2 Baños</option>
                        <option value="3">3+ Baños</option>
                      </select>
                    </div>

                    <div>
                      <label style={S.label}>Cocheras</label>
                      <select value={newProp.cocheras} onChange={(e) => setNewProp({ ...newProp, cocheras: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="0">Sin Cochera</option>
                        <option value="1">1 Cochera</option>
                        <option value="2">2+ Cocheras</option>
                      </select>
                    </div>

                    <div>
                      <label style={S.label}>Enlace Video / Recorrido 360°</label>
                      <input type="text" placeholder="Ej: https://youtube.com/..." value={newProp.video} onChange={(e) => setNewProp({ ...newProp, video: e.target.value })} style={S.input} className="kap-erp-input" />
                    </div>

                    <div>
                      <label style={S.label}>Estado Inicial del Listado</label>
                      <select value={newProp.estado} onChange={(e) => setNewProp({ ...newProp, estado: e.target.value })} style={S.input} className="kap-erp-input">
                        <option value="Publicado">Publicado (Online)</option>
                        <option value="Borrador">Borrador (Offline)</option>
                        <option value="Pausado">Pausado</option>
                      </select>
                    </div>

                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setShowPropForm(false)} style={{ ...S.btnPrimary, background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}>Cancelar</button>
                    <button type="submit" style={S.btnPrimary}>
                      <Icons.Check />
                      <span>Guardar e Publicar Ficha</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ ...S.card, padding: 0, overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>CÓDIGO</th>
                    <th style={S.th}>PROPIEDAD / TÍTULO</th>
                    <th style={S.th}>OPERACIÓN</th>
                    <th style={S.th}>UBICACIÓN</th>
                    <th style={S.th}>PRECIO</th>
                    <th style={S.th}>EXPENSAS</th>
                    <th style={S.th}>MEDIDAS / AMB</th>
                    <th style={S.th}>ESTADO</th>
                    <th style={S.th}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id} className="kap-table-row">
                      <td style={{ ...S.td, fontWeight: "700" }}>{p.cod}</td>
                      <td style={S.td}>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{p.titulo || `${p.tipo} en ${p.zona}`}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>{p.direccion}</div>
                      </td>
                      <td style={S.td}>
                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: p.operacion === "Venta" ? "#7c3aed" : "#0284c7" }}>
                          {p.operacion}
                        </span>
                      </td>
                      <td style={S.td}>{p.barrio || p.zona}</td>
                      <td style={{ ...S.td, fontWeight: "700", color: "#0f172a" }}>{p.precio}</td>
                      <td style={S.td}>
                        {p.expensas && p.expensas !== "0" ? `$ ${p.expensas}` : "—"}
                      </td>
                      <td style={S.td}>
                        <div style={{ fontSize: "0.85rem", color: "#475569" }}>{p.m2} m² t · {p.amb} amb</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{p.dorm} dorm · {p.banos} bñ</div>
                      </td>
                      <td style={S.td}>
                        <span style={{ background: p.estado === "Publicado" ? "#dcfce7" : "#f1f5f9", color: p.estado === "Publicado" ? "#166534" : "#475569", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" }}>
                          {p.estado}
                        </span>
                      </td>
                      <td style={S.td}>
                        <button onClick={() => handleDeleteProp(p.id)} style={{ background: "transparent", border: "none", color: "#ef4444", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem" }}>
                          <Icons.Trash />
                          <span>Quitar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. LEADS CRM */}
        {tab === "leads" && (
          <div style={S.dashWrap}>
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Haz clic sobre la tarjeta de un lead para avanzar de etapa en el CRM Kanban de forma rápida.</span>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              {COLS.map((col) => {
                const colLeads = leads.filter(l => l.estado === col.key);
                return (
                  <div key={col.key} style={{ background: "#ffffff", border: "1px solid #edf2f7", borderRadius: "12px", padding: "16px", minHeight: "350px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#0f172a", marginBottom: "16px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                      <span>{col.label}</span>
                      <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem" }}>{colLeads.length}</span>
                    </h4>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {colLeads.map((l) => (
                        <div key={l.id} onClick={() => moveLead(l.id)} style={{ padding: "14px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", cursor: "pointer", transition: "border-color 0.2s" }} className="kap-lead-card">
                          <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#0f172a", marginBottom: "4px" }}>{l.nombre}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span>📍 {l.zona}</span>
                            <span>💰 {l.presupuesto}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ background: l.origen === "WhatsApp" ? "#dcfce7" : "#e0f2fe", color: l.origen === "WhatsApp" ? "#166534" : "#0369a1", padding: "2px 6px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "700" }}>
                              {l.origen}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "#0284c7", fontWeight: "600" }}>Mover ➔</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. CONTRATOS Y ALQUILERES */}
        {tab === "contratos" && (
          <div style={S.dashWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Control de contratos de alquiler, vencimientos futuros y alertas de expensas</span>
              <button onClick={() => setShowContratoForm(true)} style={S.btnPrimary}>
                <Icons.Plus />
                <span>+ Registrar Contrato</span>
              </button>
            </div>

            {/* Modal Crear Contrato */}
            {showContratoForm && (
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px", color: "#0284c7" }}>
                  <Icons.Contracts />
                  <span>Registrar Contrato de Locación</span>
                </h3>
                <form onSubmit={handleAddContrato} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "end" }}>
                  <div>
                    <label style={S.label}>Inquilino (Nombre completo)</label>
                    <input type="text" placeholder="Ej: Diego Ramírez" value={newContrato.inquilino} onChange={(e) => setNewContrato({ ...newContrato, inquilino: e.target.value })} style={S.input} className="kap-erp-input" required />
                  </div>
                  <div>
                    <label style={S.label}>Propietario (Locador)</label>
                    <input type="text" placeholder="Ej: Carlos Silva" value={newContrato.propietario} onChange={(e) => setNewContrato({ ...newContrato, propietario: e.target.value })} style={S.input} className="kap-erp-input" required />
                  </div>
                  <div>
                    <label style={S.label}>Propiedad / Ficha Relacionada</label>
                    <input type="text" placeholder="Ej: AUR-1108 (Monoambiente Centro)" value={newContrato.prop} onChange={(e) => setNewContrato({ ...newContrato, prop: e.target.value })} style={S.input} className="kap-erp-input" />
                  </div>
                  <div>
                    <label style={S.label}>Monto del Alquiler Inicial</label>
                    <input type="text" placeholder="Ej: $250.000 ARS" value={newContrato.monto} onChange={(e) => setNewContrato({ ...newContrato, monto: e.target.value })} style={S.input} className="kap-erp-input" required />
                  </div>
                  <div>
                    <label style={S.label}>Metodología de Ajuste</label>
                    <select value={newContrato.ajuste} onChange={(e) => setNewContrato({ ...newContrato, ajuste: e.target.value })} style={S.input} className="kap-erp-input">
                      <option value="IPC Trimestral">IPC Trimestral (Ajuste Inflación)</option>
                      <option value="ICL Semestral">ICL Semestral (Ajuste BCRA)</option>
                      <option value="Fijo Anual">Fijo Anual</option>
                      <option value="Fijo Mensual">Fijo Mensual</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={S.btnPrimary}>Registrar Contrato</button>
                    <button type="button" onClick={() => setShowContratoForm(false)} style={{ ...S.btnPrimary, background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ ...S.card, padding: 0, overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>INQUILINO</th>
                    <th style={S.th}>PROPIETARIO</th>
                    <th style={S.th}>PROPIEDAD VINCULADA</th>
                    <th style={S.th}>MONTO MENSUAL</th>
                    <th style={S.th}>FECHA INICIO</th>
                    <th style={S.th}>FECHA FIN</th>
                    <th style={S.th}>TIPO DE AJUSTE</th>
                    <th style={S.th}>ESTADO / ALERTA</th>
                  </tr>
                </thead>
                <tbody>
                  {contratos.map((c) => (
                    <tr key={c.id} className="kap-table-row">
                      <td style={{ ...S.td, fontWeight: "700" }}>{c.inquilino}</td>
                      <td style={S.td}>{c.propietario}</td>
                      <td style={S.td}>{c.prop}</td>
                      <td style={{ ...S.td, color: "#10b981", fontWeight: "700" }}>{c.monto}</td>
                      <td style={S.td}>{c.inicio}</td>
                      <td style={S.td}>{c.fin}</td>
                      <td style={S.td}>{c.ajuste}</td>
                      <td style={S.td}>
                        {c.estado === "vigente" && <span style={S.badgeVigente}>Vigente</span>}
                        {c.estado === "por_vencer" && <span style={S.badgeVencer}>Por Vencer</span>}
                        {c.estado === "vencido" && <span style={S.badgeVencido}>Vencido</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. BLOG SEO */}
        {tab === "blog" && (
          <div style={S.dashWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Redacción de contenido inmobiliario optimizado para captar tráfico orgánico de Google</span>
              <button onClick={() => setShowBlogForm(true)} style={S.btnPrimary}>
                <Icons.Plus />
                <span>+ Crear Post SEO</span>
              </button>
            </div>

            {/* Modal Crear Post */}
            {showBlogForm && (
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px", color: "#0284c7" }}>
                  <Icons.Blog />
                  <span>Nuevo Post Optimizado para Google</span>
                </h3>
                <form onSubmit={handleAddPost} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", alignItems: "end" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={S.label}>Título del Artículo (Ej: Alquilar en Palermo: Guía de precios 2026)</label>
                    <input type="text" placeholder="Título enfocado en búsquedas de Google..." value={newPost.titulo} onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })} style={S.input} className="kap-erp-input" required />
                  </div>
                  <div>
                    <label style={S.label}>Optimización SEO Score</label>
                    <select value={newPost.seoScore} onChange={(e) => setNewPost({ ...newPost, seoScore: e.target.value })} style={S.input} className="kap-erp-input">
                      <option value="95%">Excelente (95%)</option>
                      <option value="90%">Muy Bueno (90%)</option>
                      <option value="85%">Bueno (85%)</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={S.btnPrimary}>Crear Borrador</button>
                    <button type="button" onClick={() => setShowBlogForm(false)} style={{ ...S.btnPrimary, background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ ...S.card, padding: 0, overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>TÍTULO DEL POST</th>
                    <th style={S.th}>FECHA CREACIÓN</th>
                    <th style={S.th}>VISITAS (GOOGLE)</th>
                    <th style={S.th}>ESTADO</th>
                    <th style={S.th}>PUNTUACIÓN SEO</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} className="kap-table-row">
                      <td style={{ ...S.td, fontWeight: "700", color: "#0f172a" }}>{p.titulo}</td>
                      <td style={S.td}>{p.fecha}</td>
                      <td style={S.td}>{p.visitas}</td>
                      <td style={S.td}>
                        <span style={{ background: p.estado === "Publicado" ? "#dcfce7" : "#f1f5f9", color: p.estado === "Publicado" ? "#166534" : "#475569", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" }}>
                          {p.estado}
                        </span>
                      </td>
                      <td style={{ ...S.td, fontWeight: "800", color: "#EA384D" }}>{p.seoScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. CONFIGURACION AGENTE IA */}
        {tab === "agente" && (
          <div style={S.dashWrap}>
            <div style={S.dashGrid2}>
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={S.cardTitle}>Configuración General del Asistente</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={S.label}>Nombre de tu Asistente Inteligente</label>
                    <input type="text" value={botSettings.nombre} onChange={(e) => setBotSettings({ ...botSettings, nombre: e.target.value })} style={S.input} className="kap-erp-input" />
                  </div>
                  <div>
                    <label style={S.label}>Mensaje Inicial de Saludo (WhatsApp)</label>
                    <textarea rows="4" value={botSettings.saludo} onChange={(e) => setBotSettings({ ...botSettings, saludo: e.target.value })} style={{ ...S.input, fontFamily: "inherit", resize: "none" }} className="kap-erp-input" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem" }}>
                      <input type="checkbox" checked={botSettings.autoSeo} onChange={(e) => setBotSettings({ ...botSettings, autoSeo: e.target.checked })} />
                      <span>Optimizar descripciones automáticamente para SEO Local</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem" }}>
                      <input type="checkbox" defaultChecked />
                      <span>Responder consultas sobre valor de expensas y metros cuadrados</span>
                    </label>
                  </div>
                  <button onClick={() => alert("¡Configuración del Bot actualizada exitosamente!")} style={{ ...S.btnPrimary, marginTop: "10px", width: "100%", justifyContent: "center" }}>Guardar Ajustes</button>
                </div>
              </div>

              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={S.cardTitle}>Estado de Conexión (Evolution API)</span>
                </div>
                <div style={{ textAlign: "center", padding: "20px" }}>
                  {botSettings.evolutionQr ? (
                    <div>
                      <div style={{ display: "inline-block", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px dashed #cbd5e1", marginBottom: "16px" }}>
                        <div style={{ width: "140px", height: "140px", background: "#0f172a", display: "flex", flexWrap: "wrap", padding: "6px", gap: "4px" }}>
                          {Array.from({ length: 49 }).map((_, i) => (
                            <div key={i} style={{ width: "16px", height: "16px", background: (i % 2 === 0 || i % 5 === 0) ? "#ffffff" : "#0f172a" }} />
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#166534", marginBottom: "4px" }}>✓ Conexión Simulada Activa</div>
                      <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Tu WhatsApp está conectado correctamente. Escaneá este código QR en tu celular para reconectar en caso de cambio de dispositivo.</p>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => setBotSettings({ ...botSettings, evolutionQr: true })} style={S.btnPrimary}>Generar Código QR de Conexión</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

