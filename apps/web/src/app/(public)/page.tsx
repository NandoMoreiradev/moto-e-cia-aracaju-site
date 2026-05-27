'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wrench, Settings, Plus, RotateCcw, Droplets, ShieldCheck, Calendar, Gauge, Palette, Fuel, MapPin, Star } from 'lucide-react';
import { HeroCarousel } from '@/components/common/HeroCarousel';
import { PaymentOptions } from '@/components/common/PaymentOptions';
import { StoresSection } from '@/components/common/StoresSection';
import { motos as motosApi, marcas as marcasApi } from '@/lib/api';
import type { MotoDto, MarcaDto } from '@moto-e-cia/shared';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

/* ── Styled components ────────────────────────────────────────────────── */
const BrandsSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing['3xl']} 0`};
  background: ${({ theme }) => theme.colors.offWhite};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;
const BrandsWrapper = styled.div`
  max-width: 1280px; margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;
const BrandsLabel = styled.p`
  text-align: center; font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase; letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;
const BrandsGrid = styled.div`
  display: flex; align-items: center; justify-content: center;
  gap: ${({ theme }) => theme.spacing['3xl']}; flex-wrap: wrap;
`;
const BrandLogo = styled(motion.div)`
  height: 60px;
  max-width: 150px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }

  span {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ccc;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  &:hover {
    filter: grayscale(0);
    opacity: 1;
    transform: scale(1.1);
  }
`;
const SectionWrapper = styled.section`
  padding: ${({ theme }) => `${theme.spacing['5xl']} 0`};
`;
const SectionContent = styled.div`
  max-width: 1280px; margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;
const SectionHeader = styled.div`
  text-align: center; margin-bottom: ${({ theme }) => theme.spacing['3xl']};
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
const MotosGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;
const MotoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0;
  overflow: hidden; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
  display: flex; flex-direction: column; height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
`;
const MotoCardImage = styled.div`
  height: 220px; background: ${({ theme }) => theme.colors.offWhite};
  display: flex; align-items: center; justify-content: center;
  color: ${({ theme }) => theme.colors.lightGray}; font-size: ${({ theme }) => theme.fontSizes.sm};
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
`;
const MotoCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;
const MotoCardMarca = styled.div`
  height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }

  span {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const MotoCardNome = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 800;
  text-transform: uppercase;
  margin: ${({ theme }) => `${theme.spacing.xs} 0 ${theme.spacing.sm}`};
  color: #111;
  line-height: 1.1;
`;
const MotoCardMeta = styled.div`
  display: flex; gap: 12px; margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;
const MotoCardMetaItem = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 600;
`;
const MotoCardPreco = styled.p`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;
const ServicosGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;
const ServicoCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0;
  border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.3s ease;
  &:hover { border-bottom-color: ${({ theme }) => theme.colors.primaryDark}; box-shadow: 0 15px 30px rgba(0,0,0,0.1); transform: translateY(-8px); }
`;
const CTASection = styled.section`
  margin: ${({ theme }) => theme.spacing['4xl']} auto ${({ theme }) => theme.spacing['6xl']};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, #0a0a0a 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
  border-left: 6px solid ${({ theme }) => theme.colors.primary};
  border-right: 6px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px 0 20px 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  max-width: 1000px;
  
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
const CTAContent = styled.div`
  max-width: 640px; margin: 0 auto; padding: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 2;
`;
const WhatsAppButton = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing['3xl']}`};
  background: #25D366; color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg}; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.05em;
  border: none; cursor: pointer;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease; margin-top: ${({ theme }) => theme.spacing['2xl']};
  &:hover { background: #20b858; transform: scale(1.05) translateX(5px); box-shadow: 0 0 30px rgba(37, 211, 102, 0.5); }
`;
const PrimaryButton = styled(Link)`
  display: inline-flex; align-items: center; justify-content: center; gap: ${({ theme }) => theme.spacing.sm};
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing['3xl']}`};
  background: ${props => props.theme.colors.primary}; color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.md}; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.05em;
  border-radius: 0;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease;
  width: fit-content;
  &:hover { background: ${props => props.theme.colors.primaryLight}; transform: scale(1.05) translateX(5px); box-shadow: 0 0 25px rgba(0, 85, 164, 0.6); }
`;

