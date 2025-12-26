import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PHONEPE_CONFIG, validatePhonePeConfig } from '@/lib/phonepe-config';

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

    // Check if we're in mock mode for testing
    const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE;
    if (paymentMode === 'mock') {
      console.log('🧪 MOCK PAYMENT MODE - Simulating successful payment');
      const merchantTransactionId = `TXN-${ticketId}-${Date.now()}`;
      
      // Return mock payment URL that redirects to verify endpoint
      return NextResponse.json({
        success: true,
        paymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?ticketId=${ticketId}&transactionId=${merchantTransactionId}&status=success`,
        merchantTransactionId
      });
    }

    // Log environment variables for debugging
    console.log('=== PhonePe Configuration Debug ===');
    console.log('Merchant ID:', process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID);
    console.log('Salt Key exists:', !!process.env.PHONEPE_SALT_KEY);
    console.log('Salt Index:', process.env.PHONEPE_SALT_INDEX);
    console.log('API Endpoint:', process.env.PHONEPE_API_ENDPOINT);
    console.log('PHONEPE_CONFIG:', {
      merchantId: PHONEPE_CONFIG.merchantId,
      saltKeyExists: !!PHONEPE_CONFIG.saltKey,
      saltKeyLength: PHONEPE_CONFIG.saltKey?.length,
      saltIndex: PHONEPE_CONFIG.saltIndex,
      apiEndpoint: PHONEPE_CONFIG.apiEndpoint
    });
    
    // Validate PhonePe configuration first
    const configCheck = validatePhonePeConfig();
    if (!configCheck.valid) {
      console.error('PhonePe config error:', configCheck.error);
      return NextResponse.json(
        { success: false, message: configCheck.error },
        { status: 500 }
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

    // Log the full response for debugging
    console.log('PhonePe Response:', JSON.stringify(result, null, 2));

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.data.instrumentResponse.redirectInfo.url,
        merchantTransactionId
      });
    }

    // Return detailed error message from PhonePe
    const errorMessage = result.message || result.code || 'Failed to initiate payment';
    console.error('PhonePe Error:', errorMessage, result);
    
    return NextResponse.json({
      success: false,
      message: `Payment initiation failed: ${errorMessage}`
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
