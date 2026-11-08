'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SONGS_DATA, Song, SPOTIFY_FULL_PLAYLIST_URL } from './songsData';
import { VisualizerBars } from './VisualizerBars';
import { JewelCase } from './JewelCase';
import { NotepadDedication } from './NotepadDedication';
import { ShelfCarousel } from './ShelfCarousel';
import { FullCollectionView } from './FullCollectionView';
import { PasswordDialog } from './PasswordDialog';
import { useOs } from '@/os/state/OsContext';
import { useT } from '@/i18n/I18nContext';

const STORAGE_KEY = 'ecos_discovered_songs';

export const MusicPlayerApp = () => {
  const { dispatch } = useOs();
  const { lang, t } = useT();

  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Canciones descubiertas guardadas en localStorage
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Estado de reproducción
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Animación de ruleta
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Vistas y modales
  const [viewMode, setViewMode] = useState<'player' | 'collection'>('player');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Verificar sesión HttpOnly al cargar el componente
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/check-songs')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setIsAuthenticated(Boolean(data.authenticated));
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cargar progreso de canciones descubiertas desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filtrar IDs válidos
          const validIds = parsed.filter((id) => SONGS_DATA.some((s) => s.id === id));
          setDiscoveredIds(validIds);
          const firstSong = SONGS_DATA.find((s) => s.id === validIds[validIds.length - 1]);
          if (firstSong) setCurrentSong(firstSong);
        }
      }
    } catch {
      // Ignorar errores de parseo en entornos restringidos
    }
  }, []);

  // Guardar descubrimientos en localStorage
  const saveDiscoveredIds = useCallback((newIds: string[]) => {
    setDiscoveredIds(newIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    } catch {
      // Ignorar
    }
  }, []);

  // 3. Controladores de Audio
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(null);
        })
        .catch((err) => {
          console.warn('Error al reproducir audio:', err);
          setIsPlaying(false);
          setAudioError('No se pudo reproducir el audio.');
        });
    }
  }, [isPlaying, currentSong]);

  const handleStop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const handleSelectSong = useCallback(
    (song: Song, autoPlay = false) => {
      if (currentSong?.id === song.id) {
        if (autoPlay && !isPlaying) handlePlayPause();
        return;
      }

      handleStop();
      setCurrentSong(song);
      setAudioError(null);

      // Si se solicita reproducir automáticamente al seleccionar de la colección
      if (autoPlay && audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    },
    [currentSong, isPlaying, handlePlayPause, handleStop]
  );

  // Anterior y siguiente descubierta
  const handlePrev = useCallback(() => {
    if (discoveredIds.length === 0 || !currentSong) return;
    const currentIndex = discoveredIds.indexOf(currentSong.id);
    const prevIndex = (currentIndex - 1 + discoveredIds.length) % discoveredIds.length;
    const prevSong = SONGS_DATA.find((s) => s.id === discoveredIds[prevIndex]);
    if (prevSong) handleSelectSong(prevSong, isPlaying);
  }, [discoveredIds, currentSong, isPlaying, handleSelectSong]);

  const handleNext = useCallback(() => {
    if (discoveredIds.length === 0 || !currentSong) return;
    const currentIndex = discoveredIds.indexOf(currentSong.id);
    const nextIndex = (currentIndex + 1) % discoveredIds.length;
    const nextSong = SONGS_DATA.find((s) => s.id === discoveredIds[nextIndex]);
    if (nextSong) handleSelectSong(nextSong, isPlaying);
  }, [discoveredIds, currentSong, isPlaying, handleSelectSong]);

  // 4. Descubrimiento aleatorio (Ruleta retro)
  const handleDiscoverRandom = useCallback(() => {
    if (isDiscovering) return;

    // Canciones que todavía no se han descubierto
    const remainingSongs = SONGS_DATA.filter((s) => !discoveredIds.includes(s.id));

    // Si ya se descubrieron todas (17/17)
    if (remainingSongs.length === 0) {
      setViewMode('collection');
      return;
    }

    // Elegir aleatoriamente entre las restantes
    const randomIndex = Math.floor(Math.random() * remainingSongs.length);
    const chosenSong = remainingSongs[randomIndex];

    setIsDiscovering(true);
    handleStop();

    // Animación de 1.1 segundos antes de revelar la canción
    setTimeout(() => {
      const nextDiscovered = [...discoveredIds, chosenSong.id];
      saveDiscoveredIds(nextDiscovered);
      setCurrentSong(chosenSong);
      setIsDiscovering(false);

      // Si era la última canción (17 de 17)
      if (nextDiscovered.length === SONGS_DATA.length) {
        setShowCelebration(true);
      }
    }, 1100);
  }, [discoveredIds, isDiscovering, handleStop, saveDiscoveredIds]);

  // 5. Manejo del tiempo y barra de progreso
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // 6. Cerrar sesión / Bloquear carpeta
  const handleLogout = async () => {
    handleStop();
    try {
      await fetch('/api/auth/logout-songs', { method: 'POST' });
    } catch {
      // Ignorar
    }
    setIsAuthenticated(false);
    setActiveMenu(null);
  };

  // 7. Reiniciar progreso con confirmación
  const handleConfirmReset = () => {
    handleStop();
    saveDiscoveredIds([]);
    setCurrentSong(null);
    setShowResetConfirm(false);
    setViewMode('player');
    setActiveMenu(null);
  };

  // Cierre de ventana retro
  const handleCloseWindow = () => {
    handleStop();
    dispatch({ type: 'CLOSE', id: 'if-love-were-songs' });
  };

  // Teclas de acceso rápido retro (Espacio para play/pausa)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause]);

  // Si está cargando la verificación inicial de sesión
  if (isAuthenticated === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#C0C0C0] text-black font-sans text-[12px]">
        <div className="flex items-center gap-2">
          <span>⏳</span>
          <span>Verificando permisos de acceso...</span>
        </div>
      </div>
    );
  }

  // Si no está autenticado, muestra la ventana de contraseña
  if (!isAuthenticated) {
    return (
      <PasswordDialog
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={handleCloseWindow}
      />
    );
  }

  const allUnlocked = discoveredIds.length === SONGS_DATA.length;

  return (
    <div
      onClick={() => setActiveMenu(null)}
      className="flex-1 flex flex-col bg-[#C0C0C0] text-black font-sans text-[12px] select-none h-full overflow-hidden"
    >
      {/* Audio nativo HTML5 con streaming privado */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
              audioRef.current.volume = volume;
            }
            setIsAudioLoading(false);
          }}
          onWaiting={() => setIsAudioLoading(true)}
          onPlaying={() => {
            setIsAudioLoading(false);
            setIsPlaying(true);
          }}
          onEnded={() => {
            setIsPlaying(false);
            handleNext();
          }}
          onError={() => {
            setIsAudioLoading(false);
            setIsPlaying(false);
            setAudioError('No se pudo cargar el audio.');
          }}
        />
      )}

      {/* Barra de menús retro de Windows 98 */}
      <div className="flex items-center gap-1 px-1 py-[2px] bg-[#C0C0C0] border-b border-[#808080] text-[11px] relative select-none">
        {/* Archivo */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'file' ? null : 'file');
            }}
            className={`px-1.5 py-[1px] hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'file' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            {t('explorer.file')}
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-[1px] bg-[#C0C0C0] win-raised p-[2px] min-w-[190px] shadow-lg z-50 flex flex-col text-[11px]">
              <button
                type="button"
                onClick={handleLogout}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white flex items-center justify-between"
              >
                <span>{t('songs.lockFolder')}</span>
                <span className="text-[10px] text-gray-500 hover:text-white">{t('songs.logOut')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(true);
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('songs.resetDiscovery')}
              </button>
              <div className="border-t border-[#808080] my-[2px]" />
              <button
                type="button"
                onClick={handleCloseWindow}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('menu.exit')}
              </button>
            </div>
          )}
        </div>

        {/* Reproducción */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'playback' ? null : 'playback');
            }}
            className={`px-1.5 py-[1px] hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'playback' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            {t('songs.playback')}
          </button>
          {activeMenu === 'playback' && (
            <div className="absolute left-0 top-full mt-[1px] bg-[#C0C0C0] win-raised p-[2px] min-w-[170px] shadow-lg z-50 flex flex-col text-[11px]">
              <button
                type="button"
                onClick={() => {
                  handlePlayPause();
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {isPlaying ? t('songs.pauseSpace') : t('songs.playSpace')}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleStop();
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('songs.stop')}
              </button>
              <div className="border-t border-[#808080] my-[2px]" />
              <button
                type="button"
                onClick={() => {
                  handlePrev();
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('songs.previous')}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNext();
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('songs.next')}
              </button>
            </div>
          )}
        </div>

        {/* Pistas */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'tracks' ? null : 'tracks');
            }}
            className={`px-1.5 py-[1px] hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'tracks' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            {t('songs.tracks')}
          </button>
          {activeMenu === 'tracks' && (
            <div className="absolute left-0 top-full mt-[1px] bg-[#C0C0C0] win-raised p-[2px] min-w-[210px] shadow-lg z-50 flex flex-col text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setViewMode(viewMode === 'player' ? 'collection' : 'player');
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {viewMode === 'player' ? t('songs.viewFullCollection') : t('songs.viewPlayer')}
              </button>
              <a
                href={SPOTIFY_FULL_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white text-black no-underline"
              >
                {t('songs.openSpotify')}
              </a>
            </div>
          )}
        </div>

        {/* Ayuda */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'help' ? null : 'help');
            }}
            className={`px-1.5 py-[1px] hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'help' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            {t('menu.help')}
          </button>
          {activeMenu === 'help' && (
            <div className="absolute left-0 top-full mt-[1px] bg-[#C0C0C0] win-raised p-[2px] min-w-[180px] shadow-lg z-50 flex flex-col text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setShowAbout(true);
                  setActiveMenu(null);
                }}
                className="text-left px-2 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('songs.aboutWmp')}
              </button>
            </div>
          )}
        </div>

        {/* Indicador de canciones desbloqueadas a la derecha */}
        <div className="ml-auto text-[10px] font-mono text-gray-700 pr-1 flex items-center gap-1">
          <span>{allUnlocked ? t('songs.allComplete') : t('songs.discoveredCount', { count: discoveredIds.length })}</span>
        </div>
      </div>

      {/* Contenido principal según la vista seleccionada */}
      {viewMode === 'collection' ? (
        <FullCollectionView
          currentSongId={currentSong?.id || null}
          isPlaying={isPlaying}
          onPlaySong={(s) => handleSelectSong(s, true)}
          onBackToPlayer={() => setViewMode('player')}
        />
      ) : (
        <div className="flex-1 flex flex-col p-2 gap-2 overflow-y-auto">
          {/* 1. Pantalla LCD negra y visualizador retro */}
          <div className="bg-black win-sunken p-2 flex items-center justify-between gap-3 text-[#00FF00] font-mono">
            <div className="flex-1 overflow-hidden leading-tight">
              <div className="flex items-center justify-between text-[10px] text-[#00AA00] uppercase">
                <span>
                  {currentSong
                    ? t('songs.trackN', { track: currentSong.trackNumber.toString().padStart(2, '0') })
                    : 'PISTA --/17'}
                </span>
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="text-[13px] font-bold truncate mt-0.5 tracking-wider">
                {isDiscovering
                  ? t('songs.searchingRandom')
                  : currentSong
                  ? `${currentSong.title} - ${currentSong.artist}`
                  : t('songs.pressDiscover')}
              </div>
              <div className="text-[10px] flex items-center gap-2 mt-0.5 text-gray-400">
                <span
                  className={
                    isPlaying
                      ? 'text-[#00FF00] font-bold'
                      : isAudioLoading
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  }
                >
                  {isAudioLoading
                    ? t('songs.loadingAudio')
                    : isPlaying
                    ? t('songs.nowPlaying')
                    : currentSong
                    ? t('songs.nowPaused')
                    : t('songs.ready')}
                </span>
                {audioError && <span className="text-red-400">⚠️ {audioError}</span>}
              </div>
            </div>

            {/* Visualizador de barras retro */}
            <VisualizerBars isPlaying={isPlaying} />
          </div>

          {/* 2. Área central: Caja Jewel Case a la izquierda, Bloc de Notas Dedicatoria a la derecha */}
          <div className="flex-1 flex flex-col sm:flex-row gap-2 min-h-0">
            <div className="flex flex-col items-center justify-center p-1 bg-[#D4D0C8] win-sunken flex-shrink-0">
              <JewelCase
                song={currentSong}
                isSpinning={isDiscovering}
                size="normal"
              />
            </div>

            <NotepadDedication song={currentSong} />
          </div>

          {/* 3. Barra de Controles de Reproducción y Ruleta */}
          <div className="bg-[#C0C0C0] win-raised p-2 flex flex-col gap-2">
            {/* Barra de progreso interactiva (Seekbar) */}
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="w-9 text-right text-gray-700">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                disabled={!currentSong || duration === 0}
                onChange={handleSeek}
                className="flex-1 h-3 accent-[#000080] cursor-pointer"
                title={t('songs.seekbar')}
              />
              <span className="w-9 text-gray-700">{formatTime(duration)}</span>
            </div>

            {/* Botones de control y ruleta */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Botones retro: Anterior, Play/Pausa, Detener, Siguiente */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={discoveredIds.length <= 1}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed disabled:opacity-40 px-2.5 py-1 text-[11px] font-bold"
                  title={t('songs.prevTrackTitle')}
                >
                  |◀◀
                </button>
                <button
                  type="button"
                  onClick={handlePlayPause}
                  disabled={!currentSong}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed disabled:opacity-40 px-3.5 py-1 text-[11px] font-bold min-w-[65px]"
                  title={isPlaying ? t('songs.pauseSpace') : t('songs.playSpace')}
                >
                  {isPlaying ? `⏸ ${t('songs.pause')}` : `▶ ${t('songs.play')}`}
                </button>
                <button
                  type="button"
                  onClick={handleStop}
                  disabled={!currentSong}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed disabled:opacity-40 px-2.5 py-1 text-[11px] font-bold"
                  title={t('songs.stop')}
                >
                  ■
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={discoveredIds.length <= 1}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed disabled:opacity-40 px-2.5 py-1 text-[11px] font-bold"
                  title={t('songs.nextTrackTitle')}
                >
                  ▶▶|
                </button>
              </div>

              {/* Control de volumen */}
              <div className="flex items-center gap-1.5 px-2">
                <span className="text-[12px] select-none" title={t('songs.volume', { percent: Math.round(volume * 100) })}>
                  {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-2 accent-[#000080] cursor-pointer"
                  title={t('songs.volume', { percent: Math.round(volume * 100) })}
                />
              </div>

              {/* Botón principal de Ruleta / Descubrimiento Aleatorio */}
              <button
                type="button"
                onClick={allUnlocked ? () => setViewMode('collection') : handleDiscoverRandom}
                disabled={isDiscovering}
                className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-3 py-1 text-[11px] font-bold text-black flex items-center gap-1.5 shadow-sm ml-auto"
              >
                <span>{allUnlocked ? '💿' : '🎲'}</span>
                <span>
                  {isDiscovering
                    ? t('songs.discovering')
                    : allUnlocked
                    ? t('songs.viewFullCollection')
                    : t('songs.discoverRandomButton')}
                </span>
              </button>
            </div>
          </div>

          {/* 4. Estante inferior de canciones descubiertas y candados */}
          <ShelfCarousel
            discoveredIds={discoveredIds}
            selectedSongId={currentSong?.id || null}
            onSelectSong={(s) => handleSelectSong(s, false)}
          />
        </div>
      )}

      {/* Modal de Felicitación: ¡Todas las canciones desbloqueadas! */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 select-none">
          <div className="w-full max-w-[380px] bg-[#C0C0C0] win-raised p-[3px] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="win-titlebar-active flex items-center justify-between px-2 py-1 text-white text-[11px] font-bold">
              <span>{t('songs.celebrationTitle')}</span>
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="win-raised bg-[#C0C0C0] text-black w-4 h-4 text-[10px] flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 bg-[#C0C0C0] flex flex-col gap-3 text-center">
              <div className="text-4xl animate-bounce">💿✨</div>
              <h4 className="text-[13px] font-bold text-[#000080]">
                {t('songs.celebrationHeading')}
              </h4>
              <p className="text-[11px] text-gray-800 leading-normal">
                {t('songs.celebrationDesc')}
              </p>
              <div className="flex justify-center gap-2 pt-2 border-t border-[#808080]">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    setShowCelebration(false);
                    setViewMode('collection');
                  }}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-4 py-1 text-[11px] font-bold text-black"
                >
                  {t('songs.viewFullCollection')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCelebration(false)}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-4 py-1 text-[11px] text-black"
                >
                  {t('songs.keepListening')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para reiniciar descubrimiento */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 select-none">
          <div className="w-full max-w-[340px] bg-[#C0C0C0] win-raised p-[3px] shadow-2xl">
            <div className="win-titlebar-active flex items-center justify-between px-2 py-1 text-white text-[11px] font-bold">
              <span>{t('songs.resetConfirmTitle')}</span>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="win-raised bg-[#C0C0C0] text-black w-4 h-4 text-[10px] flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-3 bg-[#C0C0C0] flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl">⚠️</span>
                <p className="text-[11px] text-gray-900 leading-relaxed">
                  {t('songs.resetConfirmDesc')}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-4 py-1 text-[11px] font-bold text-black"
                >
                  {t('dialog.ok')}
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setShowResetConfirm(false)}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-4 py-1 text-[11px] text-black"
                >
                  {t('dialog.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Acerca de WMP 98 */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 select-none">
          <div className="w-full max-w-[340px] bg-[#C0C0C0] win-raised p-[3px] shadow-2xl">
            <div className="win-titlebar-active flex items-center justify-between px-2 py-1 text-white text-[11px] font-bold">
              <span>{t('songs.aboutWmpTitle')}</span>
              <button
                type="button"
                onClick={() => setShowAbout(false)}
                className="win-raised bg-[#C0C0C0] text-black w-4 h-4 text-[10px] flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-3 bg-[#C0C0C0] flex flex-col gap-2 text-[11px]">
              <div className="font-bold text-[#000080]">Windows Media Player - If love were songs ♡</div>
              <p className="text-gray-700 leading-relaxed">
                {t('songs.aboutWmpDesc')}
              </p>
              <div className="flex justify-end pt-2 border-t border-[#808080]">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setShowAbout(false)}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-4 py-1 text-[11px] font-bold text-black"
                >
                  {t('dialog.ok')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
