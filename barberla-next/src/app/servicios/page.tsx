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
      <div className="premium-shell space-y-8 py-8">
        <div className="max-w-3xl text-center md:text-left md:max-w-none">
          <p className="urban-chip mb-3">Bento Services</p>
          <h1 className="premium-title mb-3">Servicios <span className="text-[#d8b06a]">BarberLA</span></h1>
          <p className="premium-lead">Módulos de servicio con glassmorphism, lectura clara y CTA directos.</p>
        </div>

        <div className="bento-grid">
          {services.map((service, index) => (
            <article key={service.id} className={`glass-panel p-5 md:p-6 flex flex-col gap-5 ${index % 3 === 0 ? "bento-main" : "bento-half"}`}>
              <div>
                <h2 className="mb-2 line-clamp-2 text-xl font-semibold tracking-tight">{service.name}</h2>
                <p className="inline-flex items-center gap-1.5 text-sm text-[#a7afbb]">
                  <Clock size={14} className="text-[#d8b06a]" /> {service.duration}
                </p>
              </div>

              <div className="mt-auto flex items-end justify-between gap-3">
                <p className="text-2xl font-bold text-[#d8b06a]">${service.price}</p>
                <Link href={`/agenda?service=${service.id}`} className="cta-gold">Reservar</Link>
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
