"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Service, CartItem } from "@/types";
import { Send, CheckCircle2, ChevronRight, ShoppingBag, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedBooking = sessionStorage.getItem("current_booking");
    if (savedBooking) setBooking(JSON.parse(savedBooking));

    const savedCart = localStorage.getItem("barber_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("*");
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const total = (cart.reduce((acc, item) => acc + item.price * item.quantity, 0)) + 
                (booking ? services.find(s => s.id == booking.service_id)?.price || 0 : 0);

  const sendToWhatsApp = () => {
    let message = `Hola, quiero agendar una cita y hacer un pedido:\n\n`;

    if (booking) {
      const service = services.find(s => s.id == booking.service_id);
      message += `👤 *Nombre:* ${booking.name}\n✂️ *Servicio:* ${service?.name}\n📅 *Fecha:* ${booking.date}\n⏰ *Hora:* ${booking.time}\n\n`;
    }

    if (cart.length > 0) {
      message += `🛍️ *Productos:*\n`;
      cart.forEach(item => {
        message += `- ${item.name} (x${item.quantity}) - $${item.price * item.quantity}\n`;
      });
      message += `\n`;
    }
    
    message += `💰 *Total:* $${total}`;
    
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5611451113'}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito y reserva después de enviar
    localStorage.removeItem("barber_cart");
    sessionStorage.removeItem("current_booking");
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#c5a059]"><CheckCircle2 className="animate-pulse" size={40} /></div>;

  return (
    <main className="min-h-screen pb-24 bg-[#050505]">
      <Header />
      <div className="max-w-[500px] mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Confirmación <span className="text-[#c5a059]">Final</span></h2>
        
        <div className="space-y-6">
          <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-[#222]">
            <h3 className="text-[#888] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#c5a059]" /> Resumen del Pedido
            </h3>

            {booking && (
              <div className="flex items-start gap-4 mb-8 pb-6 border-b border-[#222]">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#222]">
                  <Scissors size={18} className="text-[#c5a059]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold">{services.find(s => s.id == booking.service_id)?.name}</h4>
                  <p className="text-[#888] text-sm font-light italic tracking-tight">{booking.date} a las {booking.time}</p>
                </div>
                <div className="text-white font-extrabold tracking-tight">
                  ${services.find(s => s.id == booking.service_id)?.price}
                </div>
              </div>
            )}

            {cart.map((item) => (
              <div key={item.id} className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#222]">
                  <ShoppingBag size={18} className="text-[#c5a059]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold">{item.name}</h4>
                  <p className="text-[#888] text-sm font-light italic tracking-tight">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-white font-extrabold tracking-tight">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 border-t border-[#222]">
              <span className="text-white font-bold text-lg">Total a Pagar</span>
              <span className="text-3xl font-extrabold text-[#c5a059] tracking-tighter">${total}</span>
            </div>
          </div>

          <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-[#222] text-center">
            <p className="text-[#888] text-sm font-light mb-8 leading-relaxed italic">
              Al confirmar, se enviará tu pedido por WhatsApp para la validación final del comprobante.
            </p>
            <button 
              onClick={sendToWhatsApp}
              className="w-full bg-[#25D366] text-white font-extrabold py-5 rounded-xl shadow-[0_4px_20px_rgba(37,211,102,0.3)] uppercase tracking-widest text-sm flex items-center justify-center gap-3"
            >
              <Send size={18} /> Enviar por WhatsApp
            </button>
          </div>
        </div>
      </div>
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />
    </main>
  );
}
