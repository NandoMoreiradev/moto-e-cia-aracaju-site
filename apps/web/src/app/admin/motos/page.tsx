'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminMotos } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';
import { Plus, Search, Filter, Edit2, Trash2, Star, Calendar, Gauge } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminBadge } from '@/components/admin/AdminBadge';

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
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Motos do Catálogo
          </h1>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
            Gerencie o estoque e informações das motocicletas
          </p>
        </div>
        <Link href="/admin/motos/nova" style={{ textDecoration: 'none' }}>
          <AdminButton>
            <Plus size={18} /> Cadastrar Nova Moto
          </AdminButton>
        </Link>
      </div>

      {/* Filters Area */}
      <AdminCard style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }} />
            <AdminInput 
              placeholder="Buscar por nome, marca ou descrição..." 
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ marginBottom: 0, paddingLeft: '44px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={16} color="#999" />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              style={{
                padding: '11px 14px', background: '#fcfcfc',
                border: '1px solid #e5e5e5', borderRadius: '10px',
                color: '#111', fontSize: '14px', outline: 'none',
                minWidth: '160px'
              }}
            >
              <option value="">Todos os status</option>
              <option value="DISPONIVEL">Disponíveis</option>
              <option value="RESERVADA">Reservadas</option>
              <option value="VENDIDA">Vendidas</option>
              <option value="ALUGUEL">Aluguel</option>
            </select>
          </div>
        </div>
      </AdminCard>

      {/* Results Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
           <div style={{ 
              width: '30px', height: '30px', margin: '0 auto 16px',
              border: '3px solid #f3f3f3', borderTop: '3px solid #E2231A', 
              borderRadius: '50%', animation: 'spin 1s linear infinite'
           }} />
           <div style={{ color: '#999', fontSize: '14px' }}>Buscando motos...</div>
        </div>
      ) : motos.length === 0 ? (
        <AdminCard style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏍️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>Nenhuma moto encontrada</h3>
          <p style={{ color: '#999', marginBottom: '24px' }}>Não encontramos resultados para os filtros aplicados.</p>
          <AdminButton variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); }}>
            Limpar Filtros
          </AdminButton>
        </AdminCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {motos.map(moto => {
            const foto = moto.fotos?.find(f => f.principal) ?? moto.fotos?.[0];
            const st = STATUS_LABEL[moto.status] ?? { label: moto.status, color: '#888' };
            return (
              <AdminCard key={moto.id} style={{ padding: 0, overflow: 'hidden', marginBottom: 0 }}>
                {/* Image Container */}
                <div style={{ height: '200px', background: '#f8f8f8', position: 'relative' }}>
                  {foto ? (
                    <Image src={foto.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '48px' }}>
                      🏍️
                    </div>
                  )}
                  {/* Badges Overlay */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <AdminBadge color={st.color}>{st.label}</AdminBadge>
                  </div>
                  {moto.destaque && (
                    <div style={{ 
                      position: 'absolute', top: '12px', left: '12px',
                      background: '#E2231A', color: '#fff', borderRadius: '8px',
                      padding: '4px 8px', fontSize: '10px', fontWeight: 800,
                      display: 'flex', alignItems: 'center', gap: '4px',
                      boxShadow: '0 4px 8px rgba(226, 35, 26, 0.3)'
                    }}>
                      <Star size={10} fill="currentColor" /> DESTAQUE
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div style={{ padding: '20px' }}>
                  <div style={{ 
                    color: '#E2231A', fontSize: '11px', fontWeight: 800, 
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' 
                  }}>
                    {moto.marca}
                  </div>
                  <h3 style={{ color: '#111', fontWeight: 700, fontSize: '18px', margin: 0, lineHeight: '1.3' }}>
                    {moto.nome}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px', color: '#888', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {moto.ano || '—'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Gauge size={14} /> {moto.km === 0 ? '0 km' : (moto.km ? `${moto.km.toLocaleString('pt-BR')} km` : '—')}</span>
                  </div>

                  {moto.preco && (
                    <div style={{ color: '#2ecc71', fontWeight: 800, fontSize: '18px', marginTop: '12px' }}>
                      R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', gap: '10px', marginTop: '20px', 
                    paddingTop: '16px', borderTop: '1px solid #f0f0f0' 
                  }}>
                    <Link href={`/admin/motos/${moto.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <AdminButton variant="secondary" size="sm" style={{ width: '100%', borderRadius: '8px' }}>
                        <Edit2 size={14} /> Editar
                      </AdminButton>
                    </Link>
                    <AdminButton 
                      variant="danger" 
                      size="sm" 
                      style={{ padding: '8px 10px', borderRadius: '8px' }}
                      onClick={() => handleDelete(moto.id, moto.nome)}
                      disabled={deleting === moto.id}
                    >
                      <Trash2 size={16} />
                    </AdminButton>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Pagination Area */}
      {total > 12 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
          <AdminButton
            variant="secondary"
            disabled={page === 1}
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
          >
            Anterior
          </AdminButton>
          <span style={{ color: '#999', fontSize: '14px', fontWeight: 600 }}>
            {page} / {Math.ceil(total / 12)}
          </span>
          <AdminButton
            variant="secondary"
            disabled={page >= Math.ceil(total / 12)}
            onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
          >
            Próxima
          </AdminButton>
        </div>
      )}
    </div>
  );
}
