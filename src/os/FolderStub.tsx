'use client';

import React from 'react';
import Image from 'next/image';
import type { FolderDef } from './state/types';
import { useT } from '@/i18n/I18nContext';

type FolderStubProps = {
  folder: FolderDef;
};

/**
 * Componente genérico para carpetas en estado "planned" (stubs en construcción).
 * Muestra el icono de la carpeta, el reloj de arena retro y el mensaje localizado.
 */
export const FolderStub = ({ folder }: FolderStubProps) => {
  const { t } = useT();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#C0C0C0] text-center">
      {/* Icono de reloj de arena retro */}
      <div className="mb-4">
        <Image
          src="/icons/hourglass.png"
          alt=""
          width={32}
          height={32}
          className="pixelated animate-pulse"
        />
      </div>

      {/* Título de la carpeta */}
      <h3 className="text-[12px] font-bold text-black mb-1">
        {t(folder.nameKey)}
      </h3>

      {/* Mensaje de estado traducible */}
      <p className="text-[11px] text-[#222222] max-w-[280px]">
        {t('folder.underConstruction')}
      </p>
    </div>
  );
};

