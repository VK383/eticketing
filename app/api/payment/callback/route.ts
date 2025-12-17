import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PHONEPE_CONFIG } from '@/lib/phonepe-config';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify callback signature
    const xVerifyHeader = request.headers.get('X-VERIFY');
    if (!xVerifyHeader) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Extract response data
    const { response } = body;
    const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
    const responseData = JSON.parse(decodedResponse);

    // Verify signature
    const expectedSignature = crypto
      .createHash('sha256')
      .update(response + PHONEPE_CONFIG.saltKey)
      .digest('hex') + `###${PHONEPE_CONFIG.saltIndex}`;

    if (expectedSignature !== xVerifyHeader) {
      console.error('Invalid callback signature');
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Update ticket status based on payment result
    if (responseData.success && responseData.data?.state === 'COMPLETED') {
      // Payment successful - update ticket
      const merchantTransactionId = responseData.data.merchantTransactionId;
      const ticketId = merchantTransactionId.split('-')[1]; // Extract from TXN-{ticketId}-{timestamp}

      await supabase
        .from('tickets')
        .update({
          payment_status: 'success',
          payment_id: responseData.data.transactionId,
          payment_method: responseData.data.paymentInstrument?.type || 'UPI',
          payment_completed_at: new Date().toISOString(),
          status: 'booked'
        })
        .eq('id', ticketId);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
