"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { CartItem, Service } from "@/types";
import { Calendar, Clock, Loader2, Phone, Receipt, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const TIME_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

function AgendaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("service") ?? "";

  const [services, setServices] = useState<Service[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    service_id: initialServiceId,
    date: "",
    time: "",
    name: "",
    phone: "",
    proof: "",
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

  useEffect(() => {
    if (!formData.date) {
      setBusySlots([]);
      return;
    }

    const fetchBusySlots = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("time")
        .eq("date", formData.date)
        .in("status", ["Pendiente", "Confirmada"]);

      setBusySlots((data ?? []).map((item) => item.time));
    };

    fetchBusySlots();
  }, [formData.date]);

  const availableSlots = useMemo(
    () => TIME_SLOTS.map((slot) => ({ slot, disabled: busySlots.includes(slot) })),
    [busySlots],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, proof: String(event.target?.result ?? "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.service_id || !formData.date || !formData.time || !formData.name || !formData.phone || !formData.proof) {
      alert("Por favor completa todos los campos y sube tu comprobante.");
      return;
    }

    setLoading(true);

    try {
      const { data: duplicates, error: duplicateError } = await supabase
        .from("bookings")
        .select("id")
        .eq("date", formData.date)
        .eq("time", formData.time)
        .in("status", ["Pendiente", "Confirmada"])
        .limit(1);

      if (duplicateError) throw duplicateError;

      if (duplicates && duplicates.length > 0) {
        alert("Ese horario ya no está disponible. Elige otro por favor.");
        return;
      }

      const { error } = await supabase.from("bookings").insert([
        {
          ...formData,
          status: "Pendiente",
        },
      ]);

      if (error) throw error;

      sessionStorage.setItem("current_booking", JSON.stringify(formData));
      router.push("/checkout");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("No se pudo agendar la cita. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[520px] px-6">
      <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-white">
        Agendar cita en <span className="text-[#c5a059]">LA</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-[#222] bg-[#0f0f0f] p-8">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888]">
            <Loader2 size={14} className="text-[#c5a059]" /> Servicio
          </label>
          <select
            value={formData.service_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, service_id: e.target.value }))}
            className="w-full appearance-none rounded-xl border border-[#222] bg-[#1a1a1a] px-5 py-4 text-white outline-none transition-all focus:border-[#c5a059]"
          >
            <option value="">Selecciona un servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888]">
              <Calendar size={14} className="text-[#c5a059]" /> Fecha
            </label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value, time: "" }))}
              className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-5 py-4 text-white outline-none transition-all focus:border-[#c5a059]"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888]">
              <Clock size={14} className="text-[#c5a059]" /> Hora
            </label>
            <select
              value={formData.time}
              onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              className="w-full appearance-none rounded-xl border border-[#222] bg-[#1a1a1a] px-5 py-4 text-white outline-none transition-all focus:border-[#c5a059]"
            >
              <option value="">Selecciona</option>
              {availableSlots.map(({ slot, disabled }) => (
                <option key={slot} value={slot} disabled={disabled}>
                  {disabled ? `${slot} (ocupado)` : slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888]">
            <User size={14} className="text-[#c5a059]" /> Tu Nombre
          </label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-5 py-4 text-white outline-none transition-all focus:border-[#c5a059]"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888]">
            <Phone size={14} className="text-[#c5a059]" /> WhatsApp
          </label>
          <input
            type="tel"
            placeholder="Ej. 5512345678"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-5 py-4 text-white outline-none transition-all focus:border-[#c5a059]"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888]">
            <Receipt size={14} className="text-[#c5a059]" /> Comprobante de Pago
          </label>
          <div className="group relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#222] bg-[#1a1a1a] text-[#888] transition-all hover:border-[#c5a059]/50">
            {formData.proof ? (
              <Image src={formData.proof} alt="Comprobante" fill className="object-contain" />
            ) : (
              <>
                <Receipt size={24} className="mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sube tu foto</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 cursor-pointer opacity-0" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#a68541] py-4 text-sm font-extrabold uppercase tracking-widest text-black shadow-[0_4px_20px_rgba(197,160,89,0.3)] disabled:opacity-50"
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
    <main className="min-h-screen bg-[#050505] pb-24">
      <Header />
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c5a059]" size={40} /></div>}>
        <AgendaContent />
      </Suspense>
    </main>
  );
}
