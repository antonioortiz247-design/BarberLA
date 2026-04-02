"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[450px] w-full flex flex-col justify-center items-center text-center px-6 overflow-hidden rounded-3xl mb-12">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(5,5,5,0.4), rgba(5,5,5,0.9)), url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800")',
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
        <p className="text-[#888] text-lg mb-8 max-w-[300px] mx-auto font-light">
          Donde la tradición se encuentra con la modernidad.
        </p>
        <Link 
          href="/agenda" 
          className="inline-block bg-gradient-to-br from-[#c5a059] to-[#a68541] text-black font-bold px-10 py-4 rounded-xl shadow-[0_4px_20px_rgba(197,160,89,0.3)] hover:scale-105 transition-transform duration-300 uppercase tracking-widest text-sm"
        >
          Agendar Cita
        </Link>
      </motion.div>
    </section>
  );
}
