'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motos as motosApi, marcas as marcasApi } from '@/lib/api';
import type { MotoDto, MarcaMoto, TipoMoto, MarcaDto } from '@moto-e-cia/shared';
import { Calendar, Gauge, Palette, Search, X, Star, Eye, Zap, Box, ArrowLeft, Bell, MoreVertical, Grid, UserPlus, Link as LinkIcon, Images, PlaySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const MARCAS: { value: MarcaMoto | ''; label: string }[] = [
  { value: '', label: 'Todas as marcas' },
  { value: 'SUZUKI', label: 'Suzuki' },
  { value: 'HAOJUE', label: 'Haojue' },
  { value: 'ZONTES', label: 'Zontes' },
  { value: 'KYMCO', label: 'Kymco' },
  { value: 'OUTRO', label: 'Outras' },
];
const TIPOS: { value: TipoMoto | ''; label: string }[] = [
  { value: '', label: 'Todos os tipos' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'NAKED', label: 'Naked' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'SCOOTER', label: 'Scooter' },
  { value: 'TRAIL', label: 'Trail' },
  { value: 'STREET', label: 'Street' },
  { value: 'CROSSOVER', label: 'Crossover' },
  { value: 'CUSTOM', label: 'Custom' },
  { value: 'TOURING', label: 'Touring' },
];

const CONDICOES: { value: 'NOVA' | 'SEMINOVA' | ''; label:string }[] = [
  { value: '', label: 'Todas' },
  { value: 'NOVA', label: 'Novas (0km)' },
  { value: 'SEMINOVA', label: 'Seminovas' },
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
  const [condicao, setCondicao] = useState<'NOVA' | 'SEMINOVA' | ''>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMoto, setSelectedMoto] = useState<MotoDto | null>(null);
  const { openWhatsApp } = useWhatsApp();

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
        condicao: condicao || undefined,
        search: search || undefined,
        status: 'DISPONIVEL',
      });
      setMotos(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, marca, tipo, search, condicao]);

  useEffect(() => { load(); }, [load]);
  function resetFilters() { setMarca(''); setTipo(''); setSearch(''); setCondicao(''); setPage(1); }

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: '#f8f8f8' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .motos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .page-wrapper {
            background: #fff !important;
            color: #111 !important;
          }
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
            background: #fff !important;
            color: #111 !important;
          }
          .main-content-container {
            padding: 0 !important;
          }
          .marcas-scroll {
            padding: 0 16px 16px !important;
            margin-bottom: 0 !important;
            gap: 16px !important;
            border-bottom: 1px solid #efefef !important;
            scrollbar-width: none;
          }
          .marcas-scroll::-webkit-scrollbar {
            display: none;
          }
          .insta-story-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            flex: 0 0 auto;
          }
          .marca-btn {
            width: 64px !important;
            height: 64px !important;
            border-radius: 50% !important;
            padding: 2px !important;
            border: 1px solid #e5e5e5 !important;
            background: #fff !important;
            opacity: 1 !important;
            filter: none !important;
            box-shadow: none !important;
            transform: none !important;
            flex-direction: row;
          }
          .marca-btn.active-story {
            border: 2px solid transparent !important;
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
            background-origin: border-box !important;
            background-clip: padding-box, border-box !important;
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
            background: #efefef;
          }
          .mobile-insta-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 4px;
            box-sizing: border-box;
          }
          .mobile-tabs {
            display: flex !important;
            border-bottom: 1px solid #efefef;
          }
          .mobile-tab {
            flex: 1;
            display: flex;
            justify-content: center;
            padding: 12px 0;
            color: #888;
            border-bottom: 1px solid transparent;
          }
          .mobile-tab.active {
            color: #111;
            border-bottom: 1px solid #111;
          }
          .desktop-marcas-scroll {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-insta-item, .mobile-tabs, .mobile-bio-header, .mobile-marcas-scroll {
            display: none !important;
          }
        }
      `}} />

      {/* Header banner - hidden on mobile */}
      <div className="desktop-header" style={{
        background: 'linear-gradient(135deg, #151515 0%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px 80px', textAlign: 'center',
        borderBottom: '4px solid #0055A4'
      }}>
        {/* Carbon fiber overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 8px)',
          pointerEvents: 'none', zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: '#0055A4', fontSize: '14px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Catálogo
          </p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 16px', letterSpacing: '0.02em' }}>
            Nossas Motos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', margin: 0, fontWeight: 500 }}>
            {total > 0 ? `${total} moto${total !== 1 ? 's' : ''} disponíve${total !== 1 ? 'is' : 'l'}` : 'Carregando catálogo...'}
          </p>
        </div>
      </div>

      {/* Instagram-style Bio Header - mobile only */}
      <div className="mobile-bio-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ArrowLeft size={24} />
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>motoeciaaracaju_oficial</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bell size={24} />
            <MoreVertical size={24} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', marginBottom: '16px', gap: '20px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '3px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', overflow: 'hidden', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/logo_moto_e_cia.png" alt="Logo" width={74} height={74} style={{ objectFit: 'contain', padding: '6px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{total}</div>
              <div style={{ fontSize: '13px', color: '#111' }}>posts</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>48 mil</div>
              <div style={{ fontSize: '13px', color: '#111' }}>seguidores</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>4.077</div>
              <div style={{ fontSize: '13px', color: '#111' }}>seguindo</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px' }}>Moto & Cia Aracaju Oficial</h2>
          <p style={{ fontSize: '14px', margin: '0 0 4px', lineHeight: '1.4' }}>
            🏆Há mais de 20 anos sendo referência em motos<br/>
            📍Aracaju e N. Sra. do Socorro<br/>
            📱(79) 98166-4850 | (79) 99147-0176
          </p>
          <a href="https://linktr.ee/motoeciasuzuki" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00376b', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>
            <LinkIcon size={14} /> linktr.ee/motoeciasuzuki e 1 outra pessoa
          </a>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button style={{ flex: 1, background: '#efefef', color: '#111', border: 'none', borderRadius: '8px', padding: '6px 0', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>Seguindo <span style={{fontSize:'10px'}}>v</span></button>
          <button style={{ flex: 1, background: '#efefef', color: '#111', border: 'none', borderRadius: '8px', padding: '6px 0', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Mensagem</button>
          <button onClick={() => openWhatsApp()} style={{ flex: 1, background: '#efefef', color: '#111', border: 'none', borderRadius: '8px', padding: '6px 0', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Contato</button>
          <button style={{ background: '#efefef', color: '#111', border: 'none', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><UserPlus size={16} /></button>
        </div>
      </div>

      <div className="main-content-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {marcas.length > 0 && (
          <>
          {/* Desktop Marcas */}
          <div className="marcas-scroll desktop-marcas-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px 0 16px', marginBottom: '72px', scrollbarWidth: 'none' }}>
            {marcas.map(m => (
              <button
                key={m.id}
                className="marca-btn-desktop"
                onClick={() => {
                  setMarca(marca === m.nome ? '' : m.nome as any);
                  setCondicao('');
                  setPage(1);
                }}
                style={{
                  flex: '0 0 auto', width: '120px', height: '70px', borderRadius: '4px',
                  background: '#fff',
                  border: '2px solid', borderColor: marca === m.nome ? '#0055A4' : '#e5e5e5',
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '10px', opacity: (marca && marca !== m.nome) || condicao === 'SEMINOVA' ? 0.4 : 1,
                  filter: (marca && marca !== m.nome) || condicao === 'SEMINOVA' ? 'grayscale(100%)' : 'none',
                  boxShadow: marca === m.nome ? '0 4px 15px rgba(0, 85, 164, 0.2)' : 'none',
                  transform: marca === m.nome ? 'translateY(-2px)' : 'none'
                }}
                title={m.nome}
              >
                {m.logoUrl ? (
                  <img src={m.logoUrl} alt={m.nome} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: marca === m.nome ? '#0055A4' : '#888' }}>{m.nome}</span>
                )}
              </button>
            ))}
            <button
              className="marca-btn-desktop"
              onClick={() => {
                setCondicao(condicao === 'SEMINOVA' ? '' : 'SEMINOVA');
                setMarca('');
                setPage(1);
              }}
              style={{
                flex: '0 0 auto', width: '120px', height: '70px', borderRadius: '4px',
                background: '#fff',
                border: '2px solid', borderColor: condicao === 'SEMINOVA' ? '#0055A4' : '#e5e5e5',
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px', opacity: marca ? 0.4 : 1,
                filter: marca ? 'grayscale(100%)' : 'none',
                boxShadow: condicao === 'SEMINOVA' ? '0 4px 15px rgba(0, 85, 164, 0.2)' : 'none',
                transform: condicao === 'SEMINOVA' ? 'translateY(-2px)' : 'none'
              }}
              title="Motos Seminovas"
            >
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: condicao === 'SEMINOVA' ? '#0055A4' : '#888' }}>Seminovas</span>
            </button>
          </div>

          {/* Mobile Marcas */}
          <div className="marcas-scroll mobile-marcas-scroll" style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px 0 16px', marginBottom: '72px', scrollbarWidth: 'none' }}>
            <div className="insta-story-container">
              <button
                className={`marca-btn ${condicao === 'SEMINOVA' ? 'active-story' : ''}`}
                onClick={() => {
                  setCondicao(condicao === 'SEMINOVA' ? '' : 'SEMINOVA');
                  setMarca('');
                  setPage(1);
                }}
                style={{
                  opacity: marca ? 0.5 : 1
                }}
              >
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   <img src="/logo_moto_e_cia.png" alt="Seminovas" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
                </div>
              </button>
              <span style={{ fontSize: '11px', color: '#111', fontWeight: condicao === 'SEMINOVA' ? 700 : 400 }}>SEMINOVAS</span>
            </div>
            
            {marcas.map(m => (
              <div key={m.id} className="insta-story-container">
                <button
                  className={`marca-btn ${marca === m.nome ? 'active-story' : ''}`}
                  onClick={() => {
                    setMarca(marca === m.nome ? '' : m.nome as any);
                    setCondicao('');
                    setPage(1);
                  }}
                  style={{
                    opacity: (marca && marca !== m.nome) || condicao === 'SEMINOVA' ? 0.5 : 1
                  }}
                >
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {m.logoUrl ? (
                      <img src={m.logoUrl} alt={m.nome} style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#111' }}>{m.nome.substring(0,3)}</span>
                    )}
                  </div>
                </button>
                <span style={{ fontSize: '11px', color: '#111', textTransform: 'uppercase', fontWeight: marca === m.nome ? 700 : 400, whiteSpace: 'nowrap' }}>{m.nome}</span>
              </div>
            ))}
          </div>
          </>
        )}

        {/* Filters */}
        <div className="filters-container" style={{
          background: '#fff', borderRadius: '0', padding: '24px',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
          marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          borderTop: '4px solid #0055A4',
          position: 'relative', zIndex: 10,
          marginTop: '-56px'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input type="text" placeholder="Buscar moto..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '12px 14px 12px 36px', border: '1px solid #e5e5e5', borderRadius: '4px', fontSize: '14px', fontWeight: 600 }}
            />
          </div>
          <select value={marca} onChange={e => { setMarca(e.target.value as any); setPage(1); }}
            style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
            {MARCAS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select value={condicao} onChange={e => { setCondicao(e.target.value as any); setPage(1); }}
            style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
            {CONDICOES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {(marca || tipo || search || condicao) && (
            <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: 'transparent', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
              <X size={14} /> Limpar
            </button>
          )}
        </div>

        {/* Mobile Tabs */}
        <div className="mobile-tabs" style={{ display: 'none' }}>
          <div className="mobile-tab active">
            <Grid size={24} />
          </div>
          <div className="mobile-tab">
            <PlaySquare size={24} />
          </div>
          <div className="mobile-tab">
            <UserPlus size={24} />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#999' }}>Carregando...</div>
        ) : motos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#999' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.5 }}>
              <Search size={64} strokeWidth={1.5} color="#0055A4" />
            </div>
            <p>Nenhuma moto encontrada com esses filtros.</p>
            <button onClick={resetFilters} style={{ marginTop: '16px', padding: '12px 24px', background: '#0055A4', border: 'none', borderRadius: '0', fontWeight: 800, textTransform: 'uppercase', color: '#fff', cursor: 'pointer', clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
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
                    <div style={{ background: '#fff', borderRadius: '0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', borderBottom: '4px solid #0055A4', display: 'flex', flexDirection: 'column', height: '100%' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
                    >
                      <div style={{ height: '220px', background: '#f0f0f0', position: 'relative', clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}>
                        {foto
                          ? <Image src={foto.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
                          : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>🏍️</div>
                        }
                        {st && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '6px 12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: st.color, borderLeft: `3px solid ${st.color}` }}>{st.label}</div>
                        )}
                        {moto.destaque && (
                          <div style={{ 
                            position: 'absolute', top: '10px', left: '10px', 
                            background: '#0055A4', 
                            padding: '6px 12px', fontSize: '11px', fontWeight: 800, color: '#fff', textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: '4px', borderRight: '3px solid #1A6FBC'
                          }}>
                            <Star size={12} fill="currentColor" /> Destaque
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ color: '#0055A4', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{moto.marca}</div>
                        <h2 style={{ color: '#111', fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', margin: '4px 0 12px', lineHeight: 1.1 }}>{moto.nome}</h2>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                          {moto.ano && (
                            <span style={{ color: '#666', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={14} /> {moto.ano}
                            </span>
                          )}
                          {moto.km !== null && (
                            <span style={{ color: '#666', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Gauge size={14} /> {moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`}
                            </span>
                          )}
                        </div>
                        {moto.preco
                          ? <div style={{ color: '#0055A4', fontSize: '24px', fontWeight: 800 }}>R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          : <div style={{ color: '#888', fontSize: '16px', fontWeight: 600 }}>Consulte o preço</div>
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
                      <div style={{ width: '100%', height: '100%', background: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏍️</div>
                    )}
                    {moto.fotos && moto.fotos.length > 1 ? (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', color: '#fff' }}>
                        <Images size={16} fill="currentColor" />
                      </div>
                    ) : moto.destaque ? (
                      <div style={{ position: 'absolute', top: '5px', right: '5px', color: '#fff' }}>
                        <Star size={12} fill="#E2231A" stroke="#E2231A" />
                      </div>
                    ) : null}
                    <div style={{ position: 'absolute', bottom: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                      {moto.condicao && (
                        <div style={{ background: moto.condicao === 'NOVA' ? '#fff' : 'rgba(0,0,0,0.6)', color: moto.condicao === 'NOVA' ? '#000' : '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 4px', borderRadius: '2px' }}>
                           {moto.condicao === 'NOVA' ? 'Novo' : 'Semi'}
                        </div>
                      )}
                      {moto.preco && (
                        <div style={{ background: '#E2231A', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 4px', borderRadius: '2px' }}>
                           R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </div>
                      )}
                    </div>
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
                          <div style={{ height: '48px', width: '99px', position: 'relative' }}>
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
