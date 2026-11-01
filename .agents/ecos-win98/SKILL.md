---
name: ecos-win98
description: Construye y extiende ECOS, una app web en Next.js que simula el escritorio de Windows 98 con estética Y2K, donde cada funcionalidad es una carpeta/ventana del "sistema operativo". Úsala siempre que el usuario trabaje en ECOS o pida cualquier cosa del escritorio, ventanas arrastrables, barra de tareas, menú Inicio, iconos, carpetas (BANK OF MEMORIES con Carousel y Games, If love were songs, <3, Our Love), paleta Windows 98, selector de idioma ES/EN con n8n, o cualquier componente con look retro de Windows 98 / Y2K, aunque no diga "ECOS" explícitamente. Impone la restricción de NO usar POO (sin clases).
---

# ECOS — Escritorio Windows 98 / Y2K en Next.js

ECOS es una app web que **se comporta como un sistema operativo Windows 98**: arranca en el escritorio, cada funcionalidad es una carpeta que abre una ventana, y toda la interfaz (iconos, ventanas, barra de tareas, menú Inicio, diálogos) imita el SO original con la paleta de colores de Windows 98 y toques Y2K.

Esta skill define **qué construir, cómo estructurarlo y qué NO hacer**. Léela completa antes de escribir código.

---

## 1. Reglas innegociables

1. **Sin POO.** Prohibido: `class`, `extends`, `implements`, `this`, `super`, herencia, patrones basados en instancias (`new MiServicio()`), decoradores, singletons de clase.
   - Usa: **funciones**, **módulos ES**, **objetos planos**, **componentes funcionales de React + hooks**, **reducers puros** y **composición**.
   - `type` / `interface` de TypeScript son válidos **solo para describir la forma de datos** (no para modelar comportamiento con jerarquías).
   - Sí se permiten APIs nativas que requieren `new` (`new Date()`, `new Map()`, `new URL()`, `new Audio()`, `new Set()`): no es POO propia, es uso de la plataforma. **No** crees clases propias.
2. **Todo se ve y se siente como Windows 98.** Nada de estilos modernos (sin bordes redondeados, sin sombras difusas, sin gradientes suaves salvo el de la barra de título, sin animaciones tipo "spring"). Esquinas rectas, bordes biselados de 2 px, fuente pixelada.
3. **Cada funcionalidad es una carpeta** en el escritorio que abre una ventana. No agregues rutas de Next.js por funcionalidad: el "SO" vive en una sola página (`/`) y las ventanas son estado.
4. **Solo desarrolla lo que el usuario ya especificó.** Las carpetas de contenido están **planificadas pero NO especificadas** (ver sección 4). Créalas como *stubs* (icono + ventana con mensaje "En construcción"). **No inventes** carruseles, juegos, reproductores, formularios de comentarios ni galerías hasta que el usuario dé la especificación.
5. **Front primero, sin base de datos (fase actual).** Se integra todo el front antes de conectar BD. Prohibido instalar o configurar Supabase, Prisma, Firebase, SQL, ORMs o endpoints de persistencia hasta que el usuario lo pida. Lo dinámico (p. ej. los comentarios) se prepara con una capa de datos simulada (sección 12).
6. **Idioma ES/EN vía n8n** (ver sección 7). Ningún texto visible puede estar hardcodeado en un componente, **incluidos los nombres de las carpetas**: todo pasa por la función `t(key)`.
7. **Paleta oficial de Windows 98** únicamente, a través de tokens mapeados a TailwindCSS (ver sección 5 y `references/win98-tokens.css`). Prohibido usar la paleta por defecto de Tailwind (`bg-gray-200`, `text-blue-600`…), `rounded-*`, `shadow-*` y colores sueltos (`#fff`, `gray`, etc.) fuera de los tokens.

---

## 2. Stack y convenciones

