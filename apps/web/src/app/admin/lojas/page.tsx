'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { adminLojas } from '@/lib/api';
import type { LojaDto } from '@moto-e-cia/shared';
import { Plus, Edit2, Trash2, Store, MapPin, Phone, Loader2 } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';

export default function AdminLojasPage() {
  const [lojas, setLojas] = useState<LojaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminLojas.list();
      setLojas(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir a loja "${nome}"?`)) return;
    setDeleting(id);
    try {
      await adminLojas.delete(id);
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
          <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Lojas</h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Gerencie endereços, contatos e fotos das lojas físicas exibidas no site</p>
        </div>
        <AdminButton onClick={() => window.location.href = '/admin/lojas/nova'}>
          <Plus size={18} /> Nova Loja
        </AdminButton>
      </div>

      {loading ? (
        <div style={{ color: '#999', textAlign: 'center', padding: '100px 0' }}>
          <Loader2 size={32} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
          <div>Carregando lojas...</div>
        </div>
      ) : lojas.length === 0 ? (
        <AdminCard style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ background: '#f8f9fa', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Store size={32} color="#ccc" />
          </div>
          <h3 style={{ color: '#111', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Nenhuma loja cadastrada</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Cadastre suas lojas físicas para exibi-las na home e no rodapé do site.</p>
          <AdminButton onClick={() => window.location.href = '/admin/lojas/nova'} variant="secondary">
            Cadastrar minha primeira loja
          </AdminButton>
        </AdminCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {lojas.map(loja => {
            const capa = loja.fotos[0];
            return (
              <AdminCard key={loja.id} noPadding style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', background: '#f5f5f5', position: 'relative' }}>
                  {capa ? (
                    <Image src={capa.url} alt={loja.nome} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                      <Store size={40} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <AdminBadge color={loja.ativa ? '#2ecc71' : '#888'}>
                      {loja.ativa ? 'Ativa' : 'Inativa'}
                    </AdminBadge>
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#E2231A', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>
                    {loja.cidadeEstado}
                  </span>
                  <h3 style={{ color: '#111', fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.2 }}>
                    {loja.nome}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#666', fontSize: '13px', marginBottom: '8px', lineHeight: 1.4 }}>
                    <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#999' }} />
                    {loja.endereco}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                    <Phone size={14} style={{ flexShrink: 0, color: '#999' }} />
                    {loja.telefone}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f8f9fa' }}>
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      style={{ flex: 1, background: '#fff' }}
                      onClick={() => window.location.href = `/admin/lojas/${loja.id}`}
                    >
                      <Edit2 size={14} /> Editar
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      type="button"
                      loading={deleting === loja.id}
                      onClick={() => handleDelete(loja.id, loja.nome)}
                      style={{ width: '42px' }}
                    >
                      {!deleting && <Trash2 size={14} />}
                    </AdminButton>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
