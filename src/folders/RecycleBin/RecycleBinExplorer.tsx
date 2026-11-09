'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOs } from '@/os/state/OsContext';
import { useT } from '@/i18n/I18nContext';
import { findFolderById } from '@/folders/registry';

type EasterEggItem = {
  id: string;
  nameKey: string;
  type: 'txt' | 'exe' | 'doc' | 'log';
  icon: string;
  size: string;
  date: string;
  dialogTitleKey: string;
  contentKey: string;
};

const EASTER_EGG_FILES: EasterEggItem[] = [
  {
    id: 'dudas',
    nameKey: 'recycleBin.dudasName',
    type: 'txt',
    icon: '/icons/voucher.png', // O icono de texto
    size: '0 KB',
    date: '01/01/2023',
    dialogTitleKey: 'recycleBin.dudasDialogTitle',
    contentKey: 'recycleBin.dudasContent',
  },
  {
    id: 'ganas',
    nameKey: 'recycleBin.ganasName',
    type: 'exe',
    icon: '/icons/purble-place.png',
    size: '0 KB',
    date: '14/02/2024',
    dialogTitleKey: 'recycleBin.ganasDialogTitle',
    contentKey: 'recycleBin.ganasContent',
  },
  {
    id: 'motivos',
    nameKey: 'recycleBin.motivosName',
    type: 'doc',
    icon: '/icons/minesweeper.png',
    size: '0 KB',
    date: '20/05/2024',
    dialogTitleKey: 'recycleBin.motivosDialogTitle',
    contentKey: 'recycleBin.motivosContent',
  },
  {
    id: 'enojo',
    nameKey: 'recycleBin.enojoName',
    type: 'log',
    icon: '/icons/solitaire.png',
    size: '1 KB',
    date: '15/11/2024',
    dialogTitleKey: 'recycleBin.enojoDialogTitle',
    contentKey: 'recycleBin.enojoContent',
  },
];

