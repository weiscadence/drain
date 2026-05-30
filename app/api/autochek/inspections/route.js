import { NextResponse } from 'next/server';

/*
 * AutoChek Inspections API
 * Escrow-protected inspection booking
 * 
 * Flow:
 * 1. User requests inspection for a deal
 * 2. User deposits funds to escrow
 * 3. Mechanic accepts job
 * 4. Mechanic completes inspection, submits report
 * 5. User approves, funds release to mechanic
 * 
 * TODO: Solana escrow integration
 */

const ESCROW_FEE = 0.05; // 5% platform fee

let inspections = [
  {
    id: 'insp_demo',
    deal: { make: 'Toyota', model: 'Camry', year: 2021, location: 'Los Angeles, CA' },
    mechanic: { id: 'mech_1', name: 'Mike\'s Mobile Inspections' },
    buyer: 'DssY...m2CZ',
    status: 'completed',
    price: 150,
    escrowTx: 'demo_escrow_tx',
    report: {
      overall: 'Good',
      engine: 'No issues detected',
      transmission: 'Smooth shifting',
      brakes: 'Pads at 60%',
      suspension: 'Minor wear, normal for mileage',
      body: 'Small scratch on rear bumper',
      interior: 'Clean, minimal wear',
      recommendations: ['Replace cabin air filter', 'Rotate tires soon'],
      score: 85
    },
    created: '2026-02-05T10:00:00Z',
    completed: '2026-02-05T14:30:00Z'
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const buyer = searchParams.get('buyer');
  const mechanic = searchParams.get('mechanic');
  const status = searchParams.get('status');
  
  if (id) {
    const inspection = inspections.find(i => i.id === id);
    if (!inspection) {
      return NextResponse.json({ success: false, error: 'Inspection not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, inspection });
  }
  
  let results = inspections.filter(i =>
    (!buyer || i.buyer === buyer) &&
    (!mechanic || i.mechanic.id === mechanic) &&
    (!status || i.status === status)
  );
  
  return NextResponse.json({
    success: true,
    count: results.length,
    inspections: results
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    // Request new inspection
    if (action === 'request') {
      const { deal, mechanicId, buyerWallet } = body;
      
      if (!deal || !mechanicId || !buyerWallet) {
        return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
      }
      
      const inspection = {
        id: 'insp_' + Date.now(),
        deal,
        mechanic: { id: mechanicId },
        buyer: buyerWallet,
        status: 'pending_escrow',
        price: 150, // Would fetch from mechanic
        escrowTx: null,
        report: null,
        created: new Date().toISOString(),
        completed: null
      };
      
      inspections.push(inspection);
      
      return NextResponse.json({
        success: true,
        message: 'Inspection requested. Deposit funds to escrow to confirm.',
        inspection,
        escrowAmount: inspection.price * (1 + ESCROW_FEE),
        escrowAddress: 'ESCROW_ADDRESS_HERE' // Would be real Solana address
      });
    }
    
    // Submit inspection report (mechanic)
    if (action === 'submit_report') {
      const { inspectionId, report, mechanicWallet } = body;
      
      const inspection = inspections.find(i => i.id === inspectionId);
      if (!inspection) {
        return NextResponse.json({ success: false, error: 'Inspection not found' }, { status: 404 });
      }
      
      inspection.report = report;
      inspection.status = 'pending_approval';
      
      return NextResponse.json({
        success: true,
        message: 'Report submitted. Awaiting buyer approval to release funds.',
        inspection
      });
    }
    
    // Approve and release funds (buyer)
    if (action === 'approve') {
      const { inspectionId, buyerWallet } = body;
      
      const inspection = inspections.find(i => i.id === inspectionId);
      if (!inspection) {
        return NextResponse.json({ success: false, error: 'Inspection not found' }, { status: 404 });
      }
      
      inspection.status = 'completed';
      inspection.completed = new Date().toISOString();
      
      return NextResponse.json({
        success: true,
        message: 'Inspection approved. Funds released to mechanic.',
        inspection,
        // Would include actual tx hash
        releaseTx: 'RELEASE_TX_HASH'
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
