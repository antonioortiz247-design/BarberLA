"use client";

import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FloatingCart({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <Link
            href="/carrito"
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#c5a059] to-[#a68541] rounded-full shadow-[0_8px_25px_rgba(197,160,89,0.4)] text-black relative"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#c5a059]">
              {count}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
