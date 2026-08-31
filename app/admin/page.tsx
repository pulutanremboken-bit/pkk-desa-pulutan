 "use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Activity = {
  id: string;
  title: string;
  slug: string;
  category: string;
  event_date: string;
  location: string | null;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
};

type ActivityForm = {
  title: string;
  date: string;
  location: string;
  category: string;
  excerpt: string;
  content: string;
};

const emptyForm: ActivityForm = {
  title: "",
  date: "",
  location: "",
  category: "Kegiatan PKK",
  excerpt: "",
  content: "",
};

function makeSlug(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now()
  );
}

function getStoragePath(publicUrl: string | null) {
  if (!publicUrl) return null;

  const marker = "/storage/v1/object/public/kegiatan/";
  const index = publicUrl.indexOf(marker);

  if (index === -1) return null;

  return decodeURIComponent(publicUrl.slice(index + marker.length));
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [form, setForm] = useState<ActivityForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingOldCover, setEditingOldCover] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const DEFAULT_HERO_IMAGE =
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1800&q=85";
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [savingHero, setSavingHero] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);
 
  const mountedRef = useRef(true);
  const dashboardRequestRef = useRef(0);

   async function loadDashboard() {
    const requestId = ++dashboardRequestRef.current;
    const s = supabase();

    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await s.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (
        !mountedRef.current ||
        requestId !== dashboardRequestRef.current
      ) {
        return;
      }

      const user = session?.user;

      if (!user) {
        setLogged(false);
        setActivities([]);
        return;
      }

      setEmail(user.email ?? "");
      setLogged(true);

      const activitiesResult = await s
        .from("kegiatan")
        .select("*")
        .order("event_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (
        !mountedRef.current ||
        requestId !== dashboardRequestRef.current
      ) {
        return;
      }

      if (activitiesResult.error) {
        setError(activitiesResult.error.message);
      } else {
        setActivities(
          (activitiesResult.data ?? []) as Activity[]
        );
      }

      // Mengambil pengaturan foto beranda.
      // Tabel site_settings belum memiliki tipe otomatis
      // pada konfigurasi Supabase, sehingga data diberikan
      // tipe secara eksplisit.
      const settingResult = await s
        .from("site_settings")
        .select("value")
        .eq("key", "hero_image")
        .maybeSingle();

      if (
        !mountedRef.current ||
        requestId !== dashboardRequestRef.current
      ) {
        return;
      }

      if (settingResult.error) {
        console.error(
          "Gagal memuat pengaturan beranda:",
          settingResult.error.message
        );

        setHeroImage(DEFAULT_HERO_IMAGE);
      } else {
        const settingData =
          settingResult.data as unknown as {
            value: string;
          } | null;

        setHeroImage(
          settingData?.value ||
            DEFAULT_HERO_IMAGE
        );
      }
    } catch (err) {
      if (
        !mountedRef.current ||
        requestId !== dashboardRequestRef.current
      ) {
        return;
      }

      const rawMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat dashboard.";

      if (rawMessage.includes("Failed to fetch")) {
        setError(
          "Gagal terhubung ke Supabase. Periksa koneksi internet lalu coba lagi. Sesi admin tetap aman."
        );
      } else {
        setError(rawMessage);
      }
    } finally {
      if (
        mountedRef.current &&
        requestId === dashboardRequestRef.current
      ) {
        setLoading(false);
      }
    }
  }

useEffect(() => {
  mountedRef.current = true;

  loadDashboard();

  const s = supabase();

  const {
    data: { subscription },
  } = s.auth.onAuthStateChange((event, session) => {
    if (!mountedRef.current) return;

    if (event === "SIGNED_OUT" || !session?.user) {
      setLogged(false);
      setActivities([]);
      setEmail("");
      return;
    }

    if (event === "SIGNED_IN") {
      setEmail(session.user.email ?? "");
      setLogged(true);
      loadDashboard();
    }
  });

  return () => {
    mountedRef.current = false;
    subscription.unsubscribe();
  };
}, []);
 
