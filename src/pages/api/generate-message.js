export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || '';

// ─── LOCAL FALLBACK (sin API key) ────────────────────────────────────────────
function generarSecuenciaLocal(p, tono = 'informal') {
  const sinWeb = !p.web;
  const rubro = (p.rubro || 'Inmobiliaria').toLowerCase();
  const rating = p.rating ? ` (${p.rating}⭐ en Google)` : '';
  const nombre = p.nombre;
  const ciudad = p.ciudad;

  const saludos = {
    informal: `¡Hola! Soy Diego de Kaptativa. Vi ${nombre} en ${ciudad}${rating}`,
    corporativo: `Estimados, les escribo de parte de Kaptativa. Revisé el perfil de ${nombre} en ${ciudad}`,
    directo: `Hola, Diego de Kaptativa. Vi ${nombre} en ${ciudad}${rating}`
  };

  const ganchos = {
    gimnasio: sinWeb
      ? { ap: `y noté que no tienen web para mostrar clases y reservar turnos online.`, seg: `Muchos de nuestros clientes gimnasios duplicaron sus reservas con una web simple + recordatorios automáticos por WhatsApp.`, reen: `¿Les interesa ver cómo funcionaría para ${nombre}? Es un diagnóstico de 15 minutos.` }
      : { ap: `y vi que las reservas de clases se gestionan de forma manual.`, seg: `Automatizamos confirmaciones y recordatorios de turnos para que el equipo se enfoque en los socios.`, reen: `Solo quería saber si tienen interés antes de cerrar mi agenda de esta semana.` },
    'estudio contable': sinWeb
      ? { ap: `y vi que no tienen portal web para centralizar clientes ni recibir consultas automáticas.`, seg: `Clientes nuestros del rubro redujeron un 40% las consultas repetitivas con un bot de FAQs en WhatsApp.`, reen: `¿Puedo mostrarles el panel en 5 minutos esta semana?` }
      : { ap: `y vi que la comunicación con clientes se maneja de forma manual.`, seg: `Automatizamos recordatorios de vencimientos y FAQs contables directamente en WhatsApp.`, reen: `¿Tienen agenda esta semana para una llamada rápida?` },
    'e-commerce': sinWeb
      ? { ap: `y noté que venden por Instagram sin e-commerce propio con cobro automático.`, seg: `Un checkout propio + bot de seguimiento de pedidos en WhatsApp puede bajar el abandono de carritos hasta un 60%.`, reen: `¿Les sirve ver un ejemplo con su tipo de producto?` }
      : { ap: `y vi que les falta automatizar el recupero de carritos abandonados por WhatsApp.`, seg: `Los bots de recupero de carritos suelen recuperar entre 10-25% de las ventas perdidas.`, reen: `¿Esta semana tienen 5 minutos para verlo?` },
    gastronomía: sinWeb
      ? { ap: `y noté que toman pedidos manualmente sin carta digital integrada.`, seg: `Un bot de pedidos en WhatsApp reduce errores y libera al equipo durante el servicio pico.`, reen: `¿Los busco para un diagnóstico rápido?` }
      : { ap: `y vi que la toma de pedidos y pagos se gestiona a mano.`, seg: `Integrar un bot que tome pedidos y cobre en WhatsApp puede ahorrar horas de trabajo por semana.`, reen: `¿Puedo mostrarles cómo en 5 minutos?` },
    inmobiliaria: sinWeb
      ? { ap: `y vi que manejan su catálogo por Instagram sin web propia para filtrar propiedades.`, seg: `Con un catálogo web + WhatsApp con IA sus clientes consultan 24/7 y ustedes reciben solo los leads calificados.`, reen: `¿Les interesa ver cómo funcionaría en un diagnóstico rápido antes de que cierren el mes?` }
      : { ap: `y vi que atienden consultas manualmente sin un agente de IA que filtre los leads.`, seg: `Clientes del rubro redujeron el tiempo de atención inicial un 70% con un asistente en WhatsApp.`, reen: `¿Cerramos 5 minutos esta semana?` }
  };

  const gancho = ganchos[rubro] || ganchos['inmobiliaria'];

  const cierres = {
    informal: `Justo ayudamos a empresas del rubro a automatizar esto. ¿Te muestro en 5 min cómo se vería para ustedes?`,
    corporativo: `Nos especializamos en soluciones de automatización para este sector. ¿Podrían coordinar una breve reunión técnica?`,
    directo: `¿Te interesa un diagnóstico de 15 min?`
  };

  const apertura = `${saludos[tono]} ${gancho.ap} ${cierres[tono]}`;

  const seguimiento = tono === 'corporativo'
    ? `Buenas, les reenvío mi consulta anterior sobre ${nombre}. ${gancho.seg} ¿Tienen disponibilidad esta semana para conversar?`
    : `Hola de nuevo, soy Diego de Kaptativa. Quería retomar el mensaje anterior sobre ${nombre}. ${gancho.seg} ¿Les viene bien una llamada corta?`;

  const reenganche = tono === 'corporativo'
    ? `Estimados de ${nombre}, entiendo que el día a día es muy exigente. ${gancho.reen} Sin compromiso.`
    : `¡Hola! Último mensaje, lo prometo. ${gancho.reen}`;

  return { apertura, seguimiento, reenganche };
}

