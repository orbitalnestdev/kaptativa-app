# 🚀 Kaptativa 2.0 — Sistemas Digitales e Integración de Procesos

Plataforma web de alta conversión e infraestructura digital para **Kaptativa®**, desarrollada con **Astro 5+**, **React 19**, **Node.js**, **Appwrite Cloud** e **Inteligencia Artificial (OpenAI / WhatsApp API)**.

---

## 📋 Requisitos Previos

- **Node.js**: `v22.12.0` o superior (Requerido)
- **npm**: `v10.0.0` o superior

---

## 🛠️ Instalación & Configuración Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/kaptativa-app.git
   cd kaptativa-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   Copiá el archivo `.env.example` para crear tu `.env` local:
   ```bash
   cp .env.example .env
   ```

   Completá las variables en el archivo `.env`:
   ```env
   PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
   PUBLIC_APPWRITE_PROJECT_ID="tu_project_id"
   PUBLIC_APPWRITE_DATABASE_ID="kaptativa_db"
   APPWRITE_API_KEY="tu_api_key_servidor"
   OPENAI_API_KEY="tu_openai_api_key"
   ```

---

## 💻 Comandos de Desarrollo & Producción

### 1. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente en `http://localhost:4321/`.

### 2. Verificación de Tipos (TypeScript & Astro Check)
```bash
npm run check
```

### 3. Ejecutar Pruebas Automatizadas
```bash
npm test
```

### 4. Compilar para Producción (Build)
```bash
npm run build
```
Genera la compilación optimizada en el directorio `./dist`.

### 5. Previsualizar la Compilación de Producción
```bash
npm run preview
```

---

## 🌐 Estructura del Proyecto

```
kaptativa-app/
├── public/              # Recursos estáticos (imágenes, logos, favicons, app.js)
├── src/
│   ├── components/      # Componentes modulares UI (Header, Hero, Servicios, Footer, etc.)
│   ├── data/            # Fuentes de datos estructuradas, i18n y artículos de Blog
│   ├── layouts/         # Layouts base (Layout.astro, AdminLayout.astro)
│   ├── lib/             # Cliente de Appwrite y utilidades de backend
│   ├── pages/           # Rutas estáticas y dinámicas (Home, Servicios, Blog, Contacto, Admin)
│   └── styles/          # Hojas de estilo globales (global.css)
├── .env.example         # Plantilla de variables de entorno (sin secretos)
├── .gitignore            # Archivos excluidos del control de versiones
├── astro.config.mjs     # Configuración de Astro & adaptadores (Node.js SSR + Sitemap)
├── package.json         # Scripts y dependencias del proyecto
└── tsconfig.json        # Configuración de TypeScript en modo estricto
```

---

## 🛡️ Licencia y Propiedad
Todos los derechos reservados © Kaptativa®.