export const RecycleBinExplorer = () => {
  const { state, dispatch } = useOs();
  const { t } = useT();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<{
    title: string;
    content: string;
    isError?: boolean;
    restoreId?: string;
  } | null>(null);

  // Estado para el modal de confirmación antes de vaciar
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);
  // Estado para el modal de Acceso Denegado
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  // Carpetas del escritorio que han sido enviadas a la papelera
  const recycledDesktopFolders = state.recycledIds
    .map((id) => findFolderById(id))
    .filter(Boolean);

  const totalCount = EASTER_EGG_FILES.length + recycledDesktopFolders.length;

  // Manejo de apertura al hacer doble clic
  const handleItemDoubleClick = (item: EasterEggItem) => {
    setActiveDialog({
      title: t(item.dialogTitleKey),
      content: t(item.contentKey),
    });
  };

  const handleDesktopFolderDoubleClick = (folderId: string, folderName: string) => {
    setActiveDialog({
      title: `${folderName} - ${t('recycleBin.title')}`,
      content: t('recycleBin.askRestoreItem', { name: folderName }),
      restoreId: folderId,
    });
  };

  // Acción de Vaciar la Papelera
  const handleEmptyClick = () => {
    setShowConfirmEmpty(true);
  };

  // Al confirmar el vaciado: mostrar el bloqueo del corazón
  const handleConfirmEmpty = () => {
    setShowConfirmEmpty(false);
    setShowAccessDenied(true);
  };

  // Restaurar un elemento específico
  const handleRestoreItem = (id: string) => {
    dispatch({ type: 'RESTORE_FROM_RECYCLE_BIN', id });
    setActiveDialog(null);
  };

  // Restaurar todos los elementos
  const handleRestoreAll = () => {
    dispatch({ type: 'RESTORE_ALL_FROM_RECYCLE_BIN' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#C0C0C0] text-black select-none font-sans overflow-hidden relative">
      {/* Barra de menú clásica de Windows 98 */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] text-[11px] bg-[#C0C0C0]">
        <div className="relative group">
          <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-default">
            {t('explorer.file')}
          </span>
          <div className="hidden group-hover:flex absolute left-0 top-full z-50 win-raised bg-[#C0C0C0] p-[2px] w-[180px] flex-col text-[11px]">
            <div
              onClick={handleEmptyClick}
              className="px-2 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
            >
              {t('recycleBin.emptyBin')}
            </div>
            {recycledDesktopFolders.length > 0 && (
              <div
                onClick={handleRestoreAll}
                className="px-2 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
              >
                {t('recycleBin.restoreAll')}
              </div>
            )}
          </div>
        </div>
        <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-default">
          {t('explorer.edit')}
        </span>
        <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-default">
          {t('explorer.view')}
        </span>
        <span className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-default">
          {t('explorer.help')}
        </span>
      </div>

      {/* Barra de herramientas con botones retro */}
      <div className="flex items-center space-x-1 px-2 py-1 border-b border-[#808080] bg-[#C0C0C0] text-[11px] shadow-sm flex-wrap gap-1">
        <button
          onClick={handleEmptyClick}
          className="win-raised active:win-pressed px-2.5 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
          title={t('recycleBin.emptyBin')}
        >
          <span>🗑️</span>
          <span>{t('recycleBin.emptyBin')}</span>
        </button>

        {recycledDesktopFolders.length > 0 && (
          <button
            onClick={handleRestoreAll}
            className="win-raised active:win-pressed px-2.5 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
            title={t('recycleBin.restoreAll')}
          >
            <span>↩️</span>
            <span>{t('recycleBin.restoreAll')}</span>
          </button>
        )}
      </div>

      {/* Barra de dirección */}
      <div className="flex items-center px-2 py-1 text-[11px] space-x-1.5 bg-[#C0C0C0]">
        <span className="text-[#808080]">{t('explorer.address')}</span>
        <div className="flex-1 win-sunken bg-white px-1.5 py-0.5 text-black truncate flex items-center gap-1">
          <span>🗑️</span>
          <span>C:\RECYCLED\{t('recycleBin.address')}</span>
        </div>
      </div>

      {/* Área hundida de contenido (archivos de la papelera) */}
      <div
        onClick={() => setSelectedId(null)}
        className="flex-1 win-sunken bg-white p-3 overflow-auto flex flex-wrap content-start gap-4"
      >
        {/* Archivos predefinidos imposibles de borrar (Easter Eggs románticos) */}
        {EASTER_EGG_FILES.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleItemDoubleClick(item);
              }}
              className={`flex flex-col items-center justify-start w-[84px] p-1 select-none cursor-pointer group ${
                isSelected ? 'bg-[#000080] text-white' : 'hover:bg-blue-50 text-black'
              }`}
            >
              <div className="text-3xl mb-1 select-none">
                {item.type === 'txt'
                  ? '📝'
                  : item.type === 'exe'
                  ? '⚙️'
                  : item.type === 'doc'
                  ? '📄'
                  : '📜'}
              </div>
              <span
                className={`text-[11px] text-center leading-tight break-all line-clamp-2 px-1 ${
                  isSelected ? 'text-white' : 'text-black'
                }`}
              >
                {t(item.nameKey)}
              </span>
              <span
                className={`text-[9px] mt-0.5 ${
                  isSelected ? 'text-white/80' : 'text-neutral-500'
                }`}
              >
                {item.size}
              </span>
            </div>
          );
        })}

        {/* Carpetas y aplicaciones arrastradas desde el escritorio */}
        {recycledDesktopFolders.map((folder) => {
          if (!folder) return null;
          const isSelected = selectedId === folder.id;
          const folderName = t(folder.nameKey);
          return (
            <div
              key={folder.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(folder.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleDesktopFolderDoubleClick(folder.id, folderName);
              }}
              className={`flex flex-col items-center justify-start w-[84px] p-1 select-none cursor-pointer group ${
                isSelected ? 'bg-[#000080] text-white' : 'hover:bg-blue-50 text-black'
              }`}
            >
              <div className="w-8 h-8 relative flex items-center justify-center mb-1">
                <Image
                  src={folder.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="pixelated pointer-events-none"
                />
              </div>
              <span
                className={`text-[11px] text-center leading-tight break-all line-clamp-2 px-1 ${
                  isSelected ? 'text-white' : 'text-black'
                }`}
              >
                {folderName}
              </span>
              <span
                className={`text-[9px] mt-0.5 text-blue-800 ${
                  isSelected ? 'text-white/80' : ''
                }`}
              >
                {t('recycleBin.restorable')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Barra de estado inferior */}
      <div className="win-sunken bg-[#C0C0C0] px-2 py-0.5 text-[11px] text-black flex justify-between">
        <span>{t('folder.itemsCount', { count: totalCount })}</span>
        <span className="font-mono text-[10px] text-neutral-700">
          {t('recycleBin.statusSpace')}
        </span>
      </div>

      {/* ================= MODAL: VISOR DE ARCHIVO / NOTEPAD ================= */}
      {activeDialog && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="w-full max-w-[390px] bg-[#C0C0C0] win-raised p-1 shadow-xl border border-[#a0a0a0] flex flex-col">
            {/* Barra de título */}
            <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
              <span className="truncate">{activeDialog.title}</span>
              <button
                onClick={() => setActiveDialog(null)}
                className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contenido tipo Bloc de notas */}
            <div className="p-3 bg-white m-1 win-sunken font-mono text-[11.5px] text-black whitespace-pre-wrap max-h-[220px] overflow-y-auto leading-relaxed select-text">
              {activeDialog.content}
            </div>

            {/* Botones inferiores */}
            <div className="flex justify-end gap-2 p-1 border-t border-[#808080]">
              {activeDialog.restoreId ? (
                <>
                  <button
                    onClick={() => handleRestoreItem(activeDialog.restoreId!)}
                    className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer"
                  >
                    {t('recycleBin.restore')}
                  </button>
                  <button
                    onClick={() => setActiveDialog(null)}
                    className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] cursor-pointer"
                  >
                    {t('dialog.cancel')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveDialog(null)}
                  className="win-raised active:win-pressed px-4 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer"
                >
                  {t('dialog.ok')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: CONFIRMACIÓN ANTES DE VACIAR ================= */}
      {showConfirmEmpty && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#C0C0C0] win-raised p-1 shadow-2xl border border-[#a0a0a0] flex flex-col">
            <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
              <span>{t('recycleBin.confirmEmptyTitle')}</span>
              <button
                onClick={() => setShowConfirmEmpty(false)}
                className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex items-center gap-3">
              <span className="text-3xl select-none">🗑️</span>
              <p className="text-[11px] text-black font-sans leading-normal">
                {t('recycleBin.confirmEmptyText')}
              </p>
            </div>
            <div className="flex justify-end gap-2 p-2 border-t border-[#808080]">
              <button
                onClick={handleConfirmEmpty}
                className="win-raised active:win-pressed px-4 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer min-w-[70px]"
              >
                {t('dialog.yes')}
              </button>
              <button
                onClick={() => setShowConfirmEmpty(false)}
                className="win-raised active:win-pressed px-4 py-1 bg-[#C0C0C0] text-black text-[11px] cursor-pointer min-w-[70px]"
              >
                {t('dialog.no')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ACCESO DENEGADO (PROTECCIÓN DEL CORAZÓN) ================= */}
      {showAccessDenied && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[410px] bg-[#C0C0C0] win-raised p-1 shadow-2xl border border-[#a0a0a0] flex flex-col">
            {/* Barra de título con estilo de error crítico */}
            <div className="bg-[#800000] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center gap-1.5">
                <span>🛑</span>
                <span>{t('recycleBin.accessDeniedTitle')}</span>
              </div>
              <button
                onClick={() => setShowAccessDenied(false)}
                className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mensaje exacto solicitado */}
            <div className="p-4 flex items-start gap-3">
              <span className="text-4xl select-none">🛑</span>
              <div className="flex-1 text-[12px] text-black font-sans leading-relaxed">
                <p className="font-bold text-[#800000] mb-1">
                  {t('recycleBin.accessDeniedHeading')}
                </p>
                <p className="font-medium text-black">
                  &ldquo;{t('recycleBin.accessDeniedText')}&rdquo; ❤️
                </p>
              </div>
            </div>

            <div className="flex justify-end p-2 border-t border-[#808080]">
              <button
                autoFocus
                onClick={() => setShowAccessDenied(false)}
                className="win-raised active:win-pressed px-5 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer"
              >
                {t('dialog.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
