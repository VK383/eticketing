import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PHONEPE_CONFIG } from '@/lib/phonepe-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, amount, phone } = body;

    if (!ticketId || !amount || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const merchantTransactionId = `TXN-${ticketId}-${Date.now()}`;
    const merchantUserId = `USER-${phone}`;

    // PhonePe requires amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // Prepare payment request
    const paymentRequest = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId,
      merchantUserId,
      amount: amountInPaise,
      redirectUrl: `${PHONEPE_CONFIG.redirectUrl}?ticketId=${ticketId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: phone.replace(/\D/g, ''),
      paymentInstrument: {
        type: 'PAY_PAGE' // Shows all payment options including UPI
      }
    };

    // Convert to base64
    const payloadString = JSON.stringify(paymentRequest);
    const payloadBase64 = Buffer.from(payloadString).toString('base64');

    // Generate X-VERIFY header (SHA256 hash)
    const stringToHash = payloadBase64 + '/pg/v1/pay' + PHONEPE_CONFIG.saltKey;
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerifyHeader = `${sha256Hash}###${PHONEPE_CONFIG.saltIndex}`;

    // Make request to PhonePe
    const response = await fetch(`${PHONEPE_CONFIG.apiEndpoint}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerifyHeader,
      },
      body: JSON.stringify({
        request: payloadBase64
      })
    });

    const result = await response.json();

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId
      });
    }

    return NextResponse.json({
      success: false,
      message: result.message || 'Failed to initiate payment'
    }, { status: 500 });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Payment initiation failed' 
      },
      { status: 500 }
    );
  }
}