- Stack definido por el usuario: **TypeScript + Next.js (App Router, versión estable actual) + TailwindCSS**.
- El escritorio es **Client Components** (`'use client'`) porque depende de estado, arrastre y eventos. `app/page.tsx` y `app/layout.tsx` pueden ser Server Components que solo montan `<Desktop />`.
- Estado global del SO: **`useReducer` + Context** con un **reducer puro** (sin librerías). Si el usuario pide otra cosa (p. ej. Zustand), respétalo, pero siempre con funciones, nunca con clases.
- Estilos: **TailwindCSS** para todo (layout, espaciado, colores, tipografía). Los colores salen **solo** de los tokens Win98 mapeados al tema de Tailwind (`bg-face`, `text-window-text`, `bg-desktop`…). Los biseles 3D (que Tailwind no cubre bien) viven como utilidades propias `win-raised`, `win-pressed`, `win-sunken` y `win-etched` (declaradas con `@utility`, así admiten variantes como `active:`), más unas pocas clases compuestas (`.win-button`, `.win-titlebar`, `.desktop-icon`) en `@layer components`; todo se combina con utilidades Tailwind. Sin CSS Modules ni librerías de estilos adicionales.
- Nombres de archivos de componentes en `PascalCase.tsx`; utilidades y hooks en `camelCase.ts`.
- Un componente por archivo, props tipadas con `type`, sin `React.FC` obligatorio.
- Comentarios del código en **español**; identificadores en **inglés** (`openWindow`, `focusWindow`, `desktopIcons`).

### Estructura de carpetas

```
src/
├─ app/
│  ├─ layout.tsx            # fuentes, <html lang>, tokens globales
│  ├─ page.tsx              # monta <Desktop />
│  ├─ globals.css           # @import "tailwindcss" + tokens Win98
│  └─ api/
│     └─ i18n/route.ts      # proxy a n8n (webhook) con fallback local
├─ os/
│  ├─ Desktop.tsx           # fondo teal + iconos + ventanas + taskbar
│  ├─ DesktopIcon.tsx       # icono 32x32 + etiqueta, selección y doble clic
│  ├─ Window.tsx            # ventana genérica (título, min/max/cerrar, arrastre)
│  ├─ Taskbar.tsx           # botón Inicio, botones de ventanas, bandeja, reloj
│  ├─ StartMenu.tsx         # menú Inicio con submenús
│  ├─ ContextMenu.tsx       # clic derecho en escritorio/iconos
│  ├─ FolderExplorer.tsx    # ventana genérica que lista subcarpetas (p. ej. BANK OF MEMORIES)
│  ├─ MessageBox.tsx        # diálogos modales (Aceptar / Cancelar)
│  ├─ BootScreen.tsx        # pantalla de arranque "Starting ECOS..." (opcional)
│  ├─ state/
│  │  ├─ osReducer.ts       # reducer puro: abrir, cerrar, minimizar, enfocar...
│  │  ├─ OsContext.tsx      # Provider + hook useOs()
│  │  └─ types.ts           # tipos de datos (WindowState, FolderDef...)
│  └─ hooks/
│     ├─ useDrag.ts         # arrastre de ventanas con pointer events
│     └─ useClock.ts        # reloj de la bandeja
├─ folders/
│  ├─ registry.ts           # ÚNICA fuente de verdad de las carpetas (sección 4)
│  ├─ BankOfMemories/
│  │  ├─ Carousel/          # stub por ahora (fotos con carrusel)
│  │  └─ Games/             # stub por ahora (juegos Friv)
│  ├─ IfLoveWereSongs/      # stub por ahora
│  ├─ Comments/             # stub por ahora (carpeta "<3")
│  └─ OurLove/              # stub por ahora
├─ data/                    # frontera de datos (mock por ahora, BD después)
├─ i18n/
│  ├─ dictionaries/es.ts    # objeto plano con textos ES (fallback)
│  ├─ dictionaries/en.ts    # objeto plano con textos EN (fallback)
│  ├─ I18nContext.tsx       # Provider + hook useT()
│  └─ fetchMessages.ts      # función que pide mensajes al proxy /api/i18n
└─ styles/
   └─ win98-tokens.css      # copia de references/win98-tokens.css (tokens + @theme de Tailwind)
public/
├─ icons/                   # PNG pixel-art 32x32 (y 16x16 para la barra)
└─ sounds/                  # opcional: arranque, error, clic
```

---

## 3. Componentes del "sistema operativo"

Construye en este orden. No pases al siguiente hasta que el anterior funcione.

