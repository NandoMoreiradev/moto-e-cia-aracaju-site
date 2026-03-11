'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_MOTOS = [
  { id: '1', slug: 'gsx-8s', nome: 'GSX-8S', marca: 'SUZUKI', tipo: 'NAKED', preco: '51.500,00', foto: '🏍️' },
  { id: '2', slug: 'v-strom-650', nome: 'V-Strom 650', marca: 'SUZUKI', tipo: 'ADVENTURE', preco: '58.900,00', foto: '🏔️' },
  { id: '3', slug: 'dk-160', nome: 'DK 160', marca: 'HAOJUE', tipo: 'STREET', preco: '15.990,00', foto: '🛵' },
  { id: '4', slug: 't310', nome: 'T310', marca: 'ZONTES', tipo: 'ADVENTURE', preco: '30.990,00', foto: '🏍️' },
  { id: '5', slug: 'hayabusa', nome: 'Hayabusa GSX-1300R', marca: 'SUZUKI', tipo: 'SPORT', preco: '130.000,00', foto: '🦅' },
  { id: '6', slug: 'dr-160', nome: 'DR 160', marca: 'HAOJUE', tipo: 'STREET', preco: '18.590,00', foto: '🛵' },
];

const MARCAS = ['Todas', 'SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO'];
const TIPOS = ['Todos', 'SPORT', 'NAKED', 'ADVENTURE', 'STREET', 'SCOOTER'];

// --- STYLES ---
const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['4xl']} ${theme.spacing.lg}`};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: ${({ theme }) => theme.spacing['3xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

// -- Sidebar (Filtros)
const Sidebar = styled.aside`
  background: ${({ theme }) => theme.colors.offWhite};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGray};
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ $active, theme }) => ($active ? theme.fontWeights.semibold : theme.fontWeights.medium)};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.textSecondary)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.primaryDark : theme.colors.lightGray)};
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.textPrimary)};
  }
`;

// -- Grid de Motos
const MainContent = styled.div``;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const MotoCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid transparent;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const MotoImage = styled.div`
  height: 200px;
  background: ${({ theme }) => theme.colors.offWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

const MotoBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MotoMarca = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.1em;
`;

const MotoNome = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  margin: ${({ theme }) => `${theme.spacing.xs} 0 ${theme.spacing.sm}`};
  color: ${({ theme }) => theme.colors.dark};
`;

const MotoFooter = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MotoPreco = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

const VerMaisButton = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  
  &:hover {
    text-decoration: underline;
  }
`;

export default function CatalogPage() {
  const [marcaAtiva, setMarcaAtiva] = useState('Todas');
  const [tipoAtivo, setTipoAtivo] = useState('Todos');

  // Filtro
  const motosFiltradas = MOCK_MOTOS.filter((moto) => {
    const matchMarca = marcaAtiva === 'Todas' || moto.marca === marcaAtiva;
    const matchTipo = tipoAtivo === 'Todos' || moto.tipo === tipoAtivo;
    return matchMarca && matchTipo;
  });

  return (
    <PageContainer>
      <Header>
        <Title>Catálogo de Motos</Title>
        <Subtitle>Encontre a moto perfeita para o seu estilo de vida</Subtitle>
      </Header>

      <Layout>
        {/* Sidebar Filters */}
        <Sidebar>
          <FilterSection>
            <FilterTitle>Marca</FilterTitle>
            <FilterOptions>
              {MARCAS.map((marca) => (
                <FilterButton
                  key={marca}
                  $active={marcaAtiva === marca}
                  onClick={() => setMarcaAtiva(marca)}
                >
                  {marca}
                </FilterButton>
              ))}
            </FilterOptions>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Estilo</FilterTitle>
            <FilterOptions>
              {TIPOS.map((tipo) => (
                <FilterButton
                  key={tipo}
                  $active={tipoAtivo === tipo}
                  onClick={() => setTipoAtivo(tipo)}
                >
                  {tipo}
                </FilterButton>
              ))}
            </FilterOptions>
          </FilterSection>
        </Sidebar>

        {/* Listagem */}
        <MainContent>
          <TopBar>
            <span>Mostrando {motosFiltradas.length} motos encontradas</span>
          </TopBar>

          <Grid>
            {motosFiltradas.map((moto, index) => (
              <MotoCard
                key={moto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/motos/${moto.slug}`}>
                  <MotoImage>{moto.foto}</MotoImage>
                </Link>
                <MotoBody>
                  <MotoMarca>{moto.marca}</MotoMarca>
                  <Link href={`/motos/${moto.slug}`}>
                    <MotoNome>{moto.nome}</MotoNome>
                  </Link>
                  <MotoFooter>
                    <MotoPreco>R$ {moto.preco}</MotoPreco>
                    <VerMaisButton href={`/motos/${moto.slug}`}>Ver detalhes →</VerMaisButton>
                  </MotoFooter>
                </MotoBody>
              </MotoCard>
            ))}
            
            {motosFiltradas.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#6B7280' }}>
                <p>Nenhuma moto encontrada com esses filtros.</p>
                <button 
                  onClick={() => { setMarcaAtiva('Todas'); setTipoAtivo('Todos'); }}
                  style={{ color: '#E2231A', marginTop: '1rem', textDecoration: 'underline' }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </Grid>
        </MainContent>
      </Layout>
    </PageContainer>
  );
}
