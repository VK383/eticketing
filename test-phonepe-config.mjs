// Test script to verify PhonePe configuration
import { PHONEPE_CONFIG, validatePhonePeConfig } from './lib/phonepe-config';

console.log('\n=== PhonePe Configuration Test ===\n');

console.log('Environment Variables:');
console.log('NEXT_PUBLIC_PHONEPE_MERCHANT_ID:', process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID);
console.log('PHONEPE_SALT_KEY:', process.env.PHONEPE_SALT_KEY ? '✓ Set (hidden)' : '✗ Not set');
console.log('PHONEPE_SALT_INDEX:', process.env.PHONEPE_SALT_INDEX);
console.log('PHONEPE_API_ENDPOINT:', process.env.PHONEPE_API_ENDPOINT);
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

console.log('\nPHONEPE_CONFIG Object:');
console.log('merchantId:', PHONEPE_CONFIG.merchantId);
console.log('saltKey:', PHONEPE_CONFIG.saltKey ? `✓ Set (${PHONEPE_CONFIG.saltKey.substring(0, 10)}...)` : '✗ Not set');
console.log('saltIndex:', PHONEPE_CONFIG.saltIndex);
console.log('apiEndpoint:', PHONEPE_CONFIG.apiEndpoint);
console.log('redirectUrl:', PHONEPE_CONFIG.redirectUrl);
console.log('callbackUrl:', PHONEPE_CONFIG.callbackUrl);

console.log('\nValidation:');
const validation = validatePhonePeConfig();
console.log('Valid:', validation.valid);
if (!validation.valid) {
  console.log('Error:', validation.error);
}

console.log('\n=== End Test ===\n');