### 3.1 Desktop
- Fondo `--desktop` (teal `#008080`). Ocupa `100dvh` x `100dvw`, `overflow: hidden`, sin scroll.
- Iconos en **rejilla vertical** arriba a la izquierda (como el SO real), columnas de ~75 px de ancho, 32x32 de icono + etiqueta de máximo 2 líneas.
- Etiqueta: texto blanco con sombra 1 px negra; al seleccionar, fondo `--highlight` (azul marino) con texto blanco y **borde punteado** de 1 px.
- Un clic selecciona, **doble clic abre** (en táctil: un toque selecciona, segundo toque abre).
- Clic en el fondo deselecciona todo. Clic derecho abre `ContextMenu` (opciones: *Organizar iconos*, *Actualizar*, *Propiedades* — mínimas y funcionales o deshabilitadas en gris).

### 3.2 Window
- Estructura: borde exterior biselado → barra de título → (opcional) barra de menú → área de contenido (hundida, fondo `--window`) → (opcional) barra de estado.
- Barra de título: degradado horizontal `--title-active-start → --title-active-end` con texto blanco en negrita, icono 16x16 a la izquierda y botones **Minimizar / Maximizar-Restaurar / Cerrar** a la derecha (botones biselados 16x14).
- Ventana **inactiva**: degradado gris (`--title-inactive-*`).
- Funciones obligatorias: arrastrar por la barra de título, enfocar al hacer clic (sube `zIndex`), minimizar (desaparece pero queda su botón en la taskbar), maximizar/restaurar (guarda posición previa), cerrar, doble clic en barra de título = maximizar.
- Al abrir, cada ventana se cascadea (+24 px x/y respecto a la anterior) y nunca se sale de la pantalla.
- Arrastre con **Pointer Events** (`setPointerCapture`) para que funcione con ratón y táctil.
- **En pantallas ≤ 768 px**: las ventanas se abren maximizadas por defecto (menos la barra de tareas) y el arrastre se desactiva.

### 3.3 Taskbar
- Fija abajo, 28–30 px de alto, biselado elevado (`--face`).
- Izquierda: botón **Inicio** (logo + "Start"/"Inicio" en negrita). Luego separador y **un botón por ventana abierta** (el activo se ve hundido, el resto elevado; clic = enfocar/minimizar-restaurar).
- Derecha: **bandeja del sistema** hundida con selector de idioma (`ES`/`EN`), un icono de volumen (decorativo) y **reloj** HH:MM (usa `Intl.DateTimeFormat` con el idioma activo).

### 3.4 StartMenu
- Barra vertical azul a la izquierda con el texto "ECOS" rotado (estilo "Windows 98").
- Entradas: una por cada carpeta de `registry.ts`, más *Configuración → Idioma (Español / English)*, *Acerca de ECOS* y *Apagar…* (abre `MessageBox` con una broma Y2K, p. ej. "Ahora es seguro apagar su equipo").
- Se cierra al hacer clic fuera o con `Esc`.

### 3.5 MessageBox / diálogos
- Ventana modal sin botones min/max, con icono (info/advertencia/error) y botones biselados. El botón por defecto tiene borde negro extra.
- Úsalo para: carpetas en construcción, "Acerca de ECOS", errores de red de n8n.

### 3.6 Extras Y2K (opcionales, solo si el usuario los pide o encajan sin romper el SO)
Pantalla de arranque con barra de progreso a bloques, sonido de inicio (con interruptor, **nunca autoplay** sin interacción previa), contador de visitas estilo GIF, texto "Mejor visto en 800x600", fondo de pantalla seleccionable. No los agregues por iniciativa propia.

---

## 4. Carpetas (registro único)

Toda carpeta se define **solo** en `src/folders/registry.ts` como **datos** (objetos planos), no como clases. Una carpeta puede tener `children` (subcarpetas): en ese caso su ventana es un `FolderExplorer` genérico que lista los hijos como iconos, y cada hijo se abre con doble clic en su propia ventana (como el Explorador real).

```ts
// src/os/state/types.ts  (solo forma de datos)
export type FolderDef = {
  id: string;
  nameKey: string;                       // clave i18n, p. ej. 'folder.bankOfMemories'
  icon: string;                          // ruta en /public/icons
  status: 'planned' | 'ready';           // 'planned' = stub
  component?: () => Promise<{ default: React.ComponentType }>; // carpetas hoja
  children?: FolderDef[];                // carpetas contenedoras
};
```

