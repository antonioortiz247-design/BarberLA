"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { CartItem } from "@/types";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CarritoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      localStorage.setItem("barber_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem("barber_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen pb-24 bg-[#050505]">
      <Header />
      <div className="max-w-[500px] mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Tu <span className="text-[#c5a059]">Carrito</span></h2>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#0f0f0f] rounded-full flex items-center justify-center mb-6 border border-[#222]">
              <ShoppingCart size={32} className="text-[#888]" />
            </div>
            <p className="text-[#888] mb-8 font-light">Tu carrito está vacío</p>
            <Link href="/tienda" className="inline-block bg-[#1a1a1a] text-[#c5a059] px-8 py-3 rounded-xl border border-[#c5a059]/20 font-bold uppercase tracking-widest text-xs">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-10">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-6 border-b border-[#222]">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-white font-bold text-lg">{item.name}</h4>
                    <p className="text-[#c5a059] font-medium tracking-tight">${item.price} c/u</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3">
                    <div className="text-xl font-extrabold text-white tracking-tight">
                      ${item.price * item.quantity}
                    </div>
                    <div className="flex items-center gap-4 bg-[#0f0f0f] p-1.5 rounded-xl border border-[#222]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-[#888] hover:text-white"><Minus size={16} /></button>
                      <span className="text-white font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-[#c5a059] hover:text-[#c5a059]"><Plus size={16} /></button>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 ml-2 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-[#222] mb-8">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[#888] uppercase tracking-widest text-xs font-bold">Total del Carrito</span>
                <span className="text-3xl font-extrabold text-[#c5a059] tracking-tighter">${total}</span>
              </div>
              <Link href="/checkout" className="block w-full bg-gradient-to-br from-[#c5a059] to-[#a68541] text-black text-center font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(197,160,89,0.3)] uppercase tracking-widest text-sm">
                Continuar al Pago
              </Link>
            </div>
          </>
        )}
      </div>
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
    </main>
  );
}
