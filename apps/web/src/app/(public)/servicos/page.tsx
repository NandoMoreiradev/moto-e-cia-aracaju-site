'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Wrench, MessageCircle } from 'lucide-react';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const PageContainer = styled.div`
  /* Removes padding from container to allow full-width banner */
`;

const HeroBanner = styled.div`
  background: linear-gradient(135deg, #151515 0%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => `${theme.spacing['6xl']} ${theme.spacing.lg}`};
  text-align: center;
  border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};

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

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  letter-spacing: 0.02em;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: rgba(255, 255, 255, 0.7);
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  font-weight: 500;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing['4xl']};
`;

const ServiceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 240px;
  background: ${({ theme }) => theme.colors.offWhite};
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${ServiceCard}:hover & img {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const ServiceTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.1;
`;

const ServiceDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  flex-grow: 1;
  font-weight: 500;
`;

const CTASection = styled.div`
  margin-top: ${({ theme }) => theme.spacing['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, #0a0a0a 100%);
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;
  border-left: 6px solid ${({ theme }) => theme.colors.primary};
  border-right: 6px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px 0 20px 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

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

const CTAContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.1;
`;

const CTADesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  font-weight: 500;
`;

const CTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #25D366;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: white;
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.05em;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    background: #20b858;
    transform: scale(1.05) translateX(5px);
    box-shadow: 0 0 30px rgba(37, 211, 102, 0.5);
  }
`;

const SERVICOS = [
  { 
    id: 'oficina',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop', 
    titulo: 'Oficina Autorizada', 
    desc: 'Mecânicos treinados na fábrica preparados para diagnosticar e reparar sua moto com peças originais e garantia de serviço.' 
  },
  { 
    id: 'revisao',
    image: 'https://images.unsplash.com/photo-1579290680388-33dcce0633ed?q=80&w=800&auto=format&fit=crop', 
    titulo: 'Revisão Periódica', 
    desc: 'Mantenha sua garantia em dia e sua moto segura. Agende sua revisão com antecedência e garanta o melhor desempenho.' 
  },
  { 
    id: 'pecas',
    image: 'https://images.unsplash.com/photo-1620311497217-1fc9d01217e9?q=80&w=800&auto=format&fit=crop', 
    titulo: 'Peças Originais', 
    desc: 'Boutique completa com peças originais Suzuki, Haojue e Zontes. Vida longa para o seu motor.' 
  },
  { 
    id: 'acessorios',
    image: 'https://images.unsplash.com/photo-1533090368676-1fd25485eaee?q=80&w=800&auto=format&fit=crop', 
    titulo: 'Acessórios e Boutique', 
    desc: 'Capacetes, jaquetas, baús, protetores de motor e tudo mais que você precisa para equipar sua moto e você mesmo.' 
  },
  { 
    id: 'financiamento',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop', 
    titulo: 'Financiamento e Consórcio', 
    desc: 'As melhores taxas do mercado. Trabalhamos com consórcios e cartas de crédito contempladas. Realize seu sonho.' 
  },
  { 
    id: 'seguros',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=800&auto=format&fit=crop', 
    titulo: 'Seguros Parceiros', 
    desc: 'Saia da concessionária tranquilo. Temos parcerias com as melhores seguradoras para proteger seu novo bem.' 
  },
];

export default function ServicosPage() {
  const { openWhatsApp } = useWhatsApp();

  return (
    <PageContainer>
      <HeroBanner>
        <HeaderContent>
          <Title>Oficina Autorizada <span>Moto e Cia</span></Title>
          <Subtitle>
            Não vendemos apenas motos, entregamos tranquilidade e suporte contínuo para você e sua máquina.
          </Subtitle>
        </HeaderContent>
      </HeroBanner>

      <ServicesGrid>
        {SERVICOS.map((servico, index) => (
          <ServiceCard
            key={servico.id}
            id={servico.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ImageWrapper>
              <img src={servico.image} alt={servico.titulo} />
            </ImageWrapper>
            <div style={{ padding: '0 24px 24px' }}>
              <ServiceTitle>{servico.titulo}</ServiceTitle>
              <ServiceDesc>{servico.desc}</ServiceDesc>
            </div>
          </ServiceCard>
        ))}
      </ServicesGrid>

      <CTASection>
        <CTAContentWrapper>
          <Wrench size={48} color="#0055A4" style={{ marginBottom: '16px' }} />
          <CTATitle>Precisa de manutenção?</CTATitle>
          <CTADesc>Agende sua revisão ou tire dúvidas com nossos mecânicos especialistas direto pelo WhatsApp.</CTADesc>
          <CTAButton onClick={() => openWhatsApp('Olá, gostaria de agendar um serviço na oficina!')}>
            <MessageCircle size={24} /> Falar com a Oficina
          </CTAButton>
        </CTAContentWrapper>
      </CTASection>
    </PageContainer>
  );
}
