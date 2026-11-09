import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const svg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <!-- Windows 98 Paint Icon: Classic Artists Palette with Brush and Canister -->
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="1" dy="1" stdDeviation="0.2" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Brushes behind palette -->
  <!-- Brush 1: Red wooden handle -->
  <line x1="4" y1="28" x2="22" y2="4" stroke="#8B0000" stroke-width="2.5" stroke-linecap="round" />
  <!-- Brush ferrule silver -->
  <line x1="20" y1="6.5" x2="23" y2="3.5" stroke="#C0C0C0" stroke-width="3" stroke-linecap="butt" />
  <!-- Brush tip hairs -->
  <polygon points="22.5,3 26,0 24.5,4.5" fill="#1A1A1A" />
  <polygon points="23.5,2 25.5,0.5 24.5,3.5" fill="#FF0000" />

  <!-- Pencil 2: Yellow -->
  <line x1="12" y1="28" x2="27" y2="9" stroke="#E6A100" stroke-width="2" stroke-linecap="round" />
  <polygon points="26,10 29.5,7 27.5,12" fill="#D2B48C" />
  <polygon points="28.5,8 30,6.5 29,9" fill="#000000" />

  <!-- Classic Wooden Palette -->
  <path d="M 12 8 C 5 8, 2 16, 4 23 C 6 28, 16 31, 23 28 C 28 25, 30 19, 27 14 C 25 11, 20 13, 17 11 C 15 9, 15 8, 12 8 Z" 
        fill="#E8C382" stroke="#663300" stroke-width="1.2" filter="url(#shadow)" />
  
  <!-- Wood grain bevel highlight -->
  <path d="M 12 9 C 7 9, 4 15, 5 22 C 7 26, 15 29, 21 27" fill="none" stroke="#FFF2D6" stroke-width="0.8" />

  <!-- Thumb hole -->
  <ellipse cx="23" cy="22" rx="2.5" ry="3.5" fill="#4A4A4A" stroke="#221100" stroke-width="1" />
  <ellipse cx="23" cy="22" rx="2" ry="3" fill="#808080" />

  <!-- Paint Blobs (3D bevel effect) -->
  <!-- Red blob -->
  <circle cx="8" cy="15" r="2.4" fill="#FF0000" stroke="#800000" stroke-width="0.6" />
  <circle cx="7.4" cy="14.4" r="0.8" fill="#FF9999" />

  <!-- Blue blob -->
  <circle cx="11" cy="21" r="2.4" fill="#0000FF" stroke="#000080" stroke-width="0.6" />
  <circle cx="10.4" cy="20.4" r="0.8" fill="#8080FF" />

  <!-- Green blob -->
  <circle cx="16" cy="25" r="2.4" fill="#00AA00" stroke="#005500" stroke-width="0.6" />
  <circle cx="15.4" cy="24.4" r="0.8" fill="#80FF80" />

  <!-- Yellow blob -->
  <circle cx="13" cy="13" r="2.2" fill="#FFEE00" stroke="#998800" stroke-width="0.6" />
  <circle cx="12.4" cy="12.4" r="0.8" fill="#FFFFCC" />

  <!-- Cyan blob -->
  <circle cx="21" cy="14" r="2" fill="#00DDDD" stroke="#007777" stroke-width="0.6" />
</svg>
`;

const dest = path.resolve('public/icons/paint.png');
await sharp(Buffer.from(svg))
  .resize(32, 32)
  .png()
  .toFile(dest);

console.log('Generated public/icons/paint.png successfully!');
