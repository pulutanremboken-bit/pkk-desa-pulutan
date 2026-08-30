import Link from "next/link";
import Image from "next/image";

export type Activity = {
  id: string;
  title: string;
  slug: string;
  category: string;
  event_date: string;
  location?: string | null;
  excerpt?: string | null;
  cover_url?: string | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80";

export default function ActivityCard({ item }: { item: Activity }) {
  const imageUrl = item.cover_url || FALLBACK_IMAGE;

  return (
    <article className="group overflow-hidden rounded-2xl border bg-white shadow-soft transition hover:-translate-y-1">
      <Link href={`/kegiatan/${item.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-pkk-600">
            {item.category}
          </span>

          <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
            {item.title}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {new Date(item.event_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {item.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
              {item.excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
