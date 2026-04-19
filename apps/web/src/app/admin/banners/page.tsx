'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { adminBanners } from '@/lib/api';
import type { BannerDto } from '@moto-e-cia/shared';
import { Plus, Edit2, Trash2, Image as ImageIcon, ExternalLink, Sliders } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';

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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Banners</h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Gerencie os slides do banner principal na homepage</p>
        </div>
        <AdminButton onClick={() => window.location.href = '/admin/banners/novo'}>
          <Plus size={18} /> Novo Banner
        </AdminButton>
      </div>

      {loading ? (
        <div style={{ color: '#999', textAlign: 'center', padding: '100px 0' }}>
          <div className="animate-spin mb-4" style={{ display: 'inline-block' }}>⌛</div>
          <div>Carregando banners...</div>
        </div>
      ) : banners.length === 0 ? (
        <AdminCard style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ background: '#f8f9fa', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ImageIcon size={32} color="#ccc" />
          </div>
          <h3 style={{ color: '#111', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Nenhum banner encontrado</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Comece criando o primeiro slide para o topo do seu site.</p>
          <AdminButton onClick={() => window.location.href = '/admin/banners/novo'} variant="secondary">
            Criar meu primeiro banner
          </AdminButton>
        </AdminCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {banners.map(banner => (
            <AdminCard key={banner.id} noPadding style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', background: '#f5f5f5', position: 'relative' }}>
                {banner.imageUrl ? (
                  <Image src={banner.imageUrl} alt={banner.titulo || 'Banner'} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                    <ImageIcon size={48} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <AdminBadge color={banner.ativo ? '#2ecc71' : '#888'}>
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </AdminBadge>
                  {banner.mobileImageUrl && (
                    <div style={{ marginLeft: '8px' }}>
                      <AdminBadge color="#3b82f6">
                        Mobile
                      </AdminBadge>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
                  <div>
                    {banner.label && (
                      <span style={{ color: '#E2231A', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>
                        {banner.label}
                      </span>
                    )}
                    <h3 style={{ color: '#111', fontSize: '18px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                      {banner.titulo || 'Sem Título'}
                    </h3>
                  </div>
                  <div style={{ 
                    background: '#f8f9fa', borderRadius: '8px', padding: '4px 8px', 
                    fontSize: '12px', fontWeight: 700, color: '#999', border: '1px solid #eee',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Sliders size={12} /> #{banner.ordem}
                  </div>
                </div>

                <p style={{ 
                  color: '#666', fontSize: '14px', margin: '0 0 20px 0', 
                  flex: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', 
                  WebkitLineClamp: 2, overflow: 'hidden', lineHeight: 1.5 
                }}>
                  {banner.subtitulo || 'Sem descrição adicional para este slide.'}
                </p>

                <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #f8f9fa' }}>
                  <AdminButton 
                    variant="secondary" 
                    size="sm" 
                    style={{ flex: 1, background: '#fff' }}
                    onClick={() => window.location.href = `/admin/banners/${banner.id}`}
                  >
                    <Edit2 size={14} /> Editar
                  </AdminButton>
                  <AdminButton 
                    variant="danger" 
                    size="sm" 
                    type="button"
                    loading={deleting === banner.id}
                    onClick={() => handleDelete(banner.id, banner.titulo)}
                    style={{ width: '42px' }}
                  >
                    {!deleting && <Trash2 size={14} />}
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