```ts
// src/folders/registry.ts
import type { FolderDef } from '@/os/state/types';

export const folders: FolderDef[] = [
  {
    id: 'bank-of-memories',
    nameKey: 'folder.bankOfMemories',        // "BANK OF MEMORIES"
    icon: '/icons/folder-memories.png',
    status: 'ready',                         // contenedor: solo lista sus hijos
    children: [
      {
        id: 'memories-carousel',
        nameKey: 'folder.carousel',          // "Carousel"
        icon: '/icons/folder-photos.png',
        status: 'planned',
        component: () => import('./BankOfMemories/Carousel/Carousel'),
      },
      {
        id: 'memories-games',
        nameKey: 'folder.games',             // "Games"
        icon: '/icons/folder-games.png',
        status: 'planned',
        component: () => import('./BankOfMemories/Games/Games'),
      },
    ],
  },
  {
    id: 'if-love-were-songs',
    nameKey: 'folder.ifLoveWereSongs',       // "If love were songs"
    icon: '/icons/folder-music.png',
    status: 'planned',
    component: () => import('./IfLoveWereSongs/IfLoveWereSongs'),
  },
  {
    id: 'comments',
    nameKey: 'folder.comments',              // "<3"
    icon: '/icons/folder-heart.png',
    status: 'planned',
    component: () => import('./Comments/Comments'),
  },
  {
    id: 'our-love',
    nameKey: 'folder.ourLove',               // "Our Love"
    icon: '/icons/folder-love.png',
    status: 'planned',
    component: () => import('./OurLove/OurLove'),
  },
];
```

### Carpetas definidas

| ID | Nombre visible (clave i18n) | Contenido previsto (aún NO desarrollar) |
|---|---|---|
| `bank-of-memories` | **BANK OF MEMORIES** (`folder.bankOfMemories`) | Carpeta contenedora de Carousel y Games |
| `memories-carousel` | **Carousel** (`folder.carousel`) | Fotos con carrusel |
| `memories-games` | **Games** (`folder.games`) | Juegos tipo Friv |
| `if-love-were-songs` | **If love were songs** (`folder.ifLoveWereSongs`) | Canciones dedicadas |
| `comments` | **<3** (`folder.comments`) | Comentarios que dejarán las personas invitadas |
| `our-love` | **Our Love** (`folder.ourLove`) | Fotos especiales |

> **Los nombres de carpeta están en inglés por defecto, pero SÍ son traducibles:** pasan por `t()` y n8n puede devolver otra versión según el idioma activo. Los diccionarios locales (`en.ts` y también `es.ts`) guardan el inglés como respaldo hasta que el usuario defina versiones en español; si n8n no devuelve una clave de carpeta, se muestra el inglés. Nunca escribas el nombre directamente en el JSX.

### Comportamiento de un stub (`status: 'planned'`)
Ventana con el icono de la carpeta, el nombre y un texto centrado tipo "Esta carpeta está en construcción" (traducido con `t()`), más un icono de reloj de arena. Nada más.

### Cuando el usuario especifique una carpeta
1. Cambia su `status` a `'ready'`.
2. Implementa el contenido **dentro de su propia carpeta** (`src/folders/<Nombre>/`) con componentes funcionales y hooks.
3. No toques `os/` salvo que la nueva funcionalidad requiera una capacidad del SO (p. ej. un reproductor necesita un icono en la bandeja); en ese caso, explícalo antes.
4. Mantén el look Win98: un carrusel debe verse como un visor de imágenes de Windows 98 (marco hundido, botones biselados ◄ ►), un reproductor como el Reproductor de CD/Winamp-ish, los comentarios como un Bloc de notas o un chat estilo ventana, etc.

---

## 5. Paleta y estilo Windows 98

