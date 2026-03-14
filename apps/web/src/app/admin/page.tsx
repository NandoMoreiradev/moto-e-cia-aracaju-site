'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminMotos, adminMeta } from '@/lib/api';

interface Stats {
  total: number;
  disponiveis: number;
  vendidas: number;
  reservadas: number;
  destaque: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [metaStatus, setMetaStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminMotos.list({ limit: 1 }),
      adminMotos.list({ status: 'DISPONIVEL', limit: 1 }),
      adminMotos.list({ status: 'VENDIDA', limit: 1 }),
      adminMotos.list({ status: 'RESERVADA', limit: 1 }),
      adminMotos.list({ destaque: true, limit: 1 }),
      adminMeta.status().catch(() => null),
    ]).then(([all, disp, vend, res, dest, meta]) => {
      setStats({
        total: all.total,
        disponiveis: disp.total,
        vendidas: vend.total,
        reservadas: res.total,
        destaque: dest.total,
      });
      setMetaStatus(meta);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total de Motos', value: stats?.total ?? '—', color: '#4f8ef7' },
    { label: 'Disponíveis', value: stats?.disponiveis ?? '—', color: '#2ecc71' },
    { label: 'Reservadas', value: stats?.reservadas ?? '—', color: '#f39c12' },
    { label: 'Vendidas', value: stats?.vendidas ?? '—', color: '#888' },
    { label: 'Em Destaque', value: stats?.destaque ?? '—', color: '#E2231A' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: '#555', marginTop: '4px' }}>Visão geral do seu catálogo</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: '#1a1a1a',
            border: '1px solid #222',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: card.color }}>
              {loading ? '...' : card.value}
            </div>
            <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        <ActionCard
          title="Adicionar Moto"
          desc="Cadastre uma nova moto no catálogo"
          href="/admin/motos/nova"
          icon="➕"
        />
        <ActionCard
          title="Gerenciar Motos"
          desc="Edite, exclua e gerencie as fotos"
          href="/admin/motos"
          icon="🏍️"
        />
        <ActionCard
          title="Sincronizar Meta"
          desc={
            metaStatus
              ? `${metaStatus.productCatalog?.configurado ? '✅' : '⚠️'} Catálogo Instagram ${metaStatus.vehicleCatalog?.configurado ? '+ ✅ Veículos' : ''}`
              : 'Sincronizar com Instagram Shopping'
          }
          href="/admin/meta"
          icon="📘"
        />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '24px',
        transition: 'border-color 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#E2231A')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}
      >
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>{title}</div>
        <div style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>{desc}</div>
      </div>
    </Link>
  );
}
