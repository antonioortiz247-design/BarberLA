"use client";

import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FloatingCart({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-24 right-4 z-40 md:bottom-28 md:right-8"
        >
          <Link
            href="/carrito"
            className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#f6ddb0]/45 bg-gradient-to-br from-[#f6ddb0] to-[#d8b06a] text-black shadow-[0_14px_30px_rgba(216,176,106,0.35)]"
          >
            <ShoppingCart size={22} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#d8b06a]/70 bg-[#121722] text-[10px] font-bold text-[#f6ddb0]">
              {count}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
