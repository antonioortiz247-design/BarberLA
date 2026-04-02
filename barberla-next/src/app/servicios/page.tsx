"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultServices } from "@/lib/defaultData";
import { Service, CartItem } from "@/types";
import { Clock, ChevronRight } from "lucide-react";
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
    <main className="min-h-screen pb-28 bg-[#060606]">
      <Header />
      <div className="premium-shell">
        <h2 className="premium-title text-white mb-8">Nuestros <span className="text-[#c8a96a]">Servicios</span></h2>
        
        <div className="space-y-4">
          {services.map((service) => (
            <div 
              key={service.id}
              className="flex justify-between items-center p-5 bg-[#101010] border border-[#272727] rounded-2xl group hover:border-[#c8a96a]/40 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                <h4 className="text-white font-bold text-lg group-hover:text-[#c5a059] transition-colors">{service.name}</h4>
                <p className="text-[#a1a1a1] text-sm flex items-center gap-1.5 font-light">
                  <Clock size={14} className="text-[#c8a96a]" /> {service.duration}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-[#c8a96a] tracking-tight mb-2">
                  ${service.price}
                </div>
                <Link 
                  href={`/agenda?service=${service.id}`}
                  className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#1a1a1a] text-[#c8a96a] px-4 py-2 rounded-lg border border-[#c8a96a]/20 hover:bg-[#c8a96a] hover:text-black transition-all"
                >
                  Reservar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
