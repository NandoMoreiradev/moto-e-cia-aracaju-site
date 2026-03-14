'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CarouselContainer = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dark};
`;

const Slide = styled(motion.div)<{ $bgImage: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bgImage }) => ($bgImage.includes('gradient') ? $bgImage : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${$bgImage})`)};
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

interface SlideData {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    label: 'Performance Pura',
    title: 'Suzuki GSX-R1000R',
    subtitle: 'A lenda das pistas agora ao seu alcance. Tecnologia de ponta e potência inigualável.',
    image: 'linear-gradient(45deg, #1a1a1a, #4a0e0e)', // Fallback gradient
    link: '/motos/suzuki-gsx-r1000r',
  },
  {
    id: 2,
    label: 'Estilo Urbano',
    title: 'Zontes 310V',
    subtitle: 'O futuro chegou às ruas. Design futurista e tecnologia que redefine o conceito de pilotagem.',
    image: 'linear-gradient(45deg, #0e1a4a, #1a1a1a)', // Fallback gradient
    link: '/motos/zontes-310v',
  },
  {
    id: 3,
    label: 'Versatilidade Total',
    title: 'Haojue NK 150',
    subtitle: 'Pronta para qualquer terreno. Conforto, economia e a robustez que você precisa no dia a dia.',
    image: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)', // Fallback gradient
    link: '/motos/haojue-nk150',
  },
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <CarouselContainer>
      <AnimatePresence mode="wait">
        <Slide
          key={slides[current].id}
          $bgImage={slides[current].image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <Content>
            <Label
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {slides[current].label}
            </Label>
            <Title
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {slides[current].title}
            </Title>
            <Subtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {slides[current].subtitle}
            </Subtitle>
            <ButtonGroup
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <PrimaryButton href={slides[current].link}>Conhecer Modelo</PrimaryButton>
            </ButtonGroup>
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
