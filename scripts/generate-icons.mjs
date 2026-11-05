import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/games/icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const icons = [
  {
    id: 'fuego-y-agua-1',
    bg: '#1b3b22',
    border: '#2ecc71',
    svg: `
      <rect width="64" height="64" rx="4" fill="#1b3b22"/>
      <path d="M12 44 C12 28 22 20 22 14 C28 22 30 30 24 44 Z" fill="#ff471a"/>
      <path d="M42 44 C42 28 32 20 32 14 C26 22 24 30 30 44 Z" fill="#00c3ff"/>
      <circle cx="20" cy="34" r="2.5" fill="#fff"/><circle cx="34" cy="34" r="2.5" fill="#fff"/>
      <circle cx="21" cy="34" r="1.2" fill="#000"/><circle cx="33" cy="34" r="1.2" fill="#000"/>
      <rect x="42" y="42" width="18" height="18" rx="2" fill="#2ecc71"/>
      <text x="51" y="56" font-family="monospace" font-size="13" font-weight="bold" fill="#000" text-anchor="middle">1</text>
    `
  },
  {
    id: 'fuego-y-agua-2',
    bg: '#3d3000',
    border: '#f1c40f',
    svg: `
      <rect width="64" height="64" rx="4" fill="#3d3000"/>
      <circle cx="32" cy="18" r="8" fill="#f1c40f" opacity="0.4"/>
      <path d="M14 44 C14 30 22 24 22 18 C27 24 28 32 24 44 Z" fill="#ff471a"/>
      <path d="M40 44 C40 30 32 24 32 18 C27 24 26 32 30 44 Z" fill="#00c3ff"/>
      <circle cx="20" cy="35" r="2" fill="#fff"/><circle cx="34" cy="35" r="2" fill="#fff"/>
      <rect x="42" y="42" width="18" height="18" rx="2" fill="#f1c40f"/>
      <text x="51" y="56" font-family="monospace" font-size="13" font-weight="bold" fill="#000" text-anchor="middle">2</text>
    `
  },
  {
    id: 'fuego-y-agua-3',
    bg: '#00293d',
    border: '#00d2ff',
    svg: `
      <rect width="64" height="64" rx="4" fill="#00293d"/>
      <polygon points="10,8 14,24 18,8 24,20 28,8 34,22 38,8" fill="#a0e6ff" opacity="0.6"/>
      <path d="M16 46 C16 32 23 26 23 20 C28 26 29 34 25 46 Z" fill="#ff471a"/>
      <path d="M42 46 C42 32 35 26 35 20 C30 26 29 34 33 46 Z" fill="#00c3ff"/>
      <rect x="42" y="42" width="18" height="18" rx="2" fill="#00d2ff"/>
      <text x="51" y="56" font-family="monospace" font-size="13" font-weight="bold" fill="#000" text-anchor="middle">3</text>
    `
  },
  {
    id: 'fuego-y-agua-4',
    bg: '#330033',
    border: '#e056fd',
    svg: `
      <rect width="64" height="64" rx="4" fill="#330033"/>
      <polygon points="32,6 36,16 32,26 28,16" fill="#e056fd" opacity="0.8"/>
      <path d="M16 46 C16 32 23 26 23 20 C28 26 29 34 25 46 Z" fill="#ff471a"/>
      <path d="M42 46 C42 32 35 26 35 20 C30 26 29 34 33 46 Z" fill="#00c3ff"/>
      <rect x="42" y="42" width="18" height="18" rx="2" fill="#e056fd"/>
      <text x="51" y="56" font-family="monospace" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">4</text>
    `
  },
  {
    id: 'penguin-diner-1',
    bg: '#003366',
    border: '#ff9ff3',
    svg: `
      <rect width="64" height="64" rx="4" fill="#003366"/>
      <ellipse cx="32" cy="36" rx="16" ry="20" fill="#1e272e"/>
      <ellipse cx="32" cy="38" rx="10" ry="14" fill="#ffffff"/>
      <ellipse cx="28" cy="24" rx="2.5" ry="3.5" fill="#000"/>
      <ellipse cx="36" cy="24" rx="2.5" ry="3.5" fill="#000"/>
      <polygon points="30,28 34,28 32,33" fill="#ff9f43"/>
      <rect x="22" y="38" width="20" height="14" rx="3" fill="#ff6b81"/>
      <rect x="40" y="32" width="18" height="3" fill="#c7ecee"/>
      <circle cx="48" cy="28" r="4" fill="#ff4757"/>
    `
  },
  {
    id: 'penguin-diner-2',
    bg: '#2c003e',
    border: '#feca57',
    svg: `
      <rect width="64" height="64" rx="4" fill="#2c003e"/>
      <path d="M22 18 L24 8 L32 14 L40 8 L42 18 Z" fill="#feca57"/>
      <ellipse cx="32" cy="38" rx="15" ry="18" fill="#1e272e"/>
      <ellipse cx="32" cy="40" rx="9" ry="13" fill="#ffffff"/>
      <polygon points="30,30 34,30 32,35" fill="#ff9f43"/>
      <rect x="23" y="40" width="18" height="12" rx="2" fill="#f368e0"/>
      <text x="50" y="22" font-family="sans-serif" font-size="16" font-weight="900" fill="#feca57">2</text>
    `
  },
  {
    id: 'mini-scientist',
    bg: '#0c2461',
    border: '#78e08f',
    svg: `
      <rect width="64" height="64" rx="4" fill="#0c2461"/>
      <path d="M26 12 L38 12 L38 22 L48 46 L16 46 L26 22 Z" fill="#4a69bd" stroke="#78e08f" stroke-width="2"/>
      <path d="M21 44 L43 44 L37 32 L27 32 Z" fill="#78e08f"/>
      <circle cx="30" cy="36" r="3" fill="#fff" opacity="0.8"/>
      <circle cx="35" cy="40" r="2" fill="#fff" opacity="0.8"/>
      <circle cx="28" cy="20" r="4" fill="#fff"/>
      <circle cx="36" cy="20" r="4" fill="#fff"/>
      <circle cx="28" cy="20" r="2" fill="#000"/><circle cx="36" cy="20" r="2" fill="#000"/>
    `
  },
  {
    id: 'pet-grooming-studio',
    bg: '#ffb8b8',
    border: '#ff4757',
    svg: `
      <rect width="64" height="64" rx="4" fill="#ffcccc"/>
      <ellipse cx="32" cy="34" rx="16" ry="14" fill="#d29b62"/>
      <circle cx="20" cy="24" r="7" fill="#8d5b27"/><circle cx="44" cy="24" r="7" fill="#8d5b27"/>
      <circle cx="26" cy="32" r="2" fill="#000"/><circle cx="38" cy="32" r="2" fill="#000"/>
      <ellipse cx="32" cy="38" rx="3.5" ry="2.5" fill="#000"/>
      <circle cx="46" cy="46" r="8" fill="#70a1ff" opacity="0.7"/>
      <circle cx="50" cy="38" r="5" fill="#70a1ff" opacity="0.7"/>
      <path d="M12 48 L22 56 M22 48 L12 56" stroke="#ff4757" stroke-width="3" stroke-linecap="round"/>
    `
  },
  {
    id: 'nail-color-workshop',
    bg: '#3e065f',
    border: '#ff007f',
    svg: `
      <rect width="64" height="64" rx="4" fill="#3e065f"/>
      <rect x="28" y="10" width="8" height="14" fill="#2d3436"/>
      <rect x="20" y="24" width="24" height="28" rx="4" fill="#ff007f"/>
      <path d="M22 28 Q32 38 42 28" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>
      <circle cx="14" cy="46" r="4" fill="#00cec9"/>
      <circle cx="50" cy="46" r="4" fill="#fdcb6e"/>
      <text x="32" y="42" font-family="sans-serif" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">NAILS</text>
    `
  },
  {
    id: '3-pandas-1',
    bg: '#1e3c00',
    border: '#2ed573',
    svg: `
      <rect width="64" height="64" rx="4" fill="#1e3c00"/>
      <circle cx="32" cy="42" r="14" fill="#fff"/>
      <circle cx="22" cy="32" r="4" fill="#000"/><circle cx="42" cy="32" r="4" fill="#000"/>
      <ellipse cx="27" cy="40" rx="3" ry="2" fill="#000"/><ellipse cx="37" cy="40" rx="3" ry="2" fill="#000"/>
      <circle cx="18" cy="24" r="8" fill="#fff"/><circle cx="46" cy="24" r="8" fill="#fff"/>
      <circle cx="14" cy="18" r="2.5" fill="#000"/><circle cx="50" cy="18" r="2.5" fill="#000"/>
      <text x="32" y="60" font-family="sans-serif" font-size="9" font-weight="bold" fill="#2ed573" text-anchor="middle">3 PANDAS</text>
    `
  },
  {
    id: '3-pandas-night',
    bg: '#0a0d25',
    border: '#5352ed',
    svg: `
      <rect width="64" height="64" rx="4" fill="#0a0d25"/>
      <path d="M48 10 A 10 10 0 0 0 40 24 A 12 12 0 1 1 48 10 Z" fill="#ffd32a"/>
      <circle cx="32" cy="40" r="13" fill="#fff"/>
      <circle cx="22" cy="30" r="3.5" fill="#000"/><circle cx="42" cy="30" r="3.5" fill="#000"/>
      <ellipse cx="27" cy="38" rx="2.5" ry="1.8" fill="#000"/><ellipse cx="37" cy="38" rx="2.5" ry="1.8" fill="#000"/>
      <polygon points="14,14 15,17 18,17 16,19 17,22 14,20 11,22 12,19 10,17 13,17" fill="#fff"/>
      <text x="32" y="58" font-family="sans-serif" font-size="8" font-weight="bold" fill="#70a1ff" text-anchor="middle">NIGHT</text>
    `
  },
  {
    id: '3-pandas-brazil',
    bg: '#00552b',
    border: '#fed330',
    svg: `
      <rect width="64" height="64" rx="4" fill="#00552b"/>
      <polygon points="32,8 56,32 32,56 8,32" fill="#fed330"/>
      <circle cx="32" cy="32" r="13" fill="#0c2461"/>
      <path d="M20 32 Q32 26 44 32" stroke="#fff" stroke-width="2" fill="none"/>
      <circle cx="32" cy="32" r="8" fill="#fff"/>
      <circle cx="26" cy="27" r="2.5" fill="#000"/><circle cx="38" cy="27" r="2.5" fill="#000"/>
      <ellipse cx="29" cy="32" rx="1.5" ry="1" fill="#000"/><ellipse cx="35" cy="32" rx="1.5" ry="1" fill="#000"/>
    `
  },
  {
    id: 'papa-louie-1',
    bg: '#870000',
    border: '#f1c40f',
    svg: `
      <rect width="64" height="64" rx="4" fill="#870000"/>
      <path d="M22 22 C18 10 46 10 42 22 Z" fill="#ffffff"/>
      <rect x="22" y="20" width="20" height="4" fill="#e74c3c"/>
      <circle cx="32" cy="32" r="10" fill="#f8c291"/>
      <path d="M24 34 Q32 40 40 34" fill="#000" stroke="#000" stroke-width="3" stroke-linecap="round"/>
      <polygon points="12,40 52,60 18,60" fill="#e67e22"/>
      <circle cx="24" cy="52" r="3" fill="#c0392b"/><circle cx="36" cy="54" r="2.5" fill="#c0392b"/>
    `
  },
  {
    id: 'mad-burger',
    bg: '#d35400',
    border: '#f39c12',
    svg: `
      <rect width="64" height="64" rx="4" fill="#d35400"/>
      <path d="M14 26 C14 16 50 16 50 26 Z" fill="#f5cd79"/>
      <rect x="12" y="28" width="40" height="4" fill="#2ed573"/>
      <rect x="12" y="34" width="40" height="6" rx="2" fill="#8b4513"/>
      <rect x="14" y="42" width="36" height="5" rx="2" fill="#f5cd79"/>
      <circle cx="24" cy="24" r="2" fill="#fff"/><circle cx="24" cy="24" r="1" fill="#000"/>
      <circle cx="38" cy="24" r="2" fill="#fff"/><circle cx="38" cy="24" r="1" fill="#000"/>
      <path d="M48 24 L58 18 M48 30 L60 30 M48 36 L56 42" stroke="#fff" stroke-width="2"/>
    `
  },
  {
    id: 'papas-pizzeria',
    bg: '#b33927',
    border: '#f9ca24',
    svg: `
      <rect width="64" height="64" rx="4" fill="#b33927"/>
      <polygon points="32,10 56,54 8,54" fill="#f6b93b"/>
      <path d="M8 54 Q32 60 56 54" stroke="#e58e26" stroke-width="4" fill="none"/>
      <circle cx="28" cy="34" r="3.5" fill="#eb2f06"/><circle cx="38" cy="40" r="3.5" fill="#eb2f06"/>
      <circle cx="24" cy="46" r="3.5" fill="#eb2f06"/><circle cx="34" cy="48" r="3.5" fill="#eb2f06"/>
      <text x="32" y="24" font-family="sans-serif" font-size="8" font-weight="900" fill="#fff" text-anchor="middle">PIZZA</text>
    `
  },
  {
    id: 'papas-burgeria',
    bg: '#574b90',
    border: '#f5cd79',
    svg: `
      <rect width="64" height="64" rx="4" fill="#574b90"/>
      <path d="M16 18 C16 10 48 10 48 18 Z" fill="#f5cd79"/>
      <circle cx="24" cy="14" r="1" fill="#fff"/><circle cx="32" cy="13" r="1" fill="#fff"/><circle cx="40" cy="14" r="1" fill="#fff"/>
      <rect x="14" y="20" width="36" height="4" fill="#2ed573"/>
      <polygon points="14,26 50,26 46,31 18,31" fill="#e74c3c"/>
      <rect x="14" y="32" width="36" height="5" fill="#f1c40f"/>
      <rect x="12" y="38" width="40" height="7" rx="3" fill="#5c3818"/>
      <rect x="16" y="47" width="32" height="6" rx="3" fill="#f5cd79"/>
      <text x="32" y="60" font-family="sans-serif" font-size="7" font-weight="bold" fill="#f5cd79" text-anchor="middle">BURGER</text>
    `
  },
  {
    id: 'papas-taco-mia',
    bg: '#1b8a5a',
    border: '#f6e58d',
    svg: `
      <rect width="64" height="64" rx="4" fill="#1b8a5a"/>
      <path d="M12 44 C12 20 52 20 52 44 Z" fill="#f6e58d"/>
      <path d="M16 40 C22 28 42 28 48 40" stroke="#badc58" stroke-width="4" fill="none"/>
      <circle cx="26" cy="34" r="3" fill="#eb4d4b"/><circle cx="38" cy="34" r="3" fill="#eb4d4b"/>
      <circle cx="32" cy="36" r="2.5" fill="#6ab04c"/>
      <text x="32" y="56" font-family="sans-serif" font-size="8" font-weight="900" fill="#f6e58d" text-anchor="middle">TACO MIA</text>
    `
  },
  {
    id: 'papas-freezeria',
    bg: '#006266',
    border: '#ff9ff3',
    svg: `
      <rect width="64" height="64" rx="4" fill="#006266"/>
      <polygon points="20,24 44,24 38,54 26,54" fill="#dfe6e9"/>
      <rect x="22" y="28" width="20" height="6" fill="#ff7675"/>
      <rect x="23" y="36" width="18" height="6" fill="#ffeaa7"/>
      <rect x="25" y="44" width="14" height="6" fill="#74b9ff"/>
      <circle cx="32" cy="18" r="8" fill="#ffffff"/>
      <circle cx="32" cy="12" r="4" fill="#d63031"/>
      <text x="50" y="24" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ff9ff3">❄</text>
    `
  },
  {
    id: 'sleep-walk',
    bg: '#0c102b',
    border: '#48dbfb',
    svg: `
      <rect width="64" height="64" rx="4" fill="#0c102b"/>
      <circle cx="48" cy="16" r="8" fill="#feca57"/>
      <polygon points="6,50 32,32 58,50" fill="#c0392b"/>
      <circle cx="28" cy="24" r="5" fill="#f8c291"/>
      <path d="M28 19 L22 14 L30 14 Z" fill="#48dbfb"/>
      <rect x="26" y="29" width="8" height="14" fill="#48dbfb"/>
      <line x1="34" y1="32" x2="42" y2="32" stroke="#48dbfb" stroke-width="2"/>
      <text x="18" y="20" font-family="sans-serif" font-size="9" fill="#fff">Z</text>
      <text x="24" y="14" font-family="sans-serif" font-size="7" fill="#fff">z</text>
    `
  },
  {
    id: 'headcase',
    bg: '#130f40',
    border: '#ffbe76',
    svg: `
      <rect width="64" height="64" rx="4" fill="#130f40"/>
      <circle cx="32" cy="32" r="18" fill="#f0932b"/>
      <circle cx="25" cy="28" r="4" fill="#fff"/><circle cx="39" cy="28" r="4" fill="#fff"/>
      <circle cx="26" cy="28" r="2" fill="#000"/><circle cx="38" cy="28" r="2" fill="#000"/>
      <ellipse cx="32" cy="38" rx="6" ry="4" fill="#130f40"/>
      <rect x="8" y="48" width="12" height="12" fill="#686de0"/>
      <rect x="44" y="48" width="12" height="12" fill="#686de0"/>
    `
  },
  {
    id: 'top-nail-kristen-stewart',
    bg: '#1a0022',
    border: '#e056fd',
    svg: `
      <rect width="64" height="64" rx="4" fill="#1a0022"/>
      <path d="M20 48 Q20 20 32 12 Q44 20 44 48 Z" fill="#2d3436"/>
      <path d="M26 28 C26 20 38 20 38 28 L36 44 L28 44 Z" fill="#e056fd"/>
      <polygon points="32,16 34,22 40,22 35,26 37,32 32,28 27,32 29,26 24,22 30,22" fill="#f9ca24"/>
      <text x="32" y="58" font-family="sans-serif" font-size="7" font-weight="900" fill="#e056fd" text-anchor="middle">GLAM NAIL</text>
    `
  },
  {
    id: 'heart-of-the-wild-1',
    bg: '#111a2e',
    border: '#70a1ff',
    svg: `
      <rect width="64" height="64" rx="4" fill="#111a2e"/>
      <circle cx="38" cy="24" r="14" fill="#dfe4ea"/>
      <path d="M14 52 L26 36 L30 40 L34 32 L40 42 L48 52 Z" fill="#2f3542"/>
      <path d="M22 38 C22 30 28 26 32 24 C30 28 32 30 28 34 Z" fill="#ced6e0"/>
      <polygon points="12,54 18,34 24,54" fill="#1e272e"/>
      <polygon points="40,54 48,32 54,54" fill="#1e272e"/>
    `
  },
  {
    id: 'heart-of-the-wild-2',
    bg: '#2b1b17',
    border: '#e67e22',
    svg: `
      <rect width="64" height="64" rx="4" fill="#2b1b17"/>
      <circle cx="32" cy="24" r="14" fill="#e67e22"/>
      <path d="M8 56 L24 38 L32 44 L44 32 L56 56 Z" fill="#1e272e"/>
      <text x="50" y="20" font-family="sans-serif" font-size="14" font-weight="900" fill="#f1c40f">2</text>
      <text x="32" y="60" font-family="sans-serif" font-size="7" font-weight="bold" fill="#f39c12" text-anchor="middle">WILD 2</text>
    `
  },
  {
    id: 'imagine-artist',
    bg: '#341f97',
    border: '#10ac84',
    svg: `
      <rect width="64" height="64" rx="4" fill="#341f97"/>
      <ellipse cx="32" cy="36" rx="20" ry="16" fill="#ee5253"/>
      <circle cx="22" cy="30" r="3.5" fill="#feca57"/><circle cx="32" cy="26" r="3.5" fill="#48dbfb"/>
      <circle cx="42" cy="30" r="3.5" fill="#1dd1a1"/><circle cx="26" cy="40" r="3.5" fill="#ff9ff3"/>
      <circle cx="38" cy="40" r="4.5" fill="#341f97"/>
      <line x1="44" y1="12" x2="28" y2="34" stroke="#c8d6e5" stroke-width="3" stroke-linecap="round"/>
      <polygon points="26,36 30,32 27,33" fill="#10ac84"/>
    `
  },
  {
    id: 'bad-ice-cream-1',
    bg: '#004e64',
    border: '#25a18e',
    svg: `
      <rect width="64" height="64" rx="4" fill="#004e64"/>
      <rect x="18" y="16" width="28" height="32" rx="6" fill="#f8f9fa"/>
      <circle cx="26" cy="26" r="3" fill="#000"/><circle cx="38" cy="26" r="3" fill="#000"/>
      <rect x="24" y="34" width="16" height="3" fill="#000"/>
      <polygon points="22,48 42,48 32,60" fill="#e0a96d"/>
      <rect x="8" y="24" width="8" height="8" rx="2" fill="#7ae582"/>
      <rect x="48" y="24" width="8" height="8" rx="2" fill="#7ae582"/>
      <text x="32" y="14" font-family="sans-serif" font-size="8" font-weight="900" fill="#fff" text-anchor="middle">ICE CREAM</text>
    `
  },
  {
    id: 'bad-ice-cream-2',
    bg: '#3e2723',
    border: '#8d6e63',
    svg: `
      <rect width="64" height="64" rx="4" fill="#3e2723"/>
      <rect x="18" y="16" width="28" height="32" rx="6" fill="#5d4037"/>
      <circle cx="26" cy="26" r="3" fill="#fff"/><circle cx="38" cy="26" r="3" fill="#fff"/>
      <circle cx="26" cy="26" r="1.5" fill="#000"/><circle cx="38" cy="26" r="1.5" fill="#000"/>
      <rect x="24" y="34" width="16" height="3" fill="#fff"/>
      <polygon points="22,48 42,48 32,60" fill="#d7ccc8"/>
      <circle cx="12" cy="28" r="4" fill="#e91e63"/>
      <text x="50" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffb74d">2</text>
    `
  },
  {
    id: 'bad-ice-cream-3',
    bg: '#880e4f',
    border: '#f48fb1',
    svg: `
      <rect width="64" height="64" rx="4" fill="#880e4f"/>
      <rect x="18" y="16" width="28" height="32" rx="6" fill="#f06292"/>
      <circle cx="26" cy="26" r="3" fill="#000"/><circle cx="38" cy="26" r="3" fill="#000"/>
      <rect x="24" y="34" width="16" height="3" fill="#000"/>
      <polygon points="22,48 42,48 32,60" fill="#ffd54f"/>
      <rect x="8" y="24" width="8" height="8" rx="2" fill="#80deea"/>
      <text x="50" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffd54f">3</text>
    `
  },
  {
    id: 'peanut-facial-beauty',
    bg: '#f8a5c2',
    border: '#f78fb3',
    svg: `
      <rect width="64" height="64" rx="4" fill="#f8a5c2"/>
      <circle cx="32" cy="32" r="18" fill="#f5cd79"/>
      <circle cx="24" cy="28" r="6" fill="#78e08f"/><circle cx="40" cy="28" r="6" fill="#78e08f"/>
      <circle cx="24" cy="28" r="2" fill="#38ada9"/><circle cx="40" cy="28" r="2" fill="#38ada9"/>
      <path d="M28 40 Q32 44 36 40" stroke="#c44569" stroke-width="2" fill="none"/>
      <circle cx="18" cy="18" r="5" fill="#ff9ff3"/><circle cx="46" cy="18" r="5" fill="#ff9ff3"/>
      <text x="32" y="58" font-family="sans-serif" font-size="7" font-weight="bold" fill="#574b90" text-anchor="middle">BEAUTY SPA</text>
    `
  },
  {
    id: 'power-pamplona',
    bg: '#b71540',
    border: '#f6b93b',
    svg: `
      <rect width="64" height="64" rx="4" fill="#b71540"/>
      <path d="M12 20 Q20 12 28 22" stroke="#f6b93b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M52 20 Q44 12 36 22" stroke="#f6b93b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="32" cy="30" r="14" fill="#0a3d62"/>
      <circle cx="26" cy="28" r="3" fill="#eb2f06"/><circle cx="38" cy="28" r="3" fill="#eb2f06"/>
      <ellipse cx="32" cy="36" rx="6" ry="4" fill="#3c6382"/>
      <polygon points="16,56 48,56 32,46" fill="#e55039"/>
      <text x="32" y="62" font-family="sans-serif" font-size="6" font-weight="900" fill="#fff" text-anchor="middle">PAMPLONA</text>
    `
  }
];

for (const icon of icons) {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" shape-rendering="crispEdges">
    <style>text { user-select: none; }</style>
    ${icon.svg}
    <rect x="0.5" y="0.5" width="63" height="63" rx="3.5" fill="none" stroke="${icon.border}" stroke-width="1"/>
  </svg>`;
  fs.writeFileSync(path.join(outDir, `${icon.id}.svg`), content.trim());
}

console.log(`Generated ${icons.length} game icons successfully in ${outDir}`);
