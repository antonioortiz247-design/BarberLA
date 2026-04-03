"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(110deg, rgba(8,10,14,0.92) 0%, rgba(8,10,14,0.66) 46%, rgba(8,10,14,0.88) 100%), url("https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_14%,rgba(216,176,106,0.24),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 grid min-h-[68svh] items-end gap-8 p-6 md:min-h-[74svh] md:grid-cols-[1.3fr_0.7fr] md:p-10 lg:p-14"
      >
        <div>
          <span className="urban-chip mb-4">Barbería LA Experience</span>
          <h1 className="mb-4 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.6rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
            Tu mejor versión empieza en <span className="text-[#d8b06a]">Barbería LA</span>.
          </h1>
          <p className="premium-lead mb-8 max-w-xl">
            Cortes, barba y estilo profesional en un espacio moderno. Agenda en segundos y recibe atención puntual.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/agenda" className="cta-gold">Agendar ahora</Link>
            <Link href="/tienda" className="ghost-btn">Explorar tienda</Link>
          </div>
        </div>

        <aside className="glass-panel p-4 md:p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#99a7ba] mb-3">Experience metrics</p>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-2xl font-bold">+2,500</p>
              <p className="text-xs text-[#a7afbb]">Cortes realizados</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-2xl font-bold">4.9★</p>
              <p className="text-xs text-[#a7afbb]">Calificación promedio</p>
            </div>
          </div>
        </aside>
      </motion.div>
    </section>
  );
}
