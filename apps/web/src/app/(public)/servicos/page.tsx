'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['4xl']} ${theme.spacing.lg}`};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const ServiceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  flex-direction: column;
  transition: transform ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.colors.offWhite};
  border-radius: ${({ theme }) => `${theme.borderRadius['2xl']} ${theme.borderRadius['2xl']} 0 0`};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  ${ServiceCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ServiceTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ServiceDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  flex-grow: 1;
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
  return (
    <PageContainer>
      <Header>
        <Title>Bem-vindo à Oficina da <span>Oficina Moto e Cia</span></Title>
        <Subtitle>
          Não vendemos apenas motos, entregamos tranquilidade e suporte contínuo para você e sua máquina.
        </Subtitle>
      </Header>

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
    </PageContainer>
  );
}
