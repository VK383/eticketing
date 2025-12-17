// PhonePe Payment Gateway Configuration
// Documentation: https://developer.phonepe.com/v1/docs/payment-gateway

export interface PhonePePaymentRequest {
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number; // in paise (₹500 = 50000 paise)
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: string; // "UPI_INTENT" or "PAY_PAGE"
  };
}

export interface PhonePePaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'COMPLETED' | 'FAILED' | 'PENDING';
    responseCode: string;
    paymentInstrument?: {
      type: string;
      utr?: string;
    };
  };
}

// Test mode credentials (replace with production keys for live)
export const PHONEPE_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID || 'MERCHANTUAT',
  saltKey: process.env.PHONEPE_SALT_KEY || '',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  apiEndpoint: process.env.PHONEPE_API_ENDPOINT || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  redirectUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify` : 'http://localhost:3000/api/payment/verify',
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback` : 'http://localhost:3000/api/payment/callback',
};

export function generateMerchantTransactionId(ticketId: string): string {
  const timestamp = Date.now();
  return `TXN-${ticketId}-${timestamp}`;
}
