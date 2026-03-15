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

  // Se for a página de login, nem tentar checar autenticação ou mostrar o layout lateral
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return; // ignora a checagem no login

    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    auth.me()
      .then(u => { setUser(u as any); setChecking(false); })
      .catch(() => { clearToken(); router.replace('/admin/login'); });
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push('/admin/login');
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#666', fontSize: '15px' }}>Verificando acesso...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111', fontFamily: 'inherit' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#161616',
        borderRight: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: '#E2231A',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff'
            }}>
              <Bike size={20} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Moto e Cia</div>
              <div style={{ color: '#555', fontSize: '11px' }}>Painel Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  color: active ? '#fff' : '#888',
                  background: active ? '#E2231A' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginBottom: '4px',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #222' }}>
          <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>{user?.email}</div>
          <div style={{ color: '#999', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{user?.name}</div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#666',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
          <Link
            href="/"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '8px',
              color: '#555',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            ← Ver site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}
