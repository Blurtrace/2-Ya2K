'use client';

import React, { useState } from 'react';
import type { FolderDef } from './state/types';
import { DesktopIcon } from './DesktopIcon';
import { useOs } from './state/OsContext';
import { useT } from '@/i18n/I18nContext';

type FolderExplorerProps = {
  folder: FolderDef;
};

/**
 * Explorador de carpetas genérico para carpetas contenedoras como "BANK OF MEMORIES".
 * Presenta barra de menú retro, área hundida de contenido blanco y barra de estado.
 */
export const FolderExplorer = ({ folder }: FolderExplorerProps) => {
  const { dispatch } = useOs();
  const { t } = useT();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const children = folder.children ?? [];

  const handleOpenChild = (childId: string) => {
    dispatch({ type: 'OPEN', id: childId });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#C0C0C0] text-black">
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

      {/* Barra de dirección */}
      <div className="flex items-center px-1.5 py-1 text-[11px] space-x-1.5 bg-[#C0C0C0]">
        <span className="text-[#808080]">{t('explorer.address')}</span>
        <div className="flex-1 win-sunken bg-white px-1 py-0.5 text-black truncate">
          C:\ECOS\{t(folder.nameKey)}
        </div>
      </div>

      {/* Área hundida de iconos */}
      <div
        onClick={() => setSelectedChildId(null)}
        className="flex-1 win-sunken bg-white p-3 overflow-auto flex flex-wrap content-start gap-4"
      >
        {children.map((child) => (
          <div key={child.id} className="text-black">
            <DesktopIcon
              folder={child}
              isSelected={selectedChildId === child.id}
              onSelect={(id) => setSelectedChildId(id)}
              onOpen={(id) => handleOpenChild(id)}
            />
          </div>
        ))}
      </div>

      {/* Barra de estado al pie del explorador */}
      <div className="win-sunken bg-[#C0C0C0] px-2 py-0.5 text-[11px] text-[#000000] flex justify-between">
        <span>{t('folder.itemsCount', { count: children.length })}</span>
        <span>{t('explorer.bytes', { bytes: 0 })}</span>
      </div>
    </div>
  );
};

