'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motos as motosApi } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';

const TRANSMISSAO_LABEL: Record<string, string> = {
  MANUAL: 'Manual', AUTOMATICA: 'Automática', SEMI_AUTOMATICA: 'Semi-automática',
};

const COMBUSTIVEL_LABEL: Record<string, string> = {
  GASOLINA: 'Gasolina', ETANOL: 'Etanol', FLEX: 'Flex', ELETRICO: 'Elétrico',
};

export default function MotoDetalhePage() {
  const { slug } = useParams<{ slug: string }>();
  const [moto, setMoto] = useState<MotoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFotoIndex, setSelectedFotoIndex] = useState(0);

  // Estados para os acórdeons da Ficha Técnica (mock de grupos para simular o layout)
  const [openSpecs, setOpenSpecs] = useState<Record<string, boolean>>({
    'dimensoes': false,
    'motor': false,
  });

  const toggleSpec = (group: string) => setOpenSpecs(prev => ({ ...prev, [group]: !prev[group] }));

  useEffect(() => {
    motosApi.get(slug)
      .then(m => { setMoto(m); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#111' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', animation: 'spin 2s linear infinite' }}>🏍️</div>
        <div style={{ marginTop: '16px', color: '#666', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '12px' }}>Carregando Máquina</div>
      </div>
    </div>
  );
  if (error || !moto) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#111' }}>
      <p style={{ fontSize: '64px', margin: 0, fontWeight: 900 }}>404</p>
      <p style={{ color: '#666', fontSize: '18px' }}>Moto não encontrada ou já vendida.</p>
      <Link href="/motos" style={{ display: 'inline-block', padding: '12px 24px', background: '#E2231A', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 700, marginTop: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>← Voltar para a Concessionária</Link>
    </div>
  );

  const fotosOrdenadas = [...(moto.fotos || [])].sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0));
  const fotoAtual = fotosOrdenadas[selectedFotoIndex] || null;

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse na *${moto.nome}* (${moto.ano || ''}, ${moto.km === 0 ? '0 km' : `${(moto.km ?? 0).toLocaleString('pt-BR')} km`}). Pode me dar mais informações e verificar a disponibilidade?`
  );

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', color: '#111', fontFamily: 'inherit', overflowX: 'hidden' }}>
      
      {/* 1. MOTO CAPA (HERO BANNER) */}
      <div style={{ position: 'relative' }}>
        {/* Floating Back Header (Absolute no topo) */}
        <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', zIndex: 10, padding: '0 5%', maxWidth: '1440px', margin: '0 auto' }}>
          <Link href="/motos" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '30px', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
            ← Voltar para Motos
          </Link>
        </div>

        {moto.capaUrl ? (
          <section style={{ width: '100%', height: '55vh', position: 'relative' }}>
            <Image src={moto.capaUrl} alt={`Capa da ${moto.nome}`} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
          </section>
        ) : (
          <div style={{ width: '100%', height: '140px', background: 'radial-gradient(circle at center, #939393 0%, #444444 100%)' }} />
        )}
      </div>

      {/* 2. ÁREA DA MOTO ISOLADA E SELETOR DE COR */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 60px', padding: '0 5%', textAlign: 'center' }}>
        
        {/* Logomarca e Slogan ou Título Fallback */}
        {moto.logoUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
             <div style={{ position: 'relative', width: '300px', height: '100px' }}>
               <Image src={moto.logoUrl} alt={`Logo ${moto.nome}`} fill style={{ objectFit: 'contain' }} />
             </div>
             {moto.slogan && (
               <div style={{ marginTop: '12px', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: '#111', textTransform: 'uppercase' }}>
                 {moto.slogan}
               </div>
             )}
          </div>
        ) : (
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: '24px', color: '#333' }}>
            Conquiste sua <span style={{ color: '#e31b23' }}>{moto.nome}</span>
          </h2>
        )}
        
        {/* Badge de Preço */}
        {moto.preco && (
          <div style={{ 
            display: 'inline-block', 
            background: '#fff', 
            padding: '16px 36px', 
            borderRadius: '40px', 
            border: '1px solid #eaeaea',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
            marginBottom: '40px'
          }}>
            <div style={{ color: '#e31b23', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{fontSize:'14px', fontWeight:700, marginLeft: '4px'}}>+ frete</span>
            </div>
            <div style={{ color: '#111', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>*preço público sugerido</div>
          </div>
        )}

        {/* Imagem da Moto Isolada */}
        <div style={{ position: 'relative', height: '55vh', minHeight: '350px', marginBottom: '40px' }}>
          {fotoAtual ? (
            <Image 
              src={fotoAtual.url} 
              alt={moto.nome} 
              fill 
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
              priority
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Nenhuma foto disponível</div>
          )}
        </div>

        {/* Dots (Seletor de Cor) */}
        {fotosOrdenadas.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
            {fotosOrdenadas.map((foto, i) => {
              // Se não preencheu a cor, usamos um cinza neutro
              const bgColor = foto.corHex || '#999999';
              const isSelected = i === selectedFotoIndex;
              return (
                <button
                  key={foto.id}
                  onClick={() => setSelectedFotoIndex(i)}
                  style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: bgColor,
                    outline: isSelected ? `2px solid ${bgColor}` : 'none',
                    outlineOffset: '4px',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                  }}
                  title={foto.corNome || `Foto cor ${bgColor}`}
                />
              );
            })}
          </div>
        )}

        {/* CTAs (Tenho Interesse / Financiamento) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}?text=${whatsappMsg}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                background: '#e31b23', color: '#fff', borderRadius: '30px', 
                padding: '16px 40px', fontSize: '14px', fontWeight: 800, 
                textDecoration: 'none', transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ff2028'}
              onMouseLeave={e => e.currentTarget.style.background = '#e31b23'}
            >
              TENHO INTERESSE
            </a>
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}?text=${encodeURIComponent(`Olá, gostaria de simular um financiamento para a moto: ${moto.nome}.`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                background: '#fff', color: '#e31b23', border: '2px solid #e31b23', 
                borderRadius: '30px', padding: '16px 40px', fontSize: '14px', 
                fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e31b23'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#e31b23'; }}
            >
              FINANCIAMENTO
            </a>
        </div>
      </section>

      {/* 3. GALERIA DE FOTOS */}
      {fotosOrdenadas.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 5%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ color: '#111', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>GALERIA DE FOTOS</h3>
            <div style={{ width: '40px', height: '4px', background: '#e31b23', margin: '16px auto 0' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {fotosOrdenadas.map((foto, i) => (
              <div 
                key={foto.id} 
                onClick={() => setSelectedFotoIndex(i)}
                style={{ position: 'relative', height: '220px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eaeaea', cursor: 'pointer', background: '#fff' }}
              >
                <Image src={foto.url} alt={`Galeria ${i+1}`} fill style={{ objectFit: 'contain', padding: '16px', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. DESCRIÇÃO E ESPECIFICAÇÕES TÉCNICAS */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 120px', padding: '0 5%' }}>
        
        {moto.descricao && (
          <div style={{ marginBottom: '80px', textAlign: 'center' }}>
            <div style={{ color: '#444', fontSize: '16px', lineHeight: 1.8, fontWeight: 400 }}>
              {moto.descricao.split('\n').map((line, i) => (
                <span key={i}>{line}<br/></span>
              ))}
            </div>
          </div>
        )}

        {/* Título Vermelho Centralizado */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#e31b23', fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0px', margin: 0 }}>
            ESPECIFICAÇÕES TÉCNICAS
          </h2>
        </div>

        {/* Acórdeon 1: DIMENSÕES E PESO */}
        <div style={{ borderBottom: '1px solid #ddd' }}>
          <button 
            onClick={() => toggleSpec('dimensoes')}
            style={{ width: '100%', background: 'none', border: 'none', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '13px', color: '#333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>INFORMAÇÕES BÁSICAS DO VEÍCULO</span>
            <span style={{ transform: openSpecs['dimensoes'] ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31b23" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          
          <div style={{ maxHeight: openSpecs['dimensoes'] ? '1000px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease-in-out', opacity: openSpecs['dimensoes'] ? 1 : 0 }}>
            <div style={{ paddingBottom: '32px' }}>
              <SpecItem label="Marca Oficial" value={moto.marca} />
              <SpecItem label="Nome do Modelo" value={moto.nome} />
              <SpecItem label="Ano de Fabricação" value={moto.ano?.toString()} />
              <SpecItem label="Quilometragem (Odomêtro)" value={moto.km !== null ? (moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`) : undefined} />
              <SpecItem label="Cor Disponível" value={moto.cor || undefined} />
              <SpecItem label="Chassi (VIN)" value={moto.vin ? moto.vin.substring(0, 8) + '*****' : undefined} />
              <SpecItem label="Status de Negociação" value={moto.status} color={moto.status === 'VENDIDA' ? '#d32f2f' : '#2e7d32'} />
            </div>
          </div>
        </div>

        {/* Acórdeon 2: CAIXA DE VELOCIDADE E MOTOR */}
        <div style={{ borderBottom: '1px solid #ddd' }}>
          <button 
            onClick={() => toggleSpec('motor')}
            style={{ width: '100%', background: 'none', border: 'none', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '13px', color: '#333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>MOTOR, TRANSMISSÃO E ESTRUTURA</span>
            <span style={{ transform: openSpecs['motor'] ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31b23" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          
          <div style={{ maxHeight: openSpecs['motor'] ? '1000px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease-in-out', opacity: openSpecs['motor'] ? 1 : 0 }}>
            <div style={{ paddingBottom: '32px' }}>
              <SpecItem label="Tipo / Categoria" value={moto.tipo || undefined} />
              <SpecItem label="Alimentação / Combustível" value={moto.combustivel ? COMBUSTIVEL_LABEL[moto.combustivel] || moto.combustivel : undefined} />
              <SpecItem label="Caixa de Transmissão" value={moto.transmissao ? TRANSMISSAO_LABEL[moto.transmissao] || moto.transmissao : undefined} />
            </div>
          </div>
        </div>

        {/* Integração Meta Catalog (Se existir) */}
        {moto.metaProductId && (
          <div style={{ marginTop: '32px', padding: '20px', background: '#f5f5f5', borderLeft: '4px solid #1877F2', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '24px', color: '#1877F2' }}>📘</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#333', textTransform: 'uppercase' }}>Catálogo Facebook/Instagram</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Veículo sincronizado oficialmente no comércio eletrônico Meta. ID: {moto.metaProductId}</div>
            </div>
          </div>
        )}

      </section>
      
      {/* Botão Fixo WhatsApp Flutuante */}
      <a 
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}?text=${whatsappMsg}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 999,
          background: '#25D366', color: '#fff', width: '64px', height: '64px', 
          borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)', textDecoration: 'none', fontSize: '28px',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i style={{ fontFamily: 'sans-serif', fontStyle: 'normal' }}>💬</i>
      </a>

    </div>
  );
}

/* Row Simples para o Acórdeon */
function SpecItem({ label, value, color = '#333' }: { label: string; value?: string; color?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', padding: '16px 0 16px 16px', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ flex: '0 0 50%', color: '#777', fontSize: '13px', fontWeight: 600 }}>{label}</div>
      <div style={{ flex: '1', color: color, fontSize: '14px', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
