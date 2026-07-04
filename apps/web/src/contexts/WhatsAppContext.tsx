'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface WhatsAppContextProps {
  isOpen: boolean;
  message: string;
  openWhatsApp: (msg?: string) => void;
  closeWhatsApp: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextProps | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const openWhatsApp = (msg?: string) => {
    const defaultMsg = 'Olá! Gostaria de mais informações.';
    const text = encodeURIComponent(msg || defaultMsg);
    window.open(`https://wa.me/5579998191298?text=${text}`, '_blank');
  };

  const closeWhatsApp = () => {
    // No-op as modal is removed
  };

  return (
    <WhatsAppContext.Provider value={{ isOpen: false, message: '', openWhatsApp, closeWhatsApp }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
}
