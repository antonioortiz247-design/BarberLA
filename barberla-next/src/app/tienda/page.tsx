"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { defaultProducts } from "@/lib/defaultData";
import { Product, CartItem } from "@/types";
import { Plus } from "lucide-react";
import Image from "next/image";

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*").order("id");
      if (!error && data && data.length > 0) setProducts(data);
      else setProducts(defaultProducts);
    };
    fetchProducts();
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
      <div className="premium-shell pt-8">
        <p className="section-kicker mb-4">Luxury storefront</p>
        <h1 className="premium-title mb-3">Nuestra <span className="text-[#d7b26c]">Tienda</span></h1>
        <p className="premium-lead mb-8">Productos de alto rendimiento en un layout limpio, legible y perfectamente adaptable.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
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
                <h2 className="text-sm md:text-base font-semibold mb-3 line-clamp-2 min-h-[2.8rem]">{product.name}</h2>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[#d7b26c] font-bold text-lg whitespace-nowrap">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="h-10 w-10 shrink-0 rounded-xl border border-[#d7b26c]/30 bg-[#1a1f27] text-[#d7b26c] flex items-center justify-center hover:bg-[#d7b26c] hover:text-black transition-all"
                  >
                    <Plus size={18} strokeWidth={2.4} />
                  </button>
                </div>
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