Los tokens oficiales están en `references/win98-tokens.css`. Cópialos a `src/styles/win98-tokens.css` e impórtalos en `globals.css` justo después de Tailwind:

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "../styles/win98-tokens.css";
```

El archivo declara los tokens como variables CSS, **borra la paleta, los radios y las sombras por defecto de Tailwind** (`--color-*: initial`, `--radius-*: initial`, `--shadow-*: initial`) y los vuelve a exponer con `@theme inline`, de modo que solo existen utilidades como `bg-desktop`, `bg-face`, `text-window-text`, `bg-highlight`, `text-highlight-text`, `bg-window`, etc. (sintaxis de Tailwind v4; si el proyecto usa v3, mapea los mismos tokens en `tailwind.config.ts` → `theme.extend.colors` con `var(--token)`). Resumen:

| Token | Valor | Uso |
|---|---|---|
| `--desktop` | `#008080` | Fondo del escritorio |
| `--face` | `#C0C0C0` | Superficie de ventanas, botones, taskbar |
| `--highlight-3d` | `#FFFFFF` | Borde claro del bisel |
| `--light-3d` | `#DFDFDF` | Bisel interior claro |
| `--shadow-3d` | `#808080` | Bisel interior oscuro |
| `--dark-shadow-3d` | `#0A0A0A` | Borde exterior oscuro |
| `--title-active-start` / `-end` | `#000080` → `#1084D0` | Barra de título activa |
| `--title-inactive-start` / `-end` | `#808080` → `#B5B5B5` | Barra de título inactiva |
| `--title-text` | `#FFFFFF` | Texto de título |
| `--window` / `--window-text` | `#FFFFFF` / `#000000` | Áreas de contenido |
| `--highlight` / `--highlight-text` | `#000080` / `#FFFFFF` | Selección |
| `--tooltip-bg` | `#FFFFE1` | Tooltips |

### Biseles (clases utilitarias)
- `.win-raised` → botón/ventana elevada (estado normal).
- `.win-pressed` → botón hundido (activo/presionado).
- `.win-sunken` → campos y áreas de contenido (campo de texto, lista, visor).
- `.win-etched` → separadores grabados.
- Foco de teclado: **rectángulo punteado** de 1 px (`outline: 1px dotted var(--window-text); outline-offset: -4px`).

### Tipografía y render
- Fuente principal: `"Pixelated MS Sans Serif"` si está disponible localmente en `/public/fonts`, con *fallback* `Tahoma, "MS Sans Serif", Arial, sans-serif`. Tamaño base **11 px** (se escala en móvil con `zoom`/`transform` si hace falta, sin suavizar).
- `-webkit-font-smoothing: none; image-rendering: pixelated;` en iconos e imágenes de interfaz.
- Cursores: por defecto del sistema; reloj de arena (`wait`) durante cargas.

### Iconos
- Pixel-art **32x32** (escritorio) y **16x16** (taskbar/títulos), PNG con transparencia, en `public/icons/`.
- Si aún no existen, genera **placeholders SVG simples** y déjalos claramente marcados para reemplazar. No hotlinkees iconos de terceros ni uses assets de Microsoft con copyright; usa arte propio o libre de derechos.

---

## 6. Estado del sistema (reducer puro)

Tipos de datos (solo formas, sin comportamiento):

```ts
export type WindowState = {
  id: string;            // id de carpeta
  x: number; y: number;
  width: number; height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number };
};

export type OsState = {
  windows: WindowState[];
  activeId: string | null;
  selectedIconId: string | null;
  startMenuOpen: boolean;
  nextZ: number;
};

export type OsAction =
  | { type: 'OPEN'; id: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'TOGGLE_MAXIMIZE'; id: string }
  | { type: 'MOVE'; id: string; x: number; y: number }
  | { type: 'SELECT_ICON'; id: string | null }
  | { type: 'TOGGLE_START' };
```

- `osReducer(state, action) => OsState` es una **función pura** sin efectos secundarios: no muta, no llama a la red, no lee el DOM.
- Abrir una carpeta ya abierta **no crea otra ventana**: la enfoca (y la restaura si estaba minimizada).
- Las acciones se envían con `dispatch`; los componentes leen con `useOs()`.

---

## 7. Idioma ES / EN con n8n

**Objetivo:** toda la app puede cambiar entre español e inglés, y ese cambio pasa por **n8n**.

### Flujo
```
Cliente (useT / I18nContext)
   └─ fetchMessages(lang)  →  POST /api/i18n  (Route Handler de Next.js)
                                  └─ POST  N8N_I18N_WEBHOOK_URL  (workflow de n8n)
                                         ←  { lang, messages: { "key": "texto" } }
```

