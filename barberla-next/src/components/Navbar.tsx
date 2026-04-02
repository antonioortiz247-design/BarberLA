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
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-[#222] py-3 px-6 flex justify-between items-center z-50 max-w-[500px] mx-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative",
              isActive ? "text-[#c5a059]" : "text-[#888]"
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
