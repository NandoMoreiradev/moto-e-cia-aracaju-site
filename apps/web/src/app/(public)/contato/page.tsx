'use client';

import styled from 'styled-components';
import { FormEvent, useState } from 'react';
import { MapPin, Smartphone, Clock } from 'lucide-react';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['4xl']} ${theme.spacing.lg}`};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  letter-spacing: 0.02em;

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

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-bottom: 4px solid ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.dark} 0%, #0a0a0a 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['4xl']};
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

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

  > * {
    position: relative;
    z-index: 2;
  }
`;

const InfoTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.white};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    margin-top: 4px;
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
    font-weight: 500;
  }
`;

const FormContainer = styled.div`
  padding: ${({ theme }) => theme.spacing['4xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.dark};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(226, 35, 26, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  min-height: 150px;
  resize: vertical;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(226, 35, 26, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(226, 35, 26, 0.3);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

export default function ContatoPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { openWhatsApp } = useWhatsApp();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simular API por enquanto
    setTimeout(() => {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Fale Conosco</Title>
        <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
          Tire suas dúvidas, faça sugestões ou agende serviços.
        </p>
      </Header>

      <Layout>
        {/* Informações de Contato */}
        <ContactInfo>
          <InfoTitle>Informações de Contato</InfoTitle>
          
          <InfoItem>
            <MapPin size={24} />
            <div>
              <h4>Nossas Lojas</h4>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#fff' }}>Aracaju - SE (Matriz)</strong><br/>
                Av. Pedro Calazans, nº 717, Centro
              </p>
              <p>
                <strong style={{ color: '#fff' }}>N. Sra. do Socorro - SE (Filial)</strong><br/>
                Av. Moacir de Oliveira, 37, João Alves
              </p>
            </div>
          </InfoItem>

          <InfoItem>
            <Smartphone size={24} />
            <div>
              <h4>Telefone e WhatsApp</h4>
              <p style={{ marginBottom: '8px' }}>Atendimento: (79) 3211-0000</p>
              <button 
                onClick={() => openWhatsApp()} 
                style={{ background: 'none', border: 'none', color: '#e31b23', fontWeight: 800, padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Fale pelo WhatsApp →
              </button>
            </div>
          </InfoItem>

          <InfoItem>
            <Clock size={24} />
            <div>
              <h4>Horário de Funcionamento</h4>
              <p>Segunda à Sexta: 08:00 às 18:00<br/>Sábados: 08:00 às 12:00</p>
            </div>
          </InfoItem>
        </ContactInfo>

        {/* Formulário */}
        <FormContainer>
          <FormTitle>Envie uma Mensagem</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input type="text" id="nome" required placeholder="Seu nome" />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input type="email" id="email" required placeholder="seu@email.com" />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input type="tel" id="whatsapp" required placeholder="(79) 90000-0000" />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="mensagem">Sua Mensagem</Label>
              <TextArea id="mensagem" required placeholder="Como podemos te ajudar hoje?" />
            </FormGroup>

            <SubmitButton type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Enviando...' : status === 'success' ? 'Mensagem Enviada! ✓' : 'Enviar Mensagem'}
            </SubmitButton>
          </form>
        </FormContainer>
      </Layout>
    </PageContainer>
  );
}
