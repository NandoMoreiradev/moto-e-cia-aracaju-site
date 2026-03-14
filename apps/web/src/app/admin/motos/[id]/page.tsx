'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { adminMotos, adminMeta } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';

const isNova = (id: string) => id === 'nova';

const MARCAS = ['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO', 'SEMINOVA'];
const TIPOS = ['SPORT', 'NAKED', 'ADVENTURE', 'SCOOTER', 'TRAIL'];
const STATUS_OPTS = ['DISPONIVEL', 'RESERVADA', 'VENDIDA', 'ALUGUEL'];
const COMBUSTIVEIS = ['GASOLINA', 'ETANOL', 'FLEX', 'ELETRICO'];
const TRANSMISSOES = ['MANUAL', 'AUTOMATICA', 'SEMI_AUTOMATICA'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#1a1a1a', border: '1px solid #2a2a2a',
  borderRadius: '8px', color: '#fff', fontSize: '14px',
  boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  color: '#888', fontSize: '12px', display: 'block', marginBottom: '5px',
};
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0' };

export default function AdminMotoEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const nova = isNova(id);

  const [moto, setMoto] = useState<Partial<MotoDto>>({
    marca: 'SUZUKI' as any,
    tipo: 'NAKED' as any,
    status: 'DISPONIVEL' as any,
    combustivel: 'GASOLINA' as any,
    transmissao: 'MANUAL' as any,
    destaque: false,
    km: 0,
    ano: new Date().getFullYear(),
  });
  const [fotos, setFotos] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (nova) return;
    const data = await adminMotos.list({ limit: 200 });
    const found = data.data.find((m) => m.id === id);
    if (found) {
      setMoto(found);
      setFotos(found.fotos || []);
    }
  }, [id, nova]);

  useEffect(() => { load(); }, [load]);

  function set(key: string, value: any) {
    setMoto((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      if (nova) {
        const created = await adminMotos.create(moto);
        setMsg({ type: 'ok', text: 'Moto criada com sucesso!' });
        router.replace(`/admin/motos/${created.id}`);
      } else {
        await adminMotos.update(id, moto);
        setMsg({ type: 'ok', text: 'Alterações salvas!' });
        load();
      }
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || nova) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const foto = await adminMotos.uploadFoto(id, file);
        setFotos((prev) => [...prev, foto]);
      }
      setMsg({ type: 'ok', text: 'Foto(s) enviada(s)!' });
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFoto(fotoId: string) {
    if (!confirm('Remover esta foto?')) return;
    try {
      await adminMotos.deleteFoto(id, fotoId);
      setFotos((prev) => prev.filter((f) => f.id !== fotoId));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleSetPrincipal(fotoId: string) {
    try {
      await adminMotos.setFotoPrincipal(id, fotoId);
      setFotos((prev) => prev.map((f) => ({ ...f, principal: f.id === fotoId })));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setMsg(null);
    try {
      const res = await adminMeta.syncMoto(id);
      setMsg({ type: 'ok', text: `Meta sync: ${res.vehicle?.message} | ${res.product?.message}` });
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <form onSubmit={handleSave}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>
            {nova ? 'Nova Moto' : (moto.nome || 'Editar Moto')}
          </h1>
          <button type="button" onClick={() => router.push('/admin/motos')} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '13px', padding: 0, marginTop: '4px' }}>
            ← Voltar para Motos
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!nova && (
            <button type="button" onClick={handleSync} disabled={syncing} style={{
              padding: '10px 16px', background: '#1a3a6b', border: '1px solid #1e4d9a',
              borderRadius: '8px', color: '#6fa3f7', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>
              {syncing ? 'Sincronizando...' : '📘 Sync Meta'}
            </button>
          )}
          <button type="submit" disabled={saving} style={{
            padding: '10px 24px', background: '#E2231A', border: 'none',
            borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}>
            {saving ? 'Salvando...' : nova ? 'Criar Moto' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {msg && (
        <div style={{
          background: msg.type === 'ok' ? 'rgba(46,204,113,0.12)' : 'rgba(226,35,26,0.12)',
          border: `1px solid ${msg.type === 'ok' ? 'rgba(46,204,113,0.3)' : 'rgba(226,35,26,0.3)'}`,
          borderRadius: '8px', padding: '12px 16px', color: msg.type === 'ok' ? '#2ecc71' : '#ff6b6b',
          fontSize: '14px', marginBottom: '20px',
        }}>{msg.text}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Left column — main fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Informações Básicas">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nome / Modelo *</label>
                <input style={inputStyle} value={moto.nome || ''} onChange={e => set('nome', e.target.value)} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Marca *</label>
                <select style={inputStyle} value={moto.marca || ''} onChange={e => set('marca', e.target.value)} required>
                  {MARCAS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tipo *</label>
                <select style={inputStyle} value={moto.tipo || ''} onChange={e => set('tipo', e.target.value)} required>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={moto.status || ''} onChange={e => set('status', e.target.value)}>
                  {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={labelStyle}>Descrição</label>
              <textarea
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                value={moto.descricao || ''}
                onChange={e => set('descricao', e.target.value)}
              />
            </div>
          </Card>

          {/* Campos obrigatórios Meta */}
          <Card title="📘 Dados para Instagram / Meta Catalog">
            <p style={{ color: '#555', fontSize: '12px', marginTop: 0, marginBottom: '16px' }}>
              Campos obrigatórios para sincronização com o Catálogo de Veículos e Catálogo de Produtos do Meta.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Ano de Fabricação *</label>
                <input type="number" style={inputStyle} value={moto.ano ?? ''} onChange={e => set('ano', Number(e.target.value))} min={2000} max={2030} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Quilometragem *</label>
                <input type="number" style={inputStyle} value={moto.km ?? ''} onChange={e => set('km', Number(e.target.value))} min={0} placeholder="0 = zero km" required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cor</label>
                <input style={inputStyle} value={moto.cor || ''} onChange={e => set('cor', e.target.value)} placeholder="Ex: Vermelho Triton" />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Combustível</label>
                <select style={inputStyle} value={moto.combustivel || 'GASOLINA'} onChange={e => set('combustivel', e.target.value)}>
                  {COMBUSTIVEIS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Transmissão</label>
                <select style={inputStyle} value={moto.transmissao || 'MANUAL'} onChange={e => set('transmissao', e.target.value)}>
                  {TRANSMISSOES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>VIN / Chassi</label>
                <input style={inputStyle} value={moto.vin || ''} onChange={e => set('vin', e.target.value)} placeholder="Nº do chassi" />
              </div>
            </div>
          </Card>

          {/* Fotos */}
          {!nova && (
            <Card title={`📷 Fotos (${fotos.length})`}>
              {/* Upload zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
                style={{
                  border: '2px dashed #2a2a2a', borderRadius: '8px',
                  padding: '24px', textAlign: 'center', cursor: 'pointer',
                  color: '#555', fontSize: '14px', marginBottom: '16px',
                  transition: 'border-color 0.2s',
                }}
              >
                {uploading ? '⏳ Enviando...' : '📁 Clique ou arraste fotos aqui'}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => handleUpload(e.target.files)} />

              {/* Grid de fotos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {fotos.map(foto => (
                  <div key={foto.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: foto.principal ? '2px solid #E2231A' : '2px solid #222' }}>
                    <div style={{ height: '120px', position: 'relative' }}>
                      <Image src={foto.url} alt="foto" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '6px', background: '#111', display: 'flex', gap: '4px' }}>
                      {!foto.principal && (
                        <button type="button" onClick={() => handleSetPrincipal(foto.id)} title="Definir como principal" style={{
                          flex: 1, padding: '3px', background: '#1a1a1a', border: '1px solid #333',
                          borderRadius: '4px', color: '#888', fontSize: '11px', cursor: 'pointer',
                        }}>⭐</button>
                      )}
                      {foto.principal && (
                        <span style={{ flex: 1, textAlign: 'center', color: '#E2231A', fontSize: '11px', padding: '3px' }}>Principal</span>
                      )}
                      <button type="button" onClick={() => handleDeleteFoto(foto.id)} style={{
                        padding: '3px 6px', background: 'transparent', border: '1px solid #330000',
                        borderRadius: '4px', color: '#cc4444', fontSize: '11px', cursor: 'pointer',
                      }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
              {fotos.length === 0 && <p style={{ color: '#444', fontSize: '13px', marginTop: '8px' }}>Nenhuma foto ainda.</p>}
            </Card>
          )}
          {nova && (
            <div style={{ background: '#161616', borderRadius: '12px', padding: '16px', color: '#555', fontSize: '13px' }}>
              💡 Salve a moto primeiro para depois adicionar as fotos.
            </div>
          )}
        </div>

        {/* Right column — price, destaque, slug */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Preço e Destaque">
            <div style={fieldStyle}>
              <label style={labelStyle}>Preço (R$)</label>
              <input type="number" style={inputStyle} value={moto.preco ?? ''} onChange={e => set('preco', e.target.value ? Number(e.target.value) : null)} min={0} step={0.01} placeholder="Ex: 49900.00" />
            </div>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="destaque" checked={!!moto.destaque} onChange={e => set('destaque', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#E2231A' }} />
              <label htmlFor="destaque" style={{ color: '#aaa', fontSize: '14px', cursor: 'pointer' }}>
                ⭐ Moto em Destaque
              </label>
            </div>
            <p style={{ color: '#444', fontSize: '12px', marginTop: '6px' }}>Motos em destaque aparecem na homepage.</p>
          </Card>

          {!nova && (
            <Card title="Slug / URL">
              <div style={fieldStyle}>
                <label style={labelStyle}>Slug</label>
                <input style={{ ...inputStyle, color: '#555' }} value={moto.slug || ''} readOnly />
              </div>
              <p style={{ color: '#444', fontSize: '12px', marginTop: '6px' }}>
                URL: /motos/<span style={{ color: '#666' }}>{moto.slug}</span>
              </p>
            </Card>
          )}

          {!nova && moto.metaProductId && (
            <Card title="Meta Commerce">
              <p style={{ color: '#555', fontSize: '12px', margin: 0 }}>
                ID no catálogo de veículos:<br />
                <code style={{ color: '#6fa3f7', fontSize: '11px' }}>{moto.metaProductId}</code>
              </p>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 16px 0' }}>{title}</h3>
      {children}
    </div>
  );
}
