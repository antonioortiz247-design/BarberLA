"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
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
      const { data } = await supabase.from("services").select("*").order("id");
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  return (
    <main className="min-h-screen pb-24 bg-[#050505]">
      <Header />
      <div className="max-w-[500px] mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Nuestros <span className="text-[#c5a059]">Servicios</span></h2>
        
        <div className="space-y-4">
          {services.map((service) => (
            <div 
              key={service.id}
              className="flex justify-between items-center p-5 bg-[#0f0f0f] border border-[#222] rounded-2xl group"
            >
              <div className="flex flex-col gap-1">
                <h4 className="text-white font-bold text-lg group-hover:text-[#c5a059] transition-colors">{service.name}</h4>
                <p className="text-[#888] text-sm flex items-center gap-1.5 font-light">
                  <Clock size={14} className="text-[#c5a059]" /> {service.duration}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-[#c5a059] tracking-tight mb-2">
                  ${service.price}
                </div>
                <Link 
                  href={`/agenda?service=${service.id}`}
                  className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#1a1a1a] text-[#c5a059] px-4 py-2 rounded-lg border border-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black transition-all"
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
