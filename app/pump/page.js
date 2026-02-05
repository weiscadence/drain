import { redirect } from 'next/navigation';

// Redirect /pump to /launch
export default function PumpRedirect() {
  redirect('/launch');
}
