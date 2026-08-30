import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

const PKK_LOGO =
  "https://pkk.malukuprov.go.id/wp-content/uploads/2020/08/Logo-PKK-300x296-1.png";

const MINAHASA_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/0/01/Emblem_of_Minahasa_Regency.png";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* Header hanya menggunakan dua logo: Logo PKK dan Logo Kabupaten Minahasa */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src={PKK_LOGO}
                alt="Logo PKK"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>

            <div className="relative h-12 w-12 shrink-0">
              <Image
                src={MINAHASA_LOGO}
                alt="Logo Kabupaten Minahasa"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-pkk-600">
              Pemberdayaan Kesejahteraan Keluarga
            </p>
            <p className="text-lg font-bold text-pkk-900">
              PKK Desa Pulutan
            </p>
            <p className="text-xs text-slate-500">
              Kecamatan Remboken • Minahasa
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="hover:text-pkk-600">Beranda</Link>
          <Link href="/profil" className="hover:text-pkk-600">Profil</Link>
          <Link href="/kegiatan" className="hover:text-pkk-600">Kegiatan</Link>
          <Link href="/galeri" className="hover:text-pkk-600">Galeri</Link>
          <Link
            href="/admin"
            className="rounded-full bg-pkk-600 px-4 py-2 text-white hover:bg-pkk-700"
          >
            Admin
          </Link>
        </nav>

        <button
          className="rounded-lg border p-2 md:hidden"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