async function login(e: FormEvent) {
  e.preventDefault();

  setMsg("");
  setError("");
  setLoading(true);

  try {
    const { error: loginError } =
      await supabase().auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setPassword("");

    // Dashboard akan dimuat oleh event SIGNED_IN.
    // Jangan panggil loadDashboard() lagi di sini.
  } catch (err) {
    const rawMessage =
      err instanceof Error
        ? err.message
        : "Gagal melakukan login.";

    if (rawMessage.includes("Failed to fetch")) {
      setError(
        "Gagal terhubung ke server saat login. Periksa koneksi internet lalu coba lagi."
      );
    } else {
      setError(rawMessage);
    }

    setLoading(false);
  }
}

  async function logout() {
  setError("");
  setMsg("");

  try {
    const { error: signOutError } =
      await supabase().auth.signOut();

    if (signOutError) {
      throw signOutError;
    }

    // Membatalkan request dashboard yang mungkin masih berjalan.
    dashboardRequestRef.current += 1;

    setLogged(false);
    setEmail("");
    setActivities([]);
    setForm(emptyForm);
    setEditingId(null);

    setMsg("Anda sudah keluar dari akun admin.");
  } catch (err) {
    const rawMessage =
      err instanceof Error
        ? err.message
        : "Gagal keluar dari akun admin.";

    if (rawMessage.includes("Failed to fetch")) {
      setError(
        "Gagal terhubung ke server saat keluar. Silakan coba lagi."
      );
    } else {
      setError(rawMessage);
    }
  }
}

  function resetForm() {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
    setEditingOldCover(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function startEdit(item: Activity) {
    setEditingId(item.id);
    setEditingOldCover(item.cover_url);
    setForm({
      title: item.title,
      date: item.event_date,
      location: item.location ?? "",
      category: item.category,
      excerpt: item.excerpt ?? "",
      content: item.content,
    });
    setFile(null);
    setMsg("");
    setError("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

async function saveHeroImage() {
  setSavingHero(true);
  setMsg("");
  setError("");

  try {
    const s = supabase();

    const {
      data: { session },
      error: sessionError,
    } = await s.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const user = session?.user;

    if (!user) {
      setError("Sesi admin sudah berakhir. Silakan login kembali.");
      setLogged(false);
      return;
    }

    let nextUrl = heroImage;
    const oldUrl = heroImage;

    if (heroFile) {
      const safeName = heroFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

      const path = `site/hero-${Date.now()}-${safeName}`;

      const { error: uploadError } = await s.storage
        .from("kegiatan")
        .upload(path, heroFile, {
          upsert: false,
          contentType: heroFile.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = s.storage
        .from("kegiatan")
        .getPublicUrl(path);

      nextUrl = publicUrl;
    }

    const { error: settingError } = await s
      .from("site_settings")
      .upsert(
        {
          key: "hero_image",
          value: nextUrl,
          updated_at: new Date().toISOString(),
        } as never,
        {
          onConflict: "key",
        }
      );

    if (settingError) {
      throw settingError;
    }

    // Hapus foto hero lama setelah foto baru berhasil disimpan.
    if (
      heroFile &&
      oldUrl &&
      oldUrl.includes(
        "/storage/v1/object/public/kegiatan/"
      )
    ) {
      const marker =
        "/storage/v1/object/public/kegiatan/";

      const index = oldUrl.indexOf(marker);

      if (index !== -1) {
        const oldPath = decodeURIComponent(
          oldUrl.slice(index + marker.length)
        );

        if (oldPath.startsWith("site/")) {
          const { error: removeError } =
            await s.storage
              .from("kegiatan")
              .remove([oldPath]);

          if (removeError) {
            console.warn(
              "Foto hero lama tidak dapat dihapus:",
              removeError.message
            );
          }
        }
      }
    }

    setHeroImage(nextUrl);
    setHeroFile(null);

    setMsg("Foto beranda berhasil diperbarui.");
  } catch (err) {
    const rawMessage =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat memperbarui foto beranda.";

    if (rawMessage.includes("Failed to fetch")) {
      setError(
        "Gagal terhubung ke Supabase saat mengunggah foto. Periksa koneksi internet dan coba lagi."
      );
    } else {
      setError(rawMessage);
    }
  } finally {
    setSavingHero(false);
  }
}
  async function saveActivity(e: FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMsg("");
    setError("");

    const s = supabase();

    const {
      data: { user },
    } = await s.auth.getUser();

    if (!user) {
      setError("Sesi admin sudah berakhir. Silakan login kembali.");
      setLogged(false);
      setSaving(false);
      return;
    }

    let cover_url = editingId ? editingOldCover : null;

    if (file) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${Date.now()}-${safeName}`;

      const upload = await s.storage
        .from("kegiatan")
        .upload(path, file, { upsert: false });

      if (upload.error) {
        setError(upload.error.message);
        setSaving(false);
        return;
      }

      cover_url = s.storage.from("kegiatan").getPublicUrl(path).data.publicUrl;
    }

    if (editingId) {
      const { error: updateError } = await s
        .from("kegiatan")
        .update({
          title: form.title,
          category: form.category,
          event_date: form.date,
          location: form.location,
          excerpt: form.excerpt,
          content: form.content,
          cover_url,
        } as never)
        .eq("id", editingId);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      // Hapus foto lama hanya jika foto baru berhasil menggantikan foto lama.
      if (file && editingOldCover && editingOldCover !== cover_url) {
        const oldPath = getStoragePath(editingOldCover);
        if (oldPath) {
          await s.storage.from("kegiatan").remove([oldPath]);
        }
      }

      setMsg("Kegiatan berhasil diperbarui.");
    } else {
      const slug = makeSlug(form.title);

      const { error: insertError } = await s.from("kegiatan").insert({
        title: form.title,
        slug,
        category: form.category,
        event_date: form.date,
        location: form.location,
        excerpt: form.excerpt,
        content: form.content,
        cover_url,
        published: true,
      } as never);

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      setMsg("Kegiatan berhasil dipublikasikan.");
    }

    resetForm();
    await loadDashboard();
    setSaving(false);
  }

  async function deleteActivity(item: Activity) {
    const confirmed = window.confirm(
      `Hapus kegiatan "${item.title}"?\n\nData kegiatan akan dihapus dari website. Jika memiliki foto dari Supabase Storage, fotonya juga akan dihapus.`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setMsg("");
    setError("");

    const s = supabase();

    const { error: deleteError } = await s
      .from("kegiatan")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    const path = getStoragePath(item.cover_url);

    if (path) {
      await s.storage.from("kegiatan").remove([path]);
    }

    if (editingId === item.id) {
      resetForm();
    }

    setMsg("Kegiatan berhasil dihapus.");
    await loadDashboard();
    setDeletingId(null);
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
          <p className="text-sm text-slate-500">Memuat dashboard admin...</p>
        </div>
      </section>
    );
  }

  if (!logged) {
    return (
      <section className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
            Pengurus
          </p>

          <h1 className="mt-2 text-3xl font-black">Admin PKK</h1>

          <p className="mt-3 text-sm text-slate-500">
            Login menggunakan akun Supabase Authentication.
          </p>

          <form onSubmit={login} className="mt-7 space-y-4">
            <input
              className="w-full rounded-xl border p-3"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-pkk-600 p-3 font-bold text-white disabled:opacity-60"
            >
              Masuk
            </button>
          </form>

          <div className="mt-5 text-center">
            <a
              href="/admin/forgot-password"
              className="text-sm font-semibold text-pkk-600 hover:underline"
            >
              Lupa password?
            </a>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {msg && (
            <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
              {msg}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
            Dashboard Admin
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Kelola Kegiatan PKK
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola kegiatan yang ditampilkan kepada masyarakat Desa Pulutan.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Keluar
        </button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Total kegiatan</p>
          <p className="mt-1 text-3xl font-black text-slate-900">
            {activities.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Dipublikasikan</p>
          <p className="mt-1 text-3xl font-black text-pkk-600">
            {activities.filter((item) => item.published).length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Akun admin</p>
          <p className="mt-1 truncate text-base font-bold text-slate-900">
            {email}
          </p>
        </div>
      </div>

      {(msg || error) && (
        <div
          className={`mb-6 rounded-2xl p-4 text-sm ${
            error
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || msg}
        </div>
      )}

      <div className="mb-8 rounded-3xl bg-white p-6 shadow-soft">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
            Pengaturan Beranda
          </p>
          <h2 className="mt-1 text-2xl font-black">Foto Utama Beranda</h2>
          <p className="mt-2 text-sm text-slate-500">
            Foto ini tampil sebagai latar besar di bagian paling atas halaman utama.
            Setelah disimpan, perubahan akan tampil di website publik.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_280px] md:items-center">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Pilih foto baru
            </label>
            <input
              className="mt-2 block w-full text-sm"
              type="file"
              accept="image/*"
              onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-2 text-xs text-slate-500">
              Gunakan foto kegiatan/aktivitas PKK yang memiliki hak penggunaan.
              Foto landscape beresolusi tinggi akan terlihat paling baik.
            </p>
            <button
              type="button"
              disabled={savingHero}
              onClick={saveHeroImage}
              className="mt-4 rounded-xl bg-pkk-600 px-5 py-3 text-sm font-bold text-white hover:bg-pkk-700 disabled:opacity-60"
            >
              {savingHero ? "Menyimpan..." : "Simpan Foto Beranda"}
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-slate-100">
            <img
              src={heroImage}
              alt="Pratinjau foto beranda"
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
                {editingId ? "Edit" : "Tambah"}
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {editingId ? "Edit Kegiatan" : "Kegiatan Baru"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Batal edit
              </button>
            )}
          </div>

          <form onSubmit={saveActivity} className="mt-6 space-y-4">
            <input
              className="w-full rounded-xl border p-3"
              placeholder="Judul kegiatan"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border p-3"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <input
                className="rounded-xl border p-3"
                placeholder="Lokasi"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Kategori"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <textarea
              className="min-h-24 w-full rounded-xl border p-3"
              placeholder="Ringkasan singkat"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />

            <textarea
              className="min-h-48 w-full rounded-xl border p-3"
              placeholder="Isi berita/kegiatan"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />

            <div className="rounded-xl border border-dashed p-4">
              <label className="text-sm font-semibold text-slate-700">
                {editingId
                  ? "Ganti foto kegiatan (opsional)"
                  : "Foto kegiatan (opsional)"}
              </label>

              <input
                ref={fileRef}
                className="mt-2 block w-full text-sm"
                type="file"
                accept="image/*"
                onChange={handleFile}
              />

              {editingId && editingOldCover && (
                <p className="mt-2 text-xs text-slate-500">
                  Foto lama tetap digunakan jika Anda tidak memilih foto baru.
                </p>
              )}
            </div>

            <button
              disabled={saving}
              className="w-full rounded-xl bg-pkk-600 px-6 py-3 font-bold text-white hover:bg-pkk-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Publikasikan Kegiatan"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">
                Data
              </p>
              <h2 className="mt-1 text-2xl font-black">Daftar Kegiatan</h2>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              className="rounded-lg border px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Muat ulang
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {activities.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                Belum ada kegiatan.
              </div>
            ) : (
              activities.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {item.cover_url ? (
                      <img
                        src={item.cover_url}
                        alt=""
                        className="h-24 w-full rounded-xl object-cover sm:w-32"
                      />
                    ) : (
                      <div className="flex h-24 w-full items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:w-32">
                        Tanpa foto
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-pkk-50 px-2.5 py-1 text-[11px] font-bold uppercase text-pkk-700">
                          {item.category}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.published ? "Dipublikasi" : "Draft"}
                        </span>
                      </div>

                      <h3 className="mt-2 font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(item.event_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {item.location ? ` • ${item.location}` : ""}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => deleteActivity(item)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
