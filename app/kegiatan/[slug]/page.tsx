import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function DetailKegiatan({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) notFound();
  const { data } = await supabase().from("kegiatan").select("*").eq("slug", slug).eq("published", true).single();
  if (!data) notFound();
  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <span className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">{data.category}</span>
      <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{data.title}</h1>
      <p className="mt-4 text-sm text-slate-500">{new Date(data.event_date).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}{data.location ? ` • ${data.location}` : ""}</p>
      {data.cover_url && <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl"><Image src={data.cover_url} alt={data.title} fill className="object-cover"/></div>}
      <div className="prose prose-slate mt-10 max-w-none whitespace-pre-line leading-8">{data.content}</div>
      {data.gallery_urls?.length ? <div className="mt-12 grid gap-4 sm:grid-cols-2">{data.gallery_urls.map((url:string,i:number)=><div key={i} className="relative aspect-video overflow-hidden rounded-2xl"><Image src={url} alt={`${data.title} ${i+1}`} fill className="object-cover"/></div>)}</div> : null}
    </article>
  );
}
