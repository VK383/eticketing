# PhonePe Payment Integration Setup Guide

## 🎯 Payment Flow Added Successfully!

Your app now supports:
- ✅ 3 ticket types: Regular (₹500), VIP (₹1,500), Premium (₹3,000)
- ✅ PhonePe UPI payment gateway
- ✅ Payment verification before ticket display
- ✅ Payment status tracking

---

## 📋 Setup Steps

### 1. Update Database Schema

Run this SQL in **Supabase SQL Editor**:

```sql
-- Copy entire content from: supabase/add-payment-schema.sql
```

Go to [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor → Paste and Run

---

### 2. Get PhonePe Credentials

#### For Testing (Use Now):
1. Go to [PhonePe Developer Portal](https://developer.phonepe.com/)
2. Sign up for a test account
3. Get your Test credentials:
   - Merchant ID (default: `MERCHANTUAT`)
   - Salt Key
   - Salt Index

#### For Production (Before Launch):
1. Register at [PhonePe Business](https://www.phonepe.com/business-solutions/payment-gateway/)
2. Complete KYC verification
3. Get production credentials

---

### 3. Update Environment Variables

Update your `.env.local`:

```env
# PhonePe Payment Gateway
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=MERCHANTUAT
PHONEPE_SALT_KEY=your_actual_salt_key_here
PHONEPE_SALT_INDEX=1
PHONEPE_API_ENDPOINT=https://api-preprod.phonepe.com/apis/pg-sandbox
```

**Important:** Replace `your_actual_salt_key_here` with your real PhonePe salt key.

---

### 4. Customize Ticket Prices (Optional)

Edit `lib/ticket-pricing.ts` to change prices and features:

```typescript
export const TICKET_TYPES = {
  regular: {
    name: "Regular",
    price: 500, // Change this
    description: "Your description",
    features: ["Feature 1", "Feature 2"]
  },
  // ... customize other types
}
```

---

### 5. Test the Payment Flow

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test booking:**
   - Go to http://localhost:3000/book
   - Select a ticket type
   - Fill in details
   - Click "Pay & Book"
   - You'll be redirected to PhonePe test payment page

3. **Test Payment Scenarios:**
   - **Success:** Complete payment → Redirected to ticket with QR code
   - **Failure:** Cancel payment → See "Payment Failed" message
   - **Pending:** Close browser → Status shows "Payment Pending"

---

## 🔄 Payment Flow Explained

```
User fills form
    ↓
Selects ticket type (Regular/VIP/Premium)
    ↓
Clicks "Pay ₹XXX & Book"
    ↓
Ticket created (status: pending)
    ↓
Redirected to PhonePe payment page
    ↓
User completes payment via UPI/Card/Wallet
    ↓
PhonePe verifies payment
    ↓
Callback updates ticket (status: booked, payment: success)
    ↓
User sees ticket with QR code & download option
```

---

## 📁 New Files Created

### Database:
- `supabase/add-payment-schema.sql` - Payment columns and indexes

### Configuration:
- `lib/ticket-pricing.ts` - Ticket types and pricing logic
- `lib/phonepe-config.ts` - PhonePe API configuration

### API Endpoints:
- `app/api/payment/initiate/route.ts` - Start payment
- `app/api/payment/verify/route.ts` - Verify after redirect
- `app/api/payment/callback/route.ts` - PhonePe server callback

### Updated Components:
- `components/booking-form.tsx` - Added ticket selection & payment
- `components/ticket-view.tsx` - Added payment status checks

---

## 🚨 Important Notes

### Security:
- ✅ Salt key is server-side only (not exposed to browser)
- ✅ Payment verification uses SHA256 signatures
- ✅ Callback signature validation prevents tampering

### Testing:
- Use PhonePe test environment for development
- Test all payment scenarios (success/failure/pending)
- Verify database updates correctly

### Production Checklist:
- [ ] Get production PhonePe credentials
- [ ] Update `PHONEPE_API_ENDPOINT` to production URL
- [ ] Update `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Enable SSL/HTTPS (required by PhonePe)
- [ ] Test payment flow on production
- [ ] Set up payment monitoring/alerts

---

## 🐛 Troubleshooting

### Payment initiation fails:
- Check PhonePe credentials in `.env.local`
- Verify Salt Key is correct
- Check API endpoint URL

### Payment success but ticket not updated:
- Check callback/verify endpoint logs
- Verify Supabase connection
- Check RLS policies allow updates

### "Payment Pending" stuck:
- User may have closed browser during payment
- Check payment status in PhonePe dashboard
- Manual verification may be needed

---

## 📞 Support

- PhonePe Docs: https://developer.phonepe.com/v1/docs/payment-gateway
- PhonePe Support: support@phonepe.com
- Supabase Docs: https://supabase.com/docs

---

**Ready to test! Run the SQL script and restart your server.** 🚀
