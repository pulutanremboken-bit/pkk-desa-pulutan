 "use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [logged,setLogged]=useState(false);
  const [msg,setMsg]=useState("");
  const [form,setForm]=useState({title:"",date:"",location:"",category:"Kegiatan PKK",excerpt:"",content:""});
  const [file,setFile]=useState<File|null>(null);

  async function login(e:React.FormEvent){e.preventDefault();setMsg(""); const {error}=await supabase().auth.signInWithPassword({email,password}); if(error)setMsg(error.message); else setLogged(true);}
  async function publish(e:React.FormEvent){e.preventDefault();setMsg(""); const s=supabase(); const {data:{user}}=await s.auth.getUser(); if(!user){setMsg("Silakan login terlebih dahulu.");return;}
    let cover_url=null;
    const slug=form.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")+"-"+Date.now();
    if(file){const path=`${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`; const up=await s.storage.from("kegiatan").upload(path,file,{upsert:false}); if(up.error){setMsg(up.error.message);return;} cover_url=s.storage.from("kegiatan").getPublicUrl(path).data.publicUrl;}
    const {error}=await s.from("kegiatan").insert({title:form.title,slug,category:form.category,event_date:form.date,location:form.location,excerpt:form.excerpt,content:form.content,cover_url,published:true});
    setMsg(error ? error.message : "Kegiatan berhasil dipublikasikan."); if(!error)setForm({title:"",date:"",location:"",category:"Kegiatan PKK",excerpt:"",content:""});
  }
  if(!logged) return <section className="mx-auto max-w-md px-4 py-20"><div className="rounded-3xl bg-white p-8 shadow-soft"><p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Pengurus</p><h1 className="mt-2 text-3xl font-black">Admin PKK</h1><p className="mt-3 text-sm text-slate-500">Login menggunakan akun Supabase Authentication.</p><form onSubmit={login} className="mt-7 space-y-4"><input className="w-full rounded-xl border p-3" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="w-full rounded-xl border p-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="w-full rounded-xl bg-pkk-600 p-3 font-bold text-white">Masuk</button></form>{msg&&<p className="mt-4 text-sm text-red-600">{msg}</p>}</div></section>;
  return <section className="mx-auto max-w-3xl px-4 py-16"><div className="rounded-3xl bg-white p-8 shadow-soft"><p className="text-sm font-bold uppercase tracking-[.18em] text-pkk-600">Dashboard</p><h1 className="mt-2 text-3xl font-black">Tambah Kegiatan</h1><form onSubmit={publish} className="mt-8 space-y-5">
    <input className="w-full rounded-xl border p-3" placeholder="Judul kegiatan" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
    <div className="grid gap-5 md:grid-cols-2"><input className="rounded-xl border p-3" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/><input className="rounded-xl border p-3" placeholder="Lokasi" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></div>
    <input className="w-full rounded-xl border p-3" placeholder="Kategori" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
    <textarea className="min-h-24 w-full rounded-xl border p-3" placeholder="Ringkasan singkat" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/>
    <textarea className="min-h-56 w-full rounded-xl border p-3" placeholder="Isi berita/kegiatan" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/>
    <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)}/>
    <button className="rounded-xl bg-pkk-600 px-6 py-3 font-bold text-white">Publikasikan Kegiatan</button>
  </form>{msg&&<p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">{msg}</p>}</div></section>;
}
