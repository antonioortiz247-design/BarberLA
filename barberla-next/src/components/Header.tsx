import Image from "next/image";
import { Download } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0e13]/75 backdrop-blur-2xl">
      <div className="premium-shell flex items-center justify-between py-3.5 md:py-4.5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 md:h-12 md:w-36">
            <Image src="/lalogo.png" alt="BarberLA" fill className="object-contain" priority />
          </div>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-[#95a2b5] md:inline">Urban Premium Studio</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="/manifest.json"
            download
            className="inline-flex items-center gap-1 rounded-xl border border-[#d8b06a]/35 bg-[#1b2230] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f6ddb0] transition hover:border-[#f6ddb0]/60 hover:bg-[#252f41]"
            aria-label="Descargar configuración de la app"
          >
            <Download size={14} />
            Descargar app
          </a>
          <div className="urban-chip hidden md:inline-flex">Since 2024</div>
        </div>
      </div>
    </header>
  );
}
