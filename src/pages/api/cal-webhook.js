import { api } from '../../lib/appwrite.js';

export const prerender = false;

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
        console.warn('[Cal.com Webhook] Unauthorized request. Missing or invalid secret key.');
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized: Invalid secret key' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const payload = await request.json();
    console.log('[Cal.com Webhook] Evento recibido:', payload.triggerEvent);

    // We only care about BOOKING_CREATED
    if (payload.triggerEvent !== 'BOOKING_CREATED') {
      return new Response(JSON.stringify({ success: true, message: `Ignored event: ${payload.triggerEvent}` }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const bookingData = payload.payload?.booking;
    if (!bookingData) {
      return new Response(JSON.stringify({ success: false, error: 'No booking data found in payload' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Extract booking details
    const attendee = bookingData.attendees?.[0];
    const clientName = attendee?.name || 'Cliente de Cal.com';
    const clientEmail = attendee?.email || '';
    
    // Cal.com custom fields representation (phone fields)
    let clientPhone = attendee?.phoneNumber || '';
    if (bookingData.responses) {
      clientPhone = bookingData.responses.phone || bookingData.responses.whatsapp || clientPhone;
    }

    const startTime = new Date(bookingData.startTime);
    const dateStr = startTime.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    }) + ' hs';

    console.log('[Cal.com Webhook] Cita agendada por:', clientName, 'para:', dateStr, 'Tel:', clientPhone, 'Email:', clientEmail);

    // 1. Fetch CRM chats to find matching client
    let chatsList = [];
    try {
      const res = await api.db.listChats();
      chatsList = res.documents;
    } catch (err) {
      console.error('[Cal.com Webhook] Error listing chats:', err);
    }

    let matchedChat = null;
    if (clientPhone) {
      matchedChat = chatsList.find(c => cleanPhone(c.phone) === cleanPhone(clientPhone));
    }
    
    if (!matchedChat && clientEmail) {
      // Fallback: search Appwrite leads list by email
      try {
        const leadsRes = await api.db.listLeads();
        const matchedLead = leadsRes.documents.find(l => l.email === clientEmail);
        if (matchedLead) {
          matchedChat = chatsList.find(c => cleanPhone(c.phone) === cleanPhone(matchedLead.whatsapp));
        }
      } catch (err) {
        console.error('[Cal.com Webhook] Error matching email in leads:', err);
      }
    }

    // 2. Create the meeting in Appwrite with extra fields for reminders
    let meetingUrl = bookingData.location || '';
    if (bookingData.metadata && bookingData.metadata.videoCallUrl) {
      meetingUrl = bookingData.metadata.videoCallUrl;
    }
    if (bookingData.meetingUrl) {
      meetingUrl = bookingData.meetingUrl;
    }

    const meetingData = {
      client: matchedChat ? matchedChat.name : clientName,
      phone: clientPhone || (matchedChat ? matchedChat.phone : ''),
      date: dateStr,
      start_time: startTime.toISOString(),
      meeting_url: meetingUrl,
      reminder_sent: false,
      type: bookingData.title || 'Diagnóstico de Asistente IA (Cal.com)'
    };
    
    try {
      await api.db.createMeeting(meetingData);
      console.log('[Cal.com Webhook] Reunión agregada a Appwrite:', meetingData.client);
    } catch (err) {
      console.error('[Cal.com Webhook] Error creating meeting in Appwrite:', err);
    }

    // 3. Update chat stage and insert system notification
    if (matchedChat) {
      try {
        await api.db.updateChat(matchedChat.$id, {
          funnelStage: 'scheduled',
          assignedAgent: 'agent-diego', // Assign back to Diego on schedule
          status: 'humano'
        });

        // Insert notification message locally
        await api.db.createMessage({
          chatId: matchedChat.$id,
          sender: 'agent',
          text: `📅 *Cal.com*: Diagnóstico agendado para el ${dateStr}. Tipo: ${bookingData.title || 'Diagnóstico'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        console.log('[Cal.com Webhook] Chat del cliente actualizado a etapa Diagnóstico Agendado.');
      } catch (err) {
        console.error('[Cal.com Webhook] Error updating chat on booking creation:', err);
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Booking processed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[Cal.com Webhook] Fatal error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ==========================================
// BACKGROUND REMINDER SCHEDULER (10-MIN CHECK)
// ==========================================

async function checkAndSendMeetingReminders() {
  try {
    const now = new Date();
    // Check meetings starting in the next 15 minutes
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

    // 1. Fetch meetings from Appwrite / MockDB
    const meetingsRes = await api.db.listMeetings();
    const meetings = meetingsRes.documents || [];

    // 2. Filter upcoming meetings that haven't been reminded
    const upcomingMeetings = meetings.filter(m => {
      if (!m.start_time || !m.phone || !m.meeting_url || m.reminder_sent === true) return false;
      const startTime = new Date(m.start_time);
      // Scheduled for the future, but within 15 minutes
      return startTime <= fifteenMinutesFromNow && startTime > now;
    });

    for (const m of upcomingMeetings) {
      console.log(`[Reminder Scheduler] Sending WhatsApp reminder to ${m.client} (${m.phone}) for meeting at ${m.date}`);

      // Fetch dynamic settings from CRM
      let dbSettings = null;
      try {
        dbSettings = await api.db.getSettings();
      } catch (err) {
        console.error('[Reminder Scheduler] Error loading settings:', err);
      }

      const evoUrl = dbSettings?.evolution_url || 'https://api.evolution.kaptativa.com';
      const evoKey = dbSettings?.evolution_key || '';
      const evoInstance = dbSettings?.evolution_instance || 'kaptativa_sales_bot';
      const cleanNumber = m.phone.replace(/[^0-9]/g, '');

      if (!evoKey) {
        console.warn('[Reminder Scheduler] Missing Evolution API Key. Skipping.');
        continue;
      }

      const messageText = `👋 ¡Hola! Te recuerdo que en unos minutos comienza nuestra reunión de diagnóstico con Kaptativa.

Para unirte a la videollamada de Google Meet, haz clic en el siguiente enlace:
🔗 ${m.meeting_url}

¡Nos vemos en un momento!`;

      // Dispatch via Evolution API
      try {
        const targetUrl = `${evoUrl}/message/sendText/${evoInstance}`;
        const res = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'apikey': evoKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            number: cleanNumber,
            text: messageText,
            textMessage: {
              text: messageText
            }
          })
        });

        if (res.ok) {
          console.log(`[Reminder Scheduler] Reminder sent successfully to ${m.client}`);
          
          // Mark as sent in Appwrite/MockDB to prevent repeat reminders
          await api.db.updateMeeting(m.$id, { reminder_sent: true });
        } else {
          const errText = await res.text();
          console.error('[Reminder Scheduler] Evolution API error details:', errText);
        }
      } catch (err) {
        console.error('[Reminder Scheduler] Failed to send reminder via Evolution API:', err);
      }
    }
  } catch (err) {
    console.error('[Reminder Scheduler] Error in background loop:', err);
  }
}

// Initialize the background interval (runs every 5 minutes in standalone Node.js server)
const isServerEnv = typeof global !== 'undefined';
if (isServerEnv && !global.calReminderInterval) {
  // Run first check in 10 seconds, then every 5 minutes
  setTimeout(checkAndSendMeetingReminders, 10000);
  global.calReminderInterval = setInterval(checkAndSendMeetingReminders, 5 * 60 * 1000);
  console.log('[Reminder Scheduler] Global interval initialized (checking every 5 minutes).');
}
