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
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const savedCart = localStorage.getItem("barber_cart");
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  });

  useEffect(() => {
    const fetchProducts = () => {
      supabase
        .from("products")
        .select("*")
        .order("id")
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) setProducts(data);
          else setProducts(defaultProducts);
        });
    };

    fetchProducts();

    const channel = supabase
      .channel("products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchProducts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      <div className="premium-shell space-y-8 py-8">
        <div className="max-w-3xl text-center md:text-left md:max-w-none">
          <p className="urban-chip mb-3">Bento Store</p>
          <h1 className="premium-title mb-3">Tienda <span className="text-[#d8b06a]">Glass Edition</span></h1>
          <p className="premium-lead">Catálogo modular en bloques tipo bento para explorar y comprar sin fricción.</p>
        </div>

        <div className="bento-grid">
          {products.map((product, index) => (
            <article key={product.id} className={`glass-panel overflow-hidden ${index % 5 === 0 ? "bento-main" : "bento-half"}`}>
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="mb-3 min-h-[2.8rem] line-clamp-2 text-sm font-semibold md:text-base">{product.name}</h2>
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
      </div>
      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
