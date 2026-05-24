'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { adminMotos, adminMeta } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import {
  Star, RefreshCw, Trash2, Camera, Check, ArrowLeft,
  Save, Info, Image as ImageIcon, LayoutIcon, Settings,
  MapPin, Hash, Sparkles
} from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminBadge } from '@/components/admin/AdminBadge';

const isNova = (id: string) => id === 'nova';

const MARCAS = ['SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO'];
const TIPOS = ['SPORT', 'NAKED', 'ADVENTURE', 'SCOOTER', 'TRAIL', 'STREET', 'CROSSOVER', 'CUSTOM', 'TOURING'];
const STATUS_OPTS = ['DISPONIVEL', 'RESERVADA', 'VENDIDA', 'ALUGUEL'];
const CONDICOES = ['NOVA', 'SEMINOVA'];
const COMBUSTIVEIS = ['GASOLINA', 'ETANOL', 'FLEX', 'ELETRICO'];
const TRANSMISSOES = ['MANUAL', 'AUTOMATICA', 'SEMI_AUTOMATICA'];

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
  const [loadingAi, setLoadingAi] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (nova) return;
    try {
      const data = await adminMotos.list({ limit: 1000 });
      const found = data.data.find((m) => m.id === id);
      if (found) {
        setMoto(found);
        setFotos(found.fotos || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id, nova]);

  useEffect(() => { load(); }, [load]);

  function set(key: string, value: any) {
    setMoto((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAiFill() {
    if (!moto.marca || !moto.nome) {
      setMsg({ type: 'err', text: 'Preencha a Marca e o Nome da moto primeiro.' });
      return;
    }
    
    setLoadingAi(true);
    setMsg(null);
    try {
      const res = await adminMotos.generateSpecs(moto.marca, moto.nome);
      if (res.data) {
        setMoto(prev => ({
          ...prev,
          specs: {
            ...(prev.specs as any || {}),
            ...res.data
          }
        }));
        setMsg({ type: 'ok', text: 'Especificações preenchidas com sucesso pela Inteligência Artificial!' });
      }
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message || 'Falha ao buscar dados na IA' });
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const {
        id: _id,
        slug: _slug,
        metaProductId: _meta,
        createdAt: _created,
        updatedAt: _updated,
        fotos: _f,
        ...dataToSave
      } = moto as any;

      if (nova) {
        const created = await adminMotos.create(dataToSave);
        setMsg({ type: 'ok', text: 'Moto criada com sucesso!' });
        router.replace(`/admin/motos/${created.id}`);
      } else {
        await adminMotos.update(id, dataToSave);
        setMsg({ type: 'ok', text: 'Alterações salvas com sucesso!' });
        load();
      }
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
      window.scrollTo(0, 0);
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
      setMsg({ type: 'ok', text: 'Fotos enviadas com sucesso!' });
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFoto(fotoId: string) {
    if (!confirm('Deseja realmente excluir esta foto?')) return;
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
      setMsg({ type: 'ok', text: `Sincronização Meta concluída: ${res.vehicle?.message || 'OK'}` });
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSyncing(false);
      window.scrollTo(0, 0);
    }
  }

  async function handleUploadCapa(files: FileList | null) {
    if (!files || files.length === 0 || nova) return;
    setUploading(true);
    try {
      const updatedMoto = await adminMotos.uploadCapa(id, files[0]);
      setMoto((prev) => ({ ...prev, capaUrl: updatedMoto.capaUrl }));
      setMsg({ type: 'ok', text: 'Imagem de capa atualizada!' });
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteCapa() {
    if (!confirm('Deseja remover a imagem de capa?')) return;
    try {
      await adminMotos.deleteCapa(id);
      setMoto((prev) => ({ ...prev, capaUrl: null }));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleUploadLogo(files: FileList | null) {
    if (!files || files.length === 0 || nova) return;
    setUploading(true);
    try {
      const updatedMoto = await adminMotos.uploadLogo(id, files[0]);
      setMoto((prev) => ({ ...prev, logoUrl: updatedMoto.logoUrl }));
      setMsg({ type: 'ok', text: 'Logomarca atualizada!' });
    } catch (err: any) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteLogo() {
    if (!confirm('Deseja remover a logomarca?')) return;
    try {
      await adminMotos.deleteLogo(id);
      setMoto((prev) => ({ ...prev, logoUrl: null }));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleUpdateCor(fotoId: string, corHex: string) {
    try {
      await adminMotos.updateFoto(id, fotoId, { corHex });
      setFotos((prev) => prev.map((f) => (f.id === fotoId ? { ...f, corHex } : f)));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <form onSubmit={handleSave} style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '20px' }}>
        <div>
          <button
            type="button"
            onClick={() => router.push('/admin/motos')}
            style={{
              background: 'none', border: 'none', color: '#999',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              padding: 0, marginBottom: '8px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <ArrowLeft size={14} /> Voltar para a lista
          </button>
          <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            {nova ? 'Nova Motocicleta' : (moto.nome || 'Editar Moto')}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {!nova && (
            <AdminButton
              type="button"
              onClick={handleSync}
              disabled={syncing}
              variant="secondary"
              style={{ background: '#fff' }}
            >
              {syncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Sync Meta
            </AdminButton>
          )}
          <AdminButton type="submit" loading={saving} style={{ minWidth: '140px' }}>
            <Save size={18} /> {nova ? 'Adicionar Moto' : 'Salvar Alterações'}
          </AdminButton>
        </div>
      </div>

      {/* Notifications */}
      {msg && (
        <div style={{
          background: msg.type === 'ok' ? '#ecfdf5' : '#fff1f2',
          border: `1px solid ${msg.type === 'ok' ? '#10b98133' : '#e11d4833'}`,
          borderRadius: '12px', padding: '16px 20px',
          color: msg.type === 'ok' ? '#059669' : '#e11d48',
          fontSize: '14px', fontWeight: 600, marginBottom: '32px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          {msg.type === 'ok' ? <Check size={18} /> : <Info size={18} />}
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '32px', alignItems: 'start' }}>
        {/* Left: Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <AdminCard title="Informações do Modelo">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <AdminInput label="Nome da Moto *" value={moto.nome || ''} onChange={e => set('nome', e.target.value)} placeholder="Ex: GSX-S1000" required />
              <AdminInput label="Slogan curto (Opcional)" value={moto.slogan || ''} onChange={e => set('slogan', e.target.value)} placeholder="Ex: A força bruta na estrada" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginTop: '4px' }}>
              <AdminSelect label="Marca *" value={moto.marca || 'SUZUKI'} onChange={e => set('marca', e.target.value)} required>
                {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
              </AdminSelect>
              <AdminSelect label="Tipo / Categoria *" value={moto.tipo || 'NAKED'} onChange={e => set('tipo', e.target.value)} required>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </AdminSelect>
              <AdminSelect label="Condição *" value={(moto as any).condicao || 'NOVA'} onChange={e => set('condicao', e.target.value)}>
                {CONDICOES.map(c => <option key={c} value={c}>{c}</option>)}
              </AdminSelect>
              <AdminSelect label="Situação Atual" value={moto.status || 'DISPONIVEL'} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </AdminSelect>
            </div>

            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
                Descrição Detalhada (Site)
              </label>
              <RichTextEditor
                value={moto.descricao || ''}
                onChange={(html: string) => set('descricao', html)}
                placeholder="Fale sobre a moto, performance, história..."
              />
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
                Diferenciais Técnicos (Modal)
              </label>
              <RichTextEditor
                value={moto.diferenciais || ''}
                onChange={(html: string) => set('diferenciais', html)}
                placeholder="Liste diferenciais rápidos: Freios ABS, Quickshifter, Controle de Tração..."
              />
            </div>
          </AdminCard>

          <AdminCard title="Especificações para Catálogos">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <AdminInput label="Ano *" type="number" value={moto.ano || ''} onChange={e => set('ano', Number(e.target.value))} required />
              <AdminInput label="Quilometragem (KM) *" type="number" value={moto.km ?? ''} onChange={e => set('km', Number(e.target.value))} required />
              <AdminInput label="Cor Predominante" value={moto.cor || ''} onChange={e => set('cor', e.target.value)} placeholder="Ex: Azul Metálico" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '4px' }}>
              <AdminSelect label="Combustível" value={moto.combustivel || 'GASOLINA'} onChange={e => set('combustivel', e.target.value)}>
                {COMBUSTIVEIS.map(c => <option key={c} value={c}>{c}</option>)}
              </AdminSelect>
              <AdminSelect label="Transmissão" value={moto.transmissao || 'MANUAL'} onChange={e => set('transmissao', e.target.value)}>
                {TRANSMISSOES.map(t => <option key={t} value={t}>{t}</option>)}
              </AdminSelect>
              <AdminInput label="Nº Chassi (Opcional)" value={moto.vin || ''} onChange={e => set('vin', e.target.value)} />
            </div>
          </AdminCard>

          <AdminCard title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Especificações Técnicas</span>
              <button 
                type="button" 
                onClick={handleAiFill} 
                disabled={loadingAi || !moto.marca || !moto.nome}
                style={{ 
                  background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: (loadingAi || !moto.marca || !moto.nome) ? 'not-allowed' : 'pointer',
                  opacity: (loadingAi || !moto.marca || !moto.nome) ? 0.6 : 1
                }}
              >
                {loadingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loadingAi ? 'Buscando...' : 'Preencher com IA'}
              </button>
            </div>
          }>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', marginTop: 0 }}>
              Preencha as especificações que serão exibidas na página da moto. Deixe em branco os campos não aplicáveis.
            </p>

            {/* Motor */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Motor</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <AdminInput label="Tipo de Motor" value={(moto.specs as any)?.motor || ''} onChange={e => set('specs', { ...moto.specs, motor: e.target.value })} placeholder="Ex: Monocilíndrico DOHC" />
              <AdminInput label="Cilindrada" value={(moto.specs as any)?.cilindrada || ''} onChange={e => set('specs', { ...moto.specs, cilindrada: e.target.value })} placeholder="Ex: 776 cm³" />
              <AdminInput label="Refrigeração" value={(moto.specs as any)?.refrigeracao || ''} onChange={e => set('specs', { ...moto.specs, refrigeracao: e.target.value })} placeholder="Ex: Refrigerada a líquido" />
              <AdminInput label="Alimentação" value={(moto.specs as any)?.alimentacao || ''} onChange={e => set('specs', { ...moto.specs, alimentacao: e.target.value })} placeholder="Ex: Injeção eletrônica" />
              <AdminInput label="Relação de Compressão" value={(moto.specs as any)?.relacaoCompressao || ''} onChange={e => set('specs', { ...moto.specs, relacaoCompressao: e.target.value })} placeholder="Ex: 12,5:1" />
            </div>

            {/* Desempenho */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Desempenho</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <AdminInput label="Potência Máxima" value={(moto.specs as any)?.potencia || ''} onChange={e => set('specs', { ...moto.specs, potencia: e.target.value })} placeholder="Ex: 83 cv" />
              <AdminInput label="Rotação (Potência)" value={(moto.specs as any)?.potenciaRpm || ''} onChange={e => set('specs', { ...moto.specs, potenciaRpm: e.target.value })} placeholder="Ex: 8.500 rpm" />
              <AdminInput label="Torque Máximo" value={(moto.specs as any)?.torque || ''} onChange={e => set('specs', { ...moto.specs, torque: e.target.value })} placeholder="Ex: 78 Nm" />
              <AdminInput label="Rotação (Torque)" value={(moto.specs as any)?.torqueRpm || ''} onChange={e => set('specs', { ...moto.specs, torqueRpm: e.target.value })} placeholder="Ex: 6.500 rpm" />
            </div>

            {/* Trem de força */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Trem de Força</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <AdminInput label="Partida" value={(moto.specs as any)?.partida || ''} onChange={e => set('specs', { ...moto.specs, partida: e.target.value })} placeholder="Ex: Elétrica" />
              <AdminInput label="Embreagem" value={(moto.specs as any)?.embreagem || ''} onChange={e => set('specs', { ...moto.specs, embreagem: e.target.value })} placeholder="Ex: Multidiscos em banho de óleo" />
              <AdminInput label="Câmbio" value={(moto.specs as any)?.cambio || ''} onChange={e => set('specs', { ...moto.specs, cambio: e.target.value })} placeholder="Ex: 6 velocidades" />
            </div>

            {/* Dimensões */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Dimensões e Pesos</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <AdminInput label="Comprimento" value={(moto.specs as any)?.comprimento || ''} onChange={e => set('specs', { ...moto.specs, comprimento: e.target.value })} placeholder="Ex: 2.055 mm" />
              <AdminInput label="Largura" value={(moto.specs as any)?.largura || ''} onChange={e => set('specs', { ...moto.specs, largura: e.target.value })} placeholder="Ex: 810 mm" />
              <AdminInput label="Altura" value={(moto.specs as any)?.altura || ''} onChange={e => set('specs', { ...moto.specs, altura: e.target.value })} placeholder="Ex: 1.150 mm" />
              <AdminInput label="Distância entre Eixos" value={(moto.specs as any)?.distanciaEntreEixos || ''} onChange={e => set('specs', { ...moto.specs, distanciaEntreEixos: e.target.value })} placeholder="Ex: 1.455 mm" />
              <AdminInput label="Altura do Assento" value={(moto.specs as any)?.alturaAssento || ''} onChange={e => set('specs', { ...moto.specs, alturaAssento: e.target.value })} placeholder="Ex: 790 mm" />
              <AdminInput label="Peso" value={(moto.specs as any)?.peso || ''} onChange={e => set('specs', { ...moto.specs, peso: e.target.value })} placeholder="Ex: 193 kg" />
            </div>

            {/* Fluidos */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Fluidos</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <AdminInput label="Capacidade do Tanque" value={(moto.specs as any)?.tanque || ''} onChange={e => set('specs', { ...moto.specs, tanque: e.target.value })} placeholder="Ex: 20 L" />
              <AdminInput label="Capacidade de Óleo" value={(moto.specs as any)?.capacidadeOleo || ''} onChange={e => set('specs', { ...moto.specs, capacidadeOleo: e.target.value })} placeholder="Ex: 3,5 L" />
            </div>

            {/* Suspensão */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Suspensão</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <AdminInput label="Suspensão Dianteira" value={(moto.specs as any)?.suspensaoD || ''} onChange={e => set('specs', { ...moto.specs, suspensaoD: e.target.value })} placeholder="Ex: Telescópica invertida Ø 41 mm" />
              <AdminInput label="Suspensão Traseira" value={(moto.specs as any)?.suspensaoT || ''} onChange={e => set('specs', { ...moto.specs, suspensaoT: e.target.value })} placeholder="Ex: Monoamortecedor, curso 130 mm" />
            </div>

            {/* Freios e Pneus */}
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#E2231A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Freios e Pneus</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <AdminInput label="Freio Dianteiro" value={(moto.specs as any)?.freioD || ''} onChange={e => set('specs', { ...moto.specs, freioD: e.target.value })} placeholder="Ex: Disco duplo Ø 310 mm com ABS" />
              <AdminInput label="Freio Traseiro" value={(moto.specs as any)?.freioT || ''} onChange={e => set('specs', { ...moto.specs, freioT: e.target.value })} placeholder="Ex: Disco Ø 240 mm com ABS" />
              <AdminInput label="Pneu Dianteiro" value={(moto.specs as any)?.pneuDianteiro || ''} onChange={e => set('specs', { ...moto.specs, pneuDianteiro: e.target.value })} placeholder="Ex: 120/70-ZR17" />
              <AdminInput label="Pneu Traseiro" value={(moto.specs as any)?.pneuTraseiro || ''} onChange={e => set('specs', { ...moto.specs, pneuTraseiro: e.target.value })} placeholder="Ex: 180/55-ZR17" />
            </div>
          </AdminCard>

          {/* Media Section */}
          {!nova && (
            <>
              <AdminCard title="Imagens da Moto">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  {/* Capa */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>Hero Banner (Topo da Página)</label>
                    {moto.capaUrl ? (
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '160px', border: '1px solid #f0f0f0' }}>
                        <Image src={moto.capaUrl} alt="Capa" fill style={{ objectFit: 'cover' }} />
                        <button type="button" onClick={handleDeleteCapa} style={{
                          position: 'absolute', bottom: '10px', right: '10px',
                          padding: '6px 12px', background: 'rgba(225, 29, 72, 0.9)', color: '#fff',
                          border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                        }}>Remover</button>
                      </div>
                    ) : (
                      <div style={{
                        height: '160px', border: '2px dashed #f0f0f0', borderRadius: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
                      }}>
                        <ImageIcon size={24} color="#ccc" />
                        <AdminButton variant="secondary" size="sm" type="button" onClick={() => (document.getElementById('capa-input') as any).click()}>
                          Enviar Capa
                        </AdminButton>
                        <input id="capa-input" type="file" hidden accept="image/*" onChange={e => handleUploadCapa(e.target.files)} />
                      </div>
                    )}
                  </div>

                  {/* Logo */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>Logomarca / Modelo</label>
                    {moto.logoUrl ? (
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '160px', background: '#333', border: '1px solid #444' }}>
                        <Image src={moto.logoUrl} alt="Logo" fill style={{ objectFit: 'contain', padding: '20px' }} />
                        <button type="button" onClick={handleDeleteLogo} style={{
                          position: 'absolute', bottom: '10px', right: '10px',
                          padding: '6px 12px', background: 'rgba(225, 29, 72, 0.9)', color: '#fff',
                          border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                        }}>Remover</button>
                      </div>
                    ) : (
                      <div style={{
                        height: '160px', border: '2px dashed #f0f0f0', borderRadius: '12px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
                      }}>
                        <LayoutIcon size={24} color="#ccc" />
                        <AdminButton variant="secondary" size="sm" type="button" onClick={() => (document.getElementById('logo-input') as any).click()}>
                          Enviar Logo
                        </AdminButton>
                        <input id="logo-input" type="file" hidden accept="image/*" onChange={e => handleUploadLogo(e.target.files)} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Galeria */}
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '16px' }}>Galeria de Fotos ({fotos.length})</label>

                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
                    style={{
                      height: '100px', border: '2px dashed #f0f0f0', borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                      cursor: 'pointer', transition: 'all 0.2s', marginBottom: '24px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#E2231A'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#f0f0f0'}
                  >
                    <Camera size={20} color="#999" />
                    <span style={{ color: '#999', fontSize: '14px', fontWeight: 600 }}>Arraste fotos ou clique para enviar</span>
                  </div>
                  <input ref={fileRef} type="file" multiple hidden accept="image/*" onChange={e => handleUpload(e.target.files)} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                    {fotos.map(foto => (
                      <div key={foto.id} style={{
                        borderRadius: '12px', overflow: 'hidden', border: foto.principal ? '2px solid #E2231A' : '1px solid #eee',
                        position: 'relative'
                      }}>
                        <div style={{ height: '120px', position: 'relative' }}>
                          <Image src={foto.url} alt="foto" fill style={{ objectFit: 'cover' }} />
                          {foto.principal && (
                            <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#E2231A', color: '#fff', borderRadius: '6px', padding: '3px 6px', fontSize: '10px', fontWeight: 800 }}>CAPA</div>
                          )}
                        </div>
                        <div style={{ padding: '8px', display: 'flex', gap: '4px' }}>
                          <AdminButton variant="secondary" size="sm" type="button" title="Principal" onClick={() => handleSetPrincipal(foto.id)} style={{ flex: 1, padding: '6px' }}>
                            <Star size={14} fill={foto.principal ? '#f39c12' : 'none'} color={foto.principal ? '#f39c12' : '#999'} />
                          </AdminButton>
                          <input
                            type="color"
                            value={foto.corHex || '#ffffff'}
                            onChange={(e) => handleUpdateCor(foto.id, e.target.value)}
                            style={{ width: '30px', height: '30px', padding: '0', border: '1px solid #eee', borderRadius: '6px', cursor: 'pointer' }}
                          />
                          <AdminButton variant="danger" size="sm" type="button" onClick={() => handleDeleteFoto(foto.id)} style={{ padding: '6px' }}>
                            <Trash2 size={14} />
                          </AdminButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            </>
          )}
        </div>

        {/* Right: Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>

          <AdminCard title="Visibilidade e Preço">
            <AdminInput label="Preço de Venda (R$)" type="number" step="0.01" value={moto.preco ?? ''} onChange={e => set('preco', e.target.value ? Number(e.target.value) : null)} placeholder="0.00" />

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px', background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px',
              marginTop: '8px'
            }}>
              <input
                type="checkbox"
                id="chk-destaque"
                checked={!!moto.destaque}
                onChange={e => set('destaque', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#E2231A', cursor: 'pointer' }}
              />
              <label htmlFor="chk-destaque" style={{ color: '#111', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Destaque na Homepage
              </label>
            </div>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '10px', lineHeight: '1.4' }}>
              Motos em destaque ganham prioridade na primeira página do site público.
            </p>
          </AdminCard>

          {!nova && (
            <AdminCard title="Sistema">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#999' }}>Status:</span>
                  <AdminBadge color={STATUS_LABEL[moto.status!]?.color || '#888'}>
                    {STATUS_LABEL[moto.status!]?.label || moto.status}
                  </AdminBadge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#999', fontSize: '13px' }}>Slug / URL:</span>
                  <code style={{ background: '#f5f5f5', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', color: '#666' }}>
                    {moto.slug || '—'}
                  </code>
                </div>
                {moto.metaProductId && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <span style={{ color: '#999', fontSize: '13px' }}>Meta Product ID:</span>
                    <code style={{ background: '#f0f4ff', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', color: '#4f8ef7' }}>
                      {moto.metaProductId}
                    </code>
                  </div>
                )}
              </div>
            </AdminCard>
          )}

          {nova && (
            <div style={{
              padding: '20px', background: '#fff9db', border: '1px solid #ffec99',
              borderRadius: '16px', color: '#856404', fontSize: '13px', lineHeight: '1.5'
            }}>
              <strong>Dica:</strong> Salve as informações principais primeiro. Após a criação, você poderá enviar fotos e sincronizar com o Instagram.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  DISPONIVEL: { label: 'Disponível', color: '#2ecc71' },
  RESERVADA: { label: 'Reservada', color: '#f39c12' },
  VENDIDA: { label: 'Vendida', color: '#888' },
  ALUGUEL: { label: 'Aluguel', color: '#4f8ef7' },
};
