export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || '';

const DEFAULT_BOT_PROMPT =
  `Eres el asistente virtual inteligente de Kaptativa (empresa de desarrollo de software y automatizaciones con IA).
Tu objetivo es calificar al lead conversando amigablemente y coordinar por chat una videollamada corta de 15 minutos para un diagnóstico.
Sé breve, profesional y directo. No uses textos largos ni envíes enlaces de reservas.
Si el usuario pregunta precios, menciónale los precios base:
- Diseños web profesionales desde USD 600.
- Automatizaciones de procesos desde USD 500.
- Agentes de WhatsApp con IA entrenados a medida desde USD 800.
Intenta descubrir su rubro de negocio y en qué le gustaría automatizar.`;

const SCHEDULING_INSTRUCTIONS =
  `\nINSTRUCCIÓN DE AGENDAMIENTO CONVERSACIONAL (CRÍTICA):
1. NO envíes ningún enlace de reservas (como Cal.com). El agendamiento se hace 100% conversacional en el chat.
2. Si el cliente solicita una reunión, llamada o diagnóstico, pero no ha especificado una fecha y hora exactas, DEBES preguntarle por su disponibilidad o proponerle dos opciones de horario de lunes a viernes entre las 10:00 y las 17:00 hs.
3. SOLO cuando el cliente proponga una fecha y hora exactas (ej. "el lunes a las 11:00 hs") o confirme una de tus propuestas, debes confirmar la cita amigablemente y obligatoriamente escribir al final de tu respuesta la etiqueta secreta en este formato exacto:
[SCHEDULE_MEETING: YYYY-MM-DD HH:MM]
Reemplaza YYYY-MM-DD por el año, mes y día acordado y HH:MM por la hora en formato 24 horas.
4. NUNCA escribas la etiqueta [SCHEDULE_MEETING] si el cliente no ha proporcionado o confirmado explícitamente una fecha y hora para la cita. Si solo dice "quiero agendar", limítate a preguntarle disponibilidad.`;

export async function POST({ request, cookies }) {
  const sessionCookie = cookies.get('kaptativa_session');
  if (!sessionCookie) {
    return Response.json({ error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
  }

  try {
    const { message, history = [] } = await request.json();

    if (!message?.trim()) {
      return Response.json({ error: 'Mensaje vacío' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return Response.json({ error: 'OPENAI_API_KEY no configurado en el servidor' }, { status: 500 });
    }

    const currentDateStr = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    });

    const systemPrompt =
      `${DEFAULT_BOT_PROMPT}\n\nINFORMACIÓN CRÍTICA DE FECHA/HORA:\nHoy es: ${currentDateStr}.${SCHEDULING_INSTRUCTIONS}`;

    // Convert simulator message history to OpenAI format (skip system/agent messages)
    const historyMessages = history
      .filter(m => m.sender === 'client' || m.sender === 'bot')
      .slice(-14)
      .map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text }));

    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...historyMessages,
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    if (!openAiRes.ok) {
      const errText = await openAiRes.text();
      console.error('[simulate-message] OpenAI error:', errText);
      return Response.json({ error: 'Error al conectar con OpenAI' }, { status: 502 });
    }

    const openAiData = await openAiRes.json();
    const rawReply = openAiData.choices[0]?.message?.content || '';

    // Parse secret scheduling tag
    const scheduleMatch = rawReply.match(/\[SCHEDULE_MEETING:\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2})\]/i);
    const reply = rawReply.replace(/\[SCHEDULE_MEETING:.*?\]/gi, '').trim();
    const scheduledDate = scheduleMatch ? scheduleMatch[1] : null;

    return Response.json({ reply, scheduledDate });

  } catch (err) {
    console.error('[simulate-message] Fatal error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
