"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { defaultProducts, defaultServices } from "@/lib/defaultData";
import { Booking, Product, Service } from "@/types";
import { Calendar, CheckCircle, Eye, Loader2, LogOut, Pencil, Phone, PlusCircle, Scissors, ShieldCheck, Trash2, Upload, XCircle } from "lucide-react";
import Image from "next/image";

type EditableProduct = Omit<Product, "price"> & { price: number | string };
type EditableService = Omit<Service, "price"> & { price: number | string };

const emptyProduct = { name: "", price: "", image: "", featured: false };
const emptyService = { name: "", price: "", duration: "30 min", icon: "", featured: false };

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("barber_admin") === "true";
  });
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [services, setServices] = useState<EditableService[]>([]);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [newService, setNewService] = useState(emptyService);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [savingProducts, setSavingProducts] = useState<Record<number, boolean>>({});
  const [savingServices, setSavingServices] = useState<Record<number, boolean>>({});

  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "Edgar@";

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
      reader.readAsDataURL(file);
    });

  const fetchAdminData = async () => {
    const [bookingsRes, servicesRes, productsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("date", { ascending: true }).order("time", { ascending: true }),
      supabase.from("services").select("*").order("id"),
      supabase.from("products").select("*").order("id"),
    ]);

    return {
      bookings: bookingsRes.data ?? [],
      services: (servicesRes.data && servicesRes.data.length > 0 ? servicesRes.data : defaultServices) as EditableService[],
      products: (productsRes.data && productsRes.data.length > 0 ? productsRes.data : defaultProducts) as EditableProduct[],
    };
  };

  const applyAdminData = (data: { bookings: Booking[]; services: EditableService[]; products: EditableProduct[] }) => {
    setBookings(data.bookings);
    setServices(data.services);
    setProducts(data.products);
  };

  useEffect(() => {
    if (!isAdmin) return;

    fetchAdminData().then(applyAdminData);

    const refresh = () => {
      fetchAdminData().then(applyAdminData);
    };

    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "services" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminSecret) {
      setIsAdmin(true);
      sessionStorage.setItem("barber_admin", "true");
      return;
    }
    alert("Contraseña incorrecta");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("barber_admin");
  };

  const updateBookingStatus = async (id: number, status: Booking["status"]) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      alert("No se pudo actualizar el estado");
      return;
    }
    fetchAdminData().then(applyAdminData);
  };

  const confirmByWhatsapp = async (booking: Booking) => {
    const { error } = await supabase.from("bookings").update({ status: "Confirmada" }).eq("id", booking.id);
    if (error) {
      alert("No se pudo confirmar la cita");
      return;
    }

    const service = services.find((item) => item.id === booking.service_id);
    const phone = booking.phone.replace(/[^\d]/g, "");
    const message = `✅ ¡Tu cita en Barbería LA está confirmada!\n\nServicio: ${service?.name ?? "Servicio"}\nFecha: ${booking.date}\nHora: ${booking.time}\n\nTe esperamos.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    fetchAdminData().then(applyAdminData);
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      alert("No se pudo eliminar la cita");
      return;
    }
    fetchAdminData().then(applyAdminData);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Completa nombre, precio e imagen");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        name: newProduct.name,
        price: Number(newProduct.price),
        image: newProduct.image,
        featured: newProduct.featured,
      },
    ]);

    if (error) {
      alert(`No se pudo agregar el producto: ${error.message}`);
      return;
    }

    setNewProduct(emptyProduct);
    fetchAdminData().then(applyAdminData);
  };

  const saveProduct = async (product: EditableProduct) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        price: Number(product.price),
        image: product.image,
        featured: product.featured,
      })
      .eq("id", product.id);

    if (error) {
      alert(`No se pudo editar el producto: ${error.message}`);
      return;
    }
    fetchAdminData().then(applyAdminData);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(`No se pudo eliminar el producto: ${error.message}`);
      return;
    }
    fetchAdminData().then(applyAdminData);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) {
      alert("Completa nombre, precio y duración");
      return;
    }

    const { error } = await supabase.from("services").insert([
      {
        name: newService.name,
        price: Number(newService.price),
        duration: newService.duration,
        icon: newService.icon,
        featured: newService.featured,
      },
    ]);

    if (error) {
      alert(`No se pudo agregar el servicio: ${error.message}`);
      return;
    }

    setNewService(emptyService);
    fetchAdminData().then(applyAdminData);
  };

  const saveService = async (service: EditableService) => {
    const { error } = await supabase
      .from("services")
      .update({
        name: service.name,
        price: Number(service.price),
        duration: service.duration,
        icon: service.icon,
        featured: service.featured,
      })
      .eq("id", service.id);

    if (error) {
      alert(`No se pudo editar el servicio: ${error.message}`);
      return;
    }
    fetchAdminData().then(applyAdminData);
  };

  const deleteService = async (id: number) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      alert(`No se pudo eliminar el servicio: ${error.message}`);
      return;
    }
    fetchAdminData().then(applyAdminData);
  };

  const updateProductField = (id: number, field: keyof EditableProduct, value: string | number | boolean) => {
    setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const updateServiceField = (id: number, field: keyof EditableService, value: string | number | boolean) => {
    setServices((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const uploadToNewProduct = async (file: File | null) => {
    if (!file) return;
    const image = await readFileAsDataUrl(file);
    setNewProduct((prev) => ({ ...prev, image }));
  };

  const uploadToExistingProduct = async (id: number, file: File | null) => {
    if (!file) return;
    const image = await readFileAsDataUrl(file);
    updateProductField(id, "image", image);
  };

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6">
        <Header />
        <div className="w-full max-w-[420px] rounded-3xl border border-[#222] bg-[#0f0f0f] p-8 shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c5a059]/20 bg-[#1a1a1a]">
              <ShieldCheck size={32} className="text-[#c5a059]" />
            </div>
          </div>
          <h2 className="mb-8 text-center text-xl font-bold uppercase tracking-widest text-white">Panel Admin LA</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#888]">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-5 py-4 text-white outline-none transition-all focus:border-[#c5a059]"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-gradient-to-br from-[#c5a059] to-[#a68541] py-4 text-xs font-bold uppercase tracking-widest text-black">
              Entrar al panel
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060606] pb-32">
      <Header />
      <div className="premium-shell py-6 md:py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Panel <span className="text-[#c5a059]">LA</span>
          </h2>
          <button onClick={handleLogout} className="rounded-lg border border-[#222] bg-[#1a1a1a] p-2 text-[#888] transition-all hover:text-white">
            <LogOut size={18} />
          </button>
        </div>

        <section className="mb-12">
          <h3 className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
            <Calendar size={14} /> Citas (tiempo real) <Loader2 size={12} className="animate-spin" />
          </h3>
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <p className="rounded-3xl border border-[#222] bg-[#0f0f0f] py-10 text-center text-sm italic text-[#888]">No hay citas registradas</p>
            ) : (
              bookings.map((booking) => {
                const service = services.find((item) => item.id === booking.service_id);
                const statusColor =
                  booking.status === "Confirmada" ? "text-green-500" : booking.status === "Cancelada" ? "text-red-500" : "text-[#c5a059]";

                return (
                  <div key={booking.id} className="relative overflow-hidden rounded-3xl border border-[#222] bg-[#0f0f0f] p-5 md:p-6">
                    <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white">{booking.name}</h4>
                        <div className="flex items-center gap-2 text-xs font-light text-[#888]">
                          <Scissors size={12} className="text-[#c5a059]" /> {service?.name ?? "Servicio"}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-light text-[#888]">
                          <Calendar size={12} className="text-[#c5a059]" /> {booking.date} | {booking.time}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-light text-[#888]">
                          <Phone size={12} className="text-[#c5a059]" /> {booking.phone}
                        </div>
                      </div>
                      <span className={`rounded-full border border-current px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-[#222] pt-4">
                      {booking.proof && (
                        <button
                          onClick={() => setSelectedProof(booking.proof)}
                          className="flex items-center gap-2 rounded-xl border border-[#c5a059]/20 bg-[#1a1a1a] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]"
                        >
                          <Eye size={14} /> Ticket
                        </button>
                      )}
                      <button
                        onClick={() => confirmByWhatsapp(booking)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-green-500"
                      >
                        <CheckCircle size={13} /> Confirmar + WhatsApp
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, "Cancelada")}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500"
                      >
                        <XCircle size={13} /> Cancelar
                      </button>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
            <PlusCircle size={14} /> Gestionar servicios
          </h3>

          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="rounded-3xl border border-[#2a2a2a] bg-[#0f0f0f] p-4">
                <div className="space-y-2">
                  <input
                    value={service.name}
                    onChange={(e) => updateServiceField(service.id, "name", e.target.value)}
                    className="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a96a]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateServiceField(service.id, "price", e.target.value)}
                      className="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a96a]"
                    />
                    <input
                      value={service.duration}
                      onChange={(e) => updateServiceField(service.id, "duration", e.target.value)}
                      className="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a96a]"
                    />
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-[11px] uppercase tracking-wider text-[#bcbcbc]">
                    <input
                      type="checkbox"
                      checked={service.featured}
                      onChange={(e) => updateServiceField(service.id, "featured", e.target.checked)}
                      className="accent-[#c8a96a]"
                    />
                    Destacado
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveService(service)}
                      className="flex-1 rounded-xl border border-[#e7cc96]/40 bg-[#c8a96a] py-2 text-[11px] font-bold uppercase tracking-widest text-black"
                    >
                      <span className="inline-flex items-center gap-1"><Pencil size={12} /> Guardar</span>
                    </button>
                    <button onClick={() => deleteService(service.id)} className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddService} className="max-w-2xl space-y-4 rounded-3xl border border-[#222] bg-[#0f0f0f] p-6 md:p-8">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-white">Nuevo servicio</h4>
            <input
              type="text"
              placeholder="Nombre del servicio"
              value={newService.name}
              onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Precio"
                value={newService.price}
                onChange={(e) => setNewService((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none"
              />
              <input
                type="text"
                placeholder="Duración (ej. 45 min)"
                value={newService.duration}
                onChange={(e) => setNewService((prev) => ({ ...prev, duration: e.target.value }))}
                className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none"
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-[#c5a059] py-4 text-xs font-bold uppercase tracking-widest text-black">
              Guardar servicio
            </button>
          </form>
        </section>

        <section className="mb-12">
          <h3 className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
            <PlusCircle size={14} /> Gestionar productos
          </h3>
          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="group flex items-start gap-4 rounded-3xl border border-[#2a2a2a] bg-[#0f0f0f] p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#c8a96a]/20">
                  <Image src={String(product.image)} alt={product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#888]">
                    <span>Producto #{product.id}</span>
                    {savingProducts[product.id] && <span className="inline-flex items-center gap-1 text-[#c5a059]"><Loader2 size={12} className="animate-spin" /> Guardando</span>}
                  </div>
                  <input
                    value={product.name}
                    onChange={(e) => updateProductField(product.id, "name", e.target.value)}
                    className="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a96a]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProductField(product.id, "price", e.target.value)}
                      className="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-sm text-white outline-none focus:border-[#c8a96a]"
                    />
                    <label className="flex items-center gap-2 rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-[11px] uppercase tracking-wider text-[#bcbcbc]">
                      <input
                        type="checkbox"
                        checked={product.featured}
                        onChange={(e) => updateProductField(product.id, "featured", e.target.checked)}
                        className="accent-[#c8a96a]"
                      />
                      Destacado
                    </label>
                  </div>
                  <input
                    value={String(product.image)}
                    onChange={(e) => updateProductField(product.id, "image", e.target.value)}
                    className="w-full rounded-xl border border-[#2f2f2f] bg-[#171717] px-3 py-2 text-xs text-white outline-none focus:border-[#c8a96a]"
                  />
                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#3b3b3b] bg-[#171717] px-3 py-2 text-[11px] uppercase tracking-wider text-[#bcbcbc] transition hover:border-[#c8a96a]/50">
                    <Upload size={12} /> Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadToExistingProduct(product.id, e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveProduct(product)}
                      className="flex-1 rounded-xl border border-[#e7cc96]/40 bg-[#c8a96a] py-2 text-[11px] font-bold uppercase tracking-widest text-black"
                    >
                      <span className="inline-flex items-center gap-1"><Pencil size={12} /> Guardar</span>
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddProduct} className="max-w-2xl space-y-5 rounded-3xl border border-[#222] bg-[#0f0f0f] p-6 md:p-8">
            <h4 className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-white">Nuevo producto</h4>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={newProduct.name}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none"
            />
            <input
              type="number"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
              className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none"
            />
            <input
              type="text"
              placeholder="URL de imagen"
              value={newProduct.image}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, image: e.target.value }))}
              className="w-full rounded-xl border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none"
            />
            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#3b3b3b] bg-[#1a1a1a] px-4 py-3 text-[11px] uppercase tracking-wider text-[#bcbcbc] transition hover:border-[#c8a96a]/50">
              <Upload size={12} /> Subir imagen desde dispositivo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadToNewProduct(e.target.files?.[0] ?? null)} />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#222] bg-[#1a1a1a] p-4">
              <input
                type="checkbox"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct((prev) => ({ ...prev, featured: e.target.checked }))}
                className="accent-[#c5a059]"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#888]">Destacado</span>
            </label>
            <button type="submit" className="w-full rounded-xl bg-[#c5a059] py-4 text-xs font-bold uppercase tracking-widest text-black">
              Guardar producto
            </button>
          </form>
        </section>
      </div>

      {selectedProof && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6" onClick={() => setSelectedProof(null)}>
          <div className="relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-3xl border border-[#c5a059]/20 shadow-2xl">
            <Image src={selectedProof} alt="Ticket" fill className="object-contain" />
          </div>
          <button className="absolute right-10 top-10 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20">
            <XCircle size={32} />
          </button>
        </div>
      )}

      <Navbar cartCount={0} />
    </main>
  );
}
