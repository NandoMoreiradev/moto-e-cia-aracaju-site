'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock datastore (mesmos do catálogo)
const MOCK_MOTOS = {
  'gsx-8s': { nome: 'GSX-8S', marca: 'SUZUKI', preco: '51.500,00', foto: '🏍️', motor: '776cc, 4 tempos', potencia: '83 cv a 8.500 rpm', torque: '7,95 kgf.m a 6.800 rpm', peso: '202 kg', tanque: '14L' },
  'v-strom-650': { nome: 'V-Strom 650', marca: 'SUZUKI', preco: '58.900,00', foto: '🏔️', motor: '645cc, V-Twin', potencia: '71 cv', torque: '6,32 kgf.m', peso: '213 kg', tanque: '20L' },
  'dk-160': { nome: 'DK 160', marca: 'HAOJUE', preco: '15.990,00', foto: '🛵', motor: '162cc, 1 cilindro', potencia: '15 cv', torque: '1,43 kgf.m', peso: '135 kg', tanque: '16,5L' },
  't310': { nome: 'T310', marca: 'ZONTES', preco: '30.990,00', foto: '🏍️', motor: '312cc, 1 cilindro', potencia: '35 cv', torque: '3,06 kgf.m', peso: '193 kg', tanque: '19L' },
  'hayabusa': { nome: 'Hayabusa GSX-1300R', marca: 'SUZUKI', preco: '130.000,00', foto: '🦅', motor: '1.340cc, 4 cilindros', potencia: '190 cv', torque: '15,3 kgf.m', peso: '264 kg', tanque: '20L' },
  'dr-160': { nome: 'DR 160', marca: 'HAOJUE', preco: '18.590,00', foto: '🛵', motor: '162cc, 1 cilindro', potencia: '15 cv', torque: '1,43 kgf.m', peso: '148 kg', tanque: '12L' },
};

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['3xl']} ${theme.spacing.lg} ${theme.spacing['5xl']}`};
`;

const Breadcrumb = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  a {
    color: ${({ theme }) => theme.colors.primary};
    &:hover { text-decoration: underline; }
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${({ theme }) => theme.spacing['4xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Gallery = styled(motion.div)`
  background: ${({ theme }) => theme.colors.offWhite};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const InfoPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const MotoMarca = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MotoNome = styled.h1`
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MotoPreco = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.offWhite};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpecLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SpecValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const WhatsAppButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing['2xl']}`};
  background: ${({ theme }) => theme.colors.whatsapp};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);

  &:hover {
    background: #1dad57;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 100px 0;
  h1 { margin-bottom: 20px; }
`;

export default function MotoDetailPage({ params }: { params: { slug: string } }) {
  const moto = MOCK_MOTOS[params.slug as keyof typeof MOCK_MOTOS];

  if (!moto) {
    return (
      <PageContainer>
        <NotFound>
          <h1>Moto não encontrada</h1>
          <Link href="/motos" style={{ color: '#E2231A' }}>← Voltar para o catálogo</Link>
        </NotFound>
      </PageContainer>
    );
  }

  const wppText = encodeURIComponent(`Olá, estou interessado na moto ${moto.marca} ${moto.nome} que vi no site.`);

  return (
    <PageContainer>
      <Breadcrumb>
        <Link href="/">Início</Link> &gt; <Link href="/motos">Catálogo</Link> &gt; {moto.nome}
      </Breadcrumb>

      <Layout>
        <Gallery
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {moto.foto}
        </Gallery>

        <InfoPanel
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MotoMarca>{moto.marca}</MotoMarca>
          <MotoNome>{moto.nome}</MotoNome>
          <MotoPreco>R$ {moto.preco}</MotoPreco>

          <SpecsGrid>
            <SpecItem>
              <SpecLabel>Motor</SpecLabel>
              <SpecValue>{moto.motor}</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>Potência</SpecLabel>
              <SpecValue>{moto.potencia}</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>Torque</SpecLabel>
              <SpecValue>{moto.torque}</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>Peso Seco</SpecLabel>
              <SpecValue>{moto.peso}</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>Tanque</SpecLabel>
              <SpecValue>{moto.tanque}</SpecValue>
            </SpecItem>
          </SpecsGrid>

          <WhatsAppButton
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}?text=${wppText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Tenho interesse
          </WhatsAppButton>
          
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6B7280', fontSize: '14px' }}>
            Fale com um consultor pelo WhatsApp
          </p>
        </InfoPanel>
      </Layout>
    </PageContainer>
  );
}
