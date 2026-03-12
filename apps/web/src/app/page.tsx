'use client';

import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(226, 35, 26, 0.15) 0%,
      rgba(0, 85, 164, 0.1) 100%
    );
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const HeroLabel = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: ${fadeInUp} 0.6s ease forwards;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.1;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeInUp} 0.6s ease 0.1s forwards;
  opacity: 0;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: rgba(255, 255, 255, 0.7);
  max-width: 560px;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  animation: ${fadeInUp} 0.6s ease 0.2s forwards;
  opacity: 0;
`;

const HeroActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.6s ease 0.3s forwards;
  opacity: 0;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['2xl']}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.button};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(226, 35, 26, 0.5);
  }

  &:active { transform: translateY(0); }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['2xl']}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.white};
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const BrandsSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing['3xl']} 0`};
  background: ${({ theme }) => theme.colors.offWhite};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const BrandsWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const BrandsLabel = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BrandsGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing['3xl']};
  flex-wrap: wrap;
`;

const BrandName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.lightGray};
  letter-spacing: 0.05em;
  transition: color ${({ theme }) => theme.transitions.fast};
  cursor: default;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SectionWrapper = styled.section`
  padding: ${({ theme }) => `${theme.spacing['5xl']} 0`};
`;

const SectionContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const MotoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const MotoCardImage = styled.div`
  height: 220px;
  background: ${({ theme }) => theme.colors.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.lightGray};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MotoCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MotoCardMarca = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.primary};
`;

const MotoCardNome = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: ${({ theme }) => `${theme.spacing.xs} 0 ${theme.spacing.md}`};
`;

const MotoCardPreco = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ServicosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ServicoCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-4px);
  }
`;

const ServicoIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ServicoTitulo = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ServicoDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const CTASection = styled.section`
  padding: ${({ theme }) => `${theme.spacing['5xl']} 0`};
  background: ${({ theme }) => theme.colors.dark};
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const WhatsAppButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['2xl']}`};
  background: ${({ theme }) => theme.colors.whatsapp};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-top: ${({ theme }) => theme.spacing['2xl']};

  &:hover {
    background: #1dad57;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
  }
`;

import { Wrench, Settings, Plus, RotateCcw, Droplets, ShieldCheck } from 'lucide-react';

const SERVICOS = [
  { icon: <Wrench size={32} />, titulo: 'Revisão Completa', desc: 'Manutenção preventiva e corretiva com técnicos certificados' },
  { icon: <Settings size={32} />, titulo: 'Mecânica em Geral', desc: 'Reparo e diagnóstico para todas as marcas e modelos' },
  { icon: <Plus size={32} />, titulo: 'Instalação de Acessórios', desc: 'Instalação profissional de baús, proteções e tecnologia' },
  { icon: <RotateCcw size={32} />, titulo: 'Troca de Pneus', desc: 'Borracharia especializada com as melhores marcas do mercado' },
  { icon: <Droplets size={32} />, titulo: 'Troca de Óleo', desc: 'Óleos Motul originais para proteger seu motor' },
  { icon: <ShieldCheck size={32} />, titulo: 'Inspeção de Freio', desc: 'Garantia de segurança com revisão completa dos sistemas de freio' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection>
        <HeroContent>
          <HeroLabel>Concessionária Oficial em Aracaju</HeroLabel>
          <HeroTitle>
            Encontre sua <span>próxima moto</span> com facilidade
          </HeroTitle>
          <HeroSubtitle>
            Revendedora oficial Suzuki, Haojue e Zontes. Motos novas, usadas, peças, serviços e
            aluguel em Aracaju/SE.
          </HeroSubtitle>
          <HeroActions>
            <PrimaryButton href="/motos">Ver catálogo</PrimaryButton>
            <SecondaryButton href="/contato">Falar conosco</SecondaryButton>
          </HeroActions>
        </HeroContent>
      </HeroSection>

      {/* Marcas */}
      <BrandsSection>
        <BrandsWrapper>
          <BrandsLabel>Marcas oficiais</BrandsLabel>
          <BrandsGrid>
            {['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO'].map((marca) => (
              <BrandName key={marca}>{marca}</BrandName>
            ))}
          </BrandsGrid>
        </BrandsWrapper>
      </BrandsSection>

      {/* Motos em Destaque */}
      <SectionWrapper>
        <SectionContent>
          <SectionHeader>
            <SectionLabel>Destaques</SectionLabel>
            <SectionTitle>Motos em Destaque</SectionTitle>
          </SectionHeader>
          <MotosGrid>
            {[1, 2, 3].map((i) => (
              <MotoCard key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                <MotoCardImage>📷 Foto da moto</MotoCardImage>
                <MotoCardBody>
                  <MotoCardMarca>Suzuki</MotoCardMarca>
                  <MotoCardNome>GSX-8R 2024</MotoCardNome>
                  <MotoCardPreco>R$ 49.900,00</MotoCardPreco>
                </MotoCardBody>
              </MotoCard>
            ))}
          </MotosGrid>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <PrimaryButton href="/motos">Ver todas as motos →</PrimaryButton>
          </div>
        </SectionContent>
      </SectionWrapper>

      {/* Serviços */}
      <SectionWrapper style={{ background: '#F8F8F8' }}>
        <SectionContent>
          <SectionHeader>
            <SectionLabel>O que oferecemos</SectionLabel>
            <SectionTitle>Nossos Serviços</SectionTitle>
          </SectionHeader>
          <ServicosGrid>
            {SERVICOS.map((s) => (
              <ServicoCard key={s.titulo}>
                <ServicoIcon>{s.icon}</ServicoIcon>
                <ServicoTitulo>{s.titulo}</ServicoTitulo>
                <ServicoDesc>{s.desc}</ServicoDesc>
              </ServicoCard>
            ))}
          </ServicosGrid>
        </SectionContent>
      </SectionWrapper>

      {/* CTA WhatsApp */}
      <CTASection>
        <CTAContent>
          <SectionLabel>Atendimento</SectionLabel>
          <HeroTitle style={{ color: 'white', fontSize: '2rem', marginTop: '0.5rem' }}>
            Precisa de ajuda para escolher?
          </HeroTitle>
          <HeroSubtitle>
            Nossa equipe está pronta para te ajudar a encontrar a moto perfeita para você.
          </HeroSubtitle>
          <WhatsAppButton
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Chamar no WhatsApp
          </WhatsAppButton>
        </CTAContent>
      </CTASection>
    </>
  );
}
