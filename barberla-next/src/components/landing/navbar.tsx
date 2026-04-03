import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "#features", label: "Propuesta" },
  { href: "#stats", label: "Resultados" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)]/80 bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-4 md:px-8">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.06em] text-[var(--color-text)] uppercase" href="/" aria-label="Ir al inicio">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Sparkles className="h-4 w-4" />
          </span>
          Urban Bites
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ButtonLink className="h-10 px-4" href="#contacto" size="sm">
          Reservar demo
        </ButtonLink>
      </div>
    </header>
  );
}
