"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendRecovery(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const redirectTo = `${window.location.origin}/admin/reset-password`;
    const { error } = await supabase().auth.resetPasswordForEmail(email, { redirectTo });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Jika email tersebut terdaftar, tautan untuk membuat password baru telah dikirim. Silakan periksa Inbox atau folder Spam.");
  }

  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Admin PKK</p>
        <h1 className="mt-2 text-3xl font-black">Lupa Password?</h1>
        <p className="mt-3 text-sm text-slate-500">Masukkan email akun admin. Kami akan mengirim tautan untuk membuat password baru.</p>

        <form onSubmit={sendRecovery} className="mt-7 space-y-4">
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Email admin"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button disabled={loading} className="w-full rounded-xl bg-pkk-600 p-3 font-bold text-white disabled:opacity-60">
            {loading ? "Mengirim..." : "Kirim Link Pemulihan"}
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
