'use client';

import { useEffect, useState } from 'react';
import { adminMeta, adminMotos } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';

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
      adminMotos.list({ limit: 100, status: 'DISPONIVEL' }),
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

  if (loading) return <div style={{ color: '#555', padding: '48px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Meta / Instagram</h1>
        <p style={{ color: '#555', fontSize: '14px', marginTop: '4px' }}>Gerenciar catálogos de produtos no Meta Commerce</p>
      </div>

      {/* Status dos catálogos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <StatusCard
          title="🏍️ Catálogo de Veículos"
          desc="Anúncios dinâmicos e retargeting no Facebook e Instagram"
          configured={status?.vehicleCatalog?.configurado}
          catalogId={status?.vehicleCatalog?.catalogId}
        />
        <StatusCard
          title="🛍️ Catálogo de Produtos"
          desc='Botão "Loja" no perfil do Instagram e marcação em posts'
          configured={status?.productCatalog?.configurado}
          catalogId={status?.productCatalog?.catalogId}
        />
      </div>

      {/* Config warning */}
      {(!status?.vehicleCatalog?.configurado || !status?.productCatalog?.configurado) && (
        <div style={{
          background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)',
          borderRadius: '10px', padding: '16px 20px', color: '#f39c12', fontSize: '14px', marginBottom: '24px',
        }}>
          ⚠️ Configure as variáveis de ambiente no arquivo <code style={{ fontFamily: 'monospace' }}>apps/api/.env</code>:
          <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><code>META_ACCESS_TOKEN</code> — Token de acesso permanente</li>
            <li><code>META_CATALOG_ID</code> — ID do Catálogo de Veículos</li>
            <li><code>META_PRODUCT_CATALOG_ID</code> — ID do Catálogo de Produtos</li>
          </ul>
        </div>
      )}

      {/* Sync All */}
      <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>Sincronizar Tudo</h2>
        <p style={{ color: '#666', fontSize: '13px', margin: '0 0 16px' }}>
          Sincroniza todas as motos DISPONÍVEIS nos dois catálogos simultaneamente.
        </p>
        <button
          onClick={handleSyncAll}
          disabled={syncing}
          style={{
            padding: '12px 24px', background: syncing ? '#333' : '#1a3a6b',
            border: '1px solid #1e4d9a', borderRadius: '8px',
            color: syncing ? '#555' : '#6fa3f7', fontSize: '14px', fontWeight: 600, cursor: syncing ? 'not-allowed' : 'pointer',
          }}
        >
          {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar todos os catálogos'}
        </button>

        {result && (
          <div style={{
            marginTop: '16px', background: result.error ? 'rgba(226,35,26,0.1)' : 'rgba(46,204,113,0.1)',
            border: `1px solid ${result.error ? 'rgba(226,35,26,0.3)' : 'rgba(46,204,113,0.3)'}`,
            borderRadius: '8px', padding: '14px 16px', fontSize: '13px',
            color: result.error ? '#ff6b6b' : '#2ecc71',
          }}>
            {result.error ? `❌ ${result.error}` :
              `✅ ${result.total} motos processadas — ` +
              `Veículos: ${result.veiculosSincronizados} | ` +
              `Produtos: ${result.produtosSincronizados} | ` +
              `Erros: ${result.erros}`
            }
          </div>
        )}
      </div>

      {/* Individual sync */}
      <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>
          Motos Disponíveis ({motos.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {motos.map(moto => (
            <div key={moto.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', background: '#111', borderRadius: '8px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{moto.nome}</div>
                <div style={{ color: '#555', fontSize: '12px' }}>
                  {moto.marca} • {moto.ano ?? '—'} • {moto.km !== null && moto.km !== undefined ? (moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`) : '—'}
                  {moto.metaProductId && <span style={{ color: '#4f8ef7', marginLeft: '8px' }}>✓ Catálogo Veículos</span>}
                </div>
              </div>
              <button
                onClick={() => handleSyncOne(moto.id)}
                disabled={syncingId === moto.id}
                style={{
                  padding: '6px 14px', background: 'transparent',
                  border: '1px solid #2a2a2a', borderRadius: '6px',
                  color: '#888', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {syncingId === moto.id ? '⏳' : '🔄 Sync'}
              </button>
            </div>
          ))}
          {motos.length === 0 && (
            <p style={{ color: '#555', fontSize: '14px' }}>Nenhuma moto disponível para sincronizar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, desc, configured, catalogId }: {
  title: string; desc: string; configured: boolean; catalogId: string | null;
}) {
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ fontSize: '18px' }}>{configured ? '✅' : '⚠️'}</span>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ color: '#555', fontSize: '12px', margin: '0 0 10px' }}>{desc}</p>
      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: configured ? '#4f8ef7' : '#444' }}>
        {catalogId || 'Não configurado'}
      </div>
    </div>
  );
}
