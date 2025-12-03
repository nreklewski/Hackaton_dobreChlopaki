import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b-2 border-primary">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Karta Łodzianina"
            width={160}
            height={34}
            className="h-auto w-40"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 font-medium text-sm uppercase tracking-wide">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Pakiety
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Aktualności
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Wydarzenia
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Zniżki
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Punkty obsługi
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Zostań partnerem
          </Link>
          <Link href="/mapa" className="hover:text-primary transition-colors">
            Łódź na mapie
          </Link>
          <Link
            href="#"
            className="hover:text-primary transition-colors text-primary font-bold"
          >
            Załóż konto
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="hidden lg:inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-bold uppercase hover:bg-opacity-90 transition-colors"
          >
            <span className="mr-2">👤</span> Zaloguj
          </Link>
          <button className="lg:hidden text-2xl text-primary">☰</button>
        </div>
      </div>
    </header>
  );
}

