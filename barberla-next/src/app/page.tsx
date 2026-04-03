"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultProducts, defaultServices } from "@/lib/defaultData";
import { CartItem, Product, Service } from "@/types";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const savedCart = localStorage.getItem("barber_cart");
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  });

  useEffect(() => {
    Promise.all([
      supabase.from("services").select("*").order("id"),
      supabase.from("products").select("*").order("id"),
    ])
      .then(([servicesRes, productsRes]) => {
        setServices(servicesRes.data && servicesRes.data.length > 0 ? servicesRes.data : defaultServices);
        setProducts(productsRes.data && productsRes.data.length > 0 ? productsRes.data : defaultProducts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setServices(defaultServices);
        setProducts(defaultProducts);
      });
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const updated = existing
        ? prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...prev, { ...product, quantity: 1 }];

      localStorage.setItem("barber_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen pb-28 md:pb-32">
      <Header />

      <div className="premium-shell space-y-8 py-6 md:space-y-10 md:py-8">
        <Hero />

        <section className="bento-grid">
          <article className="glass-panel bento-main p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="max-w-2xl">
                <p className="urban-chip mb-2">LA Signature</p>
                <h2 className="text-2xl font-bold md:text-3xl">Servicios destacados</h2>
              </div>
              <Link href="/servicios" className="inline-flex items-center gap-1 text-sm font-semibold text-[#d8b06a] hover:text-[#f6ddb0]">
                Ver todos
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {services
                .filter((service) => service.featured)
                .slice(0, 4)
                .map((service) => (
                  <Link
                    key={service.id}
                    href={`/agenda?service=${service.id}`}
                    className="rounded-2xl border border-white/15 bg-black/20 p-4 transition hover:border-[#d8b06a]/45"
                  >
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{service.name}</h3>
                    <p className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#a7afbb]">
                      <Clock size={14} className="text-[#d8b06a]" /> {service.duration}
                    </p>
                    <p className="text-xl font-extrabold text-[#d8b06a]">${service.price}</p>
                  </Link>
                ))}
            </div>
          </article>

          <article className="glass-panel bento-half p-5 md:p-6">
            <p className="urban-chip mb-3">Agenda inteligente</p>
            <h3 className="mb-2 text-xl font-bold">Bloqueo de horarios duplicados</h3>
            <p className="premium-lead mb-5">Las citas nuevas validan disponibilidad y no permiten apartar un horario ya ocupado.</p>
            <Link href="/agenda" className="cta-gold w-full">
              Agendar cita
            </Link>
          </article>

          <article className="glass-panel bento-half p-5 md:p-6">
            <p className="urban-chip mb-3">Panel operativo</p>
            <h3 className="mb-2 text-xl font-bold">Admin en tiempo real</h3>
            <p className="premium-lead mb-5">Gestiona servicios, productos y citas desde un solo panel conectado a Supabase.</p>
            <Link href="/admin" className="ghost-btn w-full">
              Ir al panel
            </Link>
          </article>
        </section>

        <section className="bento-grid">
          {products
            .filter((product) => product.featured)
            .slice(0, 4)
            .map((product) => (
              <article key={product.id} className="glass-panel bento-half overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={product.image} alt={product.name} fill className="object-cover transition duration-700 hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="mb-3 min-h-[2.8rem] line-clamp-2 text-sm font-semibold md:text-base">{product.name}</h3>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-[#d8b06a]">${product.price}</span>
                    <button
                      aria-label={`Agregar ${product.name} al carrito`}
                      onClick={() => addToCart(product)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8b06a]/35 bg-[#1b2230] text-[#d8b06a] transition hover:bg-[#d8b06a] hover:text-black"
                    >
                      <Plus size={18} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </div>

      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
