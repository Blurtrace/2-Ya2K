export type Song = {
  id: string;
  trackNumber: number;
  title: string;
  artist: string;
  spotifyId: string;
  spotifyUrl: string;
  coverUrl: string;
  audioUrl: string;
  dedication: string;
  dedication_es: string;
  dedication_en: string;
};

export const SPOTIFY_FULL_PLAYLIST_URL =
  'https://open.spotify.com/playlist/4MsctK8ce9jiAejXEJEIY8?si=d15e8f6312fb4f38';

export const getSongDedication = (song: Song, lang: string): string => {
  if (lang === 'en' && song.dedication_en) {
    return song.dedication_en;
  }
  return song.dedication_es || song.dedication;
};

export const SONGS_DATA: Song[] = [
  {
    id: '01',
    trackNumber: 1,
    title: 'Di que si',
    artist: "L'Omy",
    spotifyId: '2Rs27qUTfuCVLSsDaRYtND',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/2Rs27qUTfuCVLSsDaRYtND?si=6cdc9a66e96242de',
    coverUrl: '/songs/covers/01-di-que-si.jpg',
    audioUrl: '/api/songs/audio/01',
    dedication: 'Cuando quieras saber cuante me gustas en costeñol',
    dedication_es: 'Cuando quieras saber cuante me gustas en costeñol',
    dedication_en: 'Whenever you want to know how much I like you in Costeño slang',
  },
  {
    id: '02',
    trackNumber: 2,
    title: 'Beso',
    artist: 'Rosalía, Rauw Alejandro',
    spotifyId: '609E1JCInJncactoMmkDon',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/609E1JCInJncactoMmkDon?si=eb585803e6fc4fc1',
    coverUrl: '/songs/covers/02-beso-rosalia.jpg',
    audioUrl: '/api/songs/audio/02',
    dedication: 'Lo mucho que te extraño y el como se siente tenerte lejos',
    dedication_es: 'Lo mucho que te extraño y el como se siente tenerte lejos',
    dedication_en: 'How much I miss you and what it feels like having you so far away',
  },
  {
    id: '03',
    trackNumber: 3,
    title: 'Smithereens',
    artist: 'Twenty One Pilots',
    spotifyId: '5G6Gt9RtNaeIE418pd4yre',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/5G6Gt9RtNaeIE418pd4yre?si=a77db8a4696e420a',
    coverUrl: '/songs/covers/03-smithereens.jpg',
    audioUrl: '/api/songs/audio/03',
    dedication: 'Lo capaz que soy de hacer por ti',
    dedication_es: 'Lo capaz que soy de hacer por ti',
    dedication_en: 'Everything I am capable of doing for you',
  },
  {
    id: '04',
    trackNumber: 4,
    title: 'Tear in my Heart',
    artist: 'Twenty One Pilots',
    spotifyId: '3bnVBN67NBEzedqQuWrpP4',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/3bnVBN67NBEzedqQuWrpP4?si=fba61ba328624fb5',
    coverUrl: '/songs/covers/04-tear-in-my-heart.jpg',
    audioUrl: '/api/songs/audio/04',
    dedication:
      'Simbolo de cuanto te amo, el miedo que tuve en un principio y como tu amor me hace sentir cuando estoy contigo',
    dedication_es:
      'Simbolo de cuanto te amo, el miedo que tuve en un principio y como tu amor me hace sentir cuando estoy contigo',
    dedication_en:
      'A symbol of how much I love you, the fear I had at first, and how your love makes me feel when I am with you',
  },
  {
    id: '05',
    trackNumber: 5,
    title: 'Carita Linda',
    artist: 'DEKKO',
    spotifyId: '3nEpf7LfISOfV1lxtAD6ks',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/3nEpf7LfISOfV1lxtAD6ks?si=c53d0d3ee30343c6',
    coverUrl: '/songs/covers/05-carita-linda.jpg',
    audioUrl: '/api/songs/audio/05',
    dedication:
      'Eres la mujer que tanto soñé y te convertiste en la mujer que quiero tener a mi lado',
    dedication_es:
      'Eres la mujer que tanto soñé y te convertiste en la mujer que quiero tener a mi lado',
    dedication_en:
      'You are the woman I dreamed of so much, and you became the woman I want by my side',
  },
  {
    id: '06',
    trackNumber: 6,
    title: 'Te encontré',
    artist: 'El Vega',
    spotifyId: '2kP6fOqdSQ5CYqVH5z5844',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/2kP6fOqdSQ5CYqVH5z5844?si=bc43ee23c16d4f24',
    coverUrl: '/songs/covers/06-te-encontre.jpg',
    audioUrl: '/api/songs/audio/06',
    dedication:
      'Por mucho tiempo he estado buscando el amor y la perfección, al encontrarme contigo entendí que la perfección es algo que se contruye',
    dedication_es:
      'Por mucho tiempo he estado buscando el amor y la perfección, al encontrarme contigo entendí que la perfección es algo que se contruye',
    dedication_en:
      'For a long time I searched for love and perfection; upon finding you, I realized perfection is something we build together',
  },
  {
    id: '07',
    trackNumber: 7,
    title: 'Amor a primera vista',
    artist: 'Koffee el Kafetero, El Vega',
    spotifyId: '62rn4zB6HFncX5RbiPJqW5',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/62rn4zB6HFncX5RbiPJqW5?si=eab480e1e4ff48bb',
    coverUrl: '/songs/covers/07-amor-a-primera-vista.jpg',
    audioUrl: '/api/songs/audio/07',
    dedication:
      'Cuando te quieras enamorar de mi parla vieja, ya sabes a donde escuchar mi parla... ;)',
    dedication_es:
      'Cuando te quieras enamorar de mi parla vieja, ya sabes a donde escuchar mi parla... ;)',
    dedication_en:
      'Whenever you want to fall for my old charm and sweet talk, you know right where to listen... ;)',
  },
  {
    id: '08',
    trackNumber: 8,
    title: 'Tu amor me hace bien',
    artist: 'Marc Anthony',
    spotifyId: '3yEtuhGR8jOtusa29jWrhG',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/3yEtuhGR8jOtusa29jWrhG?si=9edbc662979b407d',
    coverUrl: '/songs/covers/08-tu-amor-me-hace-bien.jpg',
    audioUrl: '/api/songs/audio/08',
    dedication:
      '¿Quieres entender como me siento contigo a mi lado? Dale play y descubrelo cada vez que quieras recordarlo',
    dedication_es:
      '¿Quieres entender como me siento contigo a mi lado? Dale play y descubrelo cada vez que quieras recordarlo',
    dedication_en:
      'Want to understand how I feel with you by my side? Press play and discover it whenever you want a reminder',
  },
  {
    id: '09',
    trackNumber: 9,
    title: 'Me gustas CC',
    artist: 'ROA',
    spotifyId: '4Hkp1TiYqGYhknFwtUsbqd',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/4Hkp1TiYqGYhknFwtUsbqd?si=ca28505df6f44100',
    coverUrl: '/songs/covers/09-me-gustas-cc.jpg',
    audioUrl: '/api/songs/audio/09',
    dedication:
      'El amor fisico también es importante entre nosotros, por eso me salgo de lo romantico para decirte lo mucho que te deseo',
    dedication_es:
      'El amor fisico también es importante entre nosotros, por eso me salgo de lo romantico para decirte lo mucho que te deseo',
    dedication_en:
      'Physical love is also important between us, so I step out of romance for a moment to tell you just how much I desire you',
  },
  {
    id: '10',
    trackNumber: 10,
    title: '7 Palabras',
    artist: 'Kaleth Morales',
    spotifyId: '5QYH8Sufitu4q7LQwdYcbv',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/5QYH8Sufitu4q7LQwdYcbv?si=482d7904e0e64c2d',
    coverUrl: '/songs/covers/10-7-palabras.jpg',
    audioUrl: '/api/songs/audio/10',
    dedication:
      'En un principio me sentía así, dudaba de cuanto podrías llegar a amarme, pero quedate siempre con esas 7 palabras que dice Kaleth',
    dedication_es:
      'En un principio me sentía así, dudaba de cuanto podrías llegar a amarme, pero quedate siempre con esas 7 palabras que dice Kaleth',
    dedication_en:
      'At first I felt like this, wondering how deeply you could love me, but always hold onto those 7 words Kaleth sings',
  },
  {
    id: '11',
    trackNumber: 11,
    title: 'Stop The World I Wanna Get Off With You',
    artist: 'Arctic Monkeys',
    spotifyId: '2QUlMbvD9bL8wHqfsoqoet',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/2QUlMbvD9bL8wHqfsoqoet?si=2e3523ae1b1a415a',
    coverUrl: '/songs/covers/11-stop-the-world.jpg',
    audioUrl: '/api/songs/audio/11',
    dedication:
      'Expresa cuan capaz me sentía yo por tener una cita contigo cuando aún estabamos empezando a salir...',
    dedication_es:
      'Expresa cuan capaz me sentía yo por tener una cita contigo cuando aún estabamos empezando a salir...',
    dedication_en:
      'Captures just how determined I felt to have a date with you when we were just starting to go out...',
  },
  {
    id: '12',
    trackNumber: 12,
    title: 'Sweater Weather',
    artist: 'The Neighbourhood',
    spotifyId: '2QjOHCTQ1Jl3zawyYOpxh6',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/2QjOHCTQ1Jl3zawyYOpxh6?si=f54da58e374542d9',
    coverUrl: '/songs/covers/12-sweater-weather.jpg',
    audioUrl: '/api/songs/audio/12',
    dedication:
      'Para que recordemos aquellos tiempos de 2022 ;) ¿No te hace sentir igual?',
    dedication_es:
      'Para que recordemos aquellos tiempos de 2022 ;) ¿No te hace sentir igual?',
    dedication_en:
      'So we remember those times back in 2022 ;) Doesn’t it make you feel the same?',
  },
  {
    id: '13',
    trackNumber: 13,
    title: 'We fell in love in October',
    artist: 'Girl In Red',
    spotifyId: '1BYZxKSf0aTxp8ZFoeyM3d',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/1BYZxKSf0aTxp8ZFoeyM3d?si=44da44ec4be543a0',
    coverUrl: '/songs/covers/13-we-fell-in-love-in-october.jpg',
    audioUrl: '/api/songs/audio/13',
    dedication:
      '¿Quieres saber en qué epoca me enamoré de ti? La pista está en el nombre de la canción',
    dedication_es:
      '¿Quieres saber en qué epoca me enamoré de ti? La pista está en el nombre de la canción',
    dedication_en:
      'Want to know what time of year I fell in love with you? The clue is in the song name',
  },
  {
    id: '14',
    trackNumber: 14,
    title: "Baby I'm Yours",
    artist: 'Arctic Monkeys',
    spotifyId: '0SzvmWfOhoxZVGrmvb56YL',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/0SzvmWfOhoxZVGrmvb56YL?si=c1fa9a1f280a49bc',
    coverUrl: '/songs/covers/14-baby-im-yours.jpg',
    audioUrl: '/api/songs/audio/14',
    dedication: 'Vivo por y para ti, incluso si el cielo llegase a quedarse sin estrellas',
    dedication_es: 'Vivo por y para ti, incluso si el cielo llegase a quedarse sin estrellas',
    dedication_en: 'I live for you and only you, even if the sky were to run out of stars',
  },
  {
    id: '15',
    trackNumber: 15,
    title: 'Audio',
    artist: 'SIA, Diplo, Labrinth, LSD',
    spotifyId: '100eDEmpWV5YGVCqHI0leU',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/100eDEmpWV5YGVCqHI0leU?si=b3d4f45ad7d747a8',
    coverUrl: '/songs/covers/15-audio-lsd.jpg',
    audioUrl: '/api/songs/audio/15',
    dedication:
      'Quiero recordarte que mi amor se escribe en prosa y la música habla por mi; de manera que quiero que conecte con cada una de las canciones que aquí yacen',
    dedication_es:
      'Quiero recordarte que mi amor se escribe en prosa y la música habla por mi; de manera que quiero que conecte con cada una de las canciones que aquí yacen',
    dedication_en:
      'I want to remind you that my love is written in prose and music speaks for me; may it connect with every single song that lies here',
  },
  {
    id: '16',
    trackNumber: 16,
    title: 'Beso',
    artist: 'Jósean Log',
    spotifyId: '4PpuZIMmeng6qPicveSI22',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/4PpuZIMmeng6qPicveSI22?si=a1b24cebb9104fa2',
    coverUrl: '/songs/covers/16-beso-jose-log.jpg',
    audioUrl: '/api/songs/audio/16',
    dedication:
      'Te amo, BESAME ¿Nos peleamos? Besame ¿No hay palabras? Besame. Solo con un beso podemos expresar lo que con palabras no podemos',
    dedication_es:
      'Te amo, BESAME ¿Nos peleamos? Besame ¿No hay palabras? Besame. Solo con un beso podemos expresar lo que con palabras no podemos',
    dedication_en:
      'I love you, KISS ME. Did we fight? Kiss me. No words? Kiss me. Only with a kiss can we express what words cannot',
  },
  {
    id: '17',
    trackNumber: 17,
    title: 'Ah-Ah/ O-No',
    artist: 'Willie Colón, Héctor Lavoe',
    spotifyId: '5OmWm4rnwYwHAxWePNqaoK',
    spotifyUrl: 'https://open.spotify.com/intl-es/track/5OmWm4rnwYwHAxWePNqaoK?si=867f1bf5c8c54117',
    coverUrl: '/songs/covers/17-ah-ah-o-no.jpg',
    audioUrl: '/api/songs/audio/17',
    dedication:
      'Aunque Héctor quiera transmitir incertidumbre por lo que la otra persona siente; YO quiero mostrarte nuevamente que en la relación habrá incertidumbre por no saber que sucederá en un futuro o que nos depara, de lo que sí estoy seguro es de lo mucho que te amo, como eres a mi ojos (esto se refleja en la segunda parte de la canción) y a todos los lugares que quiero llevarte',
    dedication_es:
      'Aunque Héctor quiera transmitir incertidumbre por lo que la otra persona siente; YO quiero mostrarte nuevamente que en la relación habrá incertidumbre por no saber que sucederá en un futuro o que nos depara, de lo que sí estoy seguro es de lo mucho que te amo, como eres a mi ojos (esto se refleja en la segunda parte de la canción) y a todos los lugares que quiero llevarte',
    dedication_en:
      'Though Héctor sings of uncertainty about what the other person feels, I want to show you that even when the future brings uncertainty and we do not know what lies ahead, what I am entirely certain of is how deeply I love you, how radiant you are in my eyes (reflected in the second part of the song), and all the places in this world I want to take you',
  },
];
