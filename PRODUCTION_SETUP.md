# Guía de Configuración en Producción (VPS / Docker)

Esta guía explica detalladamente todos los pasos necesarios para desplegar y configurar el sistema de WhatsApp multiaugente de Kaptativa con automatización de IA y sincronización de citas de Cal.com.

---

## Paso 1: Configurar Variables de Entorno (`.env`)

En el servidor VPS, dentro de la carpeta raíz de tu aplicación Astro (`/kaptativa-app`), crea un archivo llamado `.env` con las siguientes variables:

```bash
# Puerto en el que correrá la aplicación Astro en producción (Stand-alone Node)
PORT=4321
HOST=0.0.0.0

# 1. Configuración de Appwrite (CRM)
PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1" # O tu VPS de Appwrite
PUBLIC_APPWRITE_PROJECT_ID="tu_proyecto_id_en_appwrite"
PUBLIC_APPWRITE_DATABASE_ID="kaptativa_db"
APPWRITE_API_KEY="tu_secret_api_key_del_servidor" # Generada en Appwrite > API Keys

# 2. Configuración del Asistente de IA (OpenAI)
OPENAI_API_KEY="sk-proj-tu-openai-token-secreto"

# 3. Configuración del Gateway de Evolution API
EVOLUTION_API_URL="https://api.evolution.kaptativa.com"
EVOLUTION_API_KEY="tu_apikey_global_de_evolution"
EVOLUTION_INSTANCE="kaptativa_sales_bot"

# 4. Token de Seguridad para los Webhooks (Clave Secreta compartida)
# Esta clave evitará que personas no autorizadas envíen falsos eventos a tu servidor.
WEBHOOK_SECRET="clave_secreta_para_cal_y_evolution"
```

---

## Paso 2: Vincular Evolution API (Webhook de WhatsApp)

Para que el servidor reciba los chats en tiempo real de WhatsApp, debes conectar la instancia de Evolution API a tu endpoint nativo:

1. Ingresa al panel de administración de **Evolution API** o haz una petición de configuración de Webhook.
2. Agrega un nuevo Webhook con los siguientes parámetros:
   * **URL del Webhook:** `https://tu-dominio.com/api/whatsapp-webhook?token=clave_secreta_para_cal_y_evolution`
   * **Eventos a escuchar:** Selecciona únicamente `MESSAGES_UPSERT` (o `messages.upsert`).
   * **Webhook Key (Headers):** Configura el header `webhook-key` con el valor de tu `WEBHOOK_SECRET` (ej: `clave_secreta_para_cal_y_evolution`).
   * **Estado:** `Activo`.

---

## Paso 3: Vincular Cal.com (Sincronización de Citas)

Para que el CRM mueva de forma autónoma a los leads a la etapa "Demo Agendada" cuando reservan una reunión:

1. Inicia sesión en **Cal.com** con tu cuenta.
2. Dirígete a **Ajustes > Desarrollador > Webhooks** (`Settings > Developer > Webhooks`).
3. Haz clic en **Añadir nuevo Webhook** (`Add new Webhook`):
   * **URL del Suscriptor:** `https://tu-dominio.com/api/cal-webhook?token=clave_secreta_para_cal_y_evolution`
   * **Eventos (Triggers):** Marca la casilla `Reserva creada` (`Booking created` / `BOOKING_CREATED`).
   * **Secret:** Configura el valor de tu `WEBHOOK_SECRET` (ej: `clave_secreta_para_cal_y_evolution`).
4. Haz clic en **Guardar**.
5. Asegúrate de que en tus formularios de Cal.com solicites el **Teléfono** (o Whatsapp) para que el webhook pueda emparejar al cliente por número. Si solo ingresan correo, el webhook buscará coincidencias en la lista de leads de Appwrite.

---

## Paso 4: Validar las Colecciones en Appwrite

Asegúrate de que en tu panel de Appwrite la base de datos `kaptativa_db` tenga creadas las siguientes colecciones:

1. **`whatsapp_settings`**:
   * ID del Documento: Debe existir un documento con ID `global_settings`.
   * Atributos (campos):
     * `bot_prompt` (String, largo)
     * `calendar_link` (String)
     * `knowledge_base` (String, largo)
     * `evolution_url` (String)
     * `evolution_key` (String)
     * `evolution_instance` (String)
     * `bot_active` (Boolean) - *Nuevo: para el switch general*.
2. **`whatsapp_chats`**:
   * Registra las conversaciones activas del embudo de chat.
   * Atributos: `name` (String), `phone` (String), `status` (String), `lastMessage` (String), `time` (String), `unread` (Boolean), `rubro` (String), `city` (String), `instagram` (String), `assignedAgent` (String), `funnelStage` (String).
3. **`whatsapp_meetings`**:
   * Registra las reservas de Cal.com o agendadas por la IA.
   * Atributos: `client` (String), `date` (String), `type` (String).
4. **`whatsapp_agents`**:
   * Atributos: `name` (String), `avatar` (String), `status` (String).

*Nota: La colección de `whatsapp_messages` (historial de mensajes individuales) no requiere crearse en Appwrite, ya que los mensajes son leídos en vivo desde Evolution API en caliente o persistidos en MockDB local, evitando sobrecargar de datos la base de datos de Appwrite.*

---

## Paso 5: Compilar y Ejecutar el Servidor en Producción

Accede a tu servidor VPS mediante SSH, ve a la carpeta del proyecto y ejecuta:

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar el build de producción
npm run build

# 3. Arrancar el servidor Astro Node stand-alone
node ./dist/server/entry.mjs
```

Puedes utilizar un gestor de procesos como **PM2** para que el servidor corra continuamente en segundo plano:

```bash
pm2 start ./dist/server/entry.mjs --name "kaptativa-crm" --update-env
```
