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
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openWhatsApp = (msg?: string) => {
    setMessage(msg || '');
    setIsOpen(true);
  };

  const closeWhatsApp = () => {
    setIsOpen(false);
    setMessage('');
  };

  return (
    <WhatsAppContext.Provider value={{ isOpen, message, openWhatsApp, closeWhatsApp }}>
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
