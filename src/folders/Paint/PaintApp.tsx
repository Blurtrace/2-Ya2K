'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PAINT_TOOLS, PAINT_PALETTE, type PaintTool } from './paintData';
import { PaintHelpModal } from './PaintHelpModal';

/**
 * Recreación fiel de Microsoft Paint clásico de Windows 98.
 * Reproduce la ventana flotante con barras de título, menús, caja de herramientas retro,
 * paleta de colores de 28 tonos, barra de estado y la fotografía original de Yaczury
 * en el lienzo central sin modificaciones faciales ni filtros de IA.
 */
export const PaintApp = () => {
  const [selectedTool, setSelectedTool] = useState<string>('pencil');
  const [foregroundColor, setForegroundColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const menuBarRef = useRef<HTMLDivElement>(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToolClick = (tool: PaintTool) => {
    setSelectedTool(tool.id);
  };

  const handlePaletteClick = (color: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 2) {
      // Clic derecho: Color secundario (fondo)
      setBackgroundColor(color);
    } else {
      // Clic izquierdo: Color primario (frente)
      setForegroundColor(color);
    }
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleAboutClick = () => {
    setActiveMenu(null);
    setIsAboutOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#C0C0C0] text-black font-sans text-[11px] select-none overflow-hidden">
      {/* ============================================================== */}
      {/* 1. BARRA DE MENÚS (File | Edit | View | Image | Colors | Help) */}
      {/* ============================================================== */}
      <div
        ref={menuBarRef}
        className="win-raised bg-[#C0C0C0] px-1 py-[2px] flex items-center gap-1 border-b border-[#808080] relative z-30"
      >
        {/* FILE */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick('File')}
            onMouseEnter={() => activeMenu && setActiveMenu('File')}
            className={`px-2 py-[2px] text-[11px] cursor-pointer outline-none ${
              activeMenu === 'File' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
            }`}
          >
            <u>F</u>ile
          </button>
          {activeMenu === 'File' && (
            <div className="absolute top-full left-0 mt-[1px] w-40 win-raised bg-[#C0C0C0] p-[2px] shadow-lg border border-[#808080] z-40 text-black">
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                New <span className="float-right text-[10px] opacity-75">Ctrl+N</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Open... <span className="float-right text-[10px] opacity-75">Ctrl+O</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Save <span className="float-right text-[10px] opacity-75">Ctrl+S</span>
              </button>
              <div className="win-etched my-1 h-[2px]" />
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Exit
              </button>
            </div>
          )}
        </div>

        {/* EDIT */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick('Edit')}
            onMouseEnter={() => activeMenu && setActiveMenu('Edit')}
            className={`px-2 py-[2px] text-[11px] cursor-pointer outline-none ${
              activeMenu === 'Edit' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
            }`}
          >
            <u>E</u>dit
          </button>
          {activeMenu === 'Edit' && (
            <div className="absolute top-full left-0 mt-[1px] w-40 win-raised bg-[#C0C0C0] p-[2px] shadow-lg border border-[#808080] z-40 text-black">
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Undo <span className="float-right text-[10px] opacity-75">Ctrl+Z</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Cut <span className="float-right text-[10px] opacity-75">Ctrl+X</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Copy <span className="float-right text-[10px] opacity-75">Ctrl+C</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Paste <span className="float-right text-[10px] opacity-75">Ctrl+V</span>
              </button>
            </div>
          )}
        </div>

        {/* VIEW */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick('View')}
            onMouseEnter={() => activeMenu && setActiveMenu('View')}
            className={`px-2 py-[2px] text-[11px] cursor-pointer outline-none ${
              activeMenu === 'View' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
            }`}
          >
            <u>V</u>iew
          </button>
          {activeMenu === 'View' && (
            <div className="absolute top-full left-0 mt-[1px] w-40 win-raised bg-[#C0C0C0] p-[2px] shadow-lg border border-[#808080] z-40 text-black">
              <div className="px-3 py-1 flex items-center justify-between text-neutral-800">
                <span>Tool Box</span>
                <span>✓</span>
              </div>
              <div className="px-3 py-1 flex items-center justify-between text-neutral-800">
                <span>Color Box</span>
                <span>✓</span>
              </div>
              <div className="px-3 py-1 flex items-center justify-between text-neutral-800">
                <span>Status Bar</span>
                <span>✓</span>
              </div>
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick('Image')}
            onMouseEnter={() => activeMenu && setActiveMenu('Image')}
            className={`px-2 py-[2px] text-[11px] cursor-pointer outline-none ${
              activeMenu === 'Image' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
            }`}
          >
            <u>I</u>mage
          </button>
          {activeMenu === 'Image' && (
            <div className="absolute top-full left-0 mt-[1px] w-44 win-raised bg-[#C0C0C0] p-[2px] shadow-lg border border-[#808080] z-40 text-black">
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Flip/Rotate... <span className="float-right text-[10px] opacity-75">Ctrl+R</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Invert Colors <span className="float-right text-[10px] opacity-75">Ctrl+I</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Attributes... <span className="float-right text-[10px] opacity-75">Ctrl+E</span>
              </button>
            </div>
          )}
        </div>

        {/* COLORS */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick('Colors')}
            onMouseEnter={() => activeMenu && setActiveMenu('Colors')}
            className={`px-2 py-[2px] text-[11px] cursor-pointer outline-none ${
              activeMenu === 'Colors' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
            }`}
          >
            <u>C</u>olors
          </button>
          {activeMenu === 'Colors' && (
            <div className="absolute top-full left-0 mt-[1px] w-36 win-raised bg-[#C0C0C0] p-[2px] shadow-lg border border-[#808080] z-40 text-black">
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Edit Colors...
              </button>
            </div>
          )}
        </div>

        {/* HELP (FUNCIONALIDAD ESPECIAL DEDICATORIA) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleMenuClick('Help')}
            onMouseEnter={() => activeMenu && setActiveMenu('Help')}
            className={`px-2 py-[2px] text-[11px] font-bold cursor-pointer outline-none ${
              activeMenu === 'Help' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white text-[#000080]'
            }`}
          >
            <u>H</u>elp
          </button>
          {activeMenu === 'Help' && (
            <div className="absolute top-full left-0 mt-[1px] w-52 win-raised bg-[#C0C0C0] p-[2px] shadow-xl border border-[#808080] z-50 text-black animate-fade-in">
              <button
                type="button"
                onClick={() => setActiveMenu(null)}
                className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center justify-between"
              >
                <span>Help Topics</span>
                <span className="text-[10px] opacity-75">F1</span>
              </button>
              <div className="win-etched my-1 h-[2px]" />
              <button
                type="button"
                onClick={handleAboutClick}
                className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer font-bold flex items-center gap-2 text-[#000080] hover:text-white"
              >
                <span>👑</span>
                <span>About Yaczury Navarro...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ÁREA CENTRAL (CAJA DE HERRAMIENTAS + LIENZO CON FOTO)       */}
      {/* ============================================================== */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* PANEL IZQUIERDO: HERRAMIENTAS CLÁSICAS DE PAINT */}
        <div className="w-[58px] win-raised bg-[#C0C0C0] p-1 flex flex-col items-center flex-shrink-0 border-r border-[#808080] select-none">
          {/* Rejilla de 16 herramientas (2 columnas x 8 filas) */}
          <div className="grid grid-cols-2 gap-[2px] mb-2">
            {PAINT_TOOLS.map((tool) => {
              const isSelected = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  title={tool.name}
                  onClick={() => handleToolClick(tool)}
                  onMouseEnter={() => setHoveredStatus(tool.description)}
                  onMouseLeave={() => setHoveredStatus(null)}
                  className={`w-[24px] h-[24px] flex items-center justify-center p-0 cursor-pointer transition-colors ${
                    isSelected
                      ? 'win-pressed bg-[#EAEAEA] shadow-inner'
                      : 'win-raised active:win-pressed bg-[#C0C0C0] hover:bg-[#D4D0C8]'
                  }`}
                >
                  <ToolSvgIcon icon={tool.icon} />
                </button>
              );
            })}
          </div>

          {/* Caja de opciones de herramientas secundarias estilo Win98 */}
          <div className="w-[48px] h-[66px] win-sunken bg-[#C0C0C0] p-1 flex flex-col items-center justify-center border border-[#808080] text-[9px] text-neutral-700">
            {selectedTool === 'brush' ? (
              <div className="grid grid-cols-3 gap-1">
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                <span className="w-2 h-2 bg-black rounded-full" />
                <span className="w-2.5 h-2.5 bg-black rounded-full" />
                <span className="w-1.5 h-1.5 bg-black" />
                <span className="w-2 h-2 bg-black" />
                <span className="w-2.5 h-2.5 bg-black" />
              </div>
            ) : selectedTool === 'line' || selectedTool === 'curve' ? (
              <div className="flex flex-col gap-1.5 w-full px-1">
                <div className="h-[1px] bg-black w-full" />
                <div className="h-[2px] bg-black w-full" />
                <div className="h-[3px] bg-black w-full" />
                <div className="h-[4px] bg-black w-full" />
              </div>
            ) : selectedTool === 'eraser' ? (
              <div className="flex flex-col gap-1 items-center">
                <span className="w-2 h-2 bg-white border border-black" />
                <span className="w-3 h-3 bg-white border border-black" />
                <span className="w-4 h-4 bg-white border border-black" />
              </div>
            ) : selectedTool === 'magnifier' ? (
              <div className="flex flex-col gap-0.5 font-mono text-[9px] font-bold text-black">
                <span>1x</span>
                <span className="bg-[#000080] text-white px-0.5">2x</span>
                <span>6x</span>
                <span>8x</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 opacity-70">
                <div className="w-7 h-4 border border-dashed border-black" />
                <div className="w-7 h-4 bg-black/20 border border-black" />
              </div>
            )}
          </div>
        </div>

        {/* ZONA CENTRAL: LIENZO DE PINTURA CON LA FOTO ORIGINAL */}
        <div
          className="flex-1 win-sunken bg-[#808080] p-3 sm:p-5 flex items-center justify-center overflow-auto relative select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseCoords({
              x: Math.max(0, Math.floor(e.clientX - rect.left)),
              y: Math.max(0, Math.floor(e.clientY - rect.top)),
            });
          }}
          onMouseLeave={() => setMouseCoords(null)}
        >
          {/* LIENZO BLANCO CON BORDES Y CONTROLADORES DE TAMAÑO MS PAINT */}
          <div className="relative bg-white shadow-2xl border border-[#303030] p-1.5 flex flex-col items-center justify-center max-w-full">
            {/* Controladores clásicos de redimensión de lienzo (puntos negros) */}
            <span
              className="w-[5px] h-[5px] bg-black border border-white absolute right-[-4px] top-1/2 -translate-y-1/2 cursor-e-resize z-20 pointer-events-none"
              title="Resize handle"
            />
            <span
              className="w-[5px] h-[5px] bg-black border border-white absolute bottom-[-4px] left-1/2 -translate-x-1/2 cursor-s-resize z-20 pointer-events-none"
              title="Resize handle"
            />
            <span
              className="w-[5px] h-[5px] bg-black border border-white absolute bottom-[-4px] right-[-4px] cursor-se-resize z-20 pointer-events-none"
              title="Resize handle"
            />

            {/* MARCO INTERNO DE LA FOTOGRAFÍA ORIGINAL */}
            <div className="relative overflow-hidden bg-black flex items-center justify-center border border-[#808080]">
              <Image
                src="/photos/yaczury-birthday.jpg"
                alt="Yaczury Navarro - Feliz Cumpleaños"
                width={899}
                height={1024}
                priority
                className="max-h-[380px] sm:max-h-[440px] w-auto h-auto object-contain block select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. PANEL INFERIOR: PALETA DE 28 COLORES CLÁSICA DE PAINT       */}
      {/* ============================================================== */}
      <div className="win-raised bg-[#C0C0C0] px-2 py-1 flex items-center gap-2 border-t border-[#808080] flex-shrink-0 select-none overflow-x-auto">
        {/* Selector de color activo (Primario frontal y Secundario posterior) */}
        <div
          className="win-sunken bg-[#C0C0C0] w-8 h-8 relative p-0.5 flex-shrink-0 border border-[#808080]"
          title={`Foreground: ${foregroundColor} | Background: ${backgroundColor}`}
        >
          {/* Fondo (Secundario) */}
          <div
            className="w-4 h-4 border border-black absolute bottom-1 right-1 shadow-sm"
            style={{ backgroundColor }}
          />
          {/* Frente (Primario) */}
          <div
            className="w-4 h-4 border border-black absolute top-1 left-1 z-10 shadow-sm"
            style={{ backgroundColor: foregroundColor }}
          />
        </div>

        {/* Malla de 28 colores (2 filas x 14 columnas) */}
        <div className="grid grid-rows-2 grid-flow-col gap-[2px] flex-shrink-0">
          {PAINT_PALETTE.map((color, index) => (
            <button
              key={`${color}-${index}`}
              type="button"
              onClick={(e) => handlePaletteClick(color, e)}
              onContextMenu={(e) => handlePaletteClick(color, e)}
              className="w-3.5 h-3.5 border-t-[#808080] border-l-[#808080] border-b-white border-r-white border cursor-pointer hover:brightness-110 active:scale-95 transition-transform"
              style={{ backgroundColor: color }}
              title={`${color} (Clic izq: frente, Clic der: fondo)`}
            />
          ))}
        </div>

        {/* Divisor estético retro */}
        <div className="h-6 win-etched w-[2px] mx-1" />

        <div className="text-[10px] text-neutral-600 font-sans hidden sm:block whitespace-nowrap">
          Paintbrush • 24-bit TrueColor
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. BARRA DE ESTADO INFERIOR (Status Bar: Ready)                */}
      {/* ============================================================== */}
      <div className="win-sunken bg-[#C0C0C0] px-2 py-[2px] text-[11px] font-sans text-black flex items-center justify-between flex-shrink-0 select-none border-t border-[#808080]">
        <div className="flex-1 truncate pr-2">
          {hoveredStatus ?? 'Ready'}
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px] text-neutral-700 flex-shrink-0">
          <span className="win-sunken px-1.5 py-[1px] bg-[#EAEAEA] min-w-[70px] text-center">
            {mouseCoords ? `${mouseCoords.x}, ${mouseCoords.y}px` : '899 x 1024'}
          </span>
          <span className="win-sunken px-1.5 py-[1px] bg-[#EAEAEA] text-center">
            ECOS 98
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. MODAL DE AYUDA: ABOUT YACZURY NAVARRO...                    */}
      {/* ============================================================== */}
      <PaintHelpModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

