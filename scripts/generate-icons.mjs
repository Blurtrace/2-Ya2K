import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outputDir = path.resolve('public/icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Plantilla SVG para carpeta Win98 con icono distintivo en el centro
const makeFolderSvg = (badgeSvg) => `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
  <!-- Pestaña de la carpeta trasera -->
  <path d="M2 5 H12 V7 H2 Z" fill="#000000"/>
  <path d="M3 6 H11 V8 H3 Z" fill="#FFE880"/>
  <!-- Cuerpo trasero -->
  <rect x="2" y="7" width="28" height="20" fill="#000000"/>
  <rect x="3" y="8" width="26" height="18" fill="#D4AF37"/>
  <!-- Papeles / Interior blanco -->
  <rect x="5" y="8" width="22" height="6" fill="#FFFFFF"/>
  <rect x="6" y="9" width="12" height="1" fill="#000080"/>
  <rect x="6" y="11" width="16" height="1" fill="#808080"/>
  <!-- Solapa frontal amarilla Win98 -->
  <polygon points="1,12 28,12 27,27 1,27" fill="#000000"/>
  <polygon points="2,13 27,13 26,26 2,26" fill="#FFDE59"/>
  <!-- Brillo y sombra de la solapa -->
  <line x1="2" y1="13" x2="27" y2="13" stroke="#FFF7A1" stroke-width="1"/>
  <line x1="2" y1="13" x2="2" y2="26" stroke="#FFF7A1" stroke-width="1"/>
  <line x1="2" y1="26" x2="26" y2="26" stroke="#C29B00" stroke-width="1"/>
  <line x1="26" y1="14" x2="26" y2="26" stroke="#806600" stroke-width="1"/>
  ${badgeSvg}
</svg>
`;

const icons = {
  'folder-memories.png': makeFolderSvg(`
    <!-- Emblema de banco/chip -->
    <rect x="10" y="16" width="11" height="8" fill="#000080"/>
    <rect x="12" y="18" width="7" height="4" fill="#00FFCC"/>
    <circle cx="15" cy="20" r="1.5" fill="#FFFFFF"/>
  `),
  'folder-photos.png': makeFolderSvg(`
    <!-- Emblema de foto/montaña -->
    <rect x="9" y="15" width="13" height="9" fill="#FFFFFF"/>
    <rect x="10" y="16" width="11" height="7" fill="#1084D0"/>
    <polygon points="11,22 14,18 17,22" fill="#008000"/>
    <polygon points="15,22 18,19 20,22" fill="#808000"/>
    <circle cx="18" cy="17.5" r="1" fill="#FFFF00"/>
  `),
  'folder-games.png': makeFolderSvg(`
    <!-- Emblema de joystick retro -->
    <rect x="9" y="16" width="13" height="8" fill="#333333"/>
    <rect x="10" y="17" width="11" height="6" fill="#555555"/>
    <rect x="11" y="19" width="3" height="2" fill="#000000"/>
    <rect x="12" y="18" width="1" height="4" fill="#000000"/>
    <rect x="18" y="19" width="2" height="2" fill="#FF0000"/>
  `),
  'folder-music.png': makeFolderSvg(`
    <!-- Emblema nota musical -->
    <path d="M12 21 A 2 2 0 1 0 14 21 V 16 H 19 V 21 A 2 2 0 1 0 21 21 V 15 H 12 Z" fill="#000080"/>
  `),
  'folder-heart.png': makeFolderSvg(`
    <!-- Emblema corazón rojo pixel <3 -->
    <path d="M11 16 H13 V15 H15 V16 H17 V15 H19 V16 H20 V18 H19 V19 H18 V20 H17 V21 H16 V22 H15 V23 H14 V22 H13 V21 H12 V20 H11 V19 H10 V17 H11 Z" fill="#FF0000"/>
    <rect x="12" y="16" width="1" height="1" fill="#FFAAAA"/>
  `),
  'folder-love.png': makeFolderSvg(`
    <!-- Emblema dos corazones / amor -->
    <path d="M10 16 H12 V15 H14 V16 H16 V15 H18 V16 H19 V18 H18 V19 H17 V20 H16 V21 H15 V22 H14 V23 H13 V22 H12 V21 H11 V20 H10 V19 H9 V17 H10 Z" fill="#FF1493"/>
    <rect x="17" y="18" width="4" height="4" fill="#FF69B4"/>
  `),
  'ecos-logo.png': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Monitor retro -->
      <rect x="4" y="3" width="24" height="19" fill="#000000"/>
      <rect x="5" y="4" width="22" height="17" fill="#C0C0C0"/>
      <rect x="7" y="6" width="18" height="13" fill="#008080"/>
      <!-- Logotipo 4 colores tipo Win98 en pantalla -->
      <rect x="10" y="8" width="5" height="4" fill="#FF0000"/>
      <rect x="16" y="8" width="5" height="4" fill="#00AA00"/>
      <rect x="10" y="13" width="5" height="4" fill="#0000FF"/>
      <rect x="16" y="13" width="5" height="4" fill="#FFCC00"/>
      <!-- Base del monitor -->
      <rect x="12" y="22" width="8" height="3" fill="#808080"/>
      <rect x="8" y="25" width="16" height="3" fill="#C0C0C0"/>
      <line x1="8" y1="28" x2="24" y2="28" stroke="#000000"/>
    </svg>
  `,
  'hourglass.png': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Marco del reloj de arena -->
      <rect x="8" y="4" width="16" height="3" fill="#000000"/>
      <rect x="9" y="5" width="14" height="1" fill="#000080"/>
      <rect x="8" y="25" width="16" height="3" fill="#000000"/>
      <rect x="9" y="26" width="14" height="1" fill="#000080"/>
      <!-- Vidrio -->
      <polygon points="9,7 23,7 18,16 23,25 9,25 14,16" fill="#E0F7FA"/>
      <polygon points="9,7 23,7 18,16 23,25 9,25 14,16" stroke="#000000" stroke-width="1" fill="none"/>
      <!-- Arena azul/cyan -->
      <polygon points="11,10 21,10 16,15" fill="#008080"/>
      <polygon points="15,17 17,17 20,24 12,24" fill="#008080"/>
      <line x1="16" y1="15" x2="16" y2="18" stroke="#008080"/>
    </svg>
  `,
  'volume.png': `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <polygon points="2,6 5,6 8,3 8,13 5,10 2,10" fill="#000000"/>
      <polygon points="3,7 5,7 7,5 7,11 5,9 3,9" fill="#FFFF00"/>
      <path d="M10 5 C11 6, 11 10, 10 11" stroke="#000000" stroke-width="1"/>
      <path d="M12 3 C14 5, 14 11, 12 13" stroke="#000000" stroke-width="1"/>
    </svg>
  `,
  'msg-info.png': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <circle cx="16" cy="16" r="14" fill="#000080"/>
      <circle cx="16" cy="16" r="14" stroke="#000000" stroke-width="1" fill="none"/>
      <circle cx="16" cy="10" r="2" fill="#FFFFFF"/>
      <rect x="14" y="14" width="4" height="9" fill="#FFFFFF"/>
      <rect x="12" y="14" width="3" height="2" fill="#FFFFFF"/>
      <rect x="12" y="21" width="8" height="2" fill="#FFFFFF"/>
    </svg>
  `,
  'msg-warning.png': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <polygon points="16,3 30,28 2,28" fill="#FFFF00" stroke="#000000" stroke-width="1"/>
      <rect x="14" y="12" width="4" height="7" fill="#000000"/>
      <rect x="14" y="21" width="4" height="3" fill="#000000"/>
    </svg>
  `,
  'shutdown.png': `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <rect x="4" y="4" width="24" height="18" fill="#C0C0C0" stroke="#000000"/>
      <rect x="6" y="6" width="20" height="14" fill="#000000"/>
      <!-- Símbolo de apagado rojo -->
      <circle cx="16" cy="13" r="5" stroke="#FF0000" stroke-width="2" fill="none"/>
      <line x1="16" y1="7" x2="16" y2="13" stroke="#FF0000" stroke-width="2"/>
      <rect x="8" y="24" width="16" height="3" fill="#808080"/>
      <line x1="6" y1="27" x2="26" y2="27" stroke="#000000" stroke-width="2"/>
    </svg>
  `,
};

async function generate() {
  for (const [filename, svg] of Object.entries(icons)) {
    const filePath = path.join(outputDir, filename);
    const buffer = Buffer.from(svg.trim());
    await sharp(buffer)
      .png()
      .toFile(filePath);
    console.log(`Generated: ${filename}`);
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

