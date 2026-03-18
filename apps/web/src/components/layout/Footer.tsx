'use client';

import { Clock, Mail, MapPin, Smartphone } from 'lucide-react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => `${theme.spacing['4xl']} 0 ${theme.spacing.lg}`};
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Brand = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  span {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Text = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ColTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.white};
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: color ${({ theme }) => theme.transitions.fast};
  display: inline-block;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  color: rgba(255, 255, 255, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Copyright = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        {/* Marca & Sobre */}
        <FooterCol>
          <Brand>Moto<span>&</span>Cia</Brand>
          <Text>
            Sua concessionária oficial Suzuki, Haojue e Zontes em Aracaju. 
            Paixão por duas rodas e excelência no atendimento.
          </Text>
        </FooterCol>

        {/* Links Rápidos */}
        <FooterCol>
          <ColTitle>Links Rápidos</ColTitle>
          <FooterLink href="/motos">Catálogo de Motos</FooterLink>
          <FooterLink href="/servicos">Nossos Serviços</FooterLink>
          <FooterLink href="/servicos#financiamento">Financiamento</FooterLink>
          <FooterLink href="/blog">Blog & Dicas</FooterLink>
          <FooterLink href="/contato">Fale Conosco</FooterLink>
        </FooterCol>

        {/* Contato & Endereço */}
        <FooterCol>
          <ColTitle>Atendimento</ColTitle>
          <ContactInfo>
            <MapPin size={18} />
            <span>Av. Pedro Calazans, nº 717, Centro, Aracaju - SE</span>
          </ContactInfo>
          <ContactInfo>
            <Smartphone size={18} />
            <span>(79) 99999-9999 (WhatsApp)</span>
          </ContactInfo>
          <ContactInfo>
            <Mail size={18} />
            <span>contato@motoeciaaracaju.com.br</span>
          </ContactInfo>
          <ContactInfo>
            <Clock size={18} />
            <span>Seg a Sex: 08h às 18h<br/>Sáb: 08h às 12h</span>
          </ContactInfo>
        </FooterCol>
      </FooterContent>

      <Copyright>
        © {currentYear} Moto e Cia Aracaju. Todos os direitos reservados.
      </Copyright>
    </FooterContainer>
  );
}
