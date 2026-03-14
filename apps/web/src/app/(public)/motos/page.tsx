'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motos as motosApi } from '@/lib/api';
import type { MotoDto, MarcaMoto, TipoMoto } from '@moto-e-cia/shared';

const MARCAS: { value: MarcaMoto | ''; label: string }[] = [
  { value: '', label: 'Todas as marcas' },
  { value: 'SUZUKI', label: 'Suzuki' },
  { value: 'HAOJUE', label: 'Haojue' },
  { value: 'ZONTES', label: 'Zontes' },
  { value: 'KYMCO', label: 'Kymco' },
  { value: 'SEMINOVA', label: 'Seminovas' },
  { value: 'OUTRO', label: 'Outras' },
];
const TIPOS: { value: TipoMoto | ''; label: string }[] = [
  { value: '', label: 'Todos os tipos' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'NAKED', label: 'Naked' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'SCOOTER', label: 'Scooter' },
  { value: 'TRAIL', label: 'Trail' },
];

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  DISPONIVEL: { label: 'Disponível', color: '#2ecc71' },
  RESERVADA: { label: 'Reservada', color: '#f39c12' },
  VENDIDA: { label: 'Vendida', color: '#888' },
  ALUGUEL: { label: 'Aluguel', color: '#4f8ef7' },
};

export default function MotosPage() {
  const [motos, setMotos] = useState<MotoDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [marca, setMarca] = useState<MarcaMoto | ''>('');
  const [tipo, setTipo] = useState<TipoMoto | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const LIMIT = 12;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await motosApi.list({
        page, limit: LIMIT,
        marca: marca || undefined,
        tipo: tipo || undefined,
        search: search || undefined,
        status: 'DISPONIVEL',
      });
      setMotos(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, marca, tipo, search]);

  useEffect(() => { load(); }, [load]);
  function resetFilters() { setMarca(''); setTipo(''); setSearch(''); setPage(1); }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #1a0000 100%)',
        padding: '64px 24px 48px', textAlign: 'center',
      }}>
        <p style={{ color: '#E2231A', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Catálogo
        </p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 12px' }}>
          Nossas Motos
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', margin: 0 }}>
          {total > 0 ? `${total} moto${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'}` : 'Carregando catálogo...'}
        </p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '20px',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
          marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <input type="text" placeholder="🔍 Buscar moto..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: 1, minWidth: '180px', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px' }}
          />
          <select value={marca} onChange={e => { setMarca(e.target.value as any); setPage(1); }}
            style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
            {MARCAS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select value={tipo} onChange={e => { setTipo(e.target.value as any); setPage(1); }}
            style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {(marca || tipo || search) && (
            <button onClick={resetFilters} style={{ padding: '10px 14px', background: 'transparent', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
              ✕ Limpar
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#999' }}>Carregando...</div>
        ) : motos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#999' }}>
            <p style={{ fontSize: '48px', margin: '0 0 16px' }}>🔍</p>
            <p>Nenhuma moto encontrada com esses filtros.</p>
            <button onClick={resetFilters} style={{ marginTop: '16px', padding: '10px 20px', background: '#E2231A', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
              Ver todas
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {motos.map(moto => {
              const foto = moto.fotos?.find(f => f.principal) ?? moto.fotos?.[0];
              const st = STATUS_BADGE[moto.status];
              return (
                <Link key={moto.id} href={`/motos/${moto.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                  >
                    <div style={{ height: '220px', background: '#f0f0f0', position: 'relative' }}>
                      {foto
                        ? <Image src={foto.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
                        : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>🏍️</div>
                      }
                      {st && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, color: st.color }}>{st.label}</div>
                      )}
                      {moto.destaque && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#E2231A', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, color: '#fff' }}>⭐ Destaque</div>
                      )}
                    </div>
                    <div style={{ padding: '18px' }}>
                      <div style={{ color: '#E2231A', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{moto.marca}</div>
                      <h2 style={{ color: '#111', fontSize: '18px', fontWeight: 700, margin: '4px 0 8px' }}>{moto.nome}</h2>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        {moto.ano && <span style={{ color: '#888', fontSize: '13px' }}>📅 {moto.ano}</span>}
                        {moto.km !== null && moto.km !== undefined && (
                          <span style={{ color: '#888', fontSize: '13px' }}>🛣️ {moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`}</span>
                        )}
                        {moto.cor && <span style={{ color: '#888', fontSize: '13px' }}>🎨 {moto.cor}</span>}
                      </div>
                      {moto.preco
                        ? <div style={{ color: '#2ecc71', fontSize: '18px', fontWeight: 700 }}>R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        : <div style={{ color: '#888', fontSize: '14px' }}>Consulte o preço</div>
                      }
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {total > LIMIT && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer' }}>← Anterior</button>
            <span style={{ padding: '10px 16px', color: '#888', fontSize: '14px' }}>{page} / {Math.ceil(total / LIMIT)}</span>
            <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}
              style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer' }}>Próxima →</button>
          </div>
        )}
      </div>
    </div>
  );
}
