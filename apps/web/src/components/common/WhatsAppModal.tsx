'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors?.dark || '#151515'} 0%, #0a0a0a 100%);
  border-radius: 20px 0 20px 0;
  border-left: 6px solid ${({ theme }) => theme.colors?.primary || '#0055A4'};
  border-right: 6px solid ${({ theme }) => theme.colors?.primary || '#0055A4'};
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02) 2px,
      transparent 2px,
      transparent 8px
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ModalHeader = styled.div`
  padding: 32px 32px 20px;
  text-align: center;
  position: relative;
  z-index: 2;

  h2 {
    color: ${({ theme }) => theme.colors?.white || '#ffffff'};
    font-size: ${({ theme }) => theme.fontSizes?.xl || '1.25rem'};
    font-weight: 800;
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
    margin: 0;
    font-weight: 500;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 3;
  
  &:hover {
    color: white;
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 0 32px 32px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StoreOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 20px;
  background: #25D366;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  font-family: inherit;

  &:hover {
    background: #20b858;
    transform: scale(1.03) translateX(3px);
  }

  .icon-wrapper {
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details {
    text-align: left;
    
    h3 {
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      margin: 0 0 2px;
      letter-spacing: 0.05em;
    }
    
    p {
      font-size: 12px;
      margin: 0;
      opacity: 0.9;
      font-weight: 500;
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
    const url = `https://wa.me/${phone}${message ? '?text=' + encodeURIComponent(message) : ''}`;
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
            <CloseButton onClick={closeWhatsApp} aria-label="Fechar">
              <X size={20} />
            </CloseButton>
            
            <ModalHeader>
              <h2>Fale Conosco</h2>
              <p>Escolha com qual loja deseja falar</p>
            </ModalHeader>
            
            <ModalBody>
              {STORES.map((store) => (
                <StoreOption key={store.id} onClick={() => handleStoreClick(store.phone)}>
                  <div className="icon-wrapper">
                    <MessageCircle size={24} />
                  </div>
                  <div className="details">
                    <h3>{store.name}</h3>
                    <p>{store.address}</p>
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
