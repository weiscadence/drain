'use client';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with drag/motion
const SwipeFeed = dynamic(() => import('../../components/SwipeFeed'), { ssr: false });

export default function AppPage() {
  return (
    <div className="h-screen bg-[#080808] flex flex-col overflow-hidden">
      <SwipeFeed />
    </div>
  );
}
