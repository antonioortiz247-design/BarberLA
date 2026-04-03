"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative mb-14 min-h-[62svh] overflow-hidden rounded-[2rem] border border-white/10 lg:min-h-[68svh]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(5,8,13,0.12) 0%, rgba(5,8,13,0.72) 55%, rgba(5,8,13,0.95) 100%), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1800")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(215,178,108,0.26),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_88%,rgba(109,154,255,0.15),transparent_44%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex min-h-[62svh] flex-col justify-end p-6 md:p-10 lg:min-h-[68svh] lg:p-14"
      >
        <p className="section-kicker mb-4 w-fit">Future Grooming Studio</p>
        <h1 className="premium-title mb-4 max-w-[16ch] text-white">
          Precisión premium para una imagen <span className="text-[#d7b26c]">sofisticada</span>.
        </h1>
        <p className="premium-lead mb-8 max-w-xl">
          Experiencia inspirada en Apple, Tesla y Uber Eats: limpia, rápida y elegante en cada interacción.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/agenda" className="btn-primary w-fit">
            Reservar cita
          </Link>
          <Link
            href="/servicios"
            className="inline-flex rounded-xl border border-white/20 bg-black/35 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-[#d7b26c]/50 hover:text-[#f5ddb0]"
          >
            Ver servicios
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
