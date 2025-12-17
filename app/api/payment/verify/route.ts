import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PHONEPE_CONFIG } from '@/lib/phonepe-config';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get('ticketId');
    const transactionId = searchParams.get('transactionId') || searchParams.get('merchantTransactionId');

    if (!ticketId || !transactionId) {
      return NextResponse.redirect(
        new URL(`/ticket/${ticketId}?error=invalid_params`, request.url)
      );
    }

    // Check payment status with PhonePe
    const statusUrl = `${PHONEPE_CONFIG.apiEndpoint}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transactionId}`;
    
    const stringToHash = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transactionId}` + PHONEPE_CONFIG.saltKey;
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerifyHeader = `${sha256Hash}###${PHONEPE_CONFIG.saltIndex}`;

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
      }
    });

    const result = await response.json();

    if (result.success && result.data?.state === 'COMPLETED') {
      // Update ticket in database
      const { error } = await supabase
        .from('tickets')
        .update({
          payment_status: 'success',
          payment_id: result.data.transactionId,
          payment_method: result.data.paymentInstrument?.type || 'UPI',
          payment_completed_at: new Date().toISOString(),
          status: 'booked'
        })
        .eq('id', ticketId);

      if (error) {
        console.error('Database update error:', error);
      }

      // Redirect to ticket page with success
      return NextResponse.redirect(
        new URL(`/ticket/${ticketId}?payment=success`, request.url)
      );
    }

    // Payment failed or pending
    await supabase
      .from('tickets')
      .update({
        payment_status: result.data?.state === 'FAILED' ? 'failed' : 'pending',
        status: 'pending'
      })
      .eq('id', ticketId);

    return NextResponse.redirect(
      new URL(`/ticket/${ticketId}?payment=failed`, request.url)
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(
      new URL(`/ticket/${request.nextUrl.searchParams.get('ticketId')}?error=verification_failed`, request.url)
    );
  }
}
