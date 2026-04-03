"use client";

import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FloatingCart({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 26 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-24 md:bottom-28 right-5 md:right-9 z-40"
        >
          <Link
            href="/carrito"
            className="group flex items-center justify-center w-14 h-14 rounded-full border border-[#f2d79f]/40 bg-gradient-to-br from-[#f4dba3] to-[#c79f58] text-black shadow-[0_12px_30px_rgba(208,172,103,0.35)]"
          >
            <ShoppingCart size={22} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 bg-[#111] text-[#f4dba3] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#d0ac67]/70">
              {count}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
