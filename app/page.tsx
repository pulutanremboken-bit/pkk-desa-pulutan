import Link from "next/link";
import Image from "next/image";

import ActivityCard from "@/components/ActivityCard";

import { supabase } from "@/lib/supabase";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1800&q=85";

async function getActivities() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];

  const { data } = await supabase()
    .from("kegiatan")
    .select("*")
    .eq("published", true)
    .order("event_date", { ascending: false })
    .limit(6);

  return data || [];
}

type SiteSetting = {
  value: string;
};

async function getHeroImage() {
  const { data: rawData, error } = await supabase()
    .from("site_settings")
    .select("value")
    .eq("key", "hero_image")
    .maybeSingle();

  if (error || !rawData) {
    return DEFAULT_HERO_IMAGE;
  }

  const data = rawData as unknown as SiteSetting;

  return data.value || DEFAULT_HERO_IMAGE;
}

export default async function Home() {
  const [activities, heroImage] = await Promise.all([
    getActivities(),
    getHeroImage(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-pkk-900">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover opacity-25"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-white">
              Desa Pulutan • Remboken • Minahasa
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
              Bersama Keluarga, Membangun Desa.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">
              Selamat datang di pusat informasi dan dokumentasi kegiatan PKK Desa
              Pulutan. Temukan program, kegiatan, dan cerita pemberdayaan keluarga
              di desa kita.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/kegiatan"
                className="rounded-full bg-white px-6 py-3 font-bold text-pkk-900 shadow-lg hover:bg-blue-50"
              >
                Lihat Kegiatan
              </Link>
              <Link
                href="/profil"
                className="rounded-full border border-white/30 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20"
              >
                Tentang PKK
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
              Dokumentasi
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Kegiatan Terbaru
            </h2>
          </div>
          <Link
            href="/kegiatan"
            className="text-sm font-bold text-pkk-600 hover:text-pkk-700"
          >
            Lihat semua →
          </Link>
        </div>

        {activities.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed bg-white p-12 text-center">
            <h3 className="text-xl font-bold">
              Belum ada kegiatan yang dipublikasikan
            </h3>
            <p className="mt-2 text-slate-500">
              Pengurus dapat menambahkan dokumentasi melalui halaman Admin.
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-block rounded-full bg-pkk-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              Buka Admin
            </Link>
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
              Tentang Kami
            </p>
            <h2 className="mt-2 text-3xl font-black">PKK Desa Pulutan</h2>
            <p className="mt-5 leading-8 text-slate-600">
              Website ini menjadi ruang digital untuk menyampaikan informasi kegiatan
              PKK, mendokumentasikan program pemberdayaan, serta memudahkan masyarakat
              mengikuti kegiatan yang dilaksanakan di Desa Pulutan.
            </p>
            <Link href="/profil" className="mt-6 inline-block font-bold text-pkk-600">
              Selengkapnya →
            </Link>
          </div>

          <div className="rounded-3xl bg-pkk-50 p-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              {["Kegiatan", "Keluarga", "Pemberdayaan", "Gotong Royong"].map((x) => (
                <div key={x} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="font-bold text-pkk-900">{x}</p>
                  <p className="mt-1 text-xs text-slate-500">Semangat PKK</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
