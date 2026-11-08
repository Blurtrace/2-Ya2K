export type LoveMediaItem = {
  id: string;
  year: number;
  month: number;
  displayDate: string;
  displayDateEn?: string;
  location: string;
  locationEn?: string;
  sender: 'Jandy';
  quote: string;
  quoteEn?: string;
  src: string;
  mediaType: 'image';
};

export const getOurLoveQuote = (item: LoveMediaItem, lang: string): string => {
  if (lang === 'en' && item.quoteEn) {
    return item.quoteEn;
  }
  return item.quote;
};

export const getOurLoveLocation = (item: LoveMediaItem, lang: string): string => {
  if (lang === 'en' && item.locationEn) {
    return item.locationEn;
  }
  return item.location;
};

export const getOurLoveDisplayDate = (item: LoveMediaItem, lang: string): string => {
  if (lang === 'en' && item.displayDateEn) {
    return item.displayDateEn;
  }
  return item.displayDate;
};

/**
 * Catálogo cronológico completo de fotografías y recuerdos de Nuestro Amor (Jandy y Yaczury).
 * Ordenado estrictamente por fecha real (Mayo 2023 — Enero 2026).
 */
export const ourLoveData: LoveMediaItem[] = [
  // ================= 2023 =================
  {
    id: 'love-2023-may',
    year: 2023,
    month: 5,
    displayDate: 'Mayo 2023',
    displayDateEn: 'May 2023',
    location: "McDonald's",
    locationEn: "McDonald's",
    sender: 'Jandy',
    quote: '¿Cómo voy a olvidar aquella primera cita a escondidas? Aún recuerdo que tu excusa fue "Voy a salir con las pelas".',
    quoteEn: 'How could I ever forget that first secret date? I still remember your excuse was "I\'m going out with the girls."',
    src: '/photos/our-love/2023-may.jpg',
    mediaType: 'image',
  },

  // ================= 2024 =================
  {
    id: 'love-2024-apr',
    year: 2024,
    month: 4,
    displayDate: 'Abril 2024',
    displayDateEn: 'April 2024',
    location: 'Malecón',
    locationEn: 'Malecón',
    sender: 'Jandy',
    quote: 'Nuestro primer picnic, súper tierno recordar toda esa cita.',
    quoteEn: 'Our first picnic, so sweet to look back on that whole date.',
    src: '/photos/our-love/2024-apr.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-apr1',
    year: 2024,
    month: 4,
    displayDate: 'Abril 2024',
    displayDateEn: 'April 2024',
    location: 'Malecón',
    locationEn: 'Malecón',
    sender: 'Jandy',
    quote: 'Es como transportarme al tiempo donde empecé a enamorarme de ti.',
    quoteEn: 'It feels like traveling back in time to when I first began falling in love with you.',
    src: '/photos/our-love/2024-apr1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-apr-2',
    year: 2024,
    month: 4,
    displayDate: 'Abril 2024',
    displayDateEn: 'April 2024',
    location: 'Malecón',
    locationEn: 'Malecón',
    sender: 'Jandy',
    quote: 'Y créeme, es un sentimiento que no cambiaría por nada...',
    quoteEn: "And believe me, it's a feeling I wouldn't trade for anything...",
    src: '/photos/our-love/2024-apr-2.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-agu',
    year: 2024,
    month: 8,
    displayDate: 'Agosto 2024',
    displayDateEn: 'August 2024',
    location: 'Parque Alegra',
    locationEn: 'Parque Alegra', // Nombre propio sin traducción
    sender: 'Jandy',
    quote: 'El primer regalo que te hice y sorprendió tanto porque no te esperabas esa ideotaaaa. Sabes que me encanta sorprenderte.',
    quoteEn: 'The first gift I ever gave you, and it surprised you so much because you never saw that huge idea coming. You know I love surprising you.',
    src: '/photos/our-love/2024-agu.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-agu1',
    year: 2024,
    month: 8,
    displayDate: 'Agosto 2024',
    displayDateEn: 'August 2024',
    location: 'Parque Alegra',
    locationEn: 'Parque Alegra', // Nombre propio sin traducción
    sender: 'Jandy',
    quote: 'De tus películas favoritas, pero esta vez en lo que más amas, un libro...',
    quoteEn: 'From one of your favorite movies, but this time in what you love most: a book...',
    src: '/photos/our-love/2024-agu1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-nov',
    year: 2024,
    month: 11,
    displayDate: 'Noviembre 2024',
    displayDateEn: 'November 2024',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'Me encanta verte feliz, soy feliz si tu felicidad está latente, TE AMO',
    quoteEn: 'I love seeing you happy; I am happy whenever your joy is alive. I LOVE YOU',
    src: '/photos/our-love/2024-nov.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-nov1',
    year: 2024,
    month: 11,
    displayDate: 'Noviembre 2024',
    displayDateEn: 'November 2024',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'ESPERO TE HAYA HECHO FELIZ ESE REGALO',
    quoteEn: 'I HOPE THAT GIFT MADE YOU SO HAPPY',
    src: '/photos/our-love/2024-nov1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-dec',
    year: 2024,
    month: 12,
    displayDate: 'Diciembre 2024',
    displayDateEn: 'December 2024',
    location: 'Plaza del Parque - WetSunday',
    locationEn: 'Plaza del Parque - WetSunday', // Nombre propio sin traducción
    sender: 'Jandy',
    quote: 'La foto más icónica de nuestra relación es esta, me encanta tanto, nos vemos espectacular aquí.',
    quoteEn: 'The most iconic photo of our relationship is this one; I love it so much, we look spectacular here.',
    src: '/photos/our-love/2024-dec.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-dec1',
    year: 2024,
    month: 12,
    displayDate: 'Diciembre 2024',
    displayDateEn: 'December 2024',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'Me encanta tomarte fotos distraída, eres mi musa ¿Puedo fotografiarte toda la vida?',
    quoteEn: "I love taking candid photos of you, you're my muse. Can I photograph you for the rest of my life?",
    src: '/photos/our-love/2024-dec1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-dec2',
    year: 2024,
    month: 12,
    displayDate: 'Diciembre 2024',
    displayDateEn: 'December 2024',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'Nuestra primera rutina de Skin Care y también nuestro primer video de TikTok JAJAJAJA',
    quoteEn: 'Our first skincare routine and also our first TikTok video HAHAHAHA',
    src: '/photos/our-love/2024-dec2.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2024-dec3',
    year: 2024,
    month: 12,
    displayDate: 'Diciembre 2024',
    displayDateEn: 'December 2024',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'AQUÍ PODEMOS VER A UN HOMBRE QUE SE ARREPIENTE DE ABSOLUTAMENTE NADA',
    quoteEn: 'HERE WE SEE A MAN WHO REGRETS ABSOLUTELY NOTHING',
    src: '/photos/our-love/2024-dec3.JPEG',
    mediaType: 'image',
  },

  // ================= 2025 =================
  {
    id: 'love-2025-jan',
    year: 2025,
    month: 1,
    displayDate: 'Enero 2025',
    displayDateEn: 'January 2025',
    location: 'Malecón',
    locationEn: 'Malecón',
    sender: 'Jandy',
    quote: 'Por favor, que tus ojitos nunca dejen de mirarme',
    quoteEn: 'Please, may your lovely eyes never stop looking at me',
    src: '/photos/our-love/2025-jan.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-feb',
    year: 2025,
    month: 2,
    displayDate: 'Febrero 2025',
    displayDateEn: 'February 2025',
    location: 'Casa de Zharick',
    locationEn: "Zharick's House",
    sender: 'Jandy',
    quote: 'AMAR es una decisión y por eso decido a ciegas confiar mi vida a ti',
    quoteEn: 'LOVING is a choice, and that is why I blindly choose to trust my life to you',
    src: '/photos/our-love/2025-feb.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-mar',
    year: 2025,
    month: 3,
    displayDate: 'Marzo 2025',
    displayDateEn: 'March 2025',
    location: 'Donde Argel',
    locationEn: 'Donde Argel', // Nombre propio sin traducción
    sender: 'Jandy',
    quote: 'Nuestro primer carnaval',
    quoteEn: 'Our first carnival',
    src: '/photos/our-love/2025-mar.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-mar1',
    year: 2025,
    month: 3,
    displayDate: 'Marzo 2025',
    displayDateEn: 'March 2025',
    location: 'Donde Argel',
    locationEn: 'Donde Argel', // Nombre propio sin traducción
    sender: 'Jandy',
    quote: 'Nuestro primer carnaval',
    quoteEn: 'Our first carnival',
    src: '/photos/our-love/2025-mar1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-apr',
    year: 2025,
    month: 4,
    displayDate: 'Abril 2025',
    displayDateEn: 'April 2025',
    location: 'Casamiento de Andrea',
    locationEn: "Andrea's Wedding",
    sender: 'Jandy',
    quote: 'LA PAREJA DEL MOMENTO',
    quoteEn: 'THE COUPLE OF THE MOMENT',
    src: '/photos/our-love/2025-apr.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-jun',
    year: 2025,
    month: 6,
    displayDate: 'Junio 2025',
    displayDateEn: 'June 2025',
    location: 'Casa de Roselis',
    locationEn: "Roselis's House",
    sender: 'Jandy',
    quote: '«El amor, por no tener geografía, no conoce límites». — Truman Capote',
    quoteEn: '“Love, having no geography, knows no boundaries.” — Truman Capote',
    src: '/photos/our-love/2025-jun.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-jun1',
    year: 2025,
    month: 6,
    displayDate: 'Junio 2025',
    displayDateEn: 'June 2025',
    location: 'Casa de Roselis',
    locationEn: "Roselis's House",
    sender: 'Jandy',
    quote: '«El amor, por no tener geografía, no conoce límites». — Truman Capote',
    quoteEn: '“Love, having no geography, knows no boundaries.” — Truman Capote',
    src: '/photos/our-love/2025-jun1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-jul',
    year: 2025,
    month: 7,
    displayDate: 'Julio 2025',
    displayDateEn: 'July 2025',
    location: 'Casa de Jandy',
    locationEn: "Jandy's House",
    sender: 'Jandy',
    quote: '«Amar no es mirarse el uno al otro, es mirar juntos en la misma dirección». — Antoine de Saint-Exupéry',
    quoteEn: '“Love does not consist of gazing at each other, but in looking outward together in the same direction.” — Antoine de Saint-Exupéry',
    src: '/photos/our-love/2025-jul.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-sep',
    year: 2025,
    month: 9,
    displayDate: 'Septiembre 2025',
    displayDateEn: 'September 2025',
    location: 'Centro Comercial Viva',
    locationEn: 'Viva Shopping Mall', // Viva no se traduce
    sender: 'Jandy',
    quote: 'Mi novia, mi mejor amiga, mi hermana, mi payasa, pero sobre todo: La mujer a quién amo.',
    quoteEn: 'My girlfriend, my best friend, my sister, my clown, but above all: The woman I love.',
    src: '/photos/our-love/2025-sep.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-sep1',
    year: 2025,
    month: 9,
    displayDate: 'Septiembre 2025',
    displayDateEn: 'September 2025',
    location: 'Centro Comercial Viva',
    locationEn: 'Viva Shopping Mall',
    sender: 'Jandy',
    quote: 'Mi novia, mi mejor amiga, mi hermana, mi payasa, pero sobre todo: La mujer a quién amo.',
    quoteEn: 'My girlfriend, my best friend, my sister, my clown, but above all: The woman I love.',
    src: '/photos/our-love/2025-sep1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-sep2',
    year: 2025,
    month: 9,
    displayDate: 'Septiembre 2025',
    displayDateEn: 'September 2025',
    location: 'Centro Comercial Viva',
    locationEn: 'Viva Shopping Mall',
    sender: 'Jandy',
    quote: 'Mi novia, mi mejor amiga, mi hermana, mi payasa, pero sobre todo: La mujer a quién amo.',
    quoteEn: 'My girlfriend, my best friend, my sister, my clown, but above all: The woman I love.',
    src: '/photos/our-love/2025-sep2.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-oct1',
    year: 2025,
    month: 10,
    displayDate: 'Octubre 2025',
    displayDateEn: 'October 2025',
    location: 'Playas de Tubará',
    locationEn: 'Tubará Beaches',
    sender: 'Jandy',
    quote: 'Sol, playa, arena y tú ¿Qué más le puedo pedir a mi vida?',
    quoteEn: 'Sun, beach, sand and you. What more could I ever ask of life?',
    src: '/photos/our-love/2025-oct1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-nov',
    year: 2025,
    month: 11,
    displayDate: 'Noviembre 2025',
    displayDateEn: 'November 2025',
    location: 'Casa de Jandy',
    locationEn: "Jandy's House",
    sender: 'Jandy',
    quote: '¿Recuerdas esa noche? Todo fue perfecto, tanto que sentí que la noche sería eterna a tu lado',
    quoteEn: 'Do you remember that night? Everything was perfect, so much so that I felt the night would last forever by your side',
    src: '/photos/our-love/2025-nov.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-dec',
    year: 2025,
    month: 12,
    displayDate: 'Diciembre 2025',
    displayDateEn: 'December 2025',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'En tus brazos siempre seré muy, muy, muy muy más feliz...',
    quoteEn: 'In your arms I will always be so, so, so very much happier...',
    src: '/photos/our-love/2025-dec.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2025-dec1',
    year: 2025,
    month: 12,
    displayDate: 'Diciembre 2025',
    displayDateEn: 'December 2025',
    location: 'Casa de Yaczury',
    locationEn: "Yaczury's House",
    sender: 'Jandy',
    quote: 'Beso — Jósean Log',
    quoteEn: 'Beso — Jósean Log',
    src: '/photos/our-love/2025-dec1.JPEG',
    mediaType: 'image',
  },

  // ================= 2026 =================
  {
    id: 'love-2026-jan',
    year: 2026,
    month: 1,
    displayDate: 'Enero 2026',
    displayDateEn: 'January 2026',
    location: 'Cartagena de Indias',
    locationEn: 'Cartagena de Indias',
    sender: 'Jandy',
    quote: 'Nuestro primer viajecito solos, fue tan hermoso viajar contigo, caminar La Ciudad Amurallada, tomarme fotos contigo, fotografiarte, reír contigo (Es algo que quisiera repetir).',
    quoteEn: "Our first little trip alone, it was so beautiful to travel with you, walk through the Walled City, take photos together, photograph you, laugh with you (It's something I wish to do again and again).",
    src: '/photos/our-love/2026-jan.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2026-jan1',
    year: 2026,
    month: 1,
    displayDate: 'Enero 2026',
    displayDateEn: 'January 2026',
    location: 'Cartagena de Indias',
    locationEn: 'Cartagena de Indias',
    sender: 'Jandy',
    quote: 'Nuestro primer viajecito solos, fue tan hermoso viajar contigo, caminar La Ciudad Amurallada, tomarme fotos contigo, fotografiarte, reír contigo (Es algo que quisiera repetir).',
    quoteEn: "Our first little trip alone, it was so beautiful to travel with you, walk through the Walled City, take photos together, photograph you, laugh with you (It's something I wish to do again and again).",
    src: '/photos/our-love/2026-jan1.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2026-jan2',
    year: 2026,
    month: 1,
    displayDate: 'Enero 2026',
    displayDateEn: 'January 2026',
    location: 'Cartagena de Indias',
    locationEn: 'Cartagena de Indias',
    sender: 'Jandy',
    quote: 'Nuestro primer viajecito solos, fue tan hermoso viajar contigo, caminar La Ciudad Amurallada, tomarme fotos contigo, fotografiarte, reír contigo (Es algo que quisiera repetir).',
    quoteEn: "Our first little trip alone, it was so beautiful to travel with you, walk through the Walled City, take photos together, photograph you, laugh with you (It's something I wish to do again and again).",
    src: '/photos/our-love/2026-jan2.JPEG',
    mediaType: 'image',
  },
  {
    id: 'love-2026-jan3',
    year: 2026,
    month: 1,
    displayDate: 'Enero 2026',
    displayDateEn: 'January 2026',
    location: 'Cartagena de Indias',
    locationEn: 'Cartagena de Indias',
    sender: 'Jandy',
    quote: `Cierro con esta foto, un abrazo y tus labios rojos, dos de las cosas que siempre quiero tener en mi vida, pues todo de ti me es gratificante y placentero, desde tus pequeños enojos, hasta tus explosiones de amor, porque de ti he aprendido que el amor y la confianza se construyen entre los dos y no solamente porque uno lo decide.

Amor eterno
Autor: Gustavo Adolfo Bécquer

Podrá nublarse el sol eternamente;
podrá secarse en un instante el mar;
podrá romperse el eje de la tierra
como un débil cristal.
¡Todo sucederá! Podrá la muerte
cubrirnos con su fúnebre crespón;
pero jamás en mí podrá apagarse
la llama de tu amor.`,
    quoteEn: `I close with this photo, a warm embrace and your red lips, two of the things I always want in my life. Everything about you is rewarding and joyful to me, from your little pouts to your sudden bursts of love, because from you I've learned that love and trust are built together, not just decided by one alone.

Eternal Love
Author: Gustavo Adolfo Bécquer

The sun may cloud over forever;
The sea may dry up in an instant;
The axis of the Earth may shatter
Like fragile glass.
All this will happen! Death may
Cover us with its mournful shroud;
Yet never in my soul shall fade
The burning flame of your love.`,
    src: '/photos/our-love/2026-jan3.JPEG',
    mediaType: 'image',
  },
];
