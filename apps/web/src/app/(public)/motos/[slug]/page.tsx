'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, Loader2 } from 'lucide-react';
import { motos as motosApi } from '@/lib/api';
import type { MotoDto } from '@moto-e-cia/shared';
import { useWhatsApp } from '@/contexts/WhatsAppContext';

const TRANSMISSAO_LABEL: Record<string, string> = {
  MANUAL: 'Manual', AUTOMATICA: 'Automática', SEMI_AUTOMATICA: 'Semi-automática',
};

const COMBUSTIVEL_LABEL: Record<string, string> = {
  GASOLINA: 'Gasolina', ETANOL: 'Etanol', FLEX: 'Flex', ELETRICO: 'Elétrico',
};

export default function MotoDetalhePage() {
  const { slug } = useParams<{ slug: string }>();
  const [moto, setMoto] = useState<MotoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFotoIndex, setSelectedFotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isDiferenciaisOpen, setIsDiferenciaisOpen] = useState(false);

  // Estados para os acórdeons da Ficha Técnica (mock de grupos para simular o layout)
  const [openSpecs, setOpenSpecs] = useState<Record<string, boolean>>({
    'dimensoes': false,
    'motor': false,
  });

  const { openWhatsApp } = useWhatsApp();

  const toggleSpec = (group: string) => setOpenSpecs(prev => ({ ...prev, [group]: !prev[group] }));
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 340 : scrollLeft + 340;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    motosApi.get(slug)
      .then(m => { setMoto(m); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#111' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }}>
          <Loader2 size={48} color="#e31b23" />
        </div>
        <div style={{ marginTop: '16px', color: '#666', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '12px' }}>Carregando Máquina</div>
      </div>
    </div>
  );
  if (error || !moto) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#111' }}>
      <p style={{ fontSize: '64px', margin: 0, fontWeight: 900 }}>404</p>
      <p style={{ color: '#666', fontSize: '18px' }}>Moto não encontrada ou já vendida.</p>
      <Link href="/motos" style={{ display: 'inline-block', padding: '12px 24px', background: '#E2231A', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 700, marginTop: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>← Voltar para a Concessionária</Link>
    </div>
  );

  const fotosOrdenadas = [...(moto.fotos || [])].sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0));
  const fotoAtual = fotosOrdenadas[selectedFotoIndex] || null;

  const whatsappMsg = `Olá! Tenho interesse na *${moto.nome}* (${moto.ano || ''}, ${moto.km === 0 ? '0 km' : `${(moto.km ?? 0).toLocaleString('pt-BR')} km`}). Pode me dar mais informações e verificar a disponibilidade?`;

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', color: '#111', fontFamily: 'inherit', overflowX: 'hidden' }}>
      
      {/* 1. MOTO CAPA (HERO BANNER) */}
      <div style={{ position: 'relative' }}>
        {/* Floating Back Header (Absolute no topo) */}
        <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', zIndex: 10, padding: '0 5%', maxWidth: '1440px', margin: '0 auto' }}>
          <Link href="/motos" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '30px', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
            ← Voltar para Motos
          </Link>
        </div>

        {moto.capaUrl ? (
          <section style={{ width: '100%', height: '70vh', position: 'relative' }}>
            <Image src={moto.capaUrl} alt={`Capa da ${moto.nome}`} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
            {/* Gradiente escuro no fundo para dar destaque à logo */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)', pointerEvents: 'none' }} />
            
            {/* Logomarca sobreposta ao banner (se houver logo) */}
            {moto.logoUrl && (
              <div style={{ position: 'absolute', bottom: '40px', left: '0', right: '0', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ position: 'relative', width: '350px', height: '120px' }}>
                  <Image src={moto.logoUrl} alt={`Logo ${moto.nome}`} fill style={{ objectFit: 'contain', filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.5))' }} />
                </div>
              </div>
            )}
          </section>
        ) : (
          <div style={{ width: '100%', height: '140px', background: 'radial-gradient(circle at center, #939393 0%, #444444 100%)', position: 'relative' }}>
             {/* Logomarca sobreposta ao banner fallback */}
             {moto.logoUrl && (
              <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ position: 'relative', width: '250px', height: '80px' }}>
                  <Image src={moto.logoUrl} alt={`Logo ${moto.nome}`} fill style={{ objectFit: 'contain', filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. ÁREA DA MOTO ISOLADA E SELETOR DE COR */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 60px', padding: '0 5%', textAlign: 'center' }}>
        
        {/* Slogan ou Título Fallback */}
        {moto.logoUrl ? (
          moto.slogan && (
            <div style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 700, letterSpacing: '2px', color: '#111', textTransform: 'uppercase' }}>
              {moto.slogan}
            </div>
          )
        ) : (
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: '16px', color: '#333' }}>
            Conquiste sua <span style={{ color: '#e31b23' }}>{moto.nome}</span>
          </h2>
        )}
        
        {/* Agrupamento Preço e Condição */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          
          {/* Badge de Preço */}
          {moto.preco && (
            <div style={{ 
              display: 'inline-block', 
              background: '#fff', 
              padding: '16px 36px', 
              borderRadius: '40px', 
              border: '1px solid #eaeaea',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              marginBottom: moto.condicao === 'SEMINOVA' ? '12px' : '0'
            }}>
              <div style={{ color: '#e31b23', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                R$ {Number(moto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{fontSize:'14px', fontWeight:700, marginLeft: '4px'}}>+ frete</span>
              </div>
              <div style={{ color: '#111', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>*preço público sugerido</div>
            </div>
          )}

          {/* Badge Condição / KM */}
          {moto.condicao === 'SEMINOVA' && (
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              background: '#f9f9f9', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              color: '#444',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid #eaeaea',
              gap: '6px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#fff', width: '14px', height: '14px', borderRadius: '50%', fontSize: '8px' }}>✓</span> 
              SEMINOVA 
              {moto.km !== null && (
                <>
                  <span style={{ color: '#999', margin: '0 2px' }}>•</span>
                  {moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`}
                </>
              )}
            </div>
          )}

        </div>

        {/* Imagem da Moto Isolada */}
        <div style={{ position: 'relative', height: '55vh', minHeight: '350px', marginBottom: '40px' }}>
          {fotoAtual ? (
            <Image 
              src={fotoAtual.url} 
              alt={moto.nome} 
              fill 
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
              priority
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Nenhuma foto disponível</div>
          )}
        </div>

        {/* Dots (Seletor de Cor) */}
        {fotosOrdenadas.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
            {fotosOrdenadas.map((foto, i) => {
              // Se não preencheu a cor, usamos um cinza neutro
              const bgColor = foto.corHex || '#999999';
              const isSelected = i === selectedFotoIndex;
              return (
                <button
                  key={foto.id}
                  onClick={() => setSelectedFotoIndex(i)}
                  style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: bgColor,
                    outline: isSelected ? `2px solid ${bgColor}` : 'none',
                    outlineOffset: '4px',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                  }}
                  title={foto.corNome || `Foto cor ${bgColor}`}
                />
              );
            })}
          </div>
        )}

        {/* CTAs (Tenho Interesse / Financiamento) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => openWhatsApp(whatsappMsg)}
              style={{
                background: '#e31b23', color: '#fff', borderRadius: '30px', 
                padding: '16px 40px', fontSize: '14px', fontWeight: 800, 
                border: 'none', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ff2028'}
              onMouseLeave={e => e.currentTarget.style.background = '#e31b23'}
            >
              FALE COM UM VENDEDOR
            </button>
            <button 
              onClick={() => openWhatsApp(`Olá, gostaria de simular um financiamento para a moto: ${moto.nome}.`)}
              style={{
                background: '#fff', color: '#e31b23', border: '2px solid #e31b23', 
                borderRadius: '30px', padding: '16px 40px', fontSize: '14px', 
                fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e31b23'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#e31b23'; }}
            >
              FINANCIAMENTO
            </button>
            <button 
              onClick={() => openWhatsApp(`Olá, gostaria de simular um consórcio para a moto: ${moto.nome}.`)}
              style={{
                background: '#fff', color: '#e31b23', border: '2px solid #e31b23', 
                borderRadius: '30px', padding: '16px 40px', fontSize: '14px', 
                fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e31b23'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#e31b23'; }}
            >
              CONSÓRCIO
            </button>
        </div>
      </section>

      {/* 3. GALERIA DE FOTOS (Carrossel Horizontal) */}
      {fotosOrdenadas.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 100px', padding: '0 5%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h3 style={{ color: '#111', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>GALERIA DE FOTOS</h3>
            <div style={{ width: '40px', height: '4px', background: '#e31b23', margin: '16px auto 0' }} />
          </div>
          
          <div style={{ position: 'relative', width: '100%' }}>
            {/* Nav Arrows (Desktop Only) */}
            <button 
              onClick={() => scroll('left')}
              style={{
                position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 2, background: '#fff', border: '1px solid #eaeaea', borderRadius: '50%',
                width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', color: '#e31b23'
              }}
              className="desktop-only-btn"
            >
              <ChevronLeft size={24} />
            </button>

            <button 
              onClick={() => scroll('right')}
              style={{
                position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
                zIndex: 2, background: '#fff', border: '1px solid #eaeaea', borderRadius: '50%',
                width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', color: '#e31b23'
              }}
              className="desktop-only-btn"
            >
              <ChevronRight size={24} />
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '16px', 
                paddingBottom: '20px',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                scrollSnapType: 'x mandatory',
                cursor: 'grab'
              }} 
              className="hide-scrollbar"
              onMouseDown={(e) => {
                const el = scrollRef.current;
                if (!el) return;
                el.style.cursor = 'grabbing';
                el.style.userSelect = 'none';
                el.style.scrollBehavior = 'auto'; // Disable smooth for drag
                
                // Disable scroll snap while dragging for smoother experience
                el.style.scrollSnapType = 'none';
                
                const startX = e.pageX - el.offsetLeft;
                const scrollLeft = el.scrollLeft;
                isDraggingRef.current = false;
                
                const onMouseMove = (e: MouseEvent) => {
                  const x = e.pageX - el.offsetLeft;
                  const walk = (x - startX) * 2;
                  if (Math.abs(walk) > 5) {
                    isDraggingRef.current = true;
                  }
                  el.scrollLeft = scrollLeft - walk;
                };
                
                const onMouseUp = () => {
                  el.style.cursor = 'grab';
                  el.style.userSelect = 'auto';
                  el.style.scrollBehavior = 'smooth';
                  // Restore scroll snap
                  el.style.scrollSnapType = '';
                  
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                  
                  setTimeout(() => {
                    isDraggingRef.current = false;
                  }, 50);
                };
                
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                @media (max-width: 1250px) {
                  .desktop-only-btn { display: none !important; }
                }
              `}} />
              
              {fotosOrdenadas.map((foto, i) => (
                <motion.div 
                  key={foto.id} 
                  whileHover={{ y: -5 }}
                  onClick={(e) => {
                    if (isDraggingRef.current) {
                      e.preventDefault();
                      return;
                    }
                    setModalImageIndex(i);
                    setIsModalOpen(true);
                  }}
                  style={{ 
                    flex: '0 0 320px', 
                    position: 'relative', 
                    height: '240px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    border: '1px solid #eaeaea', 
                    cursor: 'pointer', 
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <Image 
                    src={foto.url} 
                    alt={`Galeria ${i+1}`} 
                    fill 
                    style={{ objectFit: 'contain', padding: '16px' }} 
                  />
                  <div style={{ 
                    position: 'absolute', bottom: '12px', right: '12px', 
                    background: 'rgba(0,0,0,0.4)', color: '#fff', 
                    padding: '6px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Maximize2 size={16} />
                  </div>
                </motion.div>
              ))}
            </div>
            
            <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '10px' }}>
              ‹ deslize para ver mais ›
            </p>
          </div>
        </section>
      )}

      {/* 3.1 IMAGE VIEWER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
              style={{
                position: 'absolute', top: '30px', right: '30px',
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', padding: '10px'
              }}
            >
              <X size={32} />
            </button>

            {/* Nav Buttons */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex(prev => (prev === 0 ? fotosOrdenadas.length - 1 : prev - 1));
              }}
              style={{
                position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                width: '50px', height: '50px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex(prev => (prev === fotosOrdenadas.length - 1 ? 0 : prev + 1));
              }}
              style={{
                position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                width: '50px', height: '50px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ChevronRight size={32} />
            </button>

            {/* Modal Image */}
            <div style={{ position: 'relative', width: '90%', height: '80%', userSelect: 'none' }} onClick={(e) => e.stopPropagation()}>
              <Image 
                src={fotosOrdenadas[modalImageIndex].url} 
                alt="Visualização" 
                fill 
                style={{ objectFit: 'contain' }}
              />
              <div style={{ 
                position: 'absolute', bottom: '-40px', left: 0, right: 0, 
                textAlign: 'center', color: '#fff', fontSize: '14px' 
              }}>
                {modalImageIndex + 1} / {fotosOrdenadas.length} {fotosOrdenadas[modalImageIndex].corNome ? `— ${fotosOrdenadas[modalImageIndex].corNome}` : ''}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. DESCRIÇÃO E ESPECIFICAÇÕES TÉCNICAS */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 120px', padding: '0 5%' }}>
        
        {moto.descricao && (
          <div style={{ marginBottom: '80px' }}>
            <style dangerouslySetInnerHTML={{ __html: `
              .rich-content {
                color: #444;
                font-size: 16px;
                line-height: 1.8;
                font-weight: 400;
                text-align: left;
              }
              .rich-content p { margin-bottom: 1.5rem; }
              .rich-content h1 { font-size: 2rem; margin: 2rem 0 1rem; color: #111; }
              .rich-content h2 { font-size: 1.5rem; margin: 1.5rem 0 1rem; color: #111; }
              .rich-content ul, .rich-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
              .rich-content ul { list-style-type: disc; }
              .rich-content ol { list-style-type: decimal; }
              .rich-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 2rem 0; display: block; }
              .rich-content blockquote { border-left: 4px solid #e31b23; padding-left: 1.5rem; color: #666; font-style: italic; margin: 2rem 0; }
              .rich-content a { color: #e31b23; text-decoration: underline; }
            `}} />
            <div 
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: moto.descricao }} 
            />
          </div>
        )}

        {moto.diferenciais && (
          <div style={{ marginBottom: '60px', textAlign: 'center' }}>
            <button
              onClick={() => setIsDiferenciaisOpen(true)}
              style={{
                background: 'transparent',
                color: '#e31b23',
                border: '1px solid #e31b23',
                padding: '12px 24px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#e31b23';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#e31b23';
              }}
            >
              Ver todos os diferenciais
            </button>
          </div>
        )}

        {/* Modal de Diferenciais */}
        <AnimatePresence>
          {isDiferenciaisOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 10001,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)', padding: '20px'
              }}
              onClick={() => setIsDiferenciaisOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{
                  background: '#fff',
                  width: '100%',
                  maxWidth: '700px',
                  maxHeight: '80vh',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Header Modal */}
                <div style={{ 
                  padding: '24px 32px', 
                  borderBottom: '1px solid #eee', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#111', textTransform: 'uppercase' }}>
                    Diferenciais <span style={{ color: '#e31b23' }}>{moto.nome}</span>
                  </h3>
                  <button 
                    onClick={() => setIsDiferenciaisOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content Modal */}
                <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
                  <div 
                    className="rich-content"
                    dangerouslySetInnerHTML={{ __html: moto.diferenciais || '' }} 
                  />
                </div>

                {/* Footer Modal */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid #eee', textAlign: 'right' }}>
                  <button 
                    onClick={() => setIsDiferenciaisOpen(false)}
                    style={{ 
                      background: '#111', color: '#fff', border: 'none', 
                      padding: '10px 24px', borderRadius: '4px', fontWeight: 700, 
                      cursor: 'pointer', fontSize: '13px'
                    }}
                  >
                    FECHAR
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Título Vermelho Centralizado */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#e31b23', fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0px', margin: 0 }}>
            ESPECIFICAÇÕES TÉCNICAS
          </h2>
        </div>

        {/* Acórdeon 1: DIMENSÕES E PESO */}
        <div style={{ borderBottom: '1px solid #ddd' }}>
          <button 
            onClick={() => toggleSpec('dimensoes')}
            style={{ width: '100%', background: 'none', border: 'none', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '13px', color: '#333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>INFORMAÇÕES BÁSICAS DO VEÍCULO</span>
            <span style={{ transform: openSpecs['dimensoes'] ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31b23" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          
          <div style={{ maxHeight: openSpecs['dimensoes'] ? '1000px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease-in-out', opacity: openSpecs['dimensoes'] ? 1 : 0 }}>
            <div style={{ paddingBottom: '32px' }}>
              <SpecItem label="Marca Oficial" value={moto.marca} />
              <SpecItem label="Nome do Modelo" value={moto.nome} />
              <SpecItem label="Ano de Fabricação" value={moto.ano?.toString()} />
              <SpecItem label="Quilometragem (Odomêtro)" value={moto.km !== null ? (moto.km === 0 ? '0 km' : `${moto.km.toLocaleString('pt-BR')} km`) : undefined} />
              <SpecItem label="Cor Disponível" value={moto.cor || undefined} />
              <SpecItem label="Chassi (VIN)" value={moto.vin ? moto.vin.substring(0, 8) + '*****' : undefined} />
              <SpecItem label="Status de Negociação" value={moto.status} color={moto.status === 'VENDIDA' ? '#d32f2f' : '#2e7d32'} />
            </div>
          </div>
        </div>

        {/* Acórdeon 2: CAIXA DE VELOCIDADE E MOTOR */}
        <div style={{ borderBottom: '1px solid #ddd' }}>
          <button 
            onClick={() => toggleSpec('motor')}
            style={{ width: '100%', background: 'none', border: 'none', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: '13px', color: '#333', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>MOTOR, TRANSMISSÃO E ESTRUTURA</span>
            <span style={{ transform: openSpecs['motor'] ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31b23" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          
          <div style={{ maxHeight: openSpecs['motor'] ? '1000px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease-in-out', opacity: openSpecs['motor'] ? 1 : 0 }}>
            <div style={{ paddingBottom: '32px' }}>
              <SpecItem label="Tipo / Categoria" value={moto.tipo || undefined} />
              <SpecItem label="Alimentação / Combustível" value={moto.combustivel ? COMBUSTIVEL_LABEL[moto.combustivel] || moto.combustivel : undefined} />
              <SpecItem label="Caixa de Transmissão" value={moto.transmissao ? TRANSMISSAO_LABEL[moto.transmissao] || moto.transmissao : undefined} />
            </div>
          </div>
        </div>

        {/* Integração Meta Catalog (Se existir) */}
        {moto.metaProductId && (
          <div style={{ marginTop: '32px', padding: '20px', background: '#f5f5f5', borderLeft: '4px solid #1877F2', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '24px', color: '#1877F2' }}>📘</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#333', textTransform: 'uppercase' }}>Catálogo Facebook/Instagram</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Veículo sincronizado oficialmente no comércio eletrônico Meta. ID: {moto.metaProductId}</div>
            </div>
          </div>
        )}

      </section>
      
      {/* Botão Fixo WhatsApp Flutuante */}
      <button 
        onClick={() => openWhatsApp(whatsappMsg)}
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 999,
          background: '#25D366', color: '#fff', width: '64px', height: '64px', 
          borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)', border: 'none', cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.566 6.02L0 24l6.135-1.61a11.81 11.81 0 005.911 1.586h.005c6.637 0 12.048-5.411 12.05-12.048a11.82 11.82 0 00-3.418-8.521z"/>
        </svg>
      </button>

    </div>
  );
}

/* Row Simples para o Acórdeon */
function SpecItem({ label, value, color = '#333' }: { label: string; value?: string; color?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', padding: '16px 0 16px 16px', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ flex: '0 0 50%', color: '#777', fontSize: '13px', fontWeight: 600 }}>{label}</div>
      <div style={{ flex: '1', color: color, fontSize: '14px', fontWeight: 600 }}>{value}</div>
    </div>
  );
}