/* ── Static data ────────────────────────────────────────────────── */
const SERVICOS = [
  { icon: <Wrench size={32} />, titulo: 'Revisão Completa', desc: 'Manutenção preventiva e corretiva com técnicos certificados' },
  { icon: <Settings size={32} />, titulo: 'Mecânica em Geral', desc: 'Reparo e diagnóstico para todas as marcas e modelos' },
  { icon: <Plus size={32} />, titulo: 'Instalação de Acessórios', desc: 'Instalação profissional de baús, proteções e tecnologia' },
  { icon: <RotateCcw size={32} />, titulo: 'Troca de Pneus', desc: 'Borracharia especializada com as melhores marcas do mercado' },
  { icon: <Droplets size={32} />, titulo: 'Troca de Óleo', desc: 'Óleos Motul originais para proteger seu motor' },
  { icon: <ShieldCheck size={32} />, titulo: 'Inspeção de Freio', desc: 'Garantia de segurança com revisão completa dos sistemas de freio' },
];

/* ── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  const [destaques, setDestaques] = useState<MotoDto[]>([]);
  const [marcas, setMarcas] = useState<MarcaDto[]>([]);
  const [loadingMotos, setLoadingMotos] = useState(true);
  const { openWhatsApp } = useWhatsApp();

  useEffect(() => {
    Promise.all([
      motosApi.list({ destaque: true, limit: 3 }),
      marcasApi.list()
    ]).then(([motosData, marcasData]) => {
      setDestaques(motosData.data);
      setMarcas(marcasData);
    }).catch(err => {
      console.error('Erro ao carregar dados:', err);
      setDestaques([]);
    }).finally(() => setLoadingMotos(false));
  }, []);

  return (
    <>
      <HeroCarousel />

      {/* Marcas */}
      <BrandsSection>
        <BrandsWrapper>
          <BrandsLabel>Marcas oficiais</BrandsLabel>
          <BrandsGrid>
            {marcas.length > 0 ? (
              marcas.map((marca) => (
                <BrandLogo key={marca.id} whileHover={{ y: -5 }}>
                  {marca.logoUrl ? (
                    <img src={marca.logoUrl} alt={marca.nome} title={marca.nome} />
                  ) : (
                    <span>{marca.nome}</span>
                  )}
                </BrandLogo>
              ))
            ) : (
              ['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO'].map((name) => (
                <BrandLogo key={name}><span>{name}</span></BrandLogo>
              ))
            )}
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

          {loadingMotos ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '48px 0' }}>Carregando...</div>
          ) : destaques.length > 0 ? (
            <MotosGrid>
              {destaques.map((moto) => {
                const foto = moto.fotos?.find(f => f.principal) ?? moto.fotos?.[0];
                return (
                  <Link key={moto.id} href={`/motos/${moto.slug}`} style={{ textDecoration: 'none' }}>
                    <MotoCard initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                      <MotoCardImage>
                        {foto
                          ? <Image src={foto.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
                          : <span style={{ fontSize: '48px' }}>🏍️</span>
                        }
                      </MotoCardImage>
                      <MotoCardBody>
                        <MotoCardMarca>
                          {marcas.find(m => m.nome.toUpperCase() === moto.marca.toUpperCase())?.logoUrl ? (
                            <img 
                              src={marcas.find(m => m.nome.toUpperCase() === moto.marca.toUpperCase())?.logoUrl || ''} 
                              alt={moto.marca} 
                            />
                          ) : (
                            <span>{moto.marca}</span>
                          )}
                        </MotoCardMarca>
                        <MotoCardNome>{moto.nome}</MotoCardNome>
                        <MotoCardMeta>
                          {moto.ano && (
                            <MotoCardMetaItem title="Ano">
                              <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {moto.ano}
                            </MotoCardMetaItem>
                          )}
                          {moto.km !== null && moto.km !== undefined && (
                            <MotoCardMetaItem title="Quilometragem">
                              <Gauge size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`}
                            </MotoCardMetaItem>
                          )}
                          {moto.cor && (
                            <MotoCardMetaItem title="Cor">
                              <Palette size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {moto.cor}
                            </MotoCardMetaItem>
                          )}
                        </MotoCardMeta>
                        {moto.preco && (
                          <MotoCardPreco>
                            R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </MotoCardPreco>
                        )}
                      </MotoCardBody>
                    </MotoCard>
                  </Link>
                );
              })}
            </MotosGrid>
          ) : (
            /* Fallback quando não há destaques */
            <p style={{ textAlign: 'center', color: '#999' }}>
              Nenhuma moto em destaque no momento.
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <PrimaryButton href="/motos">Ver todas as motos →</PrimaryButton>
          </div>
        </SectionContent>
      </SectionWrapper>

      {/* Opções de Pagamento (Consórcio e Financiamento) */}
      <PaymentOptions />

      {/* Lojas Físicas */}
      <StoresSection />

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
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0055A4' }}>{s.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', color: '#111' }}>{s.titulo}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.6, fontWeight: 500 }}>{s.desc}</p>
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
          <WhatsAppButton onClick={() => openWhatsApp()}>
            Chamar no WhatsApp
          </WhatsAppButton>
        </CTAContent>
      </CTASection>
    </>
  );
}
