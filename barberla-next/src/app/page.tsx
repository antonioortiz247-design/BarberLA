"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { Service, Product, CartItem } from "@/types";
import { ShoppingCart, Clock, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar carrito de localStorage
    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    // Cargar datos de Supabase
    const fetchData = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          supabase.from("services").select("*").order("id"),
          supabase.from("products").select("*").order("id")
        ]);

        if (servicesRes.data) setServices(servicesRes.data);
        if (productsRes.data) setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem("barber_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen pb-24 bg-[#050505]">
      <Header />
      
      <div className="max-w-[500px] mx-auto px-6">
        <Hero />

        {/* Featured Services */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Servicios Destacados</h3>
            <Link href="/servicios" className="text-[#c5a059] text-sm font-medium flex items-center">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {services.filter(s => s.featured).map((service) => (
              <Link 
                key={service.id}
                href={`/agenda?service=${service.id}`}
                className="flex justify-between items-center p-5 bg-[#0f0f0f] border border-[#222] rounded-2xl hover:border-[#c5a059]/50 transition-all duration-300 group"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="text-white font-bold text-lg group-hover:text-[#c5a059] transition-colors">{service.name}</h4>
                  <p className="text-[#888] text-sm flex items-center gap-1.5 font-light">
                    <Clock size={14} className="text-[#c5a059]" /> {service.duration}
                  </p>
                </div>
                <div className="text-xl font-extrabold text-[#c5a059] tracking-tight">
                  ${service.price}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Productos Populares</h3>
            <Link href="/tienda" className="text-[#c5a059] text-sm font-medium flex items-center">
              Ir a tienda <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {products.filter(p => p.featured).map((product) => (
              <div key={product.id} className="bg-[#0f0f0f] border border-[#222] rounded-3xl overflow-hidden group hover:border-[#c5a059]/30 transition-all duration-500">
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-white text-sm font-bold mb-3 line-clamp-1">{product.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-[#c5a059] font-extrabold text-lg tracking-tight">${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-[#1a1a1a] text-[#c5a059] p-2.5 rounded-xl border border-[#c5a059]/20 hover:bg-[#c5a059] hover:text-black transition-all duration-300"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
