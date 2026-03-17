'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, setToken } from '@/lib/api';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await auth.login({ email, password });
      setToken(res.accessToken);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '24px',
        padding: '56px 40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          background: '#E2231A',
          borderRadius: '20px',
          boxShadow: '0 8px 16px rgba(226, 35, 26, 0.2)',
          marginBottom: '24px',
          color: '#fff',
          fontSize: '32px'
        }}>
          🏍️
        </div>

        <h1 style={{ 
          color: '#111', 
          fontSize: '26px', 
          fontWeight: 800, 
          margin: '0 0 8px',
          letterSpacing: '-0.02em'
        }}>
          Moto e Cia
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '15px', 
          fontWeight: 500, 
          marginBottom: '40px' 
        }}>
          Faça login para gerenciar sua loja
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <AdminInput
            label="E-mail profissional"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            icon={<Mail size={18} />}
          />

          <AdminInput
            label="Sua senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            icon={<Lock size={18} />}
          />

          {error && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #ffe4e6',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#e11d48',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '8px'
            }}>
              <ShieldAlert size={18} />
              {error}
            </div>
          )}

          <AdminButton
            type="submit"
            loading={loading}
            style={{ 
              height: '52px', 
              fontSize: '16px', 
              marginTop: '12px',
              boxShadow: '0 4px 12px rgba(226, 35, 26, 0.15)' 
            }}
          >
            Acessar Painel
          </AdminButton>
        </form>

        <p style={{ 
          marginTop: '40px', 
          color: '#999', 
          fontSize: '13px', 
          fontWeight: 500 
        }}>
          &copy; {new Date().getFullYear()} Moto e Cia Aracaju. All rights reserved.
        </p>
      </div>
    </div>
  );
}
