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
const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  DISPONIVEL: { label: 'Disponível', color: '#1a7a3f', bg: '#dcffe4' },
  RESERVADA: { label: 'Reservada', color: '#8a5a00', bg: '#fff3cd' },
  VENDIDA: { label: 'Vendida', color: '#555', bg: '#eee' },
  ALUGUEL: { label: 'Aluguel', color: '#1a4f8a', bg: '#dbeafe' },
};

export default function MotoDetalhePage() {
  const { slug } = useParams<{ slug: string }>();
  const [moto, setMoto] = useState<MotoDto | null>(null);
  const [selectedFoto, setSelectedFoto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    motosApi.get(slug)
      .then(m => { setMoto(m); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Carregando...</div>
  );
  if (error || !moto) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
      <p style={{ fontSize: '48px' }}>🔍</p>
      <p>Moto não encontrada.</p>
      <Link href="/motos" style={{ color: '#E2231A', marginTop: '8px' }}>← Ver catálogo</Link>
    </div>
  );

  const fotosOrdenadas = [...(moto.fotos || [])].sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0));
  const fotoAtual = fotosOrdenadas[selectedFoto];
  const status = STATUS_LABEL[moto.status];

  const specs: { label: string; value: string }[] = [
    ...(moto.ano ? [{ label: 'Ano', value: String(moto.ano) }] : []),
    ...(moto.km !== null && moto.km !== undefined ? [{ label: 'Quilometragem', value: moto.km === 0 ? '0 km (zero km)' : `${moto.km.toLocaleString('pt-BR')} km` }] : []),
    ...(moto.cor ? [{ label: 'Cor', value: moto.cor }] : []),
    ...(moto.combustivel ? [{ label: 'Combustível', value: COMBUSTIVEL_LABEL[moto.combustivel] || moto.combustivel }] : []),
    ...(moto.transmissao ? [{ label: 'Transmissão', value: TRANSMISSAO_LABEL[moto.transmissao] || moto.transmissao }] : []),
    ...(moto.tipo ? [{ label: 'Categoria', value: moto.tipo }] : []),
    ...(moto.vin ? [{ label: 'Chassi (VIN)', value: moto.vin }] : []),
  ];

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse na *${moto.nome}* (${moto.ano || ''}, ${moto.km === 0 ? '0 km' : `${(moto.km ?? 0).toLocaleString('pt-BR')} km`}). Pode me dar mais informações?`
  );

  return (
    <div style={{ background: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px 0' }}>
        <nav style={{ fontSize: '13px', color: '#888' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
          {' → '}
          <Link href="/motos" style={{ color: '#888', textDecoration: 'none' }}>Motos</Link>
          {' → '}
          <span style={{ color: '#333' }}>{moto.nome}</span>
        </nav>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
        {/* Gallery */}
        <div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', marginBottom: '12px', position: 'relative', height: '450px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            {fotoAtual
              ? <Image src={fotoAtual.url} alt={moto.nome} fill style={{ objectFit: 'cover' }} />
              : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>🏍️</div>
            }
          </div>
          {fotosOrdenadas.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {fotosOrdenadas.map((foto, i) => (
                <div key={foto.id} onClick={() => setSelectedFoto(i)} style={{
                  flexShrink: 0, width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                  cursor: 'pointer', position: 'relative',
                  border: i === selectedFoto ? '2px solid #E2231A' : '2px solid transparent',
                  opacity: i === selectedFoto ? 1 : 0.6, transition: 'opacity 0.15s',
                }}>
                  <Image src={foto.url} alt={`Foto ${i+1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
          {moto.descricao && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px' }}>Descrição</h3>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{moto.descricao}</p>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{ position: 'sticky', top: '24px' }}>
          {status && (
            <div style={{ display: 'inline-block', background: status.bg, color: status.color, fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', marginBottom: '12px' }}>
              {status.label}
            </div>
          )}
          <div style={{ color: '#E2231A', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{moto.marca}</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111', margin: '4px 0 16px' }}>{moto.nome}</h1>

          {/* Key stats */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {moto.ano && (
              <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', minWidth: '70px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>{moto.ano}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Ano</div>
              </div>
            )}
            {moto.km !== null && moto.km !== undefined && (
              <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', minWidth: '80px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>{moto.km === 0 ? '0' : moto.km.toLocaleString('pt-BR')}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>km</div>
              </div>
            )}
            {moto.cor && (
              <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{moto.cor}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Cor</div>
              </div>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: '20px' }}>
            {moto.preco
              ? <div style={{ fontSize: '32px', fontWeight: 800, color: '#2ecc71' }}>R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              : <div style={{ color: '#888', fontSize: '18px' }}>Consulte o preço</div>
            }
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '5579999999999'}?text=${whatsappMsg}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: '#25D366', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
              💬 Falar no WhatsApp
            </a>
            <Link href="/motos" style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', color: '#666', fontSize: '14px', textDecoration: 'none' }}>
              ← Ver mais motos
            </Link>
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '14px' }}>Especificações</div>
              {specs.map((spec, i) => (
                <div key={spec.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: i < specs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>{spec.label}</span>
                  <span style={{ color: '#111', fontSize: '13px', fontWeight: 600 }}>{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
