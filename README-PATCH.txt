PERBAIKAN LOGO HEADER + FOTO KEGIATAN

Masalah yang ditemukan:
- SiteHeader.tsx masih menggunakan URL Wikimedia "Special:FilePath".
  URL tersebut dapat melakukan redirect ke upload.wikimedia.org dan tidak cocok
  dengan konfigurasi gambar Next.js yang lama.
- next.config.ts belum mengizinkan domain pkk.malukuprov.go.id,
  upload.wikimedia.org, dan Supabase Storage.
- Akibatnya logo dan foto kegiatan tampil sebagai gambar rusak.

Patch ini memperbaiki:
1. Logo PKK memakai URL gambar langsung dari halaman resmi PKK Provinsi Maluku.
2. Logo Kabupaten Minahasa memakai URL gambar langsung dari Wikimedia Commons.
3. Supabase Storage ditambahkan ke remotePatterns untuk foto kegiatan.
4. Tidak ada gambar baru yang dibuat/generated.
5. Database dan data kegiatan tidak diubah.

File yang harus diganti:
- components/SiteHeader.tsx
- components/ActivityCard.tsx
- next.config.ts

CARA MEMASANG:
1. Extract ZIP.
2. Buka repository GitHub PKK Desa Pulutan.
3. Ganti ketiga file di atas dengan file dari patch.
4. Commit changes.
5. Tunggu Vercel sampai deployment berstatus Ready.
6. Buka website dan tekan Ctrl+F5.

PENTING:
Jangan hapus data kegiatan di Supabase dan jangan upload ulang foto.
