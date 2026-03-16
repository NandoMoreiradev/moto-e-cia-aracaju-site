'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminBanners } from '@/lib/api';
import type { BannerDto } from '@moto-e-cia/shared';
import toast from 'react-hot-toast';

export default function AdminBannerDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === 'novo';

  const [form, setForm] = useState({
    titulo: '',
    label: '',
    subtitulo: '',
    link: '',
    ordem: 0,
    ativo: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      adminBanners.list()
        .then(banners => {
          const banner = banners.find(b => b.id === id);
          if (banner) {
            setForm({
              titulo: banner.titulo || '',
              label: banner.label || '',
              subtitulo: banner.subtitulo || '',
              link: banner.link || '',
              ordem: banner.ordem,
              ativo: banner.ativo,
            });
            setPreview(banner.imageUrl);
          } else {
            toast.error('Banner não encontrado');
            router.push('/admin/banners');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let currentId = id as string;
      if (isNew) {
        const created = await adminBanners.create(form);
        currentId = created.id;
      } else {
        await adminBanners.update(currentId, form);
      }

      if (image) {
        await adminBanners.uploadImage(currentId, image);
      }

      toast.success('Salvo com sucesso!');
      router.push('/admin/banners');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: '#555', padding: '32px' }}>Carregando...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/banners" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Voltar para listagem</Link>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: '8px 0 0' }}>
          {isNew ? 'Novo Banner' : 'Editar Banner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Coluna 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Título principal</label>
              <input 
                value={form.titulo} 
                onChange={e => setForm({...form, titulo: e.target.value})}
                style={{ padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Etiqueta superior (opcional - ex: PERFORMANCE PURA)</label>
              <input 
                value={form.label} 
                onChange={e => setForm({...form, label: e.target.value})}
                style={{ padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Subtítulo / Descrição (opcional)</label>
              <textarea 
                rows={3}
                value={form.subtitulo} 
                onChange={e => setForm({...form, subtitulo: e.target.value})}
                style={{ padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', resize: 'none' }} 
              />
            </div>
          </div>

          {/* Coluna 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Link de destino (ex: /motos/suzuki-gsx)</label>
              <input 
                value={form.link} 
                onChange={e => setForm({...form, link: e.target.value})}
                style={{ padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Ordem de exibição</label>
                <input 
                  type="number"
                  value={form.ordem} 
                  onChange={e => setForm({...form, ordem: parseInt(e.target.value) || 0})}
                  style={{ padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                <label style={{ color: '#ddd', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={form.ativo} 
                    onChange={e => setForm({...form, ativo: e.target.checked})}
                  />
                  Visível no site
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Imagem de fundo (Banner)</label>
              <div style={{ 
                height: '140px', background: '#111', border: '2px dashed #333', borderRadius: '12px',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}>
                {preview ? (
                  <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                ) : (
                   <div style={{ color: '#333', fontSize: '24px' }}>🖼️</div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setImage(f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
              </div>
              <p style={{ color: '#444', fontSize: '11px' }}>Recomendado: 1920x800px (ou proporção horizontal)</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            type="button" 
            onClick={() => router.back()}
            style={{ 
              padding: '10px 24px', background: 'transparent', border: '1px solid #333', 
              borderRadius: '8px', color: '#888', cursor: 'pointer' 
            }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving}
            style={{ 
              padding: '10px 32px', background: '#E2231A', border: 'none', 
              borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Gravando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
