'use client';

import styled from 'styled-components';
import { FormEvent, useState } from 'react';

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
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing['4xl']};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  i {
    font-size: 1.5rem;
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
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
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default function ContatoPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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
            <i>📍</i>
            <div>
              <h4>Nosso Endereço</h4>
              <p>Av. Pedro Calazans, nº 717, <br/>Centro - Aracaju/SE<br/>CEP: 49080-115</p>
            </div>
          </InfoItem>

          <InfoItem>
            <i>📱</i>
            <div>
              <h4>Telefone e WhatsApp</h4>
              <p>(79) 99999-9999<br/>(79) 3211-0000</p>
            </div>
          </InfoItem>

          <InfoItem>
            <i>🕒</i>
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