### Reglas
1. **La URL del webhook de n8n va solo en el servidor** (`N8N_I18N_WEBHOOK_URL` en `.env.local`, sin `NEXT_PUBLIC_`). El cliente nunca la ve: llama a `/api/i18n`. Esto evita CORS y no expone el endpoint.
2. **Siempre hay fallback local.** `dictionaries/es.ts` y `dictionaries/en.ts` son objetos planos con todas las claves. Si n8n falla, tarda más de ~3 s o devuelve algo inválido, se usa el diccionario local y **no se rompe la UI**. Muestra un `MessageBox` de advertencia solo la primera vez.
3. **Idioma por defecto:** el del navegador (`navigator.language`), con `es` como alternativa. Se persiste en `localStorage` (`ecos.lang`) dentro de un `try/catch`.
4. Cambiar de idioma actualiza `<html lang>`, el reloj (`Intl`) y todos los textos sin recargar la página.
5. Las claves usan notación con puntos: `taskbar.start`, `startMenu.shutdown`, `dialog.ok`, `folder.underConstruction`.
6. `t(key, vars?)` es una función simple: busca la clave y reemplaza `{variable}`; si no existe devuelve la propia clave y avisa por `console.warn` en desarrollo.
7. Los **nombres de carpeta** (sección 4) **sí** pasan por `t()`: están en inglés por defecto y n8n puede devolverlos en otro idioma. Los diccionarios locales mantienen el inglés como respaldo.

### Contrato esperado del workflow de n8n (confírmalo con el usuario antes de asumirlo)
- Entrada: `POST { "lang": "es" | "en", "keys": ["taskbar.start", ...] }` (si `keys` se omite, devuelve todo).
- Salida: `200 { "lang": "es", "messages": { "taskbar.start": "Inicio", ... } }`.
- Si el usuario todavía no tiene el workflow, **construye primero todo con los diccionarios locales** y deja el proxy `/api/i18n` listo con un TODO claro y un flag `USE_N8N=false` en el entorno.

---

## 8. Accesibilidad y robustez

- Cada icono y botón es un `<button>` real (o tiene `role="button"` + `tabIndex`); ventanas con `role="dialog"` y `aria-labelledby` al título.
- Navegación por teclado: `Tab` recorre iconos/ventanas, `Enter` abre, `Esc` cierra menú/diálogo, `Alt+F4` (opcional) cierra la ventana activa.
- Respeta `prefers-reduced-motion`: sin animaciones de arranque ni transiciones.
- Contraste: los tokens de Win98 ya son altos; no los alteres.
- Toda lectura/escritura en `localStorage` va en `try/catch`.
- Nada de `window`/`document` durante el render del servidor: protege con `useEffect` o `typeof window !== 'undefined'` para evitar errores de hidratación (p. ej. el reloj se monta en `useEffect`).

---

## 9. Flujo de trabajo del agente

1. **Entiende la petición.** Si pide algo de una carpeta marcada como `planned`, **detente y recuerda** que está pendiente de especificación; ofrece dejar solo el stub o pide la especificación. No improvises contenido.
2. **Antes de codificar**, anuncia en 3–5 líneas qué archivos vas a crear/modificar.
3. **Construye por capas:** tokens + utilidades `.win-*` → `Desktop` + `DesktopIcon` → `Window` + reducer → `Taskbar` + `StartMenu` → `MessageBox` / `ContextMenu` → i18n → stubs de carpetas.
4. **Verifica al terminar cada capa:** `npm run lint` y `npm run build` sin errores; revisa en el navegador que abrir, mover, enfocar, minimizar, maximizar y cerrar ventanas funciona, y que el cambio ES/EN no deja textos sin traducir.
5. **Revisa la restricción POO** con una búsqueda en el código: no debe haber `class `, `extends`, `this.` ni `new <ClaseDelProyecto>(`.
6. **Explica el código entregado línea por línea.** El usuario quiere explicaciones detalladas y completas del código que se le entrega: tras cada archivo relevante, incluye una explicación paso a paso de lo que hace cada bloque, función y decisión importante, en español.

---

## 10. Lista de verificación (Definition of Done)

