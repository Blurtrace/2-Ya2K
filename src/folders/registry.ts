import type { FolderDef } from '@/os/state/types';

/**
 * Única fuente de verdad de las carpetas de ECOS.
 * Todas las carpetas se modelan como datos estructurados puros sin clases.
 */
export const folders: FolderDef[] = [
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
    status: 'planned',                       // Stub
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

