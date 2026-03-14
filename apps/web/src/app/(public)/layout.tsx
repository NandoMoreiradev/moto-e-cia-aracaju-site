import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
