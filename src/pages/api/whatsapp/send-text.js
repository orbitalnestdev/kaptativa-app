export const prerender = false;
import { api } from '../../../lib/appwrite.js';

export async function POST({ request, cookies }) {
  const sessionCookie = cookies.get('kaptativa_session');
  if (!sessionCookie) {
    return Response.json({ error: 'No autorizado. Se requiere iniciar sesión.' }, { status: 401 });
  }

  try {
    const { number, text, instance } = await request.json();

    if (!number || !text) {
      return Response.json({ error: 'Faltan parámetros: number y text son requeridos.' }, { status: 400 });
    }

    // 1. Intentar resolver credenciales desde variables de entorno seguras en el servidor
    let url = import.meta.env.EVOLUTION_API_URL || '';
    let key = import.meta.env.EVOLUTION_API_KEY || '';
    let inst = instance || import.meta.env.EVOLUTION_API_INSTANCE || 'kaptativa_sales_bot';

    // 2. Si no están en entorno y Appwrite está configurado, obtenerlas de la base de datos
    if ((!url || !key) && api.isConfigured) {
      try {
        const settings = await api.db.getSettings();
        url = settings.evolution_url || url;
        key = settings.evolution_key || key;
        inst = inst || settings.evolution_instance || 'kaptativa_sales_bot';
      } catch (dbErr) {
        console.error('[whatsapp-proxy] Error al obtener settings de Appwrite:', dbErr.message);
      }
    }

    // 3. Fallback de desarrollo local: si no hay credenciales en servidor, permitir que el cliente
    // las envíe mediante cabeceras custom (solo para modo mock local)
    if (!url || !key) {
      const clientUrl = request.headers.get('x-evolution-url');
      const clientKey = request.headers.get('x-evolution-key');
      if (clientUrl && clientKey) {
        url = clientUrl;
        key = clientKey;
      }
    }

    if (!url || !key) {
      return Response.json({ error: 'Evolution API no configurada en el servidor (EVOLUTION_API_KEY/URL).' }, { status: 500 });
    }

    // 4. Despachar petición hacia Evolution API fuera del alcance del navegador
    const cleanNumber = number.replace(/[^0-9]/g, '');
    const response = await fetch(`${url}/message/sendText/${inst}`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: text,
        textMessage: {
          text: text
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Evolution API respondió ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return Response.json({ success: true, data });

  } catch (err) {
    console.error('[whatsapp-proxy] Error en proxy de mensajería:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
