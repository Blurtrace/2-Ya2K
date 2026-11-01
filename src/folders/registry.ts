import type { FolderDef } from '@/os/state/types';

/**
 * Única fuente de verdad de las carpetas de ECOS.
 * Todas las carpetas se modelan como datos estructurados puros sin clases.
 */
export const folders: FolderDef[] = [
  {
    id: 'bank-of-memories',
    nameKey: 'folder.bankOfMemories',        // "BANK OF MEMORIES"
    icon: '/icons/folder-memories.png',
    status: 'ready',                         // Contenedor: lista sus carpetas hijas
    children: [
      {
        id: 'memories-carousel',
        nameKey: 'folder.carousel',          // "Carousel"
        icon: '/icons/folder-photos.png',
        status: 'planned',                   // Stub hasta especificación del usuario
      },
      {
        id: 'memories-games',
        nameKey: 'folder.games',             // "Games"
        icon: '/icons/folder-games.png',
        status: 'planned',                   // Stub hasta especificación del usuario
      },
    ],
  },
  {
    id: 'if-love-were-songs',
    nameKey: 'folder.ifLoveWereSongs',       // "If love were songs"
    icon: '/icons/folder-music.png',
    status: 'planned',                       // Stub
  },
  {
    id: 'comments',
    nameKey: 'folder.comments',              // "<3"
    icon: '/icons/folder-heart.png',
    status: 'planned',                       // Stub
  },
  {
    id: 'our-love',
    nameKey: 'folder.ourLove',               // "Our Love"
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

