"use client";

import Link from "next/link";
import { Home, Scissors, ShoppingBag, ShoppingCart, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/servicios", icon: Scissors, label: "Servicios" },
    { href: "/tienda", icon: ShoppingBag, label: "Tienda" },
    { href: "/carrito", icon: ShoppingCart, label: "Carrito", badge: cartCount },
    { href: "/admin", icon: ShieldCheck, label: "Admin" },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 flex w-[min(96vw,780px)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[#121722]/88 px-2 py-2 backdrop-blur-2xl md:bottom-5 md:px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition md:min-w-[86px] md:px-4",
              isActive
                ? "bg-[#1d2430] text-[#d8b06a]"
                : "text-[#91a0b4] hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <item.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[10px] uppercase tracking-[0.12em] leading-none">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -right-0.5 -top-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-[#d8b06a] px-1 text-[9px] font-black text-black">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
