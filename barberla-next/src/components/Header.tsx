import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#060606]/78 backdrop-blur-xl border-b border-white/5">
      <div className="premium-shell py-5 flex justify-center items-center">
      <div className="relative h-[54px] w-full max-w-[178px] opacity-95 transition-opacity duration-300 hover:opacity-100">
        <Image
          src="/lalogo.png"
          alt="BarberLA"
          fill
          className="object-contain"
          priority
        />
      </div>
      </div>
    </header>
  );
}
