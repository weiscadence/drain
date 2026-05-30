'use client';
import dynamic from 'next/dynamic';

const AlfalfaApp = dynamic(() => import('./AlfalfaApp'), { ssr: false });

export default function AppPage() {
  return <AlfalfaApp />;
}
