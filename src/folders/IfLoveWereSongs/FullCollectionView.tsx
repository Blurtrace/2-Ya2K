'use client';

import React from 'react';
import Image from 'next/image';
import { SONGS_DATA, Song, SPOTIFY_FULL_PLAYLIST_URL } from './songsData';

type FullCollectionViewProps = {
  currentSongId: string | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onBackToPlayer: () => void;
};

export const FullCollectionView = ({
  currentSongId,
  isPlaying,
  onPlaySong,
  onBackToPlayer,
}: FullCollectionViewProps) => {
  return (
    <div className="flex-1 flex flex-col bg-[#C0C0C0] p-2 overflow-y-auto select-none">
      {/* Banner superior con enlace a la playlist de Spotify */}
      <div className="win-raised bg-[#FFFFE1] border border-[#808080] p-2.5 mb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">💿</span>
          <div>
            <div className="text-[12px] font-bold text-black font-sans">
              Colección Completa Desbloqueada (17 de 17)
            </div>
            <div className="text-[11px] text-gray-700 italic">
              &quot;Por si quieres pasarte a revisar la playlist completa en Spotify.&quot;
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href={SPOTIFY_FULL_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-3 py-1 text-[11px] font-bold text-black flex items-center gap-1.5 no-underline"
          >
            <span className="text-green-600">●</span>
            <span>Abrir Playlist en Spotify ↗</span>
          </a>
          <button
            type="button"
            onClick={onBackToPlayer}
            className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-3 py-1 text-[11px] font-bold text-black"
          >
            Volver al Reproductor
          </button>
        </div>
      </div>

      {/* Tabla con apariencia de explorador de Windows 98 */}
      <div className="flex-1 bg-white win-sunken overflow-y-auto">
        <table className="w-full text-left text-[11px] font-sans border-collapse">
          <thead className="bg-[#C0C0C0] sticky top-0 z-10 text-black border-b border-[#808080]">
            <tr>
              <th className="win-raised py-1 px-2 w-8 text-center">#</th>
              <th className="win-raised py-1 px-2 w-12 text-center">Carátula</th>
              <th className="win-raised py-1 px-2">Título y Artista</th>
              <th className="win-raised py-1 px-2">Dedicatoria</th>
              <th className="win-raised py-1 px-2 w-28 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {SONGS_DATA.map((song) => {
              const isCurrent = currentSongId === song.id;
              const isPlayingThis = isCurrent && isPlaying;

              return (
                <tr
                  key={song.id}
                  className={`border-b border-gray-200 hover:bg-[#E8F0FE] ${
                    isCurrent ? 'bg-[#000080] text-white hover:bg-[#101090]' : 'text-black'
                  }`}
                >
                  <td className="py-2 px-2 text-center font-mono font-bold">
                    {song.trackNumber.toString().padStart(2, '0')}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="relative w-8 h-8 mx-auto win-sunken overflow-hidden">
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="font-bold truncate max-w-[180px]">{song.title}</div>
                    <div className={`text-[10px] truncate max-w-[180px] ${isCurrent ? 'text-gray-200' : 'text-gray-600'}`}>
                      {song.artist}
                    </div>
                  </td>
                  <td className="py-2 px-2 font-mono text-[11px] leading-tight max-w-[280px]">
                    &quot;{song.dedication}&quot;
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPlaySong(song)}
                        className="win-raised bg-[#C0C0C0] active:win-pressed px-2 py-0.5 text-[10px] font-bold text-black flex items-center gap-1"
                        title={isPlayingThis ? 'Pausar' : 'Reproducir'}
                      >
                        <span>{isPlayingThis ? '⏸' : '▶'}</span>
                        <span>{isPlayingThis ? 'Pausa' : 'Oír'}</span>
                      </button>
                      <a
                        href={song.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="win-raised bg-[#C0C0C0] active:win-pressed px-1.5 py-0.5 text-[10px] text-black no-underline"
                        title="Ver en Spotify"
                      >
                        ↗
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
