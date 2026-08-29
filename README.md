# Website PKK Desa Pulutan

Website publikasi dan dokumentasi kegiatan PKK Desa Pulutan, Kecamatan Remboken, Kabupaten Minahasa, Provinsi Sulawesi Utara.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Supabase (Database, Auth, Storage)
- Vercel (hosting gratis)

## Menjalankan lokal
1. Install Node.js 20+.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi URL dan anon key dari Supabase.
5. Jalankan `npm run dev`.

## Supabase
Buat project gratis di Supabase, lalu buka SQL Editor dan jalankan isi `supabase/schema.sql`.

Buat Storage bucket bernama `kegiatan` dan jadikan public, atau sesuaikan policy pada SQL.

Untuk akun admin: buat user melalui Supabase Authentication > Users > Add user.

## Deploy gratis ke Vercel
1. Upload project ini ke GitHub.
2. Import repository ke Vercel.
3. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Environment Variables.
4. Deploy.

Vercel akan memberi subdomain gratis seperti:
`https://pkk-desa-pulutan.vercel.app`

## Logo
Template menggunakan lambang PKK dan lambang Kabupaten Minahasa melalui URL Wikimedia Commons. Untuk produksi pemerintahan/desa, sebaiknya simpan salinan aset resmi yang telah disetujui dan ganti URL tersebut di `components/SiteHeader.tsx` dan `app/page.tsx`.
