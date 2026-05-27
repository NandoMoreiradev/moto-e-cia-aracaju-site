'use client';

import { Clock, Mail, MapPin, Smartphone, Facebook, Instagram } from 'lucide-react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #151515 0%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => `${theme.spacing['5xl']} 0 0`};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};

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

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing['4xl']};
  position: relative;
  z-index: 2;
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BrandLogo = styled(Link)`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 85, 164, 0.4);
    }
  }
`;

const Text = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ColTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 40px; height: 3px;
    background: ${({ theme }) => theme.colors.primary};
    transform: skewX(-20deg);
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(5px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  color: rgba(255, 255, 255, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  line-height: 1.6;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const WhatsappButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  color: rgba(255, 255, 255, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  line-height: 1.6;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const Copyright = styled.div`
  position: relative;
  z-index: 2;
  background: #000;
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
`;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { openWhatsApp } = useWhatsApp();

  return (
    <FooterContainer>
      <FooterContent>
        {/* Marca & Sobre */}
        <FooterCol>
          <BrandLogo href="/">
            <Image
              src="/logo_moto_e_cia_branca.png"
              alt="Moto e Cia Aracaju"
              width={200}
              height={80}
              style={{ objectFit: 'contain' }}
            />
          </BrandLogo>
          <Text>
            Sua concessionária oficial Suzuki, Haojue e Zontes em Aracaju e Socorro. 
            Paixão por duas rodas e excelência no atendimento.
          </Text>
          <SocialGroup>
            <a href="https://instagram.com/motoeciaaracaju" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com/motoeciaaracaju" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </SocialGroup>
        </FooterCol>

        {/* Links Rápidos */}
        <FooterCol>
          <ColTitle>Links Rápidos</ColTitle>
          <FooterLink href="/sobre">A Empresa</FooterLink>
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
            <div>
              <strong>Aracaju-SE (Matriz)</strong><br />
              Av. Pedro Calazans, nº 717, Centro
            </div>
          </ContactInfo>
          <ContactInfo>
            <MapPin size={18} />
            <div>
              <strong>N. Sra. do Socorro-SE (Filial)</strong><br />
              Av. Moacir de Oliveira, 37, João Alves
            </div>
          </ContactInfo>
          <WhatsappButton onClick={() => openWhatsApp()}>
            <Smartphone size={18} />
            <span>Fale pelo WhatsApp</span>
          </WhatsappButton>
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
