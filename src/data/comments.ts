/**
 * Frontera de datos para comentarios de la carpeta "<3".
 * Implementación funcional simulada (MOCK en memoria).
 * Sin clases, sin dependencias a base de datos externa en esta fase.
 */

export type Comment = {
  id: string;
  author: string;
  message: string;
  createdAt: string;
};

export type NewCommentInput = {
  author: string;
  message: string;
};

// Datos simulados de ejemplo en memoria
const MOCK_COMMENTS: Comment[] = [
  {
    id: 'mock-1',
    author: 'Invitado Y2K',
    message: '¡Felicitaciones! Este escritorio de Windows 98 quedó increíble.',
    createdAt: '1999-12-31T23:59:00.000Z',
  },
  {
    id: 'mock-2',
    author: 'Amigo Retro',
    message: 'Hermosos recuerdos, un gran abrazo para ambos <3',
    createdAt: '2000-01-01T00:01:00.000Z',
  },
];

/**
 * Obtiene la lista de comentarios simulados.
 * Devuelve una Promesa para mantener la misma firma asíncrona que tendrá la BD real.
 */
export const listComments = async (): Promise<Comment[]> => {
  // Simulación de latencia de red mínima
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...MOCK_COMMENTS];
};

/**
 * Agrega un nuevo comentario a la colección simulada en memoria.
 */
export const addComment = async (input: NewCommentInput): Promise<Comment> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    author: input.author.trim() || 'Anónimo',
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  MOCK_COMMENTS.unshift(newComment);
  return newComment;
};

