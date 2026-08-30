export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-xl font-bold text-white">PKK Desa Pulutan</p>
            <p className="mt-2 max-w-md text-sm leading-6">
              Pusat informasi dan dokumentasi kegiatan Pemberdayaan Kesejahteraan Keluarga Desa Pulutan.
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-semibold text-white">Wilayah</p>
            <p className="mt-2 text-sm">Desa Pulutan, Kecamatan Remboken</p>
            <p className="text-sm">Kabupaten Minahasa, Sulawesi Utara</p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-500">
          © {new Date().getFullYear()} PKK Desa Pulutan. Dibuat untuk pelayanan informasi masyarakat.
        </div>
      </div>
    </footer>
  );
}
