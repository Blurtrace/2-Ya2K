# 💾 ECOS — 2-Ya2K (Windows 98 / Y2K)

> ### 🎁 Dedicatoria de Cumpleaños
> Este repositorio/proyecto es un regalo de cumpleaños desarrollado por **BlurTrace (Jandy)** como un regalo de cumpleaños para **Yac (Yaczury)** mi novia, quién se merece tener un espacio único donde pueda recordar aquello que tanto ama *"Los recuerdos y el arte de poder volver a ellos"*.
>
> *Nota: El repositorio y el resto de su contenido puede variar durante su diseño.*

---

## 🖥️ Acerca del Proyecto

**ECOS** es una aplicación web interactiva desarrollada sobre **Next.js** que recrea fielmente la experiencia y estética de un sistema operativo **Windows 98** con toques nostálgicos **Y2K**.

Toda la aplicación vive en una única pantalla de escritorio (`/`), donde cada funcionalidad del sistema está representada por una carpeta que abre una ventana con controles de ventana clásicos, bordes biselados tridimensionales y una paleta de colores retro.

---

## ✨ Funcionalidades Principales

- **Escritorio Retro:** Fondo clásico Teal (`#008080`), rejilla vertical de iconos con selección marina punteada y soporte para doble clic (o doble toque en móviles).
- **Ventanas Interactivas Win98:**
  - Barra de título con degradado azul activo / gris inactivo.
  - Botones de control: Minimizar (`_`), Maximizar/Restaurar (`□`/`❐`) y Cerrar (`✕`).
  - Arrastre fluido por la barra de título mediante *Pointer Events* (`setPointerCapture`) con soporte para ratón y pantallas táctiles.
  - Sistema en cascada (+24 px en X/Y por ventana abierta) y gestión de profundidad (`zIndex`) al hacer clic.
  - Adaptabilidad para pantallas móviles (≤ 768 px) con apertura maximizada automática.
- **Barra de Tareas (Taskbar):**
  - Botón **Inicio** con el logo de ECOS.
  - Botones de ventanas abiertas con estado presionado/activo (`win-pressed`).
  - Bandeja del sistema (Tray) con selector de idioma rápido (`ES`/`EN`), icono de volumen y reloj en tiempo real sincronizado con `Intl.DateTimeFormat`.
- **Menú Inicio Clásico:**
  - Franja lateral vertical azul con el rótulo rotado **ECOS 98**.
  - Acceso directo a todas las carpetas del sistema.
  - Submenú de configuración de idioma.
  - Diálogo modal *Acerca de ECOS...* y botón de *Apagar el sistema...* con la clásica pantalla/broma Y2K (*"Ahora es seguro apagar su equipo"*).
- **Menú Contextual:** Activación con clic derecho sobre el escritorio (Organizar iconos, Actualizar, Propiedades).
- **Carpetas del Sistema:**
  - 📁 **BANK OF MEMORIES**: Carpeta contenedora que abre el Explorador de Windows con barra de herramientas, barra de dirección (`C:\ECOS\BANK OF MEMORIES`) y barra de estado, conteniendo:
    - 📷 **Carousel**: Visor de fotografías y memorias especiales.
    - 🎮 **Games**: Sección interactiva de juegos retro.
  - 🎵 **If love were songs**: Espacio dedicado a canciones y música con significado especial.
  - 💌 **<3**: Libro de visitas y comentarios para personas invitadas (con capa de datos simulada lista para persistencia futura).
  - 💖 **Our Love**: Galería de fotos y momentos compartidos.
- **Soporte Multilingüe (i18n):**
  - Selector de idioma entre Español (`ES`) e Inglés (`EN`) sin recargar la página.
  - Ruta proxy `/api/i18n` del servidor preparada para integrarse con flujos automatizados de **n8n**, con diccionarios locales de respaldo inmediato.

---

## 🛠️ Tecnologías Utilizadas

- **[Next.js 15 (App Router)](https://nextjs.org/):** Arquitectura React moderna con renderizado optimizado y Server Route Handlers.
- **[React 19](https://react.dev/):** Componentes funcionales modernos con hooks avanzados (`useReducer`, `useContext`, `useCallback`, `useRef`, `useState`, `useEffect`).
- **[TypeScript](https://www.typescriptlang.org/):** Tipado estricto de estructuras de datos y modelos del sistema.
- **[TailwindCSS v4](https://tailwindcss.com/):** Estilos atómicos configurados con tokens nativos de Windows 98 y utilidades personalizadas `@utility` (`win-raised`, `win-pressed`, `win-sunken`, `win-etched`).
- **Sharp:** Generación automatizada de iconos pixel-art en formato PNG de 32x32 y 16x16 píxeles.
- **Arquitectura Funcional Estricta (Sin POO):** 100% libre de clases, herencias o patrones de instancias propios; estructurada en reducers puros, módulos inmutables y composición de componentes.

---

## 🚀 Instalación y Ejecución Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Blurtrace/2-Ya2K.git
   cd 2-Ya2K
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre en tu navegador [http://localhost:3000](http://localhost:3000) para ver el escritorio de Windows 98 en funcionamiento.

---

## 👥 Créditos y Agradecimientos

Agradecimiento muy especial a las siguientes personas que colaboraron con la edición del aplicativo, búsqueda de fotos, información y extras:

1. **Roselis Paredes**
2. **Zharick Castro**
3. **Dainys de Avila**

---
*Desarrollado con mucho cariño por [BlurTrace (Jandy)](https://github.com/Blurtrace).*

