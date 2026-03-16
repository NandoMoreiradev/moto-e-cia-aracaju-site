'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminBanners } from '@/lib/api';
import type { BannerDto } from '@moto-e-cia/shared';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminBanners.list();
      setBanners(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, titulo: string | null) {
    if (!confirm(`Tem certeza que deseja excluir o banner "${titulo || 'Sem Título'}"?`)) return;
    setDeleting(id);
    try {
      await adminBanners.delete(id);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Banners</h1>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '4px' }}>Gerencie os slides do banner principal</p>
        </div>
        <Link href="/admin/banners/novo" style={{
          background: '#E2231A', color: '#fff',
          padding: '10px 20px', borderRadius: '8px',
          textDecoration: 'none', fontWeight: 600, fontSize: '14px',
        }}>
          + Novo Banner
        </Link>
      </div>

      {loading ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '48px' }}>Carregando...</div>
      ) : banners.length === 0 ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '48px' }}>
          Nenhum banner cadastrado.{' '}
          <Link href="/admin/banners/novo" style={{ color: '#E2231A' }}>Cadastrar agora</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {banners.map(banner => (
            <div key={banner.id} style={{
              background: '#1a1a1a', border: '1px solid #222',
              borderRadius: '12px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ height: '160px', background: '#111', position: 'relative' }}>
                {banner.imageUrl ? (
                  <Image src={banner.imageUrl} alt={banner.titulo || 'Banner'} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '48px' }}>
                    🖼️
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: banner.ativo ? '#2ecc71' : '#888',
                  borderRadius: '20px', padding: '3px 10px', fontSize: '10px',
                  fontWeight: 700, color: '#fff', textTransform: 'uppercase'
                }}>
                  {banner.ativo ? 'Ativo' : 'Inativo'}
                </div>
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {banner.label && (
                  <div style={{ color: '#E2231A', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {banner.label}
                  </div>
                )}
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{banner.titulo || 'Sem Título'}</div>
                <p style={{ color: '#666', fontSize: '13px', marginTop: '6px', lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                  {banner.subtitulo || 'Sem descrição'}
                </p>
                <div style={{ color: '#444', fontSize: '11px', marginTop: '8px' }}>Ordem: {banner.ordem}</div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <Link href={`/admin/banners/${banner.id}`} style={{
                    flex: 1, textAlign: 'center',
                    padding: '8px', background: '#222',
                    border: '1px solid #333', borderRadius: '6px',
                    color: '#aaa', fontSize: '13px', textDecoration: 'none',
                  }}>
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(banner.id, banner.titulo)}
                    disabled={deleting === banner.id}
                    style={{
                      padding: '8px 12px',
                      background: 'transparent', border: '1px solid #333',
                      borderRadius: '6px', color: '#cc4444',
                      fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    {deleting === banner.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
