import Image from "next/image";

export default function Header() {
  return (
    <header className="py-6 px-4 flex justify-center items-center max-w-[500px] mx-auto sticky top-0 bg-[#050505]/80 backdrop-blur-md z-40">
      <div className="relative h-[60px] w-full max-w-[180px]">
        <Image
          src="/lalogo.png"
          alt="BarberLA"
          fill
          className="object-contain"
          priority
        />
      </div>
    </header>
  );
}
