'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminMarcas } from '@/lib/api';
import type { MarcaDto } from '@moto-e-cia/shared';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, Image as ImageIcon, Award, Hash, CheckCircle2 } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';

export default function AdminMarcaDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === 'nova';

  const [form, setForm] = useState({
    nome: '',
    ordem: 0,
    ativa: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      adminMarcas.list()
        .then(marcas => {
          const marca = marcas.find(m => m.id === id);
          if (marca) {
            setForm({
              nome: marca.nome,
              ordem: marca.ordem,
              ativa: marca.ativa,
            });
            setPreview(marca.logoUrl);
          } else {
            toast.error('Marca não encontrada');
            router.push('/admin/marcas');
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
        const created = await adminMarcas.create(form);
        currentId = created.id;
      } else {
        await adminMarcas.update(currentId, form);
      }

      if (image) {
        await adminMarcas.uploadLogo(currentId, image);
      }

      toast.success('Marca salva com sucesso!');
      router.push('/admin/marcas');
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
      <div>Carregando dados da marca...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          <ArrowLeft size={16} /> Voltar para Marcas
        </button>
        <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          {isNew ? 'Nova Marca' : 'Editar Marca'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AdminCard title="Informações Gerais">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AdminInput 
                  label="Nome da Marca"
                  required
                  placeholder="Ex: SUZUKI, HAOJUE"
                  value={form.nome} 
                  onChange={e => setForm({...form, nome: e.target.value})}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <AdminInput 
                    label="Ordem de Exibição"
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
                      color: form.ativa ? '#111' : '#999'
                    }}>
                      <input 
                        type="checkbox"
                        checked={form.ativa} 
                        onChange={e => setForm({...form, ativa: e.target.checked})}
                        style={{ width: '18px', height: '18px', accentColor: '#E2231A' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>Marca Ativa</span>
                    </label>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AdminCard title="Logotipo">
              <div style={{ 
                aspectRatio: '1', background: '#f8f9fa', border: '2px dashed #eee', borderRadius: '16px',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                overflow: 'hidden', transition: 'border-color 0.2s'
              }}>
                {preview ? (
                  <>
                    <img src={preview} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => { setImage(null); setPreview(null); }}
                      style={{ 
                        position: 'absolute', top: '12px', right: '12px',
                        background: '#fff', border: '1px solid #eee', borderRadius: '50%',
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', cursor: 'pointer', color: '#e11d48',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Clique para enviar</span>
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
              <p style={{ color: '#999', fontSize: '12px', marginTop: '16px', lineHeight: 1.5, textAlign: 'center' }}>
                Recomendado: PNG transcparente ou SVG.<br/>Tamanho ideal: 400x400px.
              </p>
            </AdminCard>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AdminButton 
                type="submit" 
                loading={saving}
                style={{ width: '100%', height: '48px', fontSize: '15px' }}
              >
                <Save size={18} /> Salvar Alterações
              </AdminButton>
              <AdminButton 
                type="button" 
                variant="secondary"
                onClick={() => router.back()}
                style={{ width: '100%' }}
              >
                Cancelar
              </AdminButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
