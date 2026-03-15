'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminMarcas } from '@/lib/api';
import type { MarcaDto } from '@moto-e-cia/shared';

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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Marcas</h1>
          <p style={{ color: '#555', fontSize: '14px', marginTop: '4px' }}>Gerencie os logotipos das marcas oficiais</p>
        </div>
        <Link href="/admin/marcas/nova" style={{
          background: '#E2231A', color: '#fff',
          padding: '10px 20px', borderRadius: '8px',
          textDecoration: 'none', fontWeight: 600, fontSize: '14px',
        }}>
          + Nova Marca
        </Link>
      </div>

      {loading ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '48px' }}>Carregando...</div>
      ) : marcas.length === 0 ? (
        <div style={{ color: '#555', textAlign: 'center', padding: '48px' }}>
          Nenhuma marca cadastrada.{' '}
          <Link href="/admin/marcas/nova" style={{ color: '#E2231A' }}>Cadastrar agora</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {marcas.map(marca => (
            <div key={marca.id} style={{
              background: '#1a1a1a', border: '1px solid #222',
              borderRadius: '12px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px'
            }}>
              <div style={{ height: '80px', width: '100%', background: 'transparent', position: 'relative', marginBottom: '16px' }}>
                {marca.logoUrl ? (
                  <img src={marca.logoUrl} alt={marca.nome} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '32px' }}>
                    🏷️
                  </div>
                )}
              </div>

              <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', textAlign: 'center' }}>{marca.nome}</div>
              <div style={{ color:marca.ativa ? '#2ecc71' : '#555', fontSize: '11px', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase' }}>
                {marca.ativa ? 'Ativa' : 'Inativa'}
              </div>
              <div style={{ color: '#444', fontSize: '11px', marginTop: '2px' }}>Ordem: {marca.ordem}</div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', width: '100%' }}>
                <Link href={`/admin/marcas/${marca.id}`} style={{
                  flex: 1, textAlign: 'center',
                  padding: '8px', background: '#222',
                  border: '1px solid #333', borderRadius: '6px',
                  color: '#aaa', fontSize: '13px', textDecoration: 'none',
                }}>
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(marca.id, marca.nome)}
                  disabled={deleting === marca.id}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent', border: '1px solid #333',
                    borderRadius: '6px', color: '#cc4444',
                    fontSize: '13px', cursor: 'pointer',
                  }}
                >
                  {deleting === marca.id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
