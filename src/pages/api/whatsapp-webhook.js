import { api } from '../../lib/appwrite.js';

export const prerender = false;

// 1. Environmental settings for production
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || '';
const EVOLUTION_API_URL = import.meta.env.EVOLUTION_API_URL || 'https://api.evolution.kaptativa.com';
const EVOLUTION_API_KEY = import.meta.env.EVOLUTION_API_KEY || '';
const EVOLUTION_INSTANCE = import.meta.env.EVOLUTION_INSTANCE || 'kaptativa_sales_bot';
const DEFAULT_BOT_PROMPT = import.meta.env.BOT_PROMPT || 
  `Eres el asistente virtual inteligente de Kaptativa (empresa de desarrollo de software y automatizaciones con IA).
Tu objetivo es calificar al lead conversando amigablemente y coordinar por chat una videollamada corta de 15 minutos para un diagnóstico.
Sé breve, profesional y directo. No uses textos largos ni envíes enlaces de reservas.
Si el usuario pregunta precios, menciónale los precios base:
- Diseños web profesionales desde USD 600.
- Automatizaciones de procesos desde USD 500.
- Agentes de WhatsApp con IA entrenados a medida desde USD 800.
Intenta descubrir su rubro de negocio y en qué le gustaría automatizar.`;

// Helper to sanitize phone formatting
const cleanPhone = (phone) => phone ? phone.replace(/[^0-9]/g, '') : '';

