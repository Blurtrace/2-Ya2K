# 💾 ECOS — 2-Ya2K (Windows 98 / Y2K)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript%205.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS%20v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Vercel%20Edge-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Edge" />
  <br>
  <img src="https://img.shields.io/badge/HTML5%20Canvas%202D-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Canvas 2D" />
  <img src="https://img.shields.io/badge/Web%20Audio%20API-FF6F00?style=for-the-badge&logo=soundcharts&logoColor=white" alt="Web Audio API" />
  <img src="https://img.shields.io/badge/ESLint%209-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint 9" />
  <img src="https://img.shields.io/badge/i18n-ES%20%7C%20EN-000080?style=for-the-badge&logo=translate&logoColor=white" alt="i18n ES/EN" />
  <img src="https://img.shields.io/badge/Theme-Windows%2098%20%7C%20Y2K-008080?style=for-the-badge&logo=windows95&logoColor=white" alt="Windows 98 Y2K" />
</p>

---

> ### 🎁 Propósito y Dedicatoria de Cumpleaños
> **ECOS** fue concebido y desarrollado desde su origen por **BlurTrace (Jandy)** como un regalo de cumpleaños inolvidable para **Yaczury (Yac)**, la persona que inspira cada línea de código de este proyecto. 
> 
> El propósito fundamental de esta obra es regalarle un rincón digital único y nostálgico, creado exclusivamente para celebrar su vida, sus gustos y resguardar en el tiempo aquello que más atesora:  
> *"Los recuerdos y el arte de poder volver a ellos"*.
>
> Diseñado bajo la metáfora de una **cápsula del tiempo digital del cambio de milenio (Y2K / 1999 ➔ 2000)**, ECOS transforma fotos, canciones, cartas, momentos compartidos, juegos y cupones de regalos en un sistema operativo interactivo de Windows 98 que vive en la web.

---

## 🖥️ ¿Cómo Funciona la Aplicación?

ECOS funciona como un **entorno de escritorio completo (Web Desktop OS)** ejecutado directamente en el navegador, combinando arquitectura moderna de Next.js con interactividad retro:

### 1. ⏳ Cuenta Regresiva de Desbloqueo Y2K (`/countdown`)
- **Bloqueo Global Sincronizado:** Toda la aplicación está protegida por un **Next.js Edge Middleware** que intercepta las peticiones. Hasta antes del **10 de noviembre de 2026 a las 00:00:00 (Hora oficial de Colombia, Bogotá UTC-5)**, cualquier acceso a la ruta principal `/` es redirigido a `/countdown`.
- **Telemetría RTC del Servidor:** Mediante el endpoint `/api/time`, el cliente calibra su reloj con el tiempo exacto del servidor para garantizar que nadie pueda adelantar el contador cambiando la hora de su dispositivo.
- **Estética de Monitores CRT:** Pantalla retroiluminada en verde fósforo VFD/LED que muestra días, horas, minutos, segundos y centésimas en tiempo real, acompañada de **TATA (V de BTS)**.
- **Desbloqueo Automático y Acceso Anticipado:** Al cumplirse el milenio, el sistema ejecuta una transición animada hacia `/`. Para pruebas y desarrollo, existe un modal discreto con la clave secreta que genera una cookie criptográfica de bypass (`ecos_preview_unlocked`).

### 2. 🪟 Kernel de Escritorio y Gestor de Ventanas (Window Manager)
- **Arquitectura de Estado Global:** Motor reactivo centralizado con `useReducer` y `useContext` (`OsContext`) completamente inmutable y funcional (100% libre de Programación Orientada a Objetos o clases).
- **Gestión Avanzada de Ventanas:** Soporte para apertura múltiple, posicionamiento en cascada inteligente (+24 px), apilamiento dinámico de profundidad (`zIndex`), minimizar, maximizar a pantalla completa y cierre.
- **Arrastre Fluido por Pointer Events:** Control con soporte nativo unificado para ratón de escritorio y pantallas táctiles móviles mediante `setPointerCapture`.
- **Adaptabilidad Responsive:** Detección de dispositivos móviles (≤ 768 px) con apertura maximizada automática para una experiencia táctil cómoda.

