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
    <nav className="fixed bottom-3 left-3 right-3 md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:w-[min(92vw,760px)] rounded-2xl bg-[#0f1114]/88 backdrop-blur-2xl border border-white/10 py-2.5 px-2.5 md:px-4 flex justify-between items-center z-50 shadow-[0_16px_45px_rgba(0,0,0,0.45)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex flex-col items-center gap-1 transition-all duration-300 relative rounded-xl py-1.5 px-2 md:px-4 min-w-14",
              isActive
                ? "text-[#d0ac67] bg-white/6"
                : "text-[#8f949c] hover:text-[#f2f4f6] hover:bg-white/[0.03]"
            )}
          >
            <item.icon size={19} strokeWidth={isActive ? 2.4 : 2} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[10px] font-medium uppercase tracking-[0.13em]">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d0ac67] text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
