"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
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
      const { data } = await supabase.from("products").select("*").order("id");
      if (data) setProducts(data);
    };
    fetchProducts();
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
        <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Nuestra <span className="text-[#c5a059]">Tienda</span></h2>
        
        <div className="grid grid-cols-2 gap-5">
          {products.map((product) => (
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
      </div>
      <FloatingCart count={cartCount} />
      <Navbar cartCount={cartCount} />
    </main>
  );
}
