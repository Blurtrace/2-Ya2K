'use client';

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { OsState, OsAction } from './types';
import { osReducer, initialOsState } from './osReducer';

type OsContextValue = {
  state: OsState;
  dispatch: React.Dispatch<OsAction>;
};

const OsContext = createContext<OsContextValue | null>(null);

export const OsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(osReducer, initialOsState);

  return (
    <OsContext.Provider value={{ state, dispatch }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOs = (): OsContextValue => {
  const context = useContext(OsContext);
  if (!context) {
    throw new Error('useOs debe utilizarse dentro de un OsProvider');
  }
  return context;
};