// ─── OPENAI API ───────────────────────────────────────────────────────────────
async function generarSecuenciaConIA(p, tono) {
  const sinWeb = !p.web;
  const tonoInstruccion = {
    informal: 'español argentino informal con voseo (vos, andás, tenés, querés). Amigable y directo.',
    corporativo: 'español formal argentino con "usted". Profesional y educado.',
    directo: 'muy directo y conciso, sin saludos largos, al grano con la propuesta de valor.'
  }[tono] || 'español argentino informal';

  const datosProspecto = [
    `Negocio: "${p.nombre}"`,
    `Rubro: "${p.rubro || 'Inmobiliaria'}"`,
    `Ciudad: "${p.ciudad}"`,
    `Web: ${p.web ? `"${p.web}"` : 'NO TIENE (gran oportunidad para ofrecer desarrollo)'}`,
    `Instagram: ${p.instagram ? `"@${p.instagram}"` : 'Sin Instagram'}`,
    p.rating ? `Rating Google: ${p.rating}/5 estrellas` : null,
    p.notas ? `Notas adicionales: "${p.notas}"` : null
  ].filter(Boolean).join('\n');

  const systemPrompt = `Sos Diego, fundador de Kaptativa (empresa de desarrollo web, automatizaciones y agentes de IA con WhatsApp). Escribís mensajes de prospección en WhatsApp para ofrecer servicios.

Servicios de Kaptativa:
- Webs y catálogos digitales desde USD 600
- Automatizaciones de procesos desde USD 500
- Agentes de WhatsApp con IA desde USD 800

Reglas de escritura:
- Tono: ${tonoInstruccion}
- Máximo 3 oraciones por mensaje
- Siempre personalizá basándote en el rubro y si tiene web o no
- Nunca uses frases genéricas como "espero que estés bien"
- Terminá siempre con una pregunta o CTA claro
- ${sinWeb ? 'No tiene web: ofrecé desarrollo web/catálogo digital como primer gancho' : 'Ya tiene web: ofrecé automatizaciones, bots o integraciones con WhatsApp'}

Respondé ÚNICAMENTE con JSON válido, sin explicaciones extra.`;

  const userPrompt = `Datos del prospecto:
${datosProspecto}

Generá exactamente 3 mensajes de WhatsApp para una secuencia de contacto:
1. apertura: Primer contacto. Presentate, hacé una observación específica sobre su negocio (basada en el rubro y si tiene web), CTA para un diagnóstico de 15 minutos.
2. seguimiento: Si no respondió en 3 días. Diferente ángulo de valor, no repitas lo del primer mensaje. Mostrá un resultado concreto o caso de uso.
3. reenganche: Último intento tras 2 semanas. Muy breve, tono ligero, fácil de responder con sí/no. Podés hacer humor suave.

Formato de respuesta (JSON exacto, nada más):
{"apertura":"...","seguimiento":"...","reenganche":"..."}`;

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
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.75,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const raw = data.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  if (!parsed.apertura || !parsed.seguimiento || !parsed.reenganche) {
    throw new Error('Respuesta de IA incompleta: faltan campos de la secuencia');
  }

  return {
    apertura: parsed.apertura.trim(),
    seguimiento: parsed.seguimiento.trim(),
    reenganche: parsed.reenganche.trim()
  };
}

// ─── ENDPOINT ─────────────────────────────────────────────────────────────────
export async function POST({ request, cookies }) {
  const sessionCookie = cookies.get('kaptativa_session');
  if (!sessionCookie) {
    return Response.json({ error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prospecto, tono = 'informal' } = body;

    if (!prospecto?.nombre || !prospecto?.ciudad) {
      return Response.json({ error: 'Datos del prospecto incompletos (nombre y ciudad son obligatorios)' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      const mensajes = generarSecuenciaLocal(prospecto, tono);
      return Response.json({ mensaje: mensajes.apertura, mensajes, isMock: true });
    }

    const mensajes = await generarSecuenciaConIA(prospecto, tono);
    return Response.json({ mensaje: mensajes.apertura, mensajes, isMock: false });

  } catch (error) {
    console.error('[generate-message] Error:', error.message);
    // Fallback to local on any error
    try {
      const { prospecto, tono = 'informal' } = await request.json().catch(() => ({}));
      if (prospecto) {
        const mensajes = generarSecuenciaLocal(prospecto, tono);
        return Response.json({ mensaje: mensajes.apertura, mensajes, isMock: true });
      }
    } catch (_) {}
    return Response.json({ error: error.message }, { status: 500 });
  }
}
