"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultProducts, defaultServices } from "@/lib/defaultData";
import { Service, Product, CartItem } from "@/types";
import { Clock, ArrowRight, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchData = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          supabase.from("services").select("*").order("id"),
          supabase.from("products").select("*").order("id"),
        ]);

        setServices(servicesRes.data && servicesRes.data.length > 0 ? servicesRes.data : defaultServices);
        setProducts(productsRes.data && productsRes.data.length > 0 ? productsRes.data : defaultProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        setServices(defaultServices);
        setProducts(defaultProducts);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const newCart = existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prev, { ...product, quantity: 1 }];

      localStorage.setItem("barber_cart", JSON.stringify(newCart));
      return newCart;
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
              <div>
                <p className="urban-chip mb-2">Bento Services</p>
                <h2 className="text-2xl font-bold md:text-3xl">Servicios destacados</h2>
              </div>
              <Link href="/servicios" className="inline-flex items-center gap-1 text-sm font-semibold text-[#d8b06a] hover:text-[#f6ddb0]">
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {services.filter((s) => s.featured).slice(0, 4).map((service) => (
                <Link
                  key={service.id}
                  href={`/agenda?service=${service.id}`}
                  className="rounded-2xl border border-white/15 bg-black/20 p-4 transition hover:border-[#d8b06a]/45"
                >
                  <h3 className="line-clamp-2 text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#a7afbb]">
                    <Clock size={14} className="text-[#d8b06a]" /> {service.duration}
                  </p>
                  <p className="text-xl font-extrabold text-[#d8b06a]">${service.price}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="glass-panel bento-half p-5 md:p-6 flex flex-col justify-between">
            <div>
              <p className="urban-chip mb-3">Urban Signal</p>
              <h3 className="text-xl font-bold mb-2">Imagen cuidada en cada detalle</h3>
              <p className="premium-lead">Diseño limpio + vibra street. Reserva, compra y administra en una experiencia continua.</p>
            </div>
            <Sparkles className="mt-6 text-[#d8b06a]" />
          </article>

          <article className="glass-panel bento-half p-5 md:p-6">
            <p className="urban-chip mb-3">Top Products</p>
            <h3 className="mb-4 text-xl font-bold">Tienda rápida</h3>
            <div className="space-y-3">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl border border-white/12 bg-black/20 p-2.5">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{product.name}</p>
                    <p className="text-sm font-bold text-[#d8b06a]">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/tienda" className="ghost-btn mt-4 w-full">Ver tienda completa</Link>
          </article>
        </section>

        <section className="bento-grid">
          {products.filter((p) => p.featured).map((product) => (
            <article key={product.id} className="glass-panel bento-half overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <Image src={product.image} alt={product.name} fill className="object-cover transition duration-700 hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="mb-3 min-h-[2.8rem] line-clamp-2 text-sm font-semibold md:text-base">{product.name}</h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-[#d8b06a]">${product.price}</span>
                  <button
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
