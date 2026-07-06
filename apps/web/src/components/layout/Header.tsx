'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  a {
    color: ${({ theme }) => theme.colors.textPrimary};
    transition: color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.1);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const HeaderContainer = styled.header<{ $isMotosMobileHidden?: boolean }>`
  position: relative;
  z-index: 50;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  ${({ $isMotosMobileHidden, theme }) => $isMotosMobileHidden && `
    @media (max-width: ${theme.breakpoints.md}) {
      display: none !important;
    }
  `}
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

const CTAGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    flex-direction: column;
  }
`;

const ContactButton = styled.button`
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
  const { openWhatsApp } = useWhatsApp();

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
    <HeaderContainer $isMotosMobileHidden={pathname === '/motos'}>
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
          <CTAGroup>
            <SocialGroup>
              <a href="https://instagram.com/motoeciaaracaju" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/motoeciaaracaju" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </SocialGroup>
            <ContactButton
              onClick={() => openWhatsApp()}
              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
            >
              Fale com um Vendedor
            </ContactButton>
          </CTAGroup>
        </MenuItems>
      </Nav>
    </HeaderContainer>
  );
}