export async function POST({ request }) {
  try {
    // 0. Security Verification (Optional webhook key/token check)
    const WEBHOOK_SECRET = import.meta.env.WEBHOOK_SECRET || '';
    if (WEBHOOK_SECRET) {
      const headerKey = request.headers.get('webhook-key') || request.headers.get('apikey');
      const url = new URL(request.url);
      const queryKey = url.searchParams.get('key') || url.searchParams.get('token');
      
      if (headerKey !== WEBHOOK_SECRET && queryKey !== WEBHOOK_SECRET) {
        console.warn('[Webhook] Unauthorized request. Missing or invalid secret key.');
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized: Invalid secret key' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const payload = await request.json();
    console.log('[Webhook WhatsApp] Evento recibido:', payload.event, 'Instancia:', payload.instance);

    // Validate payload structure from Evolution API (must be messages.upsert event)
    if (!payload.data || !payload.data.key) {
      return new Response(JSON.stringify({ success: true, message: 'Ignored non-message event' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { key, pushName, message, messageTimestamp } = payload.data;
    const fromMe = key.fromMe;
    const remoteJid = key.remoteJid;
    const rawNumber = remoteJid.split('@')[0];

    // Extract text content from message payload (supports text, conversation, and captions)
    let textMessage = '';
    if (message) {
      textMessage = message.conversation || 
                    message.extendedTextMessage?.text || 
                    message.imageMessage?.caption || 
                    message.videoMessage?.caption || 
                    '';
    }

    // Ignore empty messages (reactions, system status logs, document files without text, etc.)
    if (!textMessage.trim()) {
      return new Response(JSON.stringify({ success: true, message: 'Empty text message ignored' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const timeStr = new Date(messageTimestamp ? messageTimestamp * 1000 : Date.now())
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Fetch dynamic settings from Appwrite / MockDB in real-time
    let dbSettings = null;
    try {
      dbSettings = await api.db.getSettings();
    } catch (err) {
      console.warn('[Webhook] Could not load global settings from DB, using env/code fallbacks:', err.message);
    }

    const botActive = dbSettings?.bot_active !== false;
    const botPrompt = dbSettings?.bot_prompt || DEFAULT_BOT_PROMPT;
    const knowledgeBase = dbSettings?.knowledge_base || '';
    const targetEvoUrl = dbSettings?.evolution_url || EVOLUTION_API_URL;
    const targetEvoKey = dbSettings?.evolution_key || EVOLUTION_API_KEY;
    const targetEvoInstance = dbSettings?.evolution_instance || EVOLUTION_INSTANCE;

    // Fetch existing active chats from CRM to find matching client
    let chatsList = [];
    try {
      const res = await api.db.listChats();
      chatsList = res.documents;
    } catch (err) {
      console.error('[Webhook] Error listing active chats from Appwrite:', err);
    }

    const matchedChat = chatsList.find(c => cleanPhone(c.phone) === cleanPhone(rawNumber));

    // Load conversation history stored on the chat document (server-accessible, avoids localStorage)
    let contextHistory = [];
    if (matchedChat?.context_history) {
      try { contextHistory = JSON.parse(matchedChat.context_history); } catch (e) { contextHistory = []; }
    }

    // CASE A: MESSAGE SENT BY AGENT/BOT (fromMe = true)
    if (fromMe) {
      if (matchedChat) {
        const lastMsgAppwrite = matchedChat.lastMessage || '';
        const isSelfSent = textMessage.trim() === lastMsgAppwrite.trim();

        // If the outgoing message does NOT match the last message recorded in Appwrite,
        // it means a human agent answered directly from their mobile phone or WhatsApp Web
        if (!isSelfSent && (matchedChat.assignedAgent === 'agent-bot' || matchedChat.status === 'bot')) {
          console.log('[Webhook] Human takeover detected on cell phone. Pausing bot for:', matchedChat.name);
          try {
            await api.db.updateChat(matchedChat.$id, {
              lastMessage: textMessage,
              time: timeStr,
              assignedAgent: 'agent-diego', // Assign to default human Diego
              status: 'humano',
              funnelStage: 'waiting', // Wait for prospect's response
              unread: false
            });

            // Insert system notification in chat history
            await api.db.createMessage({
              chatId: matchedChat.$id,
              sender: 'agent',
              text: `📍 *Sistema*: Chatbot pausado por respuesta externa (celular o web).`,
              time: timeStr
            });
          } catch (err) {
            console.error('[Webhook] Error executing human takeover in Appwrite:', err);
          }
        } else {
          // Just sync the last message and timestamp in Appwrite (standard bot/cockpit message)
          try {
            await api.db.updateChat(matchedChat.$id, {
              lastMessage: textMessage,
              time: timeStr,
              unread: false
            });
          } catch (err) {
            console.error('[Webhook] Error updating chat on fromMe sync:', err);
          }
        }
      }
      return new Response(JSON.stringify({ success: true, message: 'Outgoing message synced successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // CASE B: INCOMING MESSAGE FROM CLIENT (fromMe = false)
    let activeChat = matchedChat;

    if (!activeChat) {
      // 1. Create new CRM chat in Appwrite if client is not in pipeline
      try {
        const newChatData = {
          name: pushName || `Contacto ${rawNumber}`,
          phone: `+${rawNumber}`,
          status: 'bot',
          lastMessage: textMessage,
          time: timeStr,
          unread: true,
          rubro: 'Desconocido',
          city: 'Desconocida',
          assignedAgent: 'agent-bot',
          funnelStage: 'qualifying'
        };
        activeChat = await api.db.createChat(newChatData);
        console.log('[Webhook] Nuevo chat creado en CRM:', activeChat.name);
      } catch (err) {
        console.error('[Webhook] Error creating new chat in Appwrite:', err);
        // Fallback placeholder object if DB call fails to prevent server crash
        activeChat = {
          $id: `temp-${rawNumber}`,
          name: pushName || `Contacto ${rawNumber}`,
          phone: `+${rawNumber}`,
          status: 'bot',
          assignedAgent: 'agent-bot'
        };
      }
    } else {
      // 2. Update existing chat status in Appwrite
      try {
        await api.db.updateChat(activeChat.$id, {
          lastMessage: textMessage,
          time: timeStr,
          unread: true
        });
      } catch (err) {
        console.error('[Webhook] Error updating existing chat in Appwrite:', err);
      }
    }

    // 3. Save incoming message locally in MockDB (prevents Appwrite db bloat)
    try {
      await api.db.createMessage({
        chatId: activeChat.$id || activeChat.id,
        sender: 'client',
        text: textMessage,
        time: timeStr
      });
    } catch (err) {
      console.error('[Webhook] Error saving message to local log:', err);
    }

    // 4. Trigger Autonomous AI Response if assigned agent is the Bot
    if (activeChat.assignedAgent === 'agent-bot' || activeChat.status === 'bot') {
      if (!botActive) {
        console.log('[Webhook] Global bot status is DEACTIVATED. Skipping bot auto-reply.');
        return new Response(JSON.stringify({ success: true, message: 'Chat updated, but bot is disabled globally' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!OPENAI_API_KEY) {
        console.warn('[Webhook] OpenAI API Key is missing. Skipping bot response.');
        return new Response(JSON.stringify({ success: true, message: 'Chat updated, but bot disabled (no OpenAI key)' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      let botReply = '';
      try {
        const currentDateStr = new Date().toLocaleDateString('es-AR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Argentina/Buenos_Aires'
        });

        const extendedSystemPrompt = `${botPrompt}
\nBASE DE CONOCIMIENTOS DE LA EMPRESA:
${knowledgeBase}
\nINFORMACIÓN CRÍTICA DE FECHA/HORA:
Hoy es: ${currentDateStr}.
\nINSTRUCCIÓN DE AGENDAMIENTO CONVERSACIONAL (CRÍTICA):
1. NO envíes ningún enlace de reservas (como Cal.com). El agendamiento se hace 100% conversacional en el chat.
2. Si el cliente solicita una reunión, llamada o diagnóstico, pero no ha especificado una fecha y hora exactas, DEBES preguntarle por su disponibilidad o proponerle dos opciones de horario de lunes a viernes entre las 10:00 y las 17:00 hs.
3. SOLO cuando el cliente proponga una fecha y hora exactas (ej. "el lunes a las 11:00 hs") o confirme una de tus propuestas, debes confirmar la cita amigablemente y obligatoriamente escribir al final de tu respuesta la etiqueta secreta en este formato exacto:
[SCHEDULE_MEETING: YYYY-MM-DD HH:MM]
Reemplaza YYYY-MM-DD por el año, mes y día acordado y HH:MM por la hora en formato 24 horas.
4. NUNCA escribas la etiqueta [SCHEDULE_MEETING] si el cliente no ha proporcionado o confirmado explícitamente una fecha y hora para la cita. Si solo dice "quiero agendar", limítate a preguntarle disponibilidad.`;

        // Append incoming message to history and trim to last 16 entries (8 exchanges)
        contextHistory.push({ role: 'user', content: textMessage });
        if (contextHistory.length > 16) contextHistory = contextHistory.slice(-16);

        // Fetch completion directly from OpenAI REST API (keeps package dependencies clean)
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: extendedSystemPrompt },
              ...contextHistory
            ],
            temperature: 0.7
          })
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          botReply = openAiData.choices[0]?.message?.content || '';
        } else {
          const errText = await openAiRes.text();
          console.error('[Webhook] OpenAI API error details:', errText);
        }
      } catch (aiErr) {
        console.error('[Webhook] Failed to connect to OpenAI API:', aiErr);
      }

      if (botReply.trim()) {
        // Parse secret schedule tag: [SCHEDULE_MEETING: YYYY-MM-DD HH:MM]
        const scheduleMatch = botReply.match(/\[SCHEDULE_MEETING:\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s+[0-9]{2}:[0-9]{2})\]/i);
        let cleanReply = botReply;
        let scheduleTimeStr = null;

        if (scheduleMatch) {
          scheduleTimeStr = scheduleMatch[1];
          cleanReply = botReply.replace(/\[SCHEDULE_MEETING:.*?\]/gi, '').trim();
        }

        const botTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // A) Save AI response locally in MockDB (prevents Appwrite db bloat)
        try {
          await api.db.createMessage({
            chatId: activeChat.$id || activeChat.id,
            sender: 'bot',
            text: cleanReply,
            time: botTimeStr
          });
        } catch (err) {
          console.error('[Webhook] Error saving bot response locally:', err);
        }

        // B) Update last message metadata in Appwrite, persisting conversation history
        try {
          // Append bot reply to history and persist on the chat document
          contextHistory.push({ role: 'assistant', content: cleanReply });
          if (contextHistory.length > 16) contextHistory = contextHistory.slice(-16);

          const updateFields = {
            lastMessage: cleanReply,
            time: botTimeStr,
            unread: false,
            context_history: JSON.stringify(contextHistory)
          };

          if (scheduleTimeStr) {
            updateFields.assignedAgent = 'agent-diego'; // Auto takeover by Diego upon scheduling
            updateFields.status = 'humano';
            updateFields.funnelStage = 'scheduled';
          }

          await api.db.updateChat(activeChat.$id, updateFields);
        } catch (err) {
          console.error('[Webhook] Error updating chat with bot response metadata:', err);
        }

        // C) Create the meeting in Appwrite if scheduled
        if (scheduleTimeStr) {
          try {
            const [datePart, timePart] = scheduleTimeStr.split(/\s+/);
            const [year, month, day] = datePart.split('-');
            const [hour, minute] = timePart.split(':');
            
            const bookingDate = new Date(year, month - 1, day, hour, minute);
            const formattedDate = `${day}/${month} - ${hour}:${minute} hs`;
            
            const meetingData = {
              client: activeChat.name,
              phone: activeChat.phone,
              date: formattedDate,
              start_time: bookingDate.toISOString(),
              meeting_url: dbSettings?.calendar_link || 'https://cal.com/kaptativa/diagnostico',
              reminder_sent: false,
              type: 'Diagnóstico de Asistente IA (WhatsApp)'
            };

            await api.db.createMeeting(meetingData);
            console.log('[Webhook] Conversational meeting created automatically:', meetingData);

            // Also create a system log message in the chat history
            await api.db.createMessage({
              chatId: activeChat.$id || activeChat.id,
              sender: 'agent',
              text: `📅 *Sistema*: Diagnóstico agendado automáticamente por la IA para el ${formattedDate}.`,
              time: botTimeStr
            });

          } catch (meetErr) {
            console.error('[Webhook] Failed to create meeting dynamically:', meetErr);
          }
        }

        // D) Dispatch response to WhatsApp via Evolution API gateway (send clean reply without the tag)
        const sendToWhatsApp = async (number, text) => {
          const targetUrl = `${targetEvoUrl}/message/sendText/${targetEvoInstance}`;
          const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'apikey': targetEvoKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ number, text, textMessage: { text } })
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('[Webhook] Evolution API dispatch error:', errText);
          }
        };

        try {
          console.log('[Webhook] Dispatching response via Evolution API to:', rawNumber);
          await sendToWhatsApp(rawNumber, cleanReply);

          // If a meeting was just scheduled, send the Google Calendar booking link
          // so the client can confirm the slot and the event is created in Google Calendar
          if (scheduleTimeStr) {
            const calendarUrl = dbSettings?.google_calendar_url || dbSettings?.calendar_link || '';
            if (calendarUrl && !calendarUrl.includes('meet.google.com')) {
              const calMsg = `📅 Para confirmar tu lugar, completá el formulario de reserva:\n${calendarUrl}\n\n¡Te esperamos!`;
              await sendToWhatsApp(rawNumber, calMsg);
              await api.db.createMessage({
                chatId: activeChat.$id || activeChat.id,
                sender: 'bot',
                text: calMsg,
                time: botTimeStr
              });
            }
          }
        } catch (evoErr) {
          console.error('[Webhook] Failed to dispatch message via Evolution API:', evoErr);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[Webhook] Fatal processing error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
