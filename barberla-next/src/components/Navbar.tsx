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
    <nav className="fixed bottom-3 left-1/2 z-50 flex w-[min(96vw,760px)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[#10151c]/88 px-2 py-2.5 shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:bottom-5 md:px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-all duration-300 md:min-w-[82px] md:px-4",
              isActive
                ? "bg-white/7 text-[#d7b26c]"
                : "text-[#8f99a8] hover:bg-white/[0.035] hover:text-[#f2f4f6]"
            )}
          >
            <item.icon size={18} strokeWidth={isActive ? 2.4 : 2} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] leading-none">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -right-0.5 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#d7b26c] px-1 text-[9px] font-black text-black">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
