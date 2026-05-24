'use client';

import { useState, useEffect } from 'react';
import { adminMeta, adminMotos } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';
import {
  Instagram, Settings, RefreshCw, AlertCircle,
  CheckCircle2, ShoppingBag, Truck, Info,
  ChevronRight, Globe, Loader2
} from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';

export default function AdminMetaPage() {
  const [status, setStatus] = useState<any>(null);
  const [motos, setMotos] = useState<MotoDto[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminMeta.status().catch(() => null),
      adminMotos.list({ limit: 1000, status: 'DISPONIVEL' }),
    ]).then(([s, m]) => {
      setStatus(s);
      setMotos(m.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSyncAll() {
    setSyncing(true);
    setResult(null);
    try {
      const res = await adminMeta.syncAll();
      setResult(res);
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setSyncing(false);
    }
  }

  async function handleSyncOne(motoId: string) {
    setSyncingId(motoId);
    try {
      await adminMeta.syncMoto(motoId);
    } finally {
      setSyncingId(null);
    }
  }

  if (loading) return (
    <div style={{ color: '#999', textAlign: 'center', padding: '100px 0' }}>
      <Loader2 size={32} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
      <div>Carregando status do Meta...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Meta & Instagram Shopping</h1>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Sincronize seu estoque com o Facebook Catalog e Instagram Shopping</p>
      </div>

      {/* Catálogos Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <StatusCard
          title="Catálogo de Veículos"
          icon={<Truck size={20} />}
          desc="Anúncios dinâmicos e retargeting automáticos para motos."
          configured={status?.vehicleCatalog?.configurado}
          catalogId={status?.vehicleCatalog?.catalogId}
        />
        <StatusCard
          title="Catálogo de Produtos"
          icon={<ShoppingBag size={20} />}
          desc='Habilita o botão "Loja" no Instagram e marcação em fotos.'
          configured={status?.productCatalog?.configurado}
          catalogId={status?.productCatalog?.catalogId}
        />
      </div>

      {/* Missing Config Alert */}
      {(!status?.vehicleCatalog?.configurado || !status?.productCatalog?.configurado) && (
        <div style={{
          background: '#fff9db', border: '1px solid #ffec99',
          borderRadius: '16px', padding: '20px 24px', color: '#856404', 
          fontSize: '14px', marginBottom: '32px',
          display: 'flex', gap: '16px'
        }}>
          <AlertCircle size={24} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700 }}>Configuração incompleta</h4>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Para habilitar a sincronização, você precisa configurar as chaves do Meta no arquivo <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px' }}>.env</code> da API.
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AdminBadge color={status?.vehicleCatalog?.configurado ? '#2ecc71' : '#ccc'}>TOKEN</AdminBadge>
                {status?.vehicleCatalog?.configurado ? 'Conectado' : 'Pendente'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AdminBadge color={status?.productCatalog?.configurado ? '#2ecc71' : '#ccc'}>CATÁLOGOS</AdminBadge>
                {status?.productCatalog?.configurado ? 'Conectados' : 'Pendente'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Sync Action */}
      <AdminCard title="Sincronização Geral" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
              Esta ação enviará todas as motos com status <strong>DISPONÍVEL</strong> para o Meta simultaneamente. 
              Ideal para atualizações em massa após muitas alterações no estoque.
            </p>
          </div>
          <AdminButton onClick={handleSyncAll} loading={syncing} style={{ minWidth: '220px' }}>
            {syncing ? <RefreshCw className="animate-spin" /> : <Instagram size={18} />}
            Sincronizar Tudo Agora
          </AdminButton>
        </div>

        {result && (
          <div style={{
            marginTop: '24px', padding: '16px 20px', borderRadius: '12px',
            background: result.error ? '#fff1f2' : '#f0fdf4',
            border: `1px solid ${result.error ? '#e11d4833' : '#10b98133'}`,
            display: 'flex', alignItems: 'center', gap: '12px',
            color: result.error ? '#e11d48' : '#059669', fontSize: '14px', fontWeight: 600
          }}>
            {result.error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <div>
              {result.error ? `Erro: ${result.error}` :
                `Sucesso: ${result.total} motos processadas (${result.veiculosSincronizados} veículos, ${result.produtosSincronizados} produtos). ${result.erros > 0 ? `Falhas: ${result.erros}` : ''}`
              }
            </div>
          </div>
        )}
      </AdminCard>

      {/* Individual Inventory List */}
      <AdminCard title={`Motos Prontas para Sincronizar (${motos.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '0 -24px -24px -24px' }}>
          {motos.map((moto, idx) => (
            <div key={moto.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 24px',
              borderTop: idx === 0 ? 'none' : '1px solid #f8f9fa',
              transition: 'background 0.2s'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#111', fontWeight: 700, fontSize: '15px' }}>{moto.nome}</span>
                  {moto.metaProductId && (
                    <AdminBadge color="#4f8ef7">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={10} /> Online
                      </div>
                    </AdminBadge>
                  )}
                </div>
                <div style={{ color: '#999', fontSize: '13px', marginTop: '2px' }}>
                  {moto.marca} • {moto.ano} • {moto.km === 0 ? 'Zero KM' : `${moto.km?.toLocaleString()} km`}
                  {moto.metaProductId && <span style={{ marginLeft: '12px', color: '#ccc' }}>ID: {moto.metaProductId}</span>}
                </div>
              </div>
              <AdminButton 
                variant="secondary" 
                size="sm" 
                onClick={() => handleSyncOne(moto.id)}
                loading={syncingId === moto.id}
              >
                {syncingId !== moto.id && <RefreshCw size={14} />}
                Sync
              </AdminButton>
            </div>
          ))}
          {motos.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
               <Info size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
               <p style={{ margin: 0 }}>Nenhuma moto disponível para sincronizar no momento.</p>
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );
}

function StatusCard({ title, icon, desc, configured, catalogId }: {
  title: string; icon: React.ReactNode; desc: string; configured: boolean; catalogId: string | null;
}) {
  return (
    <AdminCard noPadding style={{ overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', background: configured ? '#f0fdf4' : '#fff9db', borderBottom: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '12px' }}>
         <div style={{ 
           width: '40px', height: '40px', borderRadius: '10px', 
           background: configured ? '#10b981' : '#f59e0b', color: '#fff',
           display: 'flex', alignItems: 'center', justifyContent: 'center'
         }}>
           {icon}
         </div>
         <div style={{ flex: 1 }}>
           <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: configured ? '#065f46' : '#92400e' }}>
             {title}
           </h3>
           <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: configured ? '#10b981' : '#d97706' }}>
             {configured ? 'Configurado' : 'Pendente'}
           </div>
         </div>
         {configured ? <CheckCircle2 size={20} color="#10b981" /> : <AlertCircle size={20} color="#f59e0b" />}
      </div>
      <div style={{ padding: '16px 24px' }}>
        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', lineHeight: 1.4 }}>{desc}</p>
        <div style={{ 
          background: '#f8f9fa', padding: '10px 12px', borderRadius: '8px',
          display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #eee'
        }}>
          <Settings size={12} color="#999" />
          <code style={{ fontSize: '11px', color: configured ? '#666' : '#ccc', fontFamily: 'monospace' }}>
            {catalogId || '—'}
          </code>
        </div>
      </div>
    </AdminCard>
  );
}
