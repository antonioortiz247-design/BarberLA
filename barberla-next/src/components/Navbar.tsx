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
    <nav className="fixed bottom-4 left-4 right-4 max-w-[500px] mx-auto rounded-2xl bg-[#111111]/90 backdrop-blur-2xl border border-white/10 py-2.5 px-3 flex justify-between items-center z-50 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative rounded-xl py-1.5 px-2 min-w-14",
              isActive ? "text-[#c8a96a] bg-white/5" : "text-[#8c8c8c] hover:text-white/90"
            )}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c5a059] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
