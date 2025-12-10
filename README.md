# Zero Cost Event Ticketing System

## 1. Setup Database (Supabase)
1. Go to [Supabase](https://supabase.com) and create a free project.
2. Go to the **SQL Editor** in Supabase.
3. Copy the content of `schema.sql` (in this folder) and run it.
4. Go to **Project Settings > API**.
5. Copy the `Project URL` and `anon public` key.

## 2. Configure Environment
1. Rename `.env.local.example` to `.env.local`.
2. Paste your Supabase URL and Key in the file.

## 3. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 4. Deploy (Free)
1. Push this code to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repo.
3. Add the same Environment Variables in Vercel.
4. Deploy!

## Features
- **Public**: Booking Page, Ticket Generation (Image Download).
- **Admin**: Dashboard (`/admin`), QR Scanner (`/admin/scan`).
  - **Password**: `admin123` (Change this in `app/admin/page.tsx`).

## Note
Whatsapp integration is NOT included as it is not free for bulk messaging. The system uses instant image download instead.
