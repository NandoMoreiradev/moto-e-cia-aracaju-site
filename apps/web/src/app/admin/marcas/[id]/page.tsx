'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminMarcas } from '@/lib/api';
import type { MarcaDto } from '@moto-e-cia/shared';
import toast from 'react-hot-toast';

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

  if (loading) return <div style={{ color: '#555', padding: '32px' }}>Carregando...</div>;

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/marcas" style={{ color: '#555', fontSize: '13px', textDecoration: 'none' }}>← Voltar para listagem</Link>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: '8px 0 0' }}>
          {isNew ? 'Nova Marca' : 'Editar Marca'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Nome da Marca</label>
            <input 
              required
              placeholder="Ex: SUZUKI, HAOJUE"
              value={form.nome} 
              onChange={e => setForm({...form, nome: e.target.value})}
              style={{ padding: '10px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Ordem</label>
              <input 
                type="number"
                value={form.ordem} 
                onChange={e => setForm({...form, ordem: parseInt(e.target.value) || 0})}
                style={{ padding: '10px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
              <label style={{ color: '#ddd', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={form.ativa} 
                  onChange={e => setForm({...form, ativa: e.target.checked})}
                />
                Ativa (visível no site)
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Logotipo</label>
            <div style={{ 
              height: '120px', background: '#111', border: '2px dashed #333', borderRadius: '12px',
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px'
            }}>
              {preview ? (
                <img src={preview} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Preview" />
              ) : (
                 <div style={{ color: '#333', fontSize: '24px' }}>🏷️</div>
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
            <p style={{ color: '#444', fontSize: '11px' }}>Dica: Use imagens em PNG com fundo transparente para melhor resultado.</p>
          </div>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
            {saving ? 'Gravando...' : 'Salvar Marca'}
          </button>
        </div>
      </form>
    </div>
  );
}
