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
  padding: ${({ theme }) => theme.spacing['2xl']};
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

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(226, 35, 26, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
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
    icon: '🔧', 
    titulo: 'Oficina Autorizada', 
    desc: 'Mecânicos treinados na fábrica preparados para diagnosticar e reparar sua moto com peças originais e garantia de serviço.' 
  },
  { 
    id: 'revisao',
    icon: '📋', 
    titulo: 'Revisão Periódica', 
    desc: 'Mantenha sua garantia em dia e sua moto segura. Agende sua revisão com antecedência e garanta o melhor desempenho.' 
  },
  { 
    id: 'pecas',
    icon: '⚙️', 
    titulo: 'Peças Originais', 
    desc: 'Boutique completa com peças originais Suzuki, Haojue e Zontes. Vida longa para o seu motor.' 
  },
  { 
    id: 'acessorios',
    icon: '🏍️', 
    titulo: 'Acessórios e Boutique', 
    desc: 'Capacetes, jaquetas, baús, protetores de motor e tudo mais que você precisa para equipar sua moto e você mesmo.' 
  },
  { 
    id: 'financiamento',
    icon: '💳', 
    titulo: 'Financiamento e Consórcio', 
    desc: 'As melhores taxas do mercado. Trabalhamos com consórcios e cartas de crédito contempladas. Realize seu sonho.' 
  },
  { 
    id: 'seguros',
    icon: '🛡️', 
    titulo: 'Seguros Parceiros', 
    desc: 'Saia da concessionária tranquilo. Temos parcerias com as melhores seguradoras para proteger seu novo bem.' 
  },
];

export default function ServicosPage() {
  return (
    <PageContainer>
      <Header>
        <Title>Bem-vindo ao nosso <span>Centro de Serviços</span></Title>
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
            <IconWrapper>{servico.icon}</IconWrapper>
            <ServiceTitle>{servico.titulo}</ServiceTitle>
            <ServiceDesc>{servico.desc}</ServiceDesc>
          </ServiceCard>
        ))}
      </ServicesGrid>
    </PageContainer>
  );
}
