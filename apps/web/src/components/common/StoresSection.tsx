'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import Image from 'next/image';

const SectionWrapper = styled.section`
  padding: ${({ theme }) => `${theme.spacing['5xl']} 0`};
  background: ${({ theme }) => theme.colors.offWhite};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const SectionContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const SectionLabel = styled.span`
  display: inline-block; font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold}; letter-spacing: 0.15em;
  text-transform: uppercase; color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StoresGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StoreCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.colors.dark};
  overflow: hidden;
`;

const Slide = styled(motion.div)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  &.prev { left: 1rem; }
  &.next { right: 1rem; }
`;

const StoreBody = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StoreName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex: 1;
`;

const InfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    margin-top: 2px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Button = styled.a<{ $variant?: 'whatsapp' | 'primary' | 'outline' }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  min-width: 140px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;

  ${({ $variant, theme }) => {
    if ($variant === 'whatsapp') {
      return `
        background: ${theme.colors.whatsapp};
        color: ${theme.colors.white};
        &:hover { background: #1dad57; transform: translateY(-2px); }
      `;
    }
    if ($variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        &:hover { background: ${theme.colors.primaryDark}; transform: translateY(-2px); }
      `;
    }
    return `
      background: transparent;
      border: 1px solid ${theme.colors.lightGray};
      color: ${theme.colors.textPrimary};
      &:hover { border-color: ${theme.colors.primary}; color: ${theme.colors.primary}; transform: translateY(-2px); }
    `;
  }}
`;

const StoreCarousel = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <CarouselContainer>
      <AnimatePresence mode="wait">
        <Slide
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={images[current]} alt="Loja da Moto e Cia" fill style={{ objectFit: 'cover' }} />
        </Slide>
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          <NavButton className="prev" onClick={prevSlide} aria-label="Anterior">
            <ChevronLeft size={20} />
          </NavButton>
          <NavButton className="next" onClick={nextSlide} aria-label="Próximo">
            <ChevronRight size={20} />
          </NavButton>
        </>
      )}
    </CarouselContainer>
  );
};

export const StoresSection = () => {
  const stores = [
    {
      id: 1,
      name: 'Moto e Cia - Matriz',
      address: 'Endereço da Matriz - Aracaju, SE',
      phone: '(79) 0000-0000',
      whatsapp: '5579999999999',
      schedule: 'Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 13:00',
      mapUrl: 'https://maps.google.com',
      images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    {
      id: 2,
      name: 'Moto e Cia - Filial',
      address: 'Endereço da Filial - Aracaju, SE',
      phone: '(79) 0000-0000',
      whatsapp: '5579999999999',
      schedule: 'Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 13:00',
      mapUrl: 'https://maps.google.com',
      images: [
        'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590740924900-534e7fb21ee8?q=80&w=2070&auto=format&fit=crop'
      ]
    }
  ];

  return (
    <SectionWrapper id="nossas-lojas">
      <SectionContent>
        <SectionHeader>
          <SectionLabel>Visite-nos</SectionLabel>
          <SectionTitle>Nossas Lojas</SectionTitle>
        </SectionHeader>

        <StoresGrid>
          {stores.map((store) => (
            <StoreCard 
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <StoreCarousel images={store.images} />
              
              <StoreBody>
                <StoreName>{store.name}</StoreName>
                
                <InfoList>
                  <InfoItem>
                    <MapPin size={20} />
                    <span>{store.address}</span>
                  </InfoItem>
                  <InfoItem>
                    <Phone size={20} />
                    <span>{store.phone}</span>
                  </InfoItem>
                  <InfoItem>
                    <Clock size={20} />
                    <span>{store.schedule}</span>
                  </InfoItem>
                </InfoList>
                
                <ActionButtons>
                  <Button 
                    href={`https://wa.me/${store.whatsapp}`} 
                    target="_blank" 
                    rel="noreferrer"
                    $variant="whatsapp"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </Button>
                  <Button 
                    href={store.mapUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    $variant="outline"
                  >
                    <Navigation size={18} /> Como Chegar
                  </Button>
                </ActionButtons>

              </StoreBody>
            </StoreCard>
          ))}
        </StoresGrid>
      </SectionContent>
    </SectionWrapper>
  );
};
