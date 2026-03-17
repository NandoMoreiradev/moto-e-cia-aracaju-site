'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Handshake, ShieldCheck } from 'lucide-react';

/* ── Styled components ────────────────────────────────────────────────── */
const SectionWrapper = styled.section`
  padding: ${({ theme }) => `${theme.spacing['5xl']} 0`};
  background: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
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
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
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
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.xl};

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
  background: ${({ theme }) => theme.colors.offWhite};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
  width: fit-content;
`;

const OptionTitle = styled.h3`
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.2;
`;

const OptionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
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
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['2xl']}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.button};
  width: fit-content;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(226, 35, 26, 0.5);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['2xl']}`};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  transition: all ${({ theme }) => theme.transitions.normal};
  width: fit-content;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-2px);
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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999';

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
                href={`https://wa.me/${whatsappNumber}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20Consórcio%20Nacional%20Suzuki`}
                target="_blank"
                rel="noopener noreferrer"
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
                href={`https://wa.me/${whatsappNumber}?text=Olá,%20gostaria%20de%20fazer%20uma%20análise%20de%20crédito%20para%20financiamento`}
                target="_blank"
                rel="noopener noreferrer"
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
