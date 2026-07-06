'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminLojas } from '@/lib/api';
import type { LojaFotoDto } from '@moto-e-cia/shared';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Save, Trash2, Image as ImageIcon, MapPin, Phone,
  MessageCircle, Clock, Link as LinkIcon, Hash, Loader2, UploadCloud,
} from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';

export default function AdminLojaDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === 'nova';
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: '',
    cidadeEstado: '',
    endereco: '',
    telefone: '',
    whatsapp: '',
    horario: '',
    mapUrl: '',
    ordem: 0,
    ativa: true,
  });
  const [fotos, setFotos] = useState<LojaFotoDto[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      adminLojas.list()
        .then(lojas => {
          const loja = lojas.find(l => l.id === id);
          if (loja) {
            setForm({
              nome: loja.nome,
              cidadeEstado: loja.cidadeEstado,
              endereco: loja.endereco,
              telefone: loja.telefone,
              whatsapp: loja.whatsapp,
              horario: loja.horario,
              mapUrl: loja.mapUrl || '',
              ordem: loja.ordem,
              ativa: loja.ativa,
            });
            setFotos(loja.fotos);
          } else {
            toast.error('Loja não encontrada');
            router.push('/admin/lojas');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNew) {
        const created = await adminLojas.create(form);
        toast.success('Loja criada! Agora você já pode enviar fotos dela.');
        router.push(`/admin/lojas/${created.id}`);
        router.refresh();
      } else {
        await adminLojas.update(id as string, form);
        toast.success('Loja salva com sucesso!');
        router.push('/admin/lojas');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || isNew) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const foto = await adminLojas.uploadFoto(id as string, file);
        setFotos(prev => [...prev, foto as LojaFotoDto]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar foto');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleDeleteFoto(fotoId: string) {
    if (!confirm('Deseja realmente excluir esta foto?')) return;
    try {
      await adminLojas.deleteFoto(id as string, fotoId);
      setFotos(prev => prev.filter(f => f.id !== fotoId));
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir foto');
    }
  }

  if (loading) return (
    <div style={{ color: '#999', textAlign: 'center', padding: '100px 0' }}>
      <Loader2 size={32} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
      <div>Carregando dados da loja...</div>
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
          <ArrowLeft size={16} /> Voltar para Lojas
        </button>
        <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          {isNew ? 'Nova Loja' : 'Editar Loja'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AdminCard title="Identificação">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <AdminInput
                    label="Nome (ex: Matriz, Filial)"
                    required
                    placeholder="Ex: Matriz"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                  />
                  <AdminInput
                    label="Cidade / Estado"
                    required
                    placeholder="Ex: Aracaju-SE"
                    icon={<MapPin size={16} />}
                    value={form.cidadeEstado}
                    onChange={e => setForm({ ...form, cidadeEstado: e.target.value })}
                  />
                </div>
                <AdminInput
                  label="Endereço completo"
                  required
                  placeholder="Ex: Av. Pedro Calazans, 717, Centro"
                  value={form.endereco}
                  onChange={e => setForm({ ...form, endereco: e.target.value })}
                />
                <AdminInput
                  label="Link do Google Maps (opcional)"
                  placeholder="https://maps.google.com/..."
                  icon={<LinkIcon size={16} />}
                  value={form.mapUrl}
                  onChange={e => setForm({ ...form, mapUrl: e.target.value })}
                />
              </div>
            </AdminCard>

            <AdminCard title="Contato & Horário">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <AdminInput
                    label="Telefone (exibição)"
                    required
                    placeholder="Ex: (79) 98166-4850"
                    icon={<Phone size={16} />}
                    value={form.telefone}
                    onChange={e => setForm({ ...form, telefone: e.target.value })}
                  />
                  <AdminInput
                    label="WhatsApp (somente números com DDI)"
                    required
                    placeholder="Ex: 5579981664850"
                    icon={<MessageCircle size={16} />}
                    value={form.whatsapp}
                    onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  />
                </div>
                <AdminInput
                  label="Horário de funcionamento"
                  required
                  placeholder="Ex: Seg à Sex: 08:00 às 18:00 | Sáb: 08:00 às 13:00"
                  icon={<Clock size={16} />}
                  value={form.horario}
                  onChange={e => setForm({ ...form, horario: e.target.value })}
                />
              </div>
            </AdminCard>

            <AdminCard title="Fotos da Loja">
              {isNew ? (
                <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                  Salve a loja primeiro para poder enviar fotos.
                </p>
              ) : (
                <>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: '2px dashed #eee', borderRadius: '12px', padding: '24px',
                      textAlign: 'center', cursor: 'pointer', marginBottom: '16px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    }}
                  >
                    {uploading ? (
                      <Loader2 size={24} color="#999" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <UploadCloud size={24} color="#ccc" />
                    )}
                    <span style={{ color: '#999', fontSize: '14px', fontWeight: 600 }}>
                      Arraste fotos ou clique para enviar
                    </span>
                  </div>
                  <input ref={fileRef} type="file" multiple hidden accept="image/*" onChange={e => handleUpload(e.target.files)} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {fotos.map(foto => (
                      <div key={foto.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
                        <div style={{ height: '100px', position: 'relative' }}>
                          <img src={foto.url} alt="Foto da loja" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFoto(foto.id)}
                          style={{
                            position: 'absolute', top: '6px', right: '6px',
                            background: '#fff', border: 'none', borderRadius: '50%',
                            width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#e11d48', boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {fotos.length === 0 && (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ccc', padding: '16px 0' }}>
                        <ImageIcon size={28} style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '12px' }}>Nenhuma foto enviada ainda</div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </AdminCard>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AdminCard title="Exibição">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AdminInput
                  label="Ordem"
                  type="number"
                  icon={<Hash size={16} />}
                  value={form.ordem}
                  onChange={e => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: '#666', fontSize: '13px', fontWeight: 700 }}>Status</label>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: '#f8f9fa', padding: '10px 16px', borderRadius: '10px',
                    cursor: 'pointer', border: '1px solid #eee',
                    color: form.ativa ? '#111' : '#999'
                  }}>
                    <input
                      type="checkbox"
                      checked={form.ativa}
                      onChange={e => setForm({ ...form, ativa: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#E2231A' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Loja Ativa (visível no site)</span>
                  </label>
                </div>
              </div>
            </AdminCard>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AdminButton
                type="submit"
                loading={saving}
                style={{ width: '100%', height: '52px', fontSize: '16px' }}
              >
                <Save size={20} /> {isNew ? 'Criar Loja' : 'Salvar Alterações'}
              </AdminButton>
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                style={{ width: '100%' }}
              >
                {isNew ? 'Cancelar' : 'Descartar alterações'}
              </AdminButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
