"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[460px] w-full flex flex-col justify-center items-center text-center px-6 overflow-hidden rounded-[2rem] mb-12 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(5,5,5,0.2), rgba(5,5,5,0.92)), url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Corte & Estilo <span className="text-[#c5a059] italic">Premium</span>
        </h1>
        <p className="text-[#d7d7d7] text-base mb-8 max-w-[320px] mx-auto font-light">
          Donde la tradición se encuentra con la modernidad.
        </p>
        <Link 
          href="/agenda" 
          className="inline-block bg-gradient-to-br from-[#dfbe7a] to-[#a67d34] text-black font-extrabold px-10 py-4 rounded-xl shadow-[0_10px_26px_rgba(200,169,106,0.32)] hover:translate-y-[-1px] transition-all duration-300 uppercase tracking-[0.14em] text-xs"
        >
          Agendar Cita
        </Link>
      </motion.div>
    </section>
  );
}
