'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motos as motosApi, marcas as marcasApi } from '@/lib/api';
import type { MotoDto, MarcaMoto, TipoMoto, MarcaDto } from '@moto-e-cia/shared';
import { Calendar, Gauge, Palette, Search, X, Star, Eye, Zap, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [marcas, setMarcas] = useState<MarcaDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [marca, setMarca] = useState<MarcaMoto | ''>('');
  const [tipo, setTipo] = useState<TipoMoto | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMoto, setSelectedMoto] = useState<MotoDto | null>(null);

  useEffect(() => {
    if (selectedMoto) {
      // Scroll to the selected moto element after the modal has rendered
      setTimeout(() => {
        const element = document.getElementById(`moto-feed-${selectedMoto.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 50); // Small timeout to ensure DOM is ready
    }
  }, [selectedMoto]);

  useEffect(() => {
    marcasApi.list().then(setMarcas).catch(() => setMarcas([]));
  }, []);

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
      <style dangerouslySetInnerHTML={{ __html: `
        .motos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .motos-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            padding: 0;
            background: #fff;
          }
          .desktop-header {
            display: none !important;
          }
          .mobile-bio-header {
            display: block !important;
          }
          .main-content-container {
            padding: 0 !important;
          }
          .marcas-scroll {
            padding: 16px 16px !important;
            margin-bottom: 0 !important;
            border-bottom: 1px solid #efefef;
          }
          .filters-container {
            display: none !important;
          }
          .desktop-card {
            display: none;
          }
          .mobile-insta-item {
            display: block;
            aspect-ratio: 1 / 1;
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }
          .mobile-insta-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        @media (min-width: 769px) {
          .mobile-insta-item {
            display: none;
          }
        }
      `}} />

      {/* Header banner - hidden on mobile */}
      <div className="desktop-header" style={{
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

      {/* Instagram-style Bio Header - mobile only */}
      <div className="mobile-bio-header" style={{
        background: '#fff',
        padding: '24px 16px 20px',
        borderBottom: '1px solid #efefef',
        display: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: '16px', padding: '0 20px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>{total}</div>
            <div style={{ fontSize: '12px', color: '#262626' }}>Motos</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>{marcas.length}</div>
            <div style={{ fontSize: '12px', color: '#262626' }}>Marcas</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>+ de 5000</div>
            <div style={{ fontSize: '12px', color: '#262626' }}>Clientes</div>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Moto e Cia Aracaju</h2>
          <p style={{ fontSize: '14px', color: '#262626', margin: '0 0 16px', lineHeight: '1.4' }}>
            Qualidade, procedência e as melhores marcas. Realizando sonhos sobre duas rodas desde 2011. <br/>
            📍 Av. Pedro Calazans, 717, Centro, Aracaju-SE
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a 
              href="https://www.instagram.com/suzukiaracaju_motoecia/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ flex: 1, background: '#efefef', textDecoration: 'none', textAlign: 'center', borderRadius: '8px', padding: '8px 0', fontSize: '14px', fontWeight: 600, color: '#111' }}
            >
              Seguir
            </a>
            <a 
              href="https://wa.me/5579981072289" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ flex: 1, background: '#efefef', textDecoration: 'none', textAlign: 'center', borderRadius: '8px', padding: '8px 0', fontSize: '14px', fontWeight: 600, color: '#111' }}
            >
              Fale no Whatsapp
            </a>
          </div>
        </div>
      </div>

      <div className="main-content-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {marcas.length > 0 && (
          <div className="marcas-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px 0 16px', marginBottom: '20px', scrollbarWidth: 'none' }}>
            {marcas.map(m => (
              <button 
                key={m.id}
                onClick={() => { 
                  setMarca(marca === m.nome ? '' : m.nome as any); 
                  setPage(1); 
                }}
                style={{
                  flex: '0 0 auto', width: '120px', height: '70px', borderRadius: '12px',
                  background: '#fff',
                  border: '2px solid', borderColor: marca === m.nome ? '#E2231A' : '#e5e5e5',
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '10px', opacity: marca && marca !== m.nome ? 0.4 : 1,
                  filter: marca && marca !== m.nome ? 'grayscale(100%)' : 'none',
                  boxShadow: marca === m.nome ? '0 4px 12px rgba(226, 35, 26, 0.15)' : 'none'
                }}
                title={m.nome}
              >
                {m.logoUrl ? (
                  <img src={m.logoUrl} alt={m.nome} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: 700, color: marca === m.nome ? '#E2231A' : '#888' }}>{m.nome}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="filters-container" style={{
          background: '#fff', borderRadius: '12px', padding: '20px',
          display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center',
          marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input type="text" placeholder="Buscar moto..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
          <select value={marca} onChange={e => { setMarca(e.target.value as any); setPage(1); }}
            style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
            {MARCAS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          {(marca || tipo || search) && (
            <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: 'transparent', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
              <X size={14} /> Limpar
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
          <div className="motos-grid">
            {motos.map(moto => {
              const foto = moto.fotos?.find(f => f.principal) ?? moto.fotos?.[0];
              const st = STATUS_BADGE[moto.status];
              return (
                <React.Fragment key={moto.id}>
                  {/* Desktop Card */}
                  <Link href={`/motos/${moto.slug}`} className="desktop-card" style={{ textDecoration: 'none' }}>
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
                          <div style={{ 
                            position: 'absolute', top: '10px', left: '10px', 
                            background: '#E2231A', borderRadius: '20px', 
                            padding: '4px 10px', fontSize: '11px', fontWeight: 600, color: '#fff',
                            display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <Star size={12} fill="currentColor" /> Destaque
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '18px' }}>
                        <div style={{ color: '#E2231A', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{moto.marca}</div>
                        <h2 style={{ color: '#111', fontSize: '18px', fontWeight: 700, margin: '4px 0 8px' }}>{moto.nome}</h2>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          {moto.ano && (
                            <span style={{ color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={13} /> {moto.ano}
                            </span>
                          )}
                          {moto.km !== null && (
                            <span style={{ color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Gauge size={13} /> {moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`}
                            </span>
                          )}
                        </div>
                        {moto.preco
                          ? <div style={{ color: '#2ecc71', fontSize: '18px', fontWeight: 700 }}>R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          : <div style={{ color: '#888', fontSize: '14px' }}>Consulte o preço</div>
                        }
                      </div>
                    </div>
                  </Link>

                  {/* Mobile Insta Item */}
                  <div 
                    className="mobile-insta-item" 
                    onClick={() => setSelectedMoto(moto)}
                  >
                    {foto ? (
                      <img src={foto.url} alt={moto.nome} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏍️</div>
                    )}
                    {moto.destaque && (
                      <div style={{ position: 'absolute', top: '5px', right: '5px', color: '#fff' }}>
                        <Star size={12} fill="#E2231A" stroke="#E2231A" />
                      </div>
                    )}
                  </div>
                </React.Fragment>
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

      {/* Instagram-style Feed Modal for Mobile */}
      <AnimatePresence>
        {selectedMoto && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: '#fff', display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{ 
              height: '44px', borderBottom: '1px solid #efefef', 
              display: 'flex', alignItems: 'center', padding: '0 16px',
              position: 'sticky', top: 0, background: '#fff', zIndex: 10
            }}>
              <button 
                onClick={() => setSelectedMoto(null)}
                style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={24} color="#262626" />
              </button>
              <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '16px', color: '#262626', marginRight: '40px' }}>
                Explorar
              </div>
            </div>

            {/* Feed Content */}
            <div style={{ overflowY: 'auto', flex: 1, scrollBehavior: 'smooth' }} id="mobile-feed-container">
              {motos.map(moto => {
                const fotoPrincipal = moto.fotos?.find(f => f.principal) ?? moto.fotos?.[0];
                return (
                  <div 
                    key={moto.id} 
                    id={`moto-feed-${moto.id}`}
                    style={{ borderBottom: '8px solid #f8f8f8', paddingBottom: '20px' }}
                  >
                    {/* Post Header */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0', border: '1px solid #efefef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <Image src="/logo_moto_e_cia.png" alt="Logo" width={24} height={24} style={{ objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626' }}>motoeciaaracaju</div>
                        <div style={{ fontSize: '11px', color: '#8e8e8e' }}>Aracaju, Sergipe</div>
                      </div>
                    </div>

                    {/* Image */}
                    <div style={{ width: '100%', aspectRatio: '4/3', background: '#fafafa', position: 'relative' }}>
                      {fotoPrincipal ? (
                        <Image src={fotoPrincipal.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🏍️</div>
                      )}
                    </div>

                    {/* (Interaction Icons Removed) */}

                    {/* Caption / Details */}
                    <div style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        {marcas.find(m => m.nome === moto.marca)?.logoUrl ? (
                          <div style={{ height: '34px', width: '80px', position: 'relative' }}>
                            <img 
                              src={marcas.find(m => m.nome === moto.marca)?.logoUrl || ''} 
                              alt={moto.marca} 
                              style={{ height: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                            />
                          </div>
                        ) : (
                          <span style={{ fontWeight: 700, fontSize: '13px', color: '#262626' }}>{moto.marca}</span>
                        )}
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111', margin: 0 }}>{moto.nome}</h3>
                      </div>
                      
                      <div style={{ background: '#f8f8f8', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={15} style={{ color: '#888' }} /> {moto.ano || 'N/A'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Gauge size={15} style={{ color: '#888' }} /> {moto.km === 0 ? '0 km' : `${moto.km?.toLocaleString('pt-BR')} km`}
                        </div>
                        
                        {moto.specs?.potencia && (
                          <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={15} style={{ color: '#888' }} /> {moto.specs.potencia}
                          </div>
                        )}
                        
                        {moto.specs?.motor && (
                          <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Box size={15} style={{ color: '#888' }} /> {moto.specs.motor}
                          </div>
                        )}

                        {moto.preco && (
                          <div style={{ gridColumn: 'span 2', fontSize: '18px', fontWeight: 800, color: '#0055A4', marginTop: '4px' }}>
                            R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>

                      <Link 
                        href={`/motos/${moto.slug}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          background: '#E2231A',
                          color: '#fff',
                          textAlign: 'center',
                          padding: '14px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '15px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(226, 35, 26, 0.2)'
                        }}
                      >
                        Ver todos os detalhes
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
