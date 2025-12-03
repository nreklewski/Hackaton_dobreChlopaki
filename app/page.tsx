import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans text-text-dark">
      {/* Hero Section */}
      <section className="relative h-[500px] lg:h-[600px] w-full bg-gray-100 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Hero Banner"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            {/* Content overlay if needed, currently the image has text */}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black border-b-2 border-primary inline-block pb-2 uppercase">
              Aktualności
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Item 1 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  [Obrazek Aktualności 1]
                </div>
                <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                  Czytaj więcej →
                </div>
              </div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                Święta z Kartą Łodzianina 2025 - Specjalne zniżki!
              </h3>
            </div>

            {/* News Item 2 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  [Obrazek Aktualności 2]
                </div>
                <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                  Czytaj więcej →
                </div>
              </div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                Nowi partnerzy w Karcie Łodzianina - listopad
              </h3>
            </div>

            {/* News Item 3 */}
            <div className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  [Obrazek Aktualności 3]
                </div>
                <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                  Czytaj więcej →
                </div>
              </div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                Studencie, Łódź ma dla Ciebie zniżki!
              </h3>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="#"
              className="inline-block px-8 py-3 bg-secondary text-white font-bold uppercase hover:bg-primary transition-colors"
            >
              Zobacz wszystkie
            </Link>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 uppercase">
            Pobierz aplikację
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" className="hover:opacity-90 transition-opacity">
              <Image
                src="/appstore.png"
                alt="App Store"
                width={140}
                height={45}
                className="h-12 w-auto"
              />
            </Link>
            <Link href="#" className="hover:opacity-90 transition-opacity">
              <Image
                src="/googleplay.png"
                alt="Google Play"
                width={140}
                height={45}
                className="h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section (Simplified) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8 text-black uppercase">
            Nasi Partnerzy
          </h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for partners */}
            <div className="w-32 h-16 bg-gray-300 flex items-center justify-center text-xs">
              Partner 1
            </div>
            <div className="w-32 h-16 bg-gray-300 flex items-center justify-center text-xs">
              Partner 2
            </div>
            <div className="w-32 h-16 bg-gray-300 flex items-center justify-center text-xs">
              Partner 3
            </div>
            <div className="w-32 h-16 bg-gray-300 flex items-center justify-center text-xs">
              Partner 4
            </div>
            <div className="w-32 h-16 bg-gray-300 flex items-center justify-center text-xs">
              Partner 5
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">Kontakt</h4>
              <p className="mb-2">Łódzka Organizacja Turystyczna</p>
              <p className="mb-2">ul. Piotrkowska 28</p>
              <p className="mb-2">90-269 Łódź</p>
              <p className="mt-4 text-gray-400">biuro@kartalodzianina.pl</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">Na skróty</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    PIN do karty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Dla reklamodawców
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Jak zostać partnerem
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Mapa strony
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">Dokumenty</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Regulaminy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Polityka prywatności
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Deklaracja dostępności
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">
                Social Media
              </h4>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  F
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  I
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  T
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
            <p>
              &copy; {new Date().getFullYear()} Karta Łodzianina. Wszelkie prawa
              zastrzeżone.
            </p>
            <p className="mt-2">Projekt i realizacja: Clone by AI</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
