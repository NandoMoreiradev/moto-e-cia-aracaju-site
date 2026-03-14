'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroCarousel } from '@/components/common/HeroCarousel';
import { Wrench, Settings, Plus, RotateCcw, Droplets, ShieldCheck } from 'lucide-react';

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

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing['2xl']}`};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.button};

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(226, 35, 26, 0.5);
  }
`;

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
      <HeroCarousel />

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
          <SectionTitle style={{ color: 'white', marginTop: '0.5rem' }}>
            Precisa de ajuda para escolher?
          </SectionTitle>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '1rem 0 2rem' }}>
            Nossa equipe está pronta para te ajudar a encontrar a moto perfeita para você.
          </p>
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
