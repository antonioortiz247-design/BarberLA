"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { Service, CartItem } from "@/types";
import { Calendar, Clock, User, Phone, Receipt, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function AgendaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("service");

  const [services, setServices] = useState<Service[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    service_id: initialServiceId || "",
    date: "",
    time: "",
    name: "",
    phone: "",
    proof: ""
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart) as CartItem[];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }

    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("*").order("id");
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, proof: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_id || !formData.date || !formData.time || !formData.name || !formData.phone || !formData.proof) {
      alert("Por favor completa todos los campos y sube tu comprobante.");
      return;
    }

    setLoading(true);
    try {
      // Verificar duplicados
      const { data: duplicates } = await supabase
        .from("bookings")
        .select("id")
        .eq("date", formData.date)
        .eq("time", formData.time)
        .neq("status", "Cancelada");

      if (duplicates && duplicates.length > 0) {
        alert("Este horario ya está reservado. Por favor elige otro.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("bookings").insert([{
        ...formData,
        status: "Pendiente"
      }]);

      if (error) throw error;

      // Guardar reserva en session para el checkout
      sessionStorage.setItem("current_booking", JSON.stringify(formData));
      router.push("/checkout");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error al agendar. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto px-6">
      <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Agendar <span className="text-[#c5a059]">Cita</span></h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f0f0f] p-8 rounded-3xl border border-[#222]">
        <div className="space-y-2">
          <label className="text-[#888] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Loader2 size={14} className="text-[#c5a059]" /> Servicio
          </label>
          <select 
            value={formData.service_id}
            onChange={(e) => setFormData(prev => ({ ...prev, service_id: e.target.value }))}
            className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-5 py-4 text-white focus:border-[#c5a059] outline-none transition-all appearance-none"
          >
            <option value="">Selecciona un servicio</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[#888] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-[#c5a059]" /> Fecha
            </label>
            <input 
              type="date"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-5 py-4 text-white focus:border-[#c5a059] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[#888] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-[#c5a059]" /> Hora
            </label>
            <select 
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-5 py-4 text-white focus:border-[#c5a059] outline-none transition-all appearance-none"
            >
              <option value="">Selecciona</option>
              {["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[#888] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <User size={14} className="text-[#c5a059]" /> Tu Nombre
          </label>
          <input 
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-5 py-4 text-white focus:border-[#c5a059] outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[#888] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Phone size={14} className="text-[#c5a059]" /> WhatsApp
          </label>
          <input 
            type="tel"
            placeholder="Ej. 5512345678"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-5 py-4 text-white focus:border-[#c5a059] outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[#888] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Receipt size={14} className="text-[#c5a059]" /> Comprobante de Pago
          </label>
          <div className="relative h-32 bg-[#1a1a1a] border border-[#222] border-dashed rounded-xl flex flex-col items-center justify-center text-[#888] hover:border-[#c5a059]/50 transition-all cursor-pointer group overflow-hidden">
            {formData.proof ? (
              <Image src={formData.proof} alt="Comprobante" fill className="object-contain" />
            ) : (
              <>
                <Receipt size={24} className="mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sube tu foto</span>
              </>
            )}
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-br from-[#c5a059] to-[#a68541] text-black font-extrabold py-4 rounded-xl shadow-[0_4px_20px_rgba(197,160,89,0.3)] uppercase tracking-widest text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Continuar"}
        </button>
      </form>
      <Navbar cartCount={cartCount} />
    </div>
  );
}

export default function AgendaPage() {
  return (
    <main className="min-h-screen pb-24 bg-[#050505]">
      <Header />
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c5a059]" size={40} /></div>}>
        <AgendaContent />
      </Suspense>
    </main>
  );
}
