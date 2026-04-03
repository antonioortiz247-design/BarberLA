"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { defaultProducts, defaultServices } from "@/lib/defaultData";
import { Booking, Service, Product } from "@/types";
import { 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  Phone, 
  Scissors, 
  ShoppingBag,
  Pencil
} from "lucide-react";
import Image from "next/image";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("barber_admin") === "true";
  });
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  // Nuevo Producto State
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    featured: false
  });

  async function fetchAdminData() {
    const [bookingsRes, servicesRes, productsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("date", { ascending: true }),
      supabase.from("services").select("*").order("id"),
      supabase.from("products").select("*").order("id")
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    setServices(servicesRes.data && servicesRes.data.length > 0 ? servicesRes.data : defaultServices);
    setProducts(productsRes.data && productsRes.data.length > 0 ? productsRes.data : defaultProducts);
  }

  useEffect(() => {
    if (isAdmin) fetchAdminData();
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Edgar@") {
      setIsAdmin(true);
      sessionStorage.setItem("barber_admin", "true");
      fetchAdminData();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("barber_admin");
  };

  const updateBookingStatus = async (id: number, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (!error) fetchAdminData();
  };

  const confirmAndNotify = async (booking: Booking) => {
    const { error } = await supabase.from("bookings").update({ status: "Confirmada" }).eq("id", booking.id);
    if (!error) {
      const service = services.find(s => s.id == booking.service_id);
      const message = `✅ *¡Cita Confirmada!*\n\nHola ${booking.name}, tu pago ha sido verificado. Te esperamos:\n\n✂️ *Servicio:* ${service?.name}\n📅 *Fecha:* ${booking.date}\n⏰ *Hora:* ${booking.time}\n📍 *Ubicación:* BarberLA\n\n¡Gracias por tu confianza!`;
      window.open(`https://wa.me/${booking.phone}?text=${encodeURIComponent(message)}`, "_blank");
      fetchAdminData();
    }
  };

  const deleteBooking = async (id: number) => {
    if (confirm("¿Eliminar esta cita?")) {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (!error) fetchAdminData();
    }
  };

  const updateServicePrice = async (id: number, price: number) => {
    const { error } = await supabase.from("services").update({ price }).eq("id", id);
    if (!error) alert("Precio actualizado");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;
    
    const { error } = await supabase.from("products").insert([{
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      image: newProduct.image,
      featured: newProduct.featured
    }]);

    if (!error) {
      setNewProduct({ name: "", price: "", image: "", featured: false });
      fetchAdminData();
      alert("Producto agregado");
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("¿Eliminar este producto?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) fetchAdminData();
    }
  };

  const updateProduct = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        price: Number(product.price),
        image: product.image,
        featured: product.featured,
      })
      .eq("id", product.id);

    if (!error) {
      fetchAdminData();
      alert("Producto actualizado");
    }
  };

  const handleProductField = (id: number, field: keyof Product, value: string | number | boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: field === "price" ? Number(value) : value } : p))
    );
  };

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6">
        <Header />
        <div className="w-full max-w-[350px] bg-[#0f0f0f] p-8 rounded-3xl border border-[#222] shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-[#c5a059]/20">
              <ShieldCheck size={32} className="text-[#c5a059]" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-8 uppercase tracking-widest">Acceso Admin</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#888] text-[10px] font-bold uppercase tracking-widest">Contraseña</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-5 py-4 text-white focus:border-[#c5a059] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-br from-[#c5a059] to-[#a68541] text-black font-bold py-4 rounded-xl uppercase tracking-widest text-xs">
              Entrar al Panel
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-32 bg-[#060606]">
      <Header />
      <div className="premium-shell">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Panel <span className="text-[#c5a059]">Admin</span></h2>
          <button onClick={handleLogout} className="bg-[#1a1a1a] text-[#888] p-2 rounded-lg border border-[#222] hover:text-white transition-all">
            <LogOut size={18} />
          </button>
        </div>

        {/* Citas Sección */}
        <section className="mb-12">
          <h3 className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <Calendar size={14} /> Citas Pendientes
          </h3>
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <p className="text-[#888] text-sm italic text-center py-10 bg-[#0f0f0f] rounded-3xl border border-[#222]">No hay citas registradas</p>
            ) : (
              bookings.map((booking) => {
                const service = services.find(s => s.id == booking.service_id);
                const statusColor = booking.status === 'Confirmada' ? 'text-green-500' : (booking.status === 'Cancelada' ? 'text-red-500' : 'text-[#c5a059]');
                
                return (
                  <div key={booking.id} className="bg-[#0f0f0f] border border-[#222] rounded-3xl p-6 relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h4 className="text-white font-bold text-lg">{booking.name}</h4>
                        <div className="flex items-center gap-2 text-[#888] text-xs font-light">
                          <Scissors size={12} className="text-[#c5a059]" /> {service?.name}
                        </div>
                        <div className="flex items-center gap-2 text-[#888] text-xs font-light">
                          <Calendar size={12} className="text-[#c5a059]" /> {booking.date} | {booking.time}
                        </div>
                        <div className="flex items-center gap-2 text-[#888] text-xs font-light">
                          <Phone size={12} className="text-[#c5a059]" /> {booking.phone}
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-current ${statusColor}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#222]">
                      {booking.proof && (
                        <button 
                          onClick={() => setSelectedProof(booking.proof)}
                          className="bg-[#1a1a1a] text-[#c5a059] px-4 py-2.5 rounded-xl border border-[#c5a059]/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                          <Eye size={14} /> Ticket
                        </button>
                      )}
                      <button 
                        onClick={() => confirmAndNotify(booking)}
                        className="flex-1 bg-green-500/10 text-green-500 px-4 py-2.5 rounded-xl border border-green-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} /> Confirmar
                      </button>
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="bg-red-500/10 text-red-500 p-2.5 rounded-xl border border-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Productos Sección */}
        <section className="mb-12">
          <h3 className="text-[#c5a059] text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <ShoppingBag size={14} /> Gestionar Productos
          </h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {products.map(p => (
              <div key={p.id} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl p-4 flex gap-4 items-start group">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-500 border border-[#c8a96a]/20">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    value={p.name}
                    onChange={(e) => handleProductField(p.id, "name", e.target.value)}
                    className="w-full bg-[#171717] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[#c8a96a]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) => handleProductField(p.id, "price", e.target.value)}
                      className="w-full bg-[#171717] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-[#c8a96a]"
                    />
                    <label className="flex items-center gap-2 bg-[#171717] border border-[#2f2f2f] rounded-xl px-3 py-2 text-[11px] uppercase tracking-wider text-[#bcbcbc]">
                      <input
                        type="checkbox"
                        checked={p.featured}
                        onChange={(e) => handleProductField(p.id, "featured", e.target.checked)}
                        className="accent-[#c8a96a]"
                      />
                      Destacado
                    </label>
                  </div>
                  <input
                    value={p.image}
                    onChange={(e) => handleProductField(p.id, "image", e.target.value)}
                    className="w-full bg-[#171717] border border-[#2f2f2f] rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-[#c8a96a]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProduct(p)}
                      className="flex-1 bg-[#c8a96a] text-black py-2 rounded-xl border border-[#e7cc96]/40 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest font-bold"
                    >
                      <Pencil size={13} /> Guardar
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="bg-red-500/10 text-red-500 py-2 px-3 rounded-xl border border-red-500/20 flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar Producto Form */}
          <form onSubmit={handleAddProduct} className="bg-[#0f0f0f] p-8 rounded-3xl border border-[#222] space-y-5">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs text-center mb-4">Nuevo Producto</h4>
            <input 
              type="text" 
              placeholder="Nombre del producto"
              value={newProduct.name}
              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-4 py-3 text-white text-sm outline-none"
            />
            <input 
              type="number" 
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-4 py-3 text-white text-sm outline-none"
            />
            <input 
              type="text" 
              placeholder="URL de imagen"
              value={newProduct.image}
              onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl px-4 py-3 text-white text-sm outline-none"
            />
            <div className="flex items-center gap-3 bg-[#1a1a1a] p-4 rounded-xl border border-[#222]">
              <input 
                type="checkbox" 
                checked={newProduct.featured}
                onChange={(e) => setNewProduct(prev => ({ ...prev, featured: e.target.checked }))}
                className="accent-[#c5a059]"
              />
              <label className="text-[#888] text-[10px] font-bold uppercase tracking-widest">Destacado</label>
            </div>
            <button type="submit" className="w-full bg-[#c5a059] text-black font-bold py-4 rounded-xl uppercase tracking-widest text-xs">
              Guardar Producto
            </button>
          </form>
        </section>
      </div>

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6" onClick={() => setSelectedProof(null)}>
          <div className="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border border-[#c5a059]/20 shadow-2xl">
            <Image src={selectedProof} alt="Ticket" fill className="object-contain" />
          </div>
          <button className="absolute top-10 right-10 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <XCircle size={32} />
          </button>
        </div>
      )}

      <Navbar cartCount={0} />
    </main>
  );
}
