'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, ChevronLeft, ChevronRight, Navigation, Store as StoreIcon } from 'lucide-react';
import Image from 'next/image';
import { lojas as lojasApi } from '@/lib/api';
import type { LojaDto } from '@moto-e-cia/shared';

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
  display: inline-block; font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 800; letter-spacing: 0.2em;
  text-transform: uppercase; color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: 0.02em;
  line-height: 1.1;

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: ${({ theme }) => theme.colors.primary};
    margin: ${({ theme }) => theme.spacing.md} auto 0;
    transform: skewX(-20deg);
  }
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
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.colors.dark};
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
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
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 24px;
    background: ${({ theme }) => theme.colors.primary};
    transform: skewX(-15deg);
    border-radius: 2px;
  }
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
  font-weight: 500;

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
  font-weight: 800;
  border-radius: 0;
  transition: all 0.3s ease;
  min-width: 140px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);

  ${({ $variant, theme }) => {
    if ($variant === 'whatsapp') {
      return `
        background: ${theme.colors.whatsapp || '#25D366'};
        color: ${theme.colors.white};
        border: none;
        &:hover { 
          background: #1dad57; 
          transform: translateY(-2px); 
          box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
        }
      `;
    }
    if ($variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: none;
        &:hover { 
          background: ${theme.colors.primaryDark || '#cc5200'}; 
          transform: translateY(-2px); 
          box-shadow: 0 10px 20px rgba(255, 107, 0, 0.3);
        }
      `;
    }
    return `
      background: ${theme.colors.offWhite};
      border: none;
      color: ${theme.colors.textPrimary};
      &:hover { 
        background: ${theme.colors.lightGray};
        color: ${theme.colors.primary}; 
        transform: translateY(-2px); 
      }
    `;
  }}
`;

const CarouselPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
`;

const StoreCarousel = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (images.length === 0) {
    return (
      <CarouselContainer>
        <CarouselPlaceholder>
          <StoreIcon size={48} />
        </CarouselPlaceholder>
      </CarouselContainer>
    );
  }

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
  const [lojas, setLojas] = useState<LojaDto[]>([]);

  useEffect(() => {
    lojasApi.list().then(setLojas).catch(() => setLojas([]));
  }, []);

  if (lojas.length === 0) return null;

  return (
    <SectionWrapper id="nossas-lojas">
      <SectionContent>
        <SectionHeader>
          <SectionLabel>Visite-nos</SectionLabel>
          <SectionTitle>Nossas Lojas</SectionTitle>
        </SectionHeader>

        <StoresGrid>
          {lojas.map((loja) => (
            <StoreCard
              key={loja.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <StoreCarousel images={loja.fotos.map(f => f.url)} />

              <StoreBody>
                <StoreName>Moto e Cia - {loja.nome}</StoreName>

                <InfoList>
                  <InfoItem>
                    <MapPin size={20} />
                    <span>{loja.cidadeEstado}: {loja.endereco}</span>
                  </InfoItem>
                  <InfoItem>
                    <Phone size={20} />
                    <span>{loja.telefone}</span>
                  </InfoItem>
                  <InfoItem>
                    <Clock size={20} />
                    <span>{loja.horario}</span>
                  </InfoItem>
                </InfoList>

                <ActionButtons>
                  <Button
                    href={`https://wa.me/${loja.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    $variant="whatsapp"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </Button>
                  {loja.mapUrl && (
                    <Button
                      href={loja.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      $variant="outline"
                    >
                      <Navigation size={18} /> Como Chegar
                    </Button>
                  )}
                </ActionButtons>

              </StoreBody>
            </StoreCard>
          ))}
        </StoresGrid>
      </SectionContent>
    </SectionWrapper>
  );
};
