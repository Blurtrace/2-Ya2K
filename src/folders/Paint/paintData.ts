export type PaintTool = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const PAINT_TOOLS: PaintTool[] = [
  {
    id: 'free-select',
    name: 'Free-Form Select',
    description: 'Selects a free-form part of the picture to move, copy, or edit.',
    icon: 'star',
  },
  {
    id: 'select',
    name: 'Select',
    description: 'Selects a rectangular part of the picture to move, copy, or edit.',
    icon: 'rect-select',
  },
  {
    id: 'eraser',
    name: 'Eraser/Color Eraser',
    description: 'Erases a portion of the picture using the selected eraser shape.',
    icon: 'eraser',
  },
  {
    id: 'fill',
    name: 'Fill With Color',
    description: 'Fills an area with the current drawing color.',
    icon: 'fill',
  },
  {
    id: 'pick-color',
    name: 'Pick Color',
    description: 'Picks up a color from the picture for drawing.',
    icon: 'dropper',
  },
  {
    id: 'magnifier',
    name: 'Magnifier',
    description: 'Changes the magnification.',
    icon: 'magnifier',
  },
  {
    id: 'pencil',
    name: 'Pencil',
    description: 'Draws a free-form line one pixel wide.',
    icon: 'pencil',
  },
  {
    id: 'brush',
    name: 'Brush',
    description: 'Draws using a brush with the selected shape and size.',
    icon: 'brush',
  },
  {
    id: 'airbrush',
    name: 'Airbrush',
    description: 'Draws using an airbrush of the selected spray size.',
    icon: 'airbrush',
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Inserts text into the picture.',
    icon: 'text',
  },
  {
    id: 'line',
    name: 'Line',
    description: 'Draws a straight line with the selected line width.',
    icon: 'line',
  },
  {
    id: 'curve',
    name: 'Curve',
    description: 'Draws a curved line with the selected line width.',
    icon: 'curve',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    description: 'Draws a rectangle with the selected fill style.',
    icon: 'rectangle',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    description: 'Draws a polygon with the selected fill style.',
    icon: 'polygon',
  },
  {
    id: 'ellipse',
    name: 'Ellipse',
    description: 'Draws an ellipse with the selected fill style.',
    icon: 'ellipse',
  },
  {
    id: 'rounded-rect',
    name: 'Rounded Rectangle',
    description: 'Draws a rounded rectangle with the selected fill style.',
    icon: 'rounded-rect',
  },
];

export const PAINT_PALETTE: string[] = [
  // Fila 1 (14 colores oscuros / primarios)
  '#000000',
  '#808080',
  '#800000',
  '#808000',
  '#008000',
  '#008080',
  '#000080',
  '#800080',
  '#808040',
  '#004040',
  '#0080FF',
  '#004080',
  '#8000FF',
  '#804000',
  // Fila 2 (14 colores brillantes / secundarios)
  '#FFFFFF',
  '#C0C0C0',
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FFFF80',
  '#00FF80',
  '#80FFFF',
  '#7F7FFF',
  '#FF0080',
  '#FF8040',
];

export const ABOUT_DEDICATION = {
  windowTitle: 'About Yaczury Navarro - ECOS 98',
  heading: '¿Quién es Yaczury Navarro?',
  paragraphs: [
    'Si me preguntan a mi les diré que es una mujer espectacular, de principios, valores y virtudes dignas de escribir en libros (aunque a veces un poco cascarrabias) y eso la hace ser Yazu. Porque no me hayo (y creo que ustedes tampoco) a esta mujer sin su enojo caracteristico, ella no sería ella.',
    'Yaczury es mi novia, su amiga, hija, hermana, prima, sobrina o nieta, pero creanme cuando les digo que su personalidad premium es algo digno de subir a redes JAJAJA.',
    'Feliz cumpleaños mi niña, te amo 3 millones <3',
  ],
  signature: '- Jandy Peña / BlurTrace / Clyde',
};
