'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { banners as bannersApi } from '@/lib/api';
import type { BannerDto } from '@moto-e-cia/shared';

const CarouselContainer = styled.section`
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dark};
`;

const Slide = styled(motion.div)<{ $bgImage: string }>`
  position: absolute;
  inset: 0;
  background-image: ${({ $bgImage }) => 
    $bgImage.includes('gradient') 
      ? $bgImage 
      : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("${$bgImage}")`
  };
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 1280px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  color: white;
  z-index: 2;
`;

const Label = styled(motion.span)`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primaryLight};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-transform: uppercase;
  font-weight: 700;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.25rem);
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  color: rgba(255, 255, 255, 0.82);
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PrimaryButton = styled(Link)`
  padding: 1rem 2.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.heading};
  letter-spacing: 0.05em;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(226, 35, 26, 0.8);
    border-color: transparent;
  }

  &.prev { left: 2rem; }
  &.next { right: 2rem; }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
`;

const Indicator = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '40px' : '10px')};
  height: 10px;
  border-radius: 5px;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'rgba(255, 255, 255, 0.3)')};
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const HeroCarousel = () => {
  const [slides, setSlides] = useState<BannerDto[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bannersApi.list()
      .then(data => setSlides(data))
      .catch(err => console.error('Erro ao carregar banners:', err))
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (loading || slides.length === 0) {
    return <CarouselContainer />;
  }

  const activeSlide = slides[current];

  return (
    <CarouselContainer>
      <AnimatePresence mode="wait">
        <Slide
          key={activeSlide.id}
          $bgImage={activeSlide.imageUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <Content>
            {activeSlide.label && (
              <Label
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {activeSlide.label}
              </Label>
            )}
            <Title
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {activeSlide.titulo}
            </Title>
            {activeSlide.subtitulo && (
              <Subtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {activeSlide.subtitulo}
              </Subtitle>
            )}
            {activeSlide.link && (
              <ButtonGroup
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <PrimaryButton href={activeSlide.link}>Conhecer Modelo</PrimaryButton>
              </ButtonGroup>
            )}
          </Content>
        </Slide>
      </AnimatePresence>

      <NavButton className="prev" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </NavButton>
      <NavButton className="next" onClick={nextSlide}>
        <ChevronRight size={24} />
      </NavButton>

      <Indicators>
        {slides.map((_, index) => (
          <Indicator
            key={index}
            $active={index === current}
            onClick={() => setCurrent(index)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};
