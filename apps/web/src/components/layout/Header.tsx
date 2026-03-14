'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
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
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.05em;

  span {
    color: ${({ theme }) => theme.colors.dark};
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

const StyledLink = styled(Link)<{ $isActive?: boolean }>`
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
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <HeaderContainer>
      <Nav>
        <Logo href="/">
          Moto<span>&</span>Cia
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
            Fale com Especialista
          </ContactButton>
        </MenuItems>
      </Nav>
    </HeaderContainer>
  );
}
