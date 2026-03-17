'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminBanners } from '@/lib/api';
import type { BannerDto } from '@moto-e-cia/shared';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, Image as ImageIcon, Layout, Type, Link as LinkIcon, Hash, CheckCircle2 } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminTextarea } from '@/components/admin/AdminTextarea';

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

  if (loading) return (
    <div style={{ color: '#999', textAlign: 'center', padding: '100px 0' }}>
      <div className="animate-spin mb-4" style={{ display: 'inline-block' }}>⌛</div>
      <div>Carregando dados do banner...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <button 
          onClick={() => router.back()}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'none', border: 'none', color: '#666', 
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            padding: 0, marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} /> Voltar para Banners
        </button>
        <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          {isNew ? 'Novo Banner' : 'Editar Banner'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AdminCard title="Conteúdo Textual">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <AdminInput 
                  label="Etiqueta Superior (opcional)"
                  placeholder="Ex: PERFORMANCE PURA"
                  value={form.label} 
                  onChange={e => setForm({...form, label: e.target.value})}
                  icon={<Type size={16} />}
                />
                
                <AdminInput 
                  label="Título Principal"
                  placeholder="Ex: Nova Suzuki Hayabusa 2024"
                  value={form.titulo} 
                  onChange={e => setForm({...form, titulo: e.target.value})}
                  required
                />

                <AdminTextarea 
                  label="Subtítulo / Descrição Curta"
                  placeholder="Descreva brevemente o destaque deste slide..."
                  value={form.subtitulo} 
                  onChange={e => setForm({...form, subtitulo: e.target.value})}
                  rows={4}
                />
              </div>
            </AdminCard>

            <AdminCard title="Redirecionamento">
              <AdminInput 
                label="URL de Destino (Link)"
                placeholder="Ex: /motos/suzuki-gsx ou https://wa.me/..."
                value={form.link} 
                onChange={e => setForm({...form, link: e.target.value})}
                icon={<LinkIcon size={16} />}
              />
            </AdminCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AdminCard title="Imagem & Visibilidade">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ 
                  aspectRatio: '16/9', background: '#f8f9fa', border: '2px dashed #eee', borderRadius: '16px',
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  overflow: 'hidden', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                }}>
                  {preview ? (
                    <>
                      <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                      <button 
                        type="button"
                        onClick={() => { setImage(null); setPreview(null); }}
                        style={{ 
                          position: 'absolute', top: '12px', right: '12px',
                          background: '#fff', border: '1px solid #eee', borderRadius: '50%',
                          width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', cursor: 'pointer', color: '#e11d48',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#ccc' }}>
                      <div style={{ background: '#fff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                        <ImageIcon size={24} color="#ddd" />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Enviar imagem do banner</span>
                    </div>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <AdminInput 
                    label="Ordem"
                    type="number"
                    icon={<Hash size={16} />}
                    value={form.ordem} 
                    onChange={e => setForm({...form, ordem: parseInt(e.target.value) || 0})}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#666', fontSize: '13px', fontWeight: 700 }}>Status</label>
                    <label style={{ 
                      display: 'flex', alignItems: 'center', gap: '10px', 
                      background: '#f8f9fa', padding: '10px 16px', borderRadius: '10px',
                      cursor: 'pointer', border: '1px solid #eee',
                      transition: 'all 0.2s',
                      color: form.ativo ? '#111' : '#999'
                    }}>
                      <input 
                        type="checkbox"
                        checked={form.ativo} 
                        onChange={e => setForm({...form, ativo: e.target.checked})}
                        style={{ width: '18px', height: '18px', accentColor: '#E2231A' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Ativo</span>
                    </label>
                  </div>
                </div>
              </div>
            </AdminCard>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AdminButton 
                type="submit" 
                loading={saving}
                style={{ width: '100%', height: '52px', fontSize: '16px' }}
              >
                <Save size={20} /> Salvar Banner
              </AdminButton>
              <AdminButton 
                type="button" 
                variant="secondary"
                onClick={() => router.back()}
                style={{ width: '100%' }}
              >
                Descartar alterações
              </AdminButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
