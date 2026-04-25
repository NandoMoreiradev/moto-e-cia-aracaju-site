'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Target, Heart, Award, Star, Trophy, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const PageContainer = styled.div`
  width: 100%;
`;

const HeroBanner = styled.section`
  position: relative;
  width: 100%;
  height: 50vh;
  min-height: 400px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02) 2px,
      transparent 2px,
      transparent 8px
    );
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  letter-spacing: 0.02em;
  color: #ffffff;

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

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section<{ $bg?: string }>`
  padding: ${({ theme }) => `${theme.spacing['6xl']} ${theme.spacing.lg}`};
  background: ${({ theme, $bg }) => $bg || theme.colors.white};
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const HistoryText = styled.div`
  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    position: relative;
    padding-bottom: 12px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 4px;
      background: ${({ theme }) => theme.colors.primary};
      transform: skewX(-20deg);
    }
  }

  p {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.8;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);

  img {
    object-fit: cover;
  }
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing['2xl']};
  margin-top: ${({ theme }) => theme.spacing['4xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const PillarCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: #ffffff;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
  }
`;

const AwardsContainer = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
  border: 1px solid rgba(255,215,0,0.2);
  padding: ${({ theme }) => theme.spacing['4xl']};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
  }
`;

const AwardsHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    color: rgba(255, 215, 0, 0.8);
    font-size: 1.125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

const AwardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
`;

const AwardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .icon-wrapper {
    width: 80px;
    height: 80px;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    border: 2px solid rgba(255, 215, 0, 0.3);

    svg {
      color: #FFD700;
    }
  }

  h4 {
    color: #fff;
    font-size: 1.25rem;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    color: rgba(255,255,255,0.6);
    font-size: 0.875rem;
  }
`;

const CTAWrapper = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02) 2px,
      transparent 2px,
      transparent 8px
    );
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 1rem 2.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 1.125rem;
  text-decoration: none;
  letter-spacing: 0.05em;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  margin-top: ${({ theme }) => theme.spacing.xl};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateX(5px);
    box-shadow: 0 10px 20px rgba(226, 35, 26, 0.3);
  }
`;

export default function SobrePage() {
  return (
    <PageContainer>
      <HeroBanner>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nossa História
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Acelerando junto com você desde a nossa fundação.
          </HeroSubtitle>
        </HeroContent>
      </HeroBanner>

      <Section>
        <Container>
          <HistoryGrid>
            <HistoryText>
              <h2>Nossa História</h2>
              <p>
                A Moto e Cia nasceu da paixão pelo universo das duas rodas. Desde o primeiro dia,
                nosso objetivo foi muito além de apenas vender motocicletas: queríamos criar um ponto de
                encontro para motociclistas, oferecendo um atendimento consultivo, transparente e especializado.
              </p>
              <p>
                Com muito trabalho e dedicação, nos consolidamos como a principal concessionária da região.
                Hoje, representamos com orgulho marcas consagradas mundialmente como <strong>Suzuki, Haojue e Zontes</strong>.
              </p>
              <p>
                Nossa estrutura não para de crescer. Além do nosso showroom moderno com as últimas novidades
                do mercado, contamos com uma oficina de alta tecnologia e mecânicos treinados nas próprias fábricas,
                garantindo que sua moto receba o tratamento que merece.
              </p>
            </HistoryText>
            <ImageWrapper>
              <Image
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop"
                alt="Fachada da loja"
                fill
              />
            </ImageWrapper>
          </HistoryGrid>
        </Container>
      </Section>

      <Section $bg="#f8f9fa">
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', color: '#111' }}>
              Nossos Pilares
            </h2>
          </div>
          <PillarsGrid>
            <PillarCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Target size={40} />
              <h3>Missão</h3>
              <p>
                Proporcionar a melhor experiência no universo duas rodas, entregando produtos
                e serviços de excelência que superem as expectativas dos nossos clientes.
              </p>
            </PillarCard>
            <PillarCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Star size={40} />
              <h3>Visão</h3>
              <p>
                Ser reconhecida como a concessionária de motocicletas referência em qualidade,
                confiança e atendimento ao cliente em toda a nossa região.
              </p>
            </PillarCard>
            <PillarCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Heart size={40} />
              <h3>Valores</h3>
              <p>
                Transparência nos negócios, paixão pelo que fazemos, respeito aos nossos
                clientes e colaboradores, e compromisso com a segurança.
              </p>
            </PillarCard>
          </PillarsGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <AwardsContainer>
            <AwardsHeader>
              <p>Excelência Comprovada</p>
              <h2>Prêmios e Reconhecimentos</h2>
            </AwardsHeader>
            <AwardsGrid>
              <AwardItem>
                <div className="icon-wrapper">
                  <Trophy size={32} />
                </div>
                <h4>Concessionária Destaque</h4>
                <p>Premiada pela excelência em vendas e atingimento de metas regionais.</p>
              </AwardItem>
              <AwardItem>
                <div className="icon-wrapper">
                  <Award size={32} />
                </div>
                <h4>Oficina Ouro</h4>
                <p>Certificação máxima de qualidade nos serviços prestados na oficina.</p>
              </AwardItem>
              <AwardItem>
                <div className="icon-wrapper">
                  <Shield size={32} />
                </div>
                <h4>Top Atendimento</h4>
                <p>Reconhecimento pelo alto índice de satisfação dos nossos clientes (CSAT).</p>
              </AwardItem>
            </AwardsGrid>
          </AwardsContainer>
        </Container>
      </Section>

      <CTAWrapper>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', position: 'relative', zIndex: 2, color: '#ffffff' }}>
          Venha Tomar um Café Com a Gente
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 2 }}>
          Nossa equipe está pronta para te apresentar a moto dos seus sonhos.
        </p>
        <CTAButton href="https://wa.me/5579999999999" target="_blank" rel="noopener noreferrer">
          Falar com um Consultor <ArrowRight size={20} />
        </CTAButton>
      </CTAWrapper>
    </PageContainer>
  );
}
