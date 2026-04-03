import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0e13]/75 backdrop-blur-2xl">
      <div className="premium-shell flex items-center justify-between py-3.5 md:py-4.5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 md:h-12 md:w-36">
            <Image src="/lalogo.png" alt="BarberLA" fill className="object-contain" priority />
          </div>
          <span className="hidden md:inline text-[11px] uppercase tracking-[0.16em] text-[#95a2b5]">Urban Premium Studio</span>
        </div>

        <div className="urban-chip hidden md:inline-flex">Since 2024</div>
      </div>
    </header>
  );
}
