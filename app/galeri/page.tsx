import Image from "next/image";

const photos = [
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80"
];

export default function GaleriPage() {
  return <section className="mx-auto max-w-6xl px-4 py-16"><p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Dokumentasi</p><h1 className="mt-2 text-4xl font-black">Galeri Kegiatan</h1><p className="mt-4 text-slate-600">Ruang visual untuk dokumentasi kegiatan PKK Desa Pulutan.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((x,i)=><div key={i} className="relative aspect-[4/3] overflow-hidden rounded-3xl"><Image src={x} alt={`Dokumentasi PKK ${i+1}`} fill className="object-cover transition hover:scale-105"/></div>)}</div></section>;
}
