import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#070708]/78 backdrop-blur-2xl">
      <div className="premium-shell flex items-center justify-between py-4 md:py-5">
        <figure className="relative h-[46px] w-[145px] opacity-95 transition-opacity duration-300 hover:opacity-100 md:h-[54px] md:w-[175px]">
          <Image
            src="/lalogo.png"
            alt="BarberLA"
            fill
            className="object-contain"
            priority
          />
        </figure>
        <span className="hidden rounded-full border border-[#d0ac67]/25 bg-[#101113] px-3 py-1 text-xs uppercase tracking-widest text-[#d0ac67] md:inline-flex">
          Premium Club
        </span>
      </div>
    </header>
  );
}
