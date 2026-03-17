'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { adminMotos, adminMeta } from '@/lib/api';
import { Plus, Bike, RefreshCw, CheckCircle, AlertTriangle, Share2, TrendingUp } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';

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

  const loadStats = useCallback(() => {
    setLoading(true);
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

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statCards = [
    { label: 'Total de Motos', value: stats?.total ?? '0', color: '#111', icon: <Bike size={20} /> },
    { label: 'Disponíveis', value: stats?.disponiveis ?? '0', color: '#2ecc71', icon: <CheckCircle size={20} /> },
    { label: 'Em Destaque', value: stats?.destaque ?? '0', color: '#E2231A', icon: <TrendingUp size={20} /> },
    { label: 'Reservadas', value: stats?.reservadas ?? '0', color: '#f39c12', icon: <AlertTriangle size={20} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ color: '#999', marginTop: '4px', fontWeight: 500 }}>Bem-vindo ao seu painel de gestão</p>
        </div>
        <AdminButton 
          onClick={loadStats} 
          variant="secondary" 
          size="sm"
          loading={loading}
        >
          <RefreshCw size={16} /> Atualizar dados
        </AdminButton>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map(card => (
          <AdminCard key={card.label} style={{ marginBottom: 0, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                width: '44px', height: '44px', borderRadius: '12px', 
                background: `${card.color}10`, color: card.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#111' }}>
                {loading ? '...' : card.value}
              </div>
              <div style={{ color: '#999', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>{card.label}</div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: 0 }}>Ações Rápidas</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        <ActionCard
          title="Nova Moto"
          desc="Cadastre uma nova moto com fotos e detalhes ricos."
          href="/admin/motos/nova"
          icon={<Plus size={24} />}
          color="#E2231A"
        />
        <ActionCard
          title="Catálogo"
          desc="Edite preços, mude status e gerencie diferenciais."
          href="/admin/motos"
          icon={<Bike size={24} />}
          color="#111"
        />
        <ActionCard
          title="Instagram Shopping"
          desc={metaStatus?.productCatalog?.configurado ? "Catálogo sincronizado com sucesso." : "Configure sua loja no Facebook/Instagram."}
          href="/admin/meta"
          icon={<Share2 size={24} />}
          color="#4f8ef7"
        />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, href, icon, color }: { title: string; desc: string; href: string; icon: React.ReactNode; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <AdminCard style={{ 
        marginBottom: 0, 
        padding: '28px',
        transition: 'all 0.2s',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}
      >
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '14px', 
          background: `${color}08`, color: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div>
          <div style={{ color: '#111', fontWeight: 700, fontSize: '16px' }}>{title}</div>
          <div style={{ color: '#999', fontSize: '13px', marginTop: '4px', lineHeight: '1.4' }}>{desc}</div>
        </div>
      </AdminCard>
    </Link>
  );
}
