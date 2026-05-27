'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Handshake, ShieldCheck } from 'lucide-react';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

/* ── Styled components ────────────────────────────────────────────────── */
const SectionWrapper = styled.section`
  padding: ${({ theme }) => `${theme.spacing['6xl']} 0`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, #0a0a0a 100%);
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;

  /* Efeito de velocidade / fibra de carbono */
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
  }
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
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: 0.02em;
`;

const OptionRow = styled(motion.div)<{ reverse?: boolean }>`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
  align-items: center;
  gap: ${({ theme }) => theme.spacing['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing['5xl']};

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 968px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing['2xl']};
  }
`;

const OptionImageWrapper = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 40px 0 40px 0;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
  border-left: 6px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 6px solid ${({ theme }) => theme.colors.primaryDark};


  @media (max-width: 968px) {
    aspect-ratio: 16 / 9;
  }
`;

const OptionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 968px) {
    text-align: center;
    align-items: center;
  }
`;

const OptionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: rgba(255,255,255,0.05);
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 800;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
  width: fit-content;
`;

const OptionTitle = styled.h3`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.1;

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: ${({ theme }) => theme.colors.primary};
    margin-top: ${({ theme }) => theme.spacing.sm};
    transform: skewX(-20deg);
  }
`;

const OptionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.lightGray};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing['2xl']} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 968px) {
    align-items: center;
  }
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['3xl']}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease;
  width: fit-content;
  border: none; cursor: pointer; fontFamily: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: scale(1.05) translateX(5px);
    box-shadow: 0 0 25px rgba(0, 85, 164, 0.6);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['3xl']}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease;
  width: fit-content;
  cursor: pointer; fontFamily: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05) translateX(5px);
    box-shadow: 0 0 25px rgba(0, 85, 164, 0.4);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

/* ── Component ────────────────────────────────────────────────── */
export function PaymentOptions() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <SectionWrapper>
      <SectionContent>
        <SectionHeader>
          <SectionLabel>Facilidades de Pagamento</SectionLabel>
          <SectionTitle>Conquiste a sua moto dos sonhos</SectionTitle>
        </SectionHeader>

        {/* Consórcio Nacional Suzuki */}
        <OptionRow
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <OptionImageWrapper>
            <Image
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1470&auto=format&fit=crop"
              alt="Consórcio Nacional Suzuki - Homem pilotando moto"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 968px) 100vw, 50vw"
            />
          </OptionImageWrapper>
          <OptionContent>
            <OptionBadge>
              <TrendingUp size={16} /> Planejado
            </OptionBadge>
            <OptionTitle>Consórcio Nacional Suzuki</OptionTitle>
            <OptionDescription>
              A forma mais inteligente e econômica de planejar a compra da sua Suzuki 0km. 
              Sem juros, flexível e com a garantia da própria fábrica. Seu sonho mais perto do que você imagina.
            </OptionDescription>
            <BenefitsList>
              <BenefitItem>
                <CheckCircle2 size={20} /> Taxa de administração consideravelmente baixa
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={20} /> Prazos flexíveis que cabem no bolso
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={20} /> Oferte lances para contemplação mais rápida
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={20} /> Garantia de entrega da fábrica
              </BenefitItem>
            </BenefitsList>
            <ButtonGroup>
              <PrimaryButton 
                onClick={() => openWhatsApp('Olá, gostaria de saber mais sobre o Consórcio Nacional Suzuki')}
              >
                Fazer Simulação
              </PrimaryButton>
            </ButtonGroup>
          </OptionContent>
        </OptionRow>

        {/* Financiamento */}
        <OptionRow
          reverse
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <OptionImageWrapper>
            <Image
              src="https://images.unsplash.com/photo-1560250059-86927bfdf158?q=80&w=1548&auto=format&fit=crop"
              alt="Financiamento - Aperto de mãos e fechamento de negócio"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 968px) 100vw, 50vw"
            />
          </OptionImageWrapper>
          <OptionContent>
            <OptionBadge>
              <Handshake size={16} /> Imediato
            </OptionBadge>
            <OptionTitle>Financiamento Facilitado</OptionTitle>
            <OptionDescription>
              Quer sair acelerando na hora? Trabalhamos com as melhores taxas do mercado 
              através dos nossos bancos parceiros. Aprovação rápida e parcelas que se adaptam 
              ao seu orçamento.
            </OptionDescription>
            <BenefitsList>
              <BenefitItem>
                <ShieldCheck size={20} /> Aprovação de crédito super rápida
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={20} /> Taxas especiais para modelos selecionados
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={20} /> Aceitamos sua moto usada na troca
              </BenefitItem>
              <BenefitItem>
                <CheckCircle2 size={20} /> Planos em até 48x
              </BenefitItem>
            </BenefitsList>
            <ButtonGroup>
              <SecondaryButton 
                onClick={() => openWhatsApp('Olá, gostaria de fazer uma análise de crédito para financiamento')}
              >
                Análise de Crédito
              </SecondaryButton>
            </ButtonGroup>
          </OptionContent>
        </OptionRow>

      </SectionContent>
    </SectionWrapper>
  );
}
