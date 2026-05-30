import dynamic from 'next/dynamic';

const AlphaPage = dynamic(
  () => import('./AlphaPage'),
  {
    ssr: false,
    loading: () => (
      <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(232,224,208,0.4)',fontFamily:'monospace',fontSize:13}}>
        〰️
      </div>
    ),
  }
);

export default function Page() {
  return <AlphaPage />;
}
