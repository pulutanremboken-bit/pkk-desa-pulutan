export default function ProfilPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Profil</p>
      <h1 className="mt-2 text-4xl font-black">PKK Desa Pulutan</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-soft"><h2 className="text-xl font-bold">Tentang PKK</h2><p className="mt-4 leading-8 text-slate-600">PKK Desa Pulutan merupakan gerakan pemberdayaan masyarakat yang berfokus pada peningkatan kesejahteraan keluarga melalui berbagai kegiatan dan program di desa.</p></div>
        <div className="rounded-3xl bg-pkk-900 p-8 text-white"><h2 className="text-xl font-bold">Wilayah</h2><p className="mt-4 leading-8 text-blue-100">Desa Pulutan, Kecamatan Remboken, Kabupaten Minahasa, Provinsi Sulawesi Utara.</p></div>
      </div>
      <div className="mt-8 rounded-3xl bg-white p-8 shadow-soft"><h2 className="text-xl font-bold">Fokus Kegiatan</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Pendidikan","Kesehatan","Ekonomi Keluarga","Lingkungan"].map(x=><div key={x} className="rounded-2xl bg-slate-50 p-5 font-semibold">{x}</div>)}</div></div>
    </section>
  );
}
