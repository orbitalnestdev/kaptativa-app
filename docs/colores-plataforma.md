# Esquemas de color de la plataforma Kaptativa

Para el producto (panel de administración, tienda, gestión, asistente IA) y para los sitios públicos de los clientes. Misma base que la web (`docs/diseno.md`): **un solo acento violeta**, neutros sin tinte azul y colores semánticos solo con significado.

Hay tres esquemas: **Panel claro** (predeterminado del administrador), **Panel oscuro** (opcional, mismo que la web) y **Sitio del cliente** (marca del cliente, no la nuestra).

## 1. Paleta base (igual en todos los esquemas)

```css
:root {
  /* Violeta de marca */
  --v-100: #EDE9FF; --v-200: #C9BFFF; --v-300: #A08CFF; --v-400: #8F75FF; --v-500: #7C5CFF;
  --v-600: #6A48F5; --v-700: #5B3FE0; --v-800: #4A32B8; --v-900: #2E1F7A;
  /* Neutros (sin tinte azul) */
  --n-0: #FFFFFF; --n-50: #F6F6F7; --n-100: #ECECEF; --n-200: #D4D4D9; --n-300: #B4B4BE; --n-400: #8E8E99;
  --n-500: #6E6E7A; --n-600: #52525B; --n-700: #2A2A31; --n-800: #1B1B20; --n-850: #151519; --n-900: #0F0F12;
  /* Semánticos: solo para estados y datos, nunca para decorar */
  --ok-500: #10B981; --ok-700: #047857;
  --warn-500: #F97316; --warn-700: #C2410C;
  --danger-500: #EF4444; --danger-700: #B91C1C;
  --info-500: #06B6D4; --info-700: #0E7490;
}
```

Roles de marca (no cambian con el tema): `--brand: var(--v-500)` para logo e íconos; `--brand-fill: var(--v-600)` para botones con texto blanco (5,4:1); `--brand-fill-hover: var(--v-700)`.

## 2. Panel claro (predeterminado del administrador)

El panel se usa horas seguidas y mezcla tablas, formularios y gráficos: el fondo claro cansa menos y da más contraste a los datos.

```css
[data-theme="light"] {
  --bg-app: var(--n-50);          /* fondo general */
  --bg-surface: var(--n-0);       /* tarjetas, tablas, modales */
  --bg-sunken: var(--n-100);      /* zonas hundidas: cabeceras de tabla, inputs deshabilitados */
  --bg-sidebar: var(--n-900);     /* barra lateral oscura: ancla visual de marca */
  --border: var(--n-100);
  --border-strong: var(--n-200);
  --text: var(--n-900);
  --text-2: var(--n-600);         /* 7,2:1 sobre n-50 */
  --text-3: var(--n-500);         /* 4,7:1: solo texto auxiliar ≥ 14 px */
  --text-on-brand: #FFFFFF;
  --link: var(--v-700);           /* 6,0:1 sobre n-50 */
  --brand-tint: var(--v-100);     /* fondo de fila seleccionada, chip activo */
  --brand-border: var(--v-200);
  --focus: 0 0 0 3px rgba(124, 92, 255, 0.35);
  /* Estados: texto oscuro sobre tinte claro (todos ≥ 4,5:1) */
  --ok-bg: #E6F7F1;     --ok-text: var(--ok-700);     --ok-border: #A7E9D2;
  --warn-bg: #FFF1E7;   --warn-text: var(--warn-700); --warn-border: #FFCBA8;
  --danger-bg: #FDECEC; --danger-text: var(--danger-700); --danger-border: #F7B4B4;
  --info-bg: #E3F7FB;   --info-text: var(--info-700);   --info-border: #A5E7F1;
  --neutral-bg: var(--n-100); --neutral-text: var(--n-600); --neutral-border: var(--n-200);
}
```

## 3. Panel oscuro (opcional) y web

Mismo esquema que `kaptativa.com`. Se activa por preferencia del usuario.

```css
[data-theme="dark"] {
  --bg-app: var(--n-900);
  --bg-surface: var(--n-800);
  --bg-sunken: var(--n-850);
  --bg-sidebar: var(--n-850);
  --border: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.12);
  --text: var(--n-0);
  --text-2: var(--n-300);         /* 9,3:1 */
  --text-3: var(--n-400);         /* 5,9:1 */
  --text-on-brand: #FFFFFF;
  --link: var(--v-300);           /* 7,0:1 */
  --brand-tint: rgba(124, 92, 255, 0.12);
  --brand-border: rgba(124, 92, 255, 0.25);
  --focus: 0 0 0 3px rgba(124, 92, 255, 0.45);
  --ok-bg: rgba(16, 185, 129, 0.12);  --ok-text: #34D399;  --ok-border: rgba(16, 185, 129, 0.3);
  --warn-bg: rgba(249, 115, 22, 0.14); --warn-text: #FB923C; --warn-border: rgba(249, 115, 22, 0.3);
  --danger-bg: rgba(239, 68, 68, 0.12); --danger-text: #F87171; --danger-border: rgba(239, 68, 68, 0.3);
  --info-bg: rgba(6, 182, 212, 0.12);  --info-text: #22D3EE; --info-border: rgba(6, 182, 212, 0.3);
  --neutral-bg: rgba(255, 255, 255, 0.06); --neutral-text: var(--n-300); --neutral-border: rgba(255, 255, 255, 0.12);
}
```

