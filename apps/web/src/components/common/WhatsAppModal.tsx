'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, MessageCircle } from 'lucide-react';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing?.lg || '24px'};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors?.white || '#ffffff'};
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const ModalHeader = styled.div`
  background: ${({ theme }) => theme.colors?.primary || '#0055A4'};
  padding: ${({ theme }) => theme.spacing?.xl || '32px'};
  color: ${({ theme }) => theme.colors?.white || '#ffffff'};
  text-align: center;
  position: relative;

  h2 {
    font-size: ${({ theme }) => theme.fontSizes?.['2xl'] || '1.5rem'};
    font-weight: 800;
    margin: 0 0 ${({ theme }) => theme.spacing?.xs || '8px'};
    text-transform: uppercase;
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
    opacity: 0.9;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing?.md || '16px'};
  right: ${({ theme }) => theme.spacing?.md || '16px'};
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing?.xl || '32px'};
`;

const StoreOption = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing?.xl || '32px'};
  background: ${({ theme }) => theme.colors?.offWhite || '#f5f5f5'};
  border: 2px solid transparent;
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing?.md || '16px'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: white;
    border-color: #25D366;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(37, 211, 102, 0.1);
  }

  .icon-wrapper {
    background: rgba(37, 211, 102, 0.1);
    color: #25D366;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${({ theme }) => theme.spacing?.lg || '24px'};
    flex-shrink: 0;
  }

  .details {
    flex: 1;
    
    h3 {
      font-size: ${({ theme }) => theme.fontSizes?.lg || '1.125rem'};
      font-weight: 700;
      color: ${({ theme }) => theme.colors?.textPrimary || '#111111'};
      margin: 0 0 4px;
    }
    
    p {
      font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
      color: ${({ theme }) => theme.colors?.gray || '#666666'};
      margin: 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const STORES = [
  {
    id: 'aracaju',
    name: 'Loja Aracaju',
    address: 'Fale com a equipe de Aracaju',
    phone: '5579981664850', // (79) 98166-4850
  },
  {
    id: 'socorro',
    name: 'Loja N. S. do Socorro',
    address: 'Fale com a equipe de Socorro',
    phone: '5579991470176', // (79) 99147-0176
  }
];

export function WhatsAppModal() {
  const { isOpen, message, closeWhatsApp } = useWhatsApp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleStoreClick = (phone: string) => {
    const url = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    closeWhatsApp();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWhatsApp}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <CloseButton onClick={closeWhatsApp} aria-label="Fechar">
                <X size={20} />
              </CloseButton>
              <h2>Fale Conosco</h2>
              <p>Escolha com qual loja você deseja falar</p>
            </ModalHeader>
            <ModalBody>
              {STORES.map((store) => (
                <StoreOption key={store.id} onClick={() => handleStoreClick(store.phone)}>
                  <div className="icon-wrapper">
                    <MessageCircle size={24} />
                  </div>
                  <div className="details">
                    <h3>{store.name}</h3>
                    <p><MapPin size={14} /> {store.address}</p>
                  </div>
                </StoreOption>
              ))}
            </ModalBody>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
