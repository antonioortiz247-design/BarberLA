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
          className="fixed bottom-24 right-4 z-40 md:bottom-28 md:right-8"
        >
          <Link
            href="/carrito"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[#f5ddb0]/45 bg-gradient-to-br from-[#f5ddb0] to-[#d7b26c] text-black shadow-[0_12px_30px_rgba(215,178,108,0.35)]"
          >
            <ShoppingCart size={22} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#d7b26c]/70 bg-[#111722] text-[10px] font-bold text-[#f5ddb0]">
              {count}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
