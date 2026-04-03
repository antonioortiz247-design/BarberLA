"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultServices } from "@/lib/defaultData";
import { Service, CartItem } from "@/types";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart) as CartItem[];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }

    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*").order("id");
      if (!error && data && data.length > 0) setServices(data);
      else setServices(defaultServices);
    };
    fetchServices();
  }, []);

  return (
    <main className="min-h-screen pb-28 md:pb-32">
      <Header />
      <div className="premium-shell pt-8">
        <p className="section-kicker mb-4">Precision Services</p>
        <h1 className="premium-title mb-3">Servicios <span className="text-[#d7b26c]">BarberLA</span></h1>
        <p className="premium-lead mb-8">Tratamientos de alto nivel con ejecución precisa, ritmo fluido y acabados impecables.</p>

        <div className="grid gap-4 md:gap-5">
          {services.map((service) => (
            <article key={service.id} className="premium-surface p-5 md:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-2 line-clamp-2">{service.name}</h2>
                <p className="text-sm text-[#a7adb5] inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-[#d7b26c]" /> {service.duration}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-[#d7b26c] mb-2">${service.price}</p>
                <Link
                  href={`/agenda?service=${service.id}`}
                  className="inline-flex rounded-xl border border-[#d7b26c]/35 bg-[#1a1f27] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d7b26c] hover:bg-[#d7b26c] hover:text-black transition-all"
                >
                  Reservar
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