/**
 * Iconos retro pixel-art en SVG vectorial puro para las herramientas de Paint
 */
const ToolSvgIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'star':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <path
            d="M8 1L10 6H15L11 9L13 14L8 11L3 14L5 9L1 6H6L8 1Z"
            stroke="#000000"
            strokeWidth="1.2"
            strokeDasharray="2 1"
          />
        </svg>
      );
    case 'rect-select':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <rect
            x="2"
            y="2"
            width="12"
            height="12"
            stroke="#000000"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
        </svg>
      );
    case 'eraser':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <path d="M5 11L12 4L15 7L8 14H3V11L5 11Z" fill="#FFAACC" stroke="#000" strokeWidth="1" />
          <path d="M3 11L7 7L10 10L6 14H3V11Z" fill="#EEEEEE" />
        </svg>
      );
    case 'fill':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <path d="M3 10L8 5L13 10L8 13L3 10Z" fill="#C0C0C0" stroke="#000" strokeWidth="1" />
          <path d="M7 3L11 7" stroke="#000" strokeWidth="1.5" />
          <path d="M2 13C2 13 4 14 4 15C4 16 3 16 2 16C1 16 1 15 2 13Z" fill="#FF0000" />
        </svg>
      );
    case 'dropper':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <path d="M12 2L14 4L11 7L9 5L12 2Z" fill="#000000" />
          <path d="M9 5L11 7L6 12L4 12L4 10L9 5Z" fill="#FFFFFF" stroke="#000" strokeWidth="1" />
          <path d="M2 14L4 12" stroke="#000" strokeWidth="1.5" />
        </svg>
      );
    case 'magnifier':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="#000" strokeWidth="1.5" fill="#E0F0FF" />
          <line x1="10" y1="10" x2="14.5" y2="14.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'pencil':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <line x1="3" y1="13" x2="13" y2="3" stroke="#FFCC00" strokeWidth="2.5" />
          <polygon points="1,15 4,14 2,12" fill="#000" />
          <rect x="11" y="2" width="3" height="3" fill="#FF8888" />
        </svg>
      );
    case 'brush':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <path d="M13 2L14 3L8 9L7 8L13 2Z" fill="#884400" />
          <path d="M7 8L8 9L5 12L3 13L4 10L7 8Z" fill="#4488FF" stroke="#000" strokeWidth="0.8" />
        </svg>
      );
    case 'airbrush':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pixelated">
          <rect x="7" y="5" width="5" height="9" fill="#C0C0C0" stroke="#000" strokeWidth="1" />
          <path d="M9 2L9 5M6 3L8 5" stroke="#000" strokeWidth="1" />
          <circle cx="3" cy="3" r="0.8" fill="#000" />
          <circle cx="4" cy="5" r="0.8" fill="#000" />
          <circle cx="2" cy="5" r="0.8" fill="#000" />
        </svg>
      );
    case 'text':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <text
            x="8"
            y="13"
            fontSize="14"
            fontFamily="serif"
            fontWeight="bold"
            fill="#000000"
            textAnchor="middle"
          >
            A
          </text>
        </svg>
      );
    case 'line':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="14" x2="14" y2="2" stroke="#000" strokeWidth="1.5" />
        </svg>
      );
    case 'curve':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 14 C 4 4, 12 12, 14 2" stroke="#000" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2.5" y="4.5" width="11" height="8" stroke="#000" strokeWidth="1.2" />
        </svg>
      );
    case 'polygon':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polygon points="3,13 8,2 14,8 11,14" stroke="#000" strokeWidth="1.2" />
        </svg>
      );
    case 'ellipse':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <ellipse cx="8" cy="8" rx="6" ry="4.5" stroke="#000" strokeWidth="1.2" />
        </svg>
      );
    case 'rounded-rect':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2.5" y="3.5" width="11" height="9" rx="3" stroke="#000" strokeWidth="1.2" />
        </svg>
      );
    default:
      return null;
  }
};
