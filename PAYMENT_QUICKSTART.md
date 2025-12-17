# 🎫 E-Ticketing with PhonePe Payment - Quick Start

## ✅ What's Been Added

Your ticketing app now has **PhonePe UPI payment integration** with 3 ticket tiers!

### Features:
- **3 Ticket Types:**
  - Regular: ₹500
  - VIP: ₹1,500  
  - Premium: ₹3,000
- **Payment Methods:** UPI, Credit/Debit Cards, Wallets
- **Payment Verification:** Tickets only visible after successful payment
- **QR Code Generation:** Downloadable ticket with QR code
- **Payment Status Tracking:** Success/Failed/Pending states

---

## 🚀 Next Steps (Do This Now!)

### Step 1: Update Database

1. Open [Supabase SQL Editor](https://supabase.com/dashboard)
2. Copy all content from `supabase/add-payment-schema.sql`
3. Paste and click **Run**
4. You should see "✅ Payment schema added successfully!"

### Step 2: Get PhonePe Credentials

**For immediate testing:**
1. Visit [PhonePe Developer Portal](https://developer.phonepe.com/)
2. Sign up and get **Test credentials**
3. You'll receive:
   - Merchant ID (default: `MERCHANTUAT` for testing)
   - Salt Key (unique to you)
   - Salt Index (usually `1`)

**Update `.env.local` with your Salt Key:**
```env
PHONEPE_SALT_KEY=your_actual_salt_key_from_phonepe
```

### Step 3: Test It!

1. **Server should already be running** (check terminal)
2. Go to http://localhost:3000/book
3. **Select a ticket type** (Regular/VIP/Premium)
4. **Fill in details:**
   - Name: Your Name
   - Phone: 9876543210
   - Date: Any future date
5. Click **"Pay ₹XXX & Book"**
6. You'll be redirected to PhonePe test payment page
7. Complete payment
8. See your ticket with QR code! 🎉

---

## 💰 Customize Prices

Edit `lib/ticket-pricing.ts`:

```typescript
export const TICKET_TYPES = {
  regular: {
    name: "Regular",
    price: 500, // Change to your price
    features: ["Your feature 1", "Your feature 2"]
  },
  vip: {
    name: "VIP",  
    price: 1500, // Change to your price
    features: ["VIP feature 1", "VIP feature 2"]
  },
  // ... add more types if needed
}
```

---

## 📱 How Payment Works

```
1. User selects ticket type → Sees price
2. Fills details → Clicks "Pay & Book"
3. Ticket created in DB (status: pending, payment: pending)
4. Redirected to PhonePe payment page
5. User pays via UPI/Card/Wallet
6. PhonePe verifies payment
7. Callback updates ticket (status: booked, payment: success)
8. User redirected to ticket page
9. Ticket displayed with QR code (only if payment successful!)
```

**If payment fails:** User sees error message with "Try Again" button

---

## 🔐 Security Features

- ✅ Server-side payment verification (SHA256 signatures)
- ✅ Ticket only shows after payment success
- ✅ Payment tampering prevention
- ✅ Secure callback validation

---

## 📋 Files Changed/Created

**New Files:**
- `app/api/payment/initiate/route.ts` - Start payment
- `app/api/payment/verify/route.ts` - Verify after redirect  
- `app/api/payment/callback/route.ts` - Server callback handler
- `lib/ticket-pricing.ts` - Price configuration
- `lib/phonepe-config.ts` - PhonePe settings
- `supabase/add-payment-schema.sql` - Database schema update

**Updated Files:**
- `components/booking-form.tsx` - Added ticket selection & payment
- `components/ticket-view.tsx` - Payment status checks
- `.env.local` - PhonePe credentials
- `app/ticket/[id]/page.tsx` - Next.js 15 compatibility fix

---

## 🐛 Common Issues

**"Payment initiation failed"**
- → Check PhonePe Salt Key in `.env.local`
- → Restart server after updating env

**"Ticket shows but payment pending"**
- → Run the database schema SQL first
- → Check if `payment_status` column exists

**"Cannot read properties of undefined"**
- → Restart dev server
- → Clear browser cache

---

## 🎯 Before Production

- [ ] Get **production** PhonePe credentials
- [ ] Update `PHONEPE_API_ENDPOINT` to production URL
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Enable HTTPS (PhonePe requires SSL)
- [ ] Test end-to-end payment flow
- [ ] Add payment monitoring/alerts

---

## 📞 Need Help?

- **PhonePe Docs:** https://developer.phonepe.com/v1/docs/payment-gateway
- **Full Setup Guide:** See `PAYMENT_SETUP.md`
- **Test Credentials:** Check PhonePe developer portal

---

**Everything is ready! Just run the SQL script and test.** 🚀
