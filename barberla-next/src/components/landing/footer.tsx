import Link from "next/link";

const footerColumns = [
  {
    title: "Producto",
    links: ["Flujo de pedidos", "Panel de cocina", "Análisis"],
  },
  {
    title: "Recursos",
    links: ["Guías UX", "Integraciones", "Estado del servicio"],
  },
  {
    title: "Compañía",
    links: ["Acerca", "Carreras", "Contacto"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-14">
      <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-4 md:grid-cols-[1.2fr_repeat(3,1fr)] md:px-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-text)]">Urban Bites Studio</p>
          <p className="max-w-xs text-sm leading-6 text-[var(--color-muted)]">
            Diseñamos experiencias digitales para marcas gastronómicas con foco en claridad, velocidad y conversión.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <Link className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]" href="#">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