- [ ] Escritorio teal con iconos de las 4 carpetas; BANK OF MEMORIES abre una ventana con Carousel y Games.
- [ ] Nombres de carpeta traducibles vía `t()` (inglés por defecto).
- [ ] Doble clic abre ventana Win98 (título degradado, min/max/cerrar, arrastrable, enfocable).
- [ ] Taskbar con Inicio, botones de ventanas, selector ES/EN y reloj.
- [ ] Menú Inicio funcional con las carpetas, idioma y "Apagar…".
- [ ] Todo el color sale de tokens; cero colores sueltos.
- [ ] Todos los textos de UI pasan por `t()`; ES/EN funcionan con fallback local.
- [ ] Proxy `/api/i18n` listo para n8n (o con flag desactivado y TODO claro).
- [ ] Carpetas en estado `planned` muestran stub "En construcción".
- [ ] Sin `class`, sin herencia, sin `this`.
- [ ] Sin dependencias ni código de BD (fase front); datos dinámicos solo vía `src/data/` con mock.
- [ ] Cero utilidades Tailwind de la paleta por defecto (`gray-*`, `blue-*`, `rounded-*`, `shadow-*`).
- [ ] `.env*` en `.gitignore` y `.env.example` sin valores reales (repo público).
- [ ] Funciona en escritorio y en móvil (ventanas maximizadas ≤ 768 px).
- [ ] `lint` y `build` pasan sin errores.

---

## 11. Qué NO hacer

- No uses bibliotecas de UI modernas (MUI, Chakra, shadcn, etc.) para el SO ni componentes/utilidades de Tailwind que traigan estilo moderno por defecto.
- No uses bordes redondeados, sombras difusas, *glassmorphism*, modo oscuro ni fuentes modernas (Inter, Roboto).
- No crees rutas de Next.js por carpeta (`/photos`, `/songs`…).
- No desarrolles el contenido de las carpetas sin especificación.
- No hardcodees textos visibles ni la URL del webhook de n8n en el cliente.
- **Repositorio público** (decisión del usuario): nunca subas `.env*`, claves ni la URL real del webhook de n8n; solo `.env.example` con valores de ejemplo. Las fotos pueden vivir en `public/` (el usuario ya decidió que serán públicas). Para las canciones, **prefiere embeds o enlaces** (YouTube/Spotify) en vez de commitear archivos de audio, y si el usuario sí quiere archivos propios, recuérdale una sola vez que subir música con derechos de autor a un repo público puede traer reclamos o bajas. Los comentarios de las personas invitadas (carpeta `<3`) son dinámicos y **nunca** se guardan en el repo; viven en una BD que se conectará más adelante (sección 12).

---

## 12. Datos dinámicos y conexión a BD (después)

Los comentarios de la carpeta `<3` serán **dinámicos** (los escribirán las personas invitadas). El usuario conectará la base de datos **después** de terminar el front, así que ahora solo se deja el terreno preparado:

1. **Una sola frontera de datos:** toda lectura/escritura dinámica pasa por funciones en `src/data/` (p. ej. `src/data/comments.ts` con `listComments()` y `addComment(input)`). Los componentes **nunca** guardan ni leen datos por su cuenta.
2. **Implementación simulada por ahora:** esas funciones devuelven `Promise` y trabajan sobre un arreglo en memoria con datos de ejemplo claramente marcados como `MOCK`. Mismas firmas que tendrá la versión real, para cambiar solo el interior después.
3. **Funciones y tipos, no clases:** nada de repositorios/servicios como clases. Usa funciones exportadas y `type Comment = { id: string; author: string; message: string; createdAt: string }`.
4. **El front ya contempla los estados reales:** cargando (cursor de reloj de arena), vacío, error (con `MessageBox`) y envío en curso, aunque el mock responda al instante.
5. **No definas esquema, tablas ni proveedor.** Cuando el usuario hable de la BD, se decidirá ahí (proveedor, moderación, autenticación de invitados, límites de envío) y se reemplazará solo el contenido de `src/data/`.
6. **Recordatorio:** la carpeta `<3` sigue en estado `planned`. Esta capa de datos **no** autoriza a construir su interfaz; solo indica cómo hacerlo cuando el usuario la especifique.
