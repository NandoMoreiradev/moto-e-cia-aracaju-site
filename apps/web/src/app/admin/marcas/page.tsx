'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminMarcas } from '@/lib/api';
import type { MarcaDto } from '@moto-e-cia/shared';
import { Plus, Edit2, Trash2, Award, CheckCircle2, XCircle } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminBadge } from '@/components/admin/AdminBadge';

export default function AdminMarcasPage() {
  const [marcas, setMarcas] = useState<MarcaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminMarcas.list();
      setMarcas(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir a marca "${nome}"?`)) return;
    setDeleting(id);
    try {
      await adminMarcas.delete(id);
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
          <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Marcas Oficiais</h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>Gerencie as marcas e fabricantes das motocicletas</p>
        </div>
        <AdminButton onClick={() => window.location.href = '/admin/marcas/nova'}>
          <Plus size={18} /> Nova Marca
        </AdminButton>
      </div>

      {loading ? (
        <div style={{ color: '#999', textAlign: 'center', padding: '100px 0' }}>
          <div className="animate-spin mb-4" style={{ display: 'inline-block' }}>⌛</div>
          <div>Carregando marcas...</div>
        </div>
      ) : marcas.length === 0 ? (
        <AdminCard style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ background: '#f8f9fa', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Award size={32} color="#ccc" />
          </div>
          <h3 style={{ color: '#111', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Nenhuma marca cadastrada</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Adicione as marcas que você representa para exibir no site.</p>
          <AdminButton onClick={() => window.location.href = '/admin/marcas/nova'} variant="secondary">
            Cadastrar minha primeira marca
          </AdminButton>
        </AdminCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {marcas.map(marca => (
            <AdminCard key={marca.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ height: '100px', width: '100%', background: '#fff', position: 'relative', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {marca.logoUrl ? (
                  <img src={marca.logoUrl} alt={marca.nome} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                    <Award size={30} />
                  </div>
                )}
              </div>

              <h3 style={{ color: '#111', fontWeight: 800, fontSize: '18px', margin: '0 0 6px 0' }}>{marca.nome}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                <AdminBadge color={marca.ativa ? '#2ecc71' : '#f8f9fa'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: marca.ativa ? '#fff' : '#999' }}>
                    {marca.ativa ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                    {marca.ativa ? 'Ativa' : 'Inativa'}
                  </div>
                </AdminBadge>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', background: '#f8f9fa', padding: '3px 8px', borderRadius: '6px' }}>
                  #{marca.ordem}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%', paddingTop: '16px', borderTop: '1px solid #f8f9fa' }}>
                <AdminButton 
                  variant="secondary" 
                  size="sm" 
                  style={{ flex: 1, background: '#fff' }}
                  onClick={() => window.location.href = `/admin/marcas/${marca.id}`}
                >
                  <Edit2 size={14} /> Editar
                </AdminButton>
                <AdminButton 
                  variant="danger" 
                  size="sm" 
                  type="button"
                  loading={deleting === marca.id}
                  onClick={() => handleDelete(marca.id, marca.nome)}
                  style={{ width: '42px' }}
                >
                  {!deleting && <Trash2 size={14} />}
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
