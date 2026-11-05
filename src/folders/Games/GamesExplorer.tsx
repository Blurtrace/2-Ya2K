'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { gamesData, type GameItem, type GameCategory } from './gamesData';
import { GamePlayer } from './GamePlayer';
import { useT } from '@/i18n/I18nContext';

/**
 * Explorador de Juegos Clásicos de Friv para ECOS 98.
 * Muestra la cuadrícula nostálgica de juegos con sus logos, buscador, pestañas de categoría,
 * y reproductor integrado.
 */
export const GamesExplorer = () => {
  const { lang, t } = useT();

  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  // Filtrado reactivo de juegos por categoría y texto de búsqueda
  const filteredGames = useMemo(() => {
    return gamesData.filter((game) => {
      const matchesCategory =
        selectedCategory === 'all' || game.category === selectedCategory;

      const title = lang === 'en' ? game.titleEn : game.title;
      const desc = lang === 'en' ? game.descriptionEn : game.description;

      const matchesSearch =
        searchQuery.trim() === '' ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

  const handleGameSelect = (id: string) => {
    setSelectedGameId(id);
  };

  const handleGameLaunch = (game: GameItem) => {
    setActiveGame(game);
  };

  // Si hay un juego activo, renderizar la vista del reproductor
  if (activeGame) {
    return <GamePlayer game={activeGame} onBack={() => setActiveGame(null)} />;
  }

  const categories: { id: GameCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'games.all' },
    { id: '2players', labelKey: 'games.cat2Players' },
    { id: 'cooking', labelKey: 'games.catCooking' },
    { id: 'adventure', labelKey: 'games.catAdventure' },
    { id: 'style', labelKey: 'games.catStyle' },
    { id: 'action', labelKey: 'games.catAction' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#C0C0C0] text-black select-none">
      {/* Barra de menú clásica de Windows 98 */}
      <div className="flex items-center space-x-3 px-1 py-0.5 border-b border-[#808080] text-[11px]">
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">
          {t('explorer.file')}
        </span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">
          {t('explorer.edit')}
        </span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">
          {t('explorer.view')}
        </span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">
          {t('explorer.help')}
        </span>
      </div>

      {/* Barra de dirección y buscador */}
      <div className="flex items-center px-1.5 py-1 text-[11px] space-x-2 bg-[#C0C0C0] border-b border-[#808080]">
        <span className="text-[#555]">{t('explorer.address')}</span>
        <div className="flex-1 win-sunken bg-white px-1.5 py-0.5 text-black truncate text-[11px]">
          C:\ECOS\{t('folder.games')}
        </div>

        {/* Caja de búsqueda rápida */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('games.search')}
            className="win-sunken bg-white px-1.5 py-0.5 text-[11px] w-[130px] sm:w-[160px] text-black placeholder:text-[#888] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-0.5 text-[9px] text-[#888] hover:text-black"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Pestañas de categorías estilo Windows 98 */}
      <div className="flex items-center space-x-1 px-2 pt-1 border-b border-[#808080] bg-[#C0C0C0] text-[11px] overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-0.5 cursor-pointer font-normal border-t border-l border-r border-[#808080] ${
              selectedCategory === cat.id
                ? 'win-raised bg-[#C0C0C0] font-bold -mb-[1px] pb-1 z-10'
                : 'bg-[#b0b0b0] text-[#333] hover:bg-[#C0C0C0]'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Cuadrícula hundida de juegos tipo Friv */}
      <div
        onClick={() => setSelectedGameId(null)}
        className="flex-1 win-sunken bg-[#FFFFFF] p-2.5 overflow-y-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 justify-items-center">
          {filteredGames.map((game) => {
            const isSelected = selectedGameId === game.id;
            const title = lang === 'en' ? game.titleEn : game.title;

            return (
              <div
                key={game.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGameSelect(game.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleGameLaunch(game);
                }}
                className={`group flex flex-col items-center w-[116px] p-1.5 rounded-none cursor-pointer transition-none select-none text-center ${
                  isSelected
                    ? 'bg-[#000080] text-white outline-1 outline-dotted outline-white'
                    : 'hover:bg-[#EAEAEA] text-black'
                }`}
                title={`${title}\n${t('games.doubleClick')}`}
              >
                {/* Contenedor del Logo / Imagen del juego con bisel retro */}
                <div
                  className={`w-[68px] h-[68px] p-0.5 mb-1.5 flex items-center justify-center bg-[#C0C0C0] ${
                    isSelected ? 'win-pressed' : 'win-raised group-hover:scale-105'
                  }`}
                >
                  <Image
                    src={game.icon}
                    alt={title}
                    width={64}
                    height={64}
                    className="pixelated w-16 h-16 object-cover"
                    priority={false}
                  />
                </div>

                {/* Título del juego */}
                <span className="text-[10.5px] leading-tight line-clamp-2 font-bold px-0.5 break-words">
                  {title}
                </span>

                {/* Etiquetas de estado y categoría */}
                <div className="flex gap-1 mt-1 flex-wrap justify-center">
                  {game.hasHtml5 ? (
                    <span
                      className={`text-[8px] px-1 py-[1px] font-bold ${
                        isSelected
                          ? 'bg-[#00FF66] text-black'
                          : 'bg-[#d4edda] text-[#155724] border border-[#c3e6cb]'
                      }`}
                    >
                      HTML5
                    </span>
                  ) : (
                    <span
                      className={`text-[8px] px-1 py-[1px] font-bold ${
                        isSelected
                          ? 'bg-red-400 text-white'
                          : 'bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]'
                      }`}
                    >
                      FLASH
                    </span>
                  )}

                  {game.category === '2players' && (
                    <span
                      className={`text-[8px] px-1 py-[1px] font-bold ${
                        isSelected
                          ? 'bg-yellow-300 text-black'
                          : 'bg-[#fff3cd] text-[#856404] border border-[#ffeeba]'
                      }`}
                    >
                      2P
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-[#666]">
            <span className="text-2xl mb-1">🔍</span>
            <p className="text-[11px]">No se encontraron juegos con ese nombre.</p>
          </div>
        )}
      </div>

      {/* Barra de estado inferior */}
      <div className="win-sunken bg-[#C0C0C0] px-2 py-0.5 text-[11px] text-black flex justify-between items-center">
        <span>{t('games.totalGames', { count: filteredGames.length })}</span>
        <span className="text-[#444] text-[10px] hidden sm:inline">
          {t('games.doubleClick')}
        </span>
      </div>
    </div>
  );
};

