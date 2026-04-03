"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[1.8rem] border border-white/10 min-h-[66vh] flex items-end mb-12">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(4,4,4,0.2) 0%, rgba(4,4,4,0.75) 55%, rgba(4,4,4,0.95) 100%), url("https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1800")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(208,172,103,0.2),transparent_42%)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full p-6 md:p-10 lg:p-14"
      >
        <p className="inline-flex items-center rounded-full border border-[#d0ac67]/30 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#e6cb96] mb-4">
          BarberLA Signature Experience
        </p>
        <h1 className="premium-title max-w-2xl text-white mb-4">
          Imagen precisa. Estilo futurista. <span className="text-[#d0ac67]">Lujo urbano.</span>
        </h1>
        <p className="premium-lead mb-8 max-w-xl">
          Corte, barba y grooming con estética premium inspirada en Apple + Tesla + street luxury.
        </p>
        <Link href="/agenda" className="btn-primary w-fit">
          Reservar cita
        </Link>
      </motion.div>
    </section>
  );
}
