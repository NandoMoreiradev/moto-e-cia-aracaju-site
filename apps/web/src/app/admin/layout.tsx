'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken, clearToken, auth } from '@/lib/api';
import { 
  BarChart3, Bike, Image as ImageIcon, Tag, Facebook, 
  LogOut, Globe, LayoutDashboard 
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { href: '/admin/motos', label: 'Motos', icon: <Bike size={18} /> },
  { href: '/admin/banners', label: 'Banners', icon: <ImageIcon size={18} /> },
  { href: '/admin/marcas', label: 'Marcas', icon: <Tag size={18} /> },
  { href: '/admin/meta', label: 'Meta / Instagram', icon: <Facebook size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    auth.me()
      .then(u => { setUser(u as any); setChecking(false); })
      .catch(() => { clearToken(); router.replace('/admin/login'); });
  }, [router, isLoginPage]);

  function handleLogout() {
    clearToken();
    router.push('/admin/login');
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#fff', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          width: '40px', height: '40px', 
          border: '3px solid #f3f3f3', 
          borderTop: '3px solid #E2231A', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
        <div style={{ color: '#999', fontSize: '13px', marginTop: '16px', fontWeight: 500 }}>
          Moto e Cia Admin
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: 'inherit' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        {/* Brand */}
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: '#E2231A',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(226, 35, 26, 0.2)'
            }}>
              <Bike size={22} />
            </div>
            <div>
              <div style={{ color: '#111', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }}>Moto e Cia</div>
              <div style={{ color: '#999', fontSize: '12px', fontWeight: 500 }}>Painel Gestor</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 16px' }}>
          {NAV_ITEMS.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: active ? '#fff' : '#666',
                  background: active ? '#E2231A' : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginBottom: '6px',
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 12px rgba(226, 35, 26, 0.2)' : 'none'
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#111';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#666';
                  }
                }}
              >
                <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.7 }}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div style={{ padding: '24px 16px 0', borderTop: '1px solid #f0f0f0', margin: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: '#f0f0f0', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#666', fontSize: '14px', fontWeight: 700 
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#111', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ color: '#999', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '10px',
              color: '#666',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff5f5';
              e.currentTarget.style.color = '#E2231A';
              e.currentTarget.style.borderColor = '#fee2e2';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.borderColor = '#e5e5e5';
            }}
          >
            <LogOut size={16} /> Sair do Painel
          </button>
          
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '16px',
              color: '#999',
              fontSize: '12px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#666'}
            onMouseLeave={e => e.currentTarget.style.color = '#999'}
          >
            <Globe size={14} /> Ver site público
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
        {children}
      </main>
    </div>
  );
}
