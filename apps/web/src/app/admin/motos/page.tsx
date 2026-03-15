'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminMotos } from '@/lib/api';
import { Star } from 'lucide-react';
import type { MotoDto } from '@moto-e-cia/shared';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  DISPONIVEL: { label: 'Disponível', color: '#2ecc71' },
  RESERVADA: { label: 'Reservada', color: '#f39c12' },
  VENDIDA: { label: 'Vendida', color: '#888' },
  ALUGUEL: { label: 'Aluguel', color: '#4f8ef7' },
};

export default function AdminMotosPage() {
  const [motos, setMotos] = useState<MotoDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminMotos.list({ page, limit: 12, search: search || undefined, status: (statusFilter as any) || undefined });
      setMotos(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
    setDeleting(id);
    try {
      await adminMotos.delete(id);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Motos</h1>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '4px' }}>{total} moto{total !== 1 ? 's' : ''} cadastrada{total !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/motos/nova" style={{
          background: '#E2231A', color: '#fff',
          padding: '10px 20px', borderRadius: '8px',
          textDecoration: 'none', fontWeight: 600, fontSize: '14px',
        }}>
          + Nova Moto
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{
            flex: 1, minWidth: '200px',
            padding: '10px 14px', background: '#1a1a1a',
            border: '1px solid #2a2a2a', borderRadius: '8px',
            color: '#fff', fontSize: '14px',
          }}
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{
            padding: '10px 14px', background: '#1a1a1a',
            border: '1px solid #2a2a2a', borderRadius: '8px',
            color: '#fff', fontSize: '14px',
          }}
        >
          <option value="">Todos os status</option>
          <option value="DISPONIVEL">Disponíveis</option>
          <option value="RESERVADA">Reservadas</option>
          <option value="VENDIDA">Vendidas</option>
          <option value="ALUGUEL">Aluguel</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '48px' }}>Carregando...</div>
      ) : motos.length === 0 ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '48px' }}>
          Nenhuma moto encontrada.{' '}
          <Link href="/admin/motos/nova" style={{ color: '#E2231A' }}>Cadastrar agora</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {motos.map(moto => {
            const foto = moto.fotos?.find(f => f.principal) ?? moto.fotos?.[0];
            const st = STATUS_LABEL[moto.status] ?? { label: moto.status, color: '#888' };
            return (
              <div key={moto.id} style={{
                background: '#1a1a1a', border: '1px solid #222',
                borderRadius: '12px', overflow: 'hidden',
              }}>
                {/* Imagem */}
                <div style={{ height: '180px', background: '#111', position: 'relative' }}>
                  {foto ? (
                    <Image src={foto.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '36px' }}>
                      🏍️
                    </div>
                  )}
                  {/* Status badge */}
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.75)', borderRadius: '20px',
                    padding: '3px 10px', fontSize: '11px', fontWeight: 600,
                    color: st.color,
                  }}>{st.label}</div>
                  {moto.destaque && (
                    <div style={{
                      position: 'absolute', top: '8px', left: '8px',
                      background: '#E2231A', borderRadius: '20px',
                      padding: '3px 10px', fontSize: '11px', fontWeight: 600, color: '#fff',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <Star size={11} fill="currentColor" /> Destaque
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{ color: '#E2231A', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {moto.marca}
                  </div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginTop: '2px' }}>
                    {moto.nome}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                    {moto.ano && <span style={{ color: '#666', fontSize: '12px' }}>📅 {moto.ano}</span>}
                    {moto.km !== null && moto.km !== undefined && (
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        🛣️ {moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`}
                      </span>
                    )}
                  </div>
                  {moto.preco && (
                    <div style={{ color: '#2ecc71', fontWeight: 700, fontSize: '15px', marginTop: '8px' }}>
                      R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <Link href={`/admin/motos/${moto.id}`} style={{
                      flex: 1, textAlign: 'center',
                      padding: '8px', background: '#222',
                      border: '1px solid #333', borderRadius: '6px',
                      color: '#aaa', fontSize: '13px', textDecoration: 'none',
                    }}>
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(moto.id, moto.nome)}
                      disabled={deleting === moto.id}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent', border: '1px solid #333',
                        borderRadius: '6px', color: '#cc4444',
                        fontSize: '13px', cursor: 'pointer',
                      }}
                    >
                      {deleting === moto.id ? '...' : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            style={{ padding: '8px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
          >← Anterior</button>
          <span style={{ color: '#555', padding: '8px 16px' }}>Página {page} de {Math.ceil(total / 12)}</span>
          <button
            disabled={page >= Math.ceil(total / 12)}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: '8px 16px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
          >Próxima →</button>
        </div>
      )}
    </div>
  );
}
