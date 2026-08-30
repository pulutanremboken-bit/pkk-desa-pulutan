import ActivityCard from "@/components/ActivityCard";
import { supabase } from "@/lib/supabase";

export default async function KegiatanPage() {
  let activities: any[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase().from("kegiatan").select("*").eq("published", true).order("event_date", { ascending: false });
    activities = data || [];
  }
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Dokumentasi</p>
      <h1 className="mt-2 text-4xl font-black">Kegiatan PKK</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">Kumpulan kegiatan dan program PKK Desa Pulutan yang telah dipublikasikan kepada masyarakat.</p>
      {activities.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{activities.map(x => <ActivityCard key={x.id} item={x}/>)}</div> :
        <div className="mt-10 rounded-3xl border border-dashed bg-white p-12 text-center text-slate-500">Belum ada data kegiatan.</div>}
    </section>
  );
}