### 3. 🤖 Asistentes Guías Interactivos de BT21 (TATA & COOKY)
- **Personajes de BTS en versión BT21:** Guías ilustrados en pixel-art con spritesheet animado de múltiples poses (saludo, pensamiento, felicidad, celebración).
- **Tour del Sistema de 12 Pasos:** Explicación amena y cariñosa de cada funcionalidad, menú y carpeta del sistema.
- **Acceso Rápido:** Lanzador disponible en la bandeja de la barra de tareas (icono de TATA), en el Menú Inicio o al hacer doble clic en el escritorio.

### 4. 📁 Carpetas y Experiencias Interactivas
- 📁 **BANK OF MEMORIES (Banco de Recuerdos):**
  - 📷 **Timeline / Recuerdos:** Álbum cronológico estilo tarjeta Polaroid con simulación de revelado químico progresivo, navegación por años, carrusel y reverso con notas manuscritas.
  - 🎮 **Buscaminas (Minesweeper):** Recreación fiel de Windows 98 con modos Principiante, Intermedio y Experto, temporizador digital de 7 segmentos, contador de minas y carita sonriente.
  - 🃏 **Solitario (Solitaire Klondike):** Motor completo de juego de cartas, robo de 1 o 3 cartas, deshacer movimientos y la clásica animación final de cascada de cartas rebotando en el tapete verde.
- 🎵 **If love were songs (Reproductor de Música Retro):**
  - Interfaz estilo reproductor multimedia vintage y estuche de CD (Jewel Case).
  - 17 canciones seleccionadas y dedicadas con streaming optimizado mediante HTTP Range Requests (códigos 206/307) servidas desde la red CDN.
  - Visualizador de ecualizador gráfico animado, notas de dedicatoria en formato Notepad y desbloqueo de canciones.
- 🎫 **Voucher Validator (Cupones y Sorpresas):**
  - Tarjeta de regalo virtual con diseño vino/burdeos de doble faz.
  - Zona de rascar desarrollada sobre **HTML5 Canvas 2D** con efecto de raspado metalizado realista (`destination-out`) y porcentaje de revelado para reclamar premios especiales.
- 💌 **<3 (Libro de Visitas y Dedicatorias):** Espacio para cartas y mensajes de personas queridas.
- 💖 **Our Love (Nuestra Historia):** Galería conmemorativa de fotos y momentos compartidos.
- 🗑️ **Papelera de Reciclaje (Recycle Bin):** Carpeta temática con archivos especiales, incluyendo la carpeta **"enojos"**, protegida por un simpático diálogo de acceso denegado que recuerda que allí no hay cabida para malos momentos.

### 5. 🌐 Soporte Bilingüe Instantáneo (i18n)
- Traducción completa en tiempo real entre **Español (`ES`)** e **Inglés (`EN`)** sin recargar la página.
- Abarca menús, barras de tareas, nombres de archivos, cuadros de diálogo, diálogos de los guías de BT21 y mensajes del sistema.

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Blurtrace/2-Ya2K.git
   cd 2-Ya2K
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Visita [http://localhost:3000](http://localhost:3000) para interactuar con la aplicación.

5. **Construir para producción:**
   ```bash
   npm run build
   npm run start
   ```

---

## 👥 Créditos y Agradecimientos

Agradecimiento muy especial a las siguientes personas que colaboraron con la recopilación de recuerdos, edición del aplicativo, búsqueda de fotos, información y detalles que hicieron posible este regalo:

1. **Roselis Paredes**
2. **Zharick Castro**
3. **Dainys de Avila**

---

<p align="center">
  <b>Desarrollado con todo el amor y cariño del mundo por <a href="https://github.com/Blurtrace">BlurTrace (Jandy)</a> para Yaczury ❤️</b><br>
  <i>"El tiempo pasa, pero los recuerdos bien guardados duran para siempre."</i>
</p>
