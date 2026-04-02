"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultProducts, defaultServices } from "@/lib/defaultData";
import { Service, Product, CartItem } from "@/types";
import { Clock, ChevronRight, Plus } from "lucide-react";
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

      <div className="premium-shell pt-6 md:pt-8">
        <Hero />

        <section className="mb-14 md:mb-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Servicios destacados</h2>
              <p className="premium-lead mt-2">Experiencias precisas para una imagen limpia y sofisticada.</p>
            </div>
            <Link href="/servicios" className="text-[#d0ac67] text-sm font-semibold inline-flex items-center gap-1 hover:text-[#f4dba3] transition-colors">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {services.filter((s) => s.featured).map((service) => (
              <Link
                key={service.id}
                href={`/agenda?service=${service.id}`}
                className="premium-surface p-5 md:p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight mb-2">{service.name}</h3>
                  <p className="text-sm text-[#a7adb5] inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-[#d0ac67]" /> {service.duration}
                  </p>
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-[#d0ac67]">${service.price}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 md:mb-14">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Productos premium</h2>
              <p className="premium-lead mt-2">Selección curada de grooming para mantener tu estilo todos los días.</p>
            </div>
            <Link href="/tienda" className="text-[#d0ac67] text-sm font-semibold inline-flex items-center gap-1 hover:text-[#f4dba3] transition-colors">
              Ir a tienda <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {products
              .filter((p) => p.featured)
              .map((product) => (
                <article key={product.id} className="premium-surface overflow-hidden group">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-semibold mb-3 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-[#d0ac67]">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="h-10 w-10 rounded-xl border border-[#d0ac67]/30 bg-[#17191c] text-[#d0ac67] flex items-center justify-center hover:bg-[#d0ac67] hover:text-black transition-all"
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
