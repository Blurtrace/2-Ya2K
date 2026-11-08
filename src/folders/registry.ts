import type { FolderDef } from '@/os/state/types';

/**
 * Única fuente de verdad de las carpetas de ECOS.
 * Todas las carpetas se modelan como datos estructurados puros sin clases.
 */
export const folders: FolderDef[] = [
  {
    id: 'my-computer',
    nameKey: 'folder.myComputer',            // "Mi PC" / "My Computer"
    icon: '/icons/my-computer.png',
    status: 'planned',                       // Stub inicial - icono mítico de Windows 98
  },
  {
    id: 'recycle-bin',
    nameKey: 'folder.recycleBin',            // "Papelera" / "Recycle Bin"
    icon: '/icons/recycle-bin.png',
    status: 'planned',                       // Stub inicial - icono mítico de Windows 98
  },
  {
    id: 'games',
    nameKey: 'folder.games',                 // "Juegos" / "Games"
    icon: '/icons/folder-games.png',
    status: 'ready',                         // Carpeta independiente de juegos clásicos de Friv
  },
  {
    id: 'if-love-were-songs',
    nameKey: 'folder.ifLoveWereSongs',       // "Si el amor fuera canciones" / "If love were songs"
    icon: '/icons/folder-music.png',
    status: 'ready',                         // Reproductor de música retro Windows Media Player 98
  },
  {
    id: 'comments',
    nameKey: 'folder.comments',              // "<3"
    icon: '/icons/folder-heart.png',
    status: 'ready',                         // Álbum de fotos cronológico Polaroid Windows 98 Classic (<3)
  },
  {
    id: 'our-love',
    nameKey: 'folder.ourLove',               // "Nuestro Amor" / "Our Love"
    icon: '/icons/folder-love.png',
    status: 'planned',                       // Stub
  },
  {
    id: 'minesweeper',
    nameKey: 'app.minesweeper',              // "Buscaminas" / "Minesweeper"
    icon: '/icons/minesweeper.png',
    status: 'ready',                         // Juego nativo Windows 98
  },
  {
    id: 'solitaire',
    nameKey: 'app.solitaire',                // "Solitario" / "Solitaire"
    icon: '/icons/solitaire.png',
    status: 'ready',                         // Juego nativo Windows 98
  },
  {
    id: 'pinball',
    nameKey: 'app.pinball',                  // "3D Pinball" / "3D Pinball"
    icon: '/icons/pinball.png',
    status: 'ready',                         // Motor original WebAssembly
  },
  {
    id: 'purble-place',
    nameKey: 'app.purblePlace',              // "Purble Place" / "Purble Place"
    icon: '/icons/purble-place.png',
    status: 'ready',                         // Versión web con los 3 minijuegos
  },
];

/**
 * Busca recursivamente una definición de carpeta por su ID único.
 */
export const findFolderById = (id: string, list: FolderDef[] = folders): FolderDef | undefined => {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.children) {
      const childMatch = findFolderById(id, item.children);
      if (childMatch) return childMatch;
    }
  }
  return undefined;
};

/**
 * Devuelve únicamente las carpetas de nivel superior que residen en el escritorio.
 */
export const getDesktopFolders = (): FolderDef[] => folders;

