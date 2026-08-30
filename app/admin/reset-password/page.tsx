"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = supabase();
    s.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });

    const { data: listener } = s.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    const { error } = await supabase().auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password berhasil diperbarui. Silakan masuk menggunakan password baru.");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Admin PKK</p>
        <h1 className="mt-2 text-3xl font-black">Buat Password Baru</h1>
        <p className="mt-3 text-sm text-slate-500">Gunakan password minimal 8 karakter.</p>

        {!ready && !message && (
          <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">Tautan pemulihan belum aktif atau sudah kedaluwarsa. Silakan minta tautan baru dari halaman Lupa Password.</p>
        )}

        <form onSubmit={updatePassword} className="mt-7 space-y-4">
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Password baru"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            disabled={!ready}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Ulangi password baru"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
            disabled={!ready}
          />
          <button disabled={loading || !ready} className="w-full rounded-xl bg-pkk-600 p-3 font-bold text-white disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>

        {message && <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 text-center">
          <a href="/admin" className="text-sm font-semibold text-pkk-600 hover:underline">← Kembali ke Login Admin</a>
        </div>
      </div>
    </section>
  );
}
