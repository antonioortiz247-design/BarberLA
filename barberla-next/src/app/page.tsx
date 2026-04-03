"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultProducts, defaultServices } from "@/lib/defaultData";
import { Service, Product, CartItem } from "@/types";
import { Clock, ArrowRight, Plus } from "lucide-react";
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

      <div className="premium-shell space-y-14 py-6 md:space-y-16 md:py-8">
        <Hero />

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="urban-chip mb-3">Crafted Services</p>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Rituales de corte con precisión total</h2>
              <p className="premium-lead mt-2">Bloques visuales limpios, información clara y CTA directa.</p>
            </div>
            <Link href="/servicios" className="inline-flex items-center gap-1 text-sm font-semibold text-[#d8b06a] hover:text-[#f6ddb0]">
              Ver catálogo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.filter((s) => s.featured).map((service) => (
              <Link key={service.id} href={`/agenda?service=${service.id}`} className="glass-panel p-5 transition hover:-translate-y-1">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{service.name}</h3>
                <p className="mb-5 inline-flex items-center gap-1.5 text-sm text-[#a7afbb]">
                  <Clock size={14} className="text-[#d8b06a]" /> {service.duration}
                </p>
                <p className="text-2xl font-extrabold text-[#d8b06a]">${service.price}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="urban-chip mb-3">Urban Store</p>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Productos premium para tu rutina</h2>
              <p className="premium-lead mt-2">Tarjetas compactas, textos balanceados y acciones sin solapes.</p>
            </div>
            <Link href="/tienda" className="inline-flex items-center gap-1 text-sm font-semibold text-[#d8b06a] hover:text-[#f6ddb0]">
              Ir a tienda <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.filter((p) => p.featured).map((product) => (
              <article key={product.id} className="glass-panel overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-3 min-h-[2.8rem] line-clamp-2 text-sm font-semibold md:text-base">{product.name}</h3>
                  <div className="flex items-center justify-between gap-2">
                    <span className="whitespace-nowrap text-lg font-bold text-[#d8b06a]">${product.price}</span>
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
          </div>
        </section>
      </div>

      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