## 4. Qué significa cada color (vale para los dos temas)

| Color | Se usa para | No se usa para |
|---|---|---|
| Violeta | Acción principal, selección, foco, enlaces, ícono de marca | Fondos grandes dentro del panel, estados |
| Verde `ok` | Pagado, publicado, activo, stock disponible, sincronizado | Botones principales, decoración |
| Naranja `warn` | Pendiente, en preparación, stock bajo, vence pronto | Acento de sección |
| Rojo `danger` | Error, cancelado, impago, eliminar | Resaltar texto |
| Cian `info` | Solo datos y gráficos (segunda serie), avisos informativos | Íconos, botones, bordes de tarjetas |
| Neutro | Borrador, archivado, inactivo | — |

Reglas rápidas: un solo botón violeta por pantalla; los chips de estado llevan **texto + color**, nunca color solo (accesibilidad); el rojo se reserva para errores y acciones destructivas.

## 5. Gráficos y datos

Series categóricas, en este orden (funcionan en claro y oscuro):

```css
--chart-1: #7C5CFF;  /* violeta: la serie principal (ventas, ingresos) */
--chart-2: #06B6D4;  /* cian: comparación (período anterior, otro canal) */
--chart-3: #10B981;  /* verde: positivo / cobrado */
--chart-4: #F97316;  /* naranja: pendiente / atención */
--chart-5: #A08CFF;  /* violeta claro: subcategorías de la principal */
--chart-6: #8E8E99;  /* gris: "otros", sin dato */
```

Escala secuencial (mapas de calor, intensidad): `v-100 → v-300 → v-500 → v-700 → v-900`. Escala divergente (variación %): `danger-500 → n-200 → ok-500`. Las grillas y ejes van en `--border-strong`; las etiquetas en `--text-3`.

## 6. Sitio público del cliente (marca blanca)

El sitio y la tienda de cada cliente usan **la marca del cliente**, no la nuestra. El tema se arma desde un solo color que el cliente elige en el panel:

```css
.tenant {
  --tenant-primary: #2563EB;            /* lo define el cliente */
  --tenant-primary-text: #FFFFFF;        /* se calcula: blanco o n-900 según contraste ≥ 4,5:1 */
  --tenant-tint: color-mix(in srgb, var(--tenant-primary) 12%, white);
  --tenant-hover: color-mix(in srgb, var(--tenant-primary) 85%, black);
  --tenant-surface: #FFFFFF; --tenant-bg: #F6F6F7; --tenant-text: #0F0F12;   /* tema claro por defecto */
}
```

Reglas: los estados (`ok/warn/danger/info`) son los mismos que en el panel, así el cliente ve "pagado" del mismo color en su tienda y en su administración; el violeta Kaptativa aparece solo en el crédito "Hecho con Kaptativa"; si el cliente elige un color con contraste insuficiente para texto, el panel lo avisa y propone la variante oscura.

## 7. Contrastes verificados (WCAG AA)

| Combinación | Ratio |
|---|---|
| Blanco sobre v-600 (botón) | 5,4 |
| v-700 sobre n-50 (enlace, claro) | 6,0 |
| v-300 sobre n-900 (enlace, oscuro) | 7,0 |
| n-600 sobre n-50 (texto secundario, claro) | 7,2 |
| n-300 sobre n-900 (texto secundario, oscuro) | 9,3 |
| ok-700 sobre ok-bg claro | 5,9 |
| warn-700 sobre warn-bg claro | 5,1 |
| danger-700 sobre danger-bg claro | 6,3 |
| info-700 sobre info-bg claro | 5,3 |
| v-500 sobre n-900 | 4,4 — solo íconos y texto ≥ 24 px |

## 8. Cómo aplicarlo

1. Definir los tokens de la sección 1 en `:root` y los de 2 y 3 bajo `[data-theme]`; los componentes usan únicamente los roles (`--bg-surface`, `--text-2`, `--ok-bg`…), nunca los hex.
2. Tema claro por defecto en el panel; conmutador en el perfil del usuario; respetar `prefers-color-scheme` solo la primera vez.
3. Los chips de estado se arman con un solo componente que recibe `ok | warn | danger | info | neutral`.
4. En los sitios de clientes, el único color configurable es `--tenant-primary`; el resto se deriva.
