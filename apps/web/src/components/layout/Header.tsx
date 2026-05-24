'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import { MapPin, Facebook, Instagram } from 'lucide-react';

const TopBar = styled.div`
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.dark} 0%, #111 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSizes.xs || '0.75rem'};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.03) 2px,
      transparent 2px,
      transparent 6px
    );
    pointer-events: none;
  }
`;

const TopBarContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    text-align: center;
  }
`;

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  a {
    color: ${({ theme }) => theme.colors.lightGray};
    transition: color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.1);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const StoreInfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const StoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.lightGray};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.05em;
  text-transform: uppercase;

  > svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const WhatsappLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: #25D366;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  transition: all 0.2s ease;
  text-decoration: none;
  background: rgba(37, 211, 102, 0.1);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(37, 211, 102, 0.2);
  text-transform: none;
  letter-spacing: normal;

  &:hover {
    background: rgba(37, 211, 102, 0.2);
    transform: translateX(4px);
    border-color: rgba(37, 211, 102, 0.4);
  }
`;

const WhatsappIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.004-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
  </svg>
);
const HeaderContainer = styled.header`
  position: relative;
  z-index: 50;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Nav = styled.nav`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const MenuItems = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.white};
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
    transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-10px)')};
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;

const StyledLink = styled(Link) <{ $isActive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : theme.colors.textPrimary)};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $isActive }) => ($isActive ? '100%' : '0')};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.fast};
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    width: 100%;
    display: block;
    padding-bottom: ${({ theme }) => theme.spacing.xs};
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
    
    &::after {
      display: none;
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    color: ${({ theme }) => theme.colors.white};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/motos', label: 'Motos' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/blog', label: 'Blog' },
    { href: '/sobre', label: 'Nossa História' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <HeaderContainer>
      <TopBar>
        <TopBarContent>
          <SocialGroup>
            <a href="https://instagram.com/motoeciaaracaju" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://facebook.com/motoeciaaracaju" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={16} />
            </a>
          </SocialGroup>
          <StoreInfoGroup>
            <StoreItem>
              <MapPin size={12} />
              <span>Aracaju-SE: Av. Pedro Calazans, 717, Centro</span>
              <WhatsappLink href="https://wa.me/5579999999999" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon /> (79) 99999-9999
              </WhatsappLink>
            </StoreItem>
            <StoreItem>
              <MapPin size={12} />
              <span>N. Sra. do Socorro-SE: Av. Moacir de Oliveira, 37, João Alves</span>
              <WhatsappLink href="https://wa.me/5579999999999" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon /> (79) 99999-9999
              </WhatsappLink>
            </StoreItem>
          </StoreInfoGroup>
        </TopBarContent>
      </TopBar>
      <Nav>
        <Logo href="/">
          {/* Supondo que a logo seja um PNG, mas o Next aceita JPG, WebP e SVG também */}
          <Image
            src="/logo_moto_e_cia.png"
            alt="Moto e Cia Aracaju"
            width={120}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Logo>

        <HamburgerButton onClick={toggleMenu} aria-label="Menu">
          {isOpen ? '✕' : '☰'}
        </HamburgerButton>

        <MenuItems $isOpen={isOpen}>
          {navLinks.map((link) => (
            <StyledLink
              key={link.href}
              href={link.href}
              $isActive={pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href))}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </StyledLink>
          ))}
          <ContactButton
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com um Vendedor
          </ContactButton>
        </MenuItems>
      </Nav>
    </HeaderContainer>
  );
}
