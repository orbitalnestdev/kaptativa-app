export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || '';

const TEMPLATES = {
  web:     { price: 600,  label: 'Diseño Web' },
  auto:    { price: 500,  label: 'Automatización' },
  ia:      { price: 800,  label: 'Agente IA' },
  sistema: { price: 1500, label: 'Sistema Completo' },
};

const BLOCKS = {
  'block-uiux':  { price: 200, label: 'Diseño UI/UX a Medida' },
  'block-api':   { price: 300, label: 'Integración de API Externa' },
  'block-admin': { price: 400, label: 'Panel de Administración' },
  'block-lang':  { price: 150, label: 'Soporte Multi-idioma' },
  'block-speed': { price: 150, label: 'WPO (Optimización SEO/Speed)' },
  'block-db':    { price: 250, label: 'Base de Datos Cloud' },
  'block-crm':   { price: 300, label: 'Integración CRM' },
  'block-vps':   { price: 350, label: 'Servidor VPS Dedicado' },
};

export async function POST({ request, cookies }) {
  const sessionCookie = cookies.get('kaptativa_session');
  if (!sessionCookie) {
    return Response.json({ error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
  }

  try {
    const { description } = await request.json();

    if (!description?.trim()) {
      return Response.json({ error: 'Descripción vacía' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return Response.json({ error: 'OPENAI_API_KEY no configurada' }, { status: 500 });
    }

    const systemPrompt = `Sos un experto en presupuestos de software de Kaptativa. Analizás descripciones de proyectos y devolvés una configuración de presupuesto estructurada.

Plantillas disponibles (elegí UNA según el tipo de proyecto):
- "web": Diseño Web / Landing Page / Sitio corporativo → $600 base
- "auto": Automatizaciones de procesos / integraciones → $500 base
- "ia": Agente de IA / Chatbot / WhatsApp Bot → $800 base
- "sistema": Sistema completo / App full-stack / Plataforma → $1500 base

Módulos opcionales (incluí SOLO los que aplican al proyecto):
- "block-uiux": Diseño UI/UX a medida ($200) — para proyectos que piden diseño personalizado, no plantillas
- "block-api": Integración API externa ($300) — cuando hay que conectar con un servicio externo (pagos, redes, mapas, etc.)
- "block-admin": Panel de administración ($400) — si el cliente necesita gestionar contenido o usuarios
- "block-lang": Multi-idioma ($150) — si piden varios idiomas
- "block-speed": WPO/SEO ($150) — optimización de performance, sugerida en proyectos web públicos
- "block-db": Base de datos cloud ($250) — para sistemas con datos estructurados o inventario
- "block-crm": Integración CRM ($300) — para proyectos con pipeline de ventas o leads
- "block-vps": VPS Dedicado ($350) — para sistemas de alta carga, agentes IA en producción o e-commerce

Respondé ÚNICAMENTE con JSON válido (sin texto extra):
{
  "template": "<web|auto|ia|sistema>",
  "blocks": ["block-id-1", "block-id-2"],
  "features": ["Característica 1", "Característica 2", "Característica 3", "Característica 4"],
  "maintenance": <número mensual sugerido en USD, 0 si no aplica>,
  "notes": "<observación técnica breve para incluir en la propuesta, max 120 chars>",
  "explanation": "<una sola oración explicando por qué elegiste esta combinación>"
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Proyecto: "${description}"` }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const raw = JSON.parse(data.choices[0]?.message?.content || '{}');

    // Validate and sanitize output
    const template = TEMPLATES[raw.template] ? raw.template : 'web';
    const blocks = (raw.blocks || []).filter(b => BLOCKS[b]);
    const features = (raw.features || []).slice(0, 6).map(f => String(f).trim());
    const maintenance = Math.max(0, parseInt(raw.maintenance) || 0);
    const notes = String(raw.notes || '').slice(0, 150);
    const explanation = String(raw.explanation || '');

    // Calculate suggested price
    const basePrice = TEMPLATES[template].price;
    const blocksPrice = blocks.reduce((sum, b) => sum + BLOCKS[b].price, 0);
    const suggestedTotal = basePrice + blocksPrice;

    return Response.json({
      template,
      blocks,
      features,
      maintenance,
      notes,
      explanation,
      basePrice,
      blocksPrice,
      suggestedTotal,
      templateLabel: TEMPLATES[template].label,
      blockLabels: blocks.map(b => ({ id: b, label: BLOCKS[b].label, price: BLOCKS[b].price }))
    });

  } catch (err) {
    console.error('[generate-budget] Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
