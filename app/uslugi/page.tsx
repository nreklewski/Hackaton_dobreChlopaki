"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";

// Map component reused from Łódź na mapie (leaflet integration)
const MapComponent = dynamic(() => import("../mapa/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <p className="text-gray-600">Ładowanie mapy usług...</p>
    </div>
  ),
});

type ServiceLocation = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: "wszystkie"; // dopasowane do MapComponent
  description: string;
  fullDescription?: string; // dłuższy opis dla popup
  category: string;
  tags: string[]; // dodatkowe tagi do późniejszego wyszukiwania przez LLM
};

const services: ServiceLocation[] = [
  {
    id: 1,
    name: "Pub Pod Złotym Lwem",
    lat: 51.7592,
    lng: 19.456,
    status: "wszystkie",
    description: "Przytulny pub z szerokim wyborem piw rzemieślniczych.",
    fullDescription:
      "Pub Pod Złotym Lwem to miejsce, gdzie spotkasz przyjazną atmosferę, szeroki wybór piw kraftowych oraz klasyczne drinki. Organizujemy wieczory tematyczne i muzykę na żywo w każdy weekend. Zapraszamy od poniedziałku do niedzieli w godzinach 16:00-2:00.",
    category: "pub, bar, piwo rzemieślnicze",
    tags: [
      "pub",
      "bar",
      "piwo",
      "piwo rzemieślnicze",
      "drinki",
      "muzyka na żywo",
      "spotkania towarzyskie",
      "wieczory tematyczne",
      "lokal przyjazny dla grup",
      "relaks"
    ]
  },

  {
    id: 2,
    name: "Kino Helios Łódź",
    lat: 51.7585,
    lng: 19.4567,
    status: "wszystkie",
    description: "Nowoczesne kino z komfortowymi salami i najnowszymi premierami.",
    fullDescription:
      "Kino Helios Łódź oferuje szeroki repertuar filmowy – od premier kinowych po seanse dla dzieci i klasykę filmową. Posiadamy komfortowe fotele, system dźwięku Dolby Atmos oraz przekąski w barze kinowym. Seanse codziennie od 10:00 do 23:00.",
    category: "kino, rozrywka, filmy",
    tags: [
      "kino",
      "filmy",
      "premiery",
      "seanse familijne",
      "klasyka filmowa",
      "komfortowe fotele",
      "dźwięk Dolby Atmos",
      "popcorn",
      "napoje",
      "rozrywka"
    ]
  },

  {
    id: 3,
    name: "Punkt ładowania aut elektrycznych Manufaktura",
    lat: 51.776,
    lng: 19.438,
    status: "wszystkie",
    description: "Stacja szybkiego ładowania pojazdów elektrycznych.",
    fullDescription:
      "Nowoczesna stacja szybkiego ładowania pojazdów elektrycznych zlokalizowana przy kompleksie Manufaktura. Oferujemy ładowanie prądem stałym (DC) o mocy do 150 kW, co pozwala na naładowanie większości pojazdów w ciągu 20-40 minut. Stacja jest dostępna 24/7 i obsługuje wszystkie standardowe złącza.",
    category: "ładowanie aut elektrycznych, stacja ładowania",
    tags: [
      "ładowanie",
      "ładowanie aut elektrycznych",
      "stacja ładowania",
      "szybkie ładowanie",
      "infrastruktura EV",
      "ładowanie samochodu",
      "ładowanie auta",
      "ładowanie tesli",
      "stacja ładowania tesla",
    ],
  },
  {
    id: 4,
    name: "Warsztat EcoMechanik",
    lat: 51.748,
    lng: 19.47,
    status: "wszystkie",
    description: "Naprawy i przeglądy samochodów niskoemisyjnych.",
    fullDescription:
      "Warsztat samochodowy specjalizujący się w naprawie i przeglądach pojazdów niskoemisyjnych oraz ekologicznych. Oferujemy kompleksową obsługę pojazdów hybrydowych, elektrycznych oraz z napędem CNG/LPG. Wykonujemy przeglądy techniczne, diagnostykę komputerową oraz naprawy układów napędowych.",
    category: "mechanik, samochody ekologiczne",
    tags: [
      "mechanik",
      "samochody ekologiczne",
      "niskoemisyjne",
      "serwis",
      "przeglądy techniczne",
      "serwis auta",
      "serwis samochodu",
      "naprawa samochodu ekologicznego",
    ],
  },
  {
    id: 5,
    name: "Przychodnia Rodzinna Zdrowy Łodzianin",
    lat: 51.755,
    lng: 19.47,
    status: "wszystkie",
    description:
      "Przychodnia POZ, lekarze rodzinni, pediatrzy oraz podstawowe badania diagnostyczne.",
    fullDescription:
      "Nowoczesna przychodnia podstawowej opieki zdrowotnej oferująca kompleksową opiekę medyczną dla całej rodziny. W naszej placówce przyjmują doświadczeni lekarze rodzinni oraz pediatrzy. Oferujemy podstawowe badania diagnostyczne, szczepienia oraz porady specjalistyczne. Przychodnia współpracuje z NFZ oraz oferuje wizyty prywatne.",
    category: "przychodnia, lekarz rodzinny, zdrowie",
    tags: [
      "przychodnia",
      "lekarz rodzinny",
      "pediatra",
      "badania",
      "poradnia zdrowia",
      "NFZ",
    ],
  },
  {
    id: 6,
    name: "Biblioteka Miejska Łódź-Śródmieście",
    lat: 51.765,
    lng: 19.46,
    status: "wszystkie",
    description:
      "Nowoczesna biblioteka z czytelnią, strefą coworkingową i dostępem do e-booków.",
    fullDescription:
      "Nowoczesna biblioteka miejska oferująca szeroki wybór książek, czasopism oraz dostęp do e-booków i audiobooków. W naszej placówce znajdziesz przestronną czytelnię z miejscami do nauki, strefę coworkingową z szybkim internetem oraz salę konferencyjną. Organizujemy regularne spotkania autorskie i warsztaty edukacyjne.",
    category: "biblioteka, edukacja, kultura",
    tags: [
      "biblioteka",
      "książki",
      "czytelnia",
      "coworking",
      "kultura",
      "nauka",
    ],
  },
  {
    id: 7,
    name: "Centrum Sportowe Atlas Arena Fitness",
    lat: 51.768,
    lng: 19.43,
    status: "wszystkie",
    description:
      "Siłownia, fitness, basen i zajęcia grupowe dla dorosłych i dzieci.",
    fullDescription:
      "Nowoczesne centrum sportowe oferujące pełną gamę aktywności fizycznych. W naszej ofercie znajdziesz profesjonalnie wyposażoną siłownię, basen olimpijski, saunę, jacuzzi oraz szeroki wybór zajęć grupowych (joga, pilates, spinning, aerobik). Organizujemy również zajęcia dla dzieci i młodzieży.",
    category: "sport, fitness, rekreacja",
    tags: [
      "siłownia",
      "fitness",
      "basen",
      "zajęcia grupowe",
      "sport",
      "rekreacja",
    ],
  },
  {
    id: 8,
    name: "Coworking Łódź Fabryczna",
    lat: 51.759,
    lng: 19.458,
    status: "wszystkie",
    description:
      "Przestrzeń coworkingowa z salami konferencyjnymi, szybkim internetem i dostępem 24/7.",
    fullDescription:
      "Nowoczesna przestrzeń coworkingowa zlokalizowana w pobliżu dworca Łódź Fabryczna. Oferujemy elastyczne miejsca pracy, biurka dedykowane, sale konferencyjne oraz przestronne open space. Wszystkie miejsca wyposażone są w szybki internet światłowodowy oraz ergonomiczne krzesła. Dostęp 24/7 dla członków.",
    category: "coworking, biuro, praca zdalna",
    tags: [
      "coworking",
      "biuro",
      "praca zdalna",
      "sala konferencyjna",
      "internet",
      "freelancer",
    ],
  },
  {
    id: 9,
    name: "Przedszkole Miejskie Zielony Zakątek",
    lat: 51.751,
    lng: 19.44,
    status: "wszystkie",
    description:
      "Publiczne przedszkole z ogrodem, zajęciami językowymi i programem proekologicznym.",
    fullDescription:
      "Publiczne przedszkole miejskie oferujące opiekę i edukację dla dzieci w wieku 3-6 lat. Nasza placówka posiada przestronny ogród z placem zabaw, nowoczesne sale dydaktyczne oraz wykwalifikowaną kadrę pedagogiczną. Oferujemy zajęcia językowe (angielski, niemiecki), zajęcia artystyczne, muzyczne oraz sportowe.",
    category: "przedszkole, edukacja dzieci",
    tags: [
      "przedszkole",
      "dzieci",
      "edukacja",
      "opieka",
      "ekologia",
      "zajęcia językowe",
    ],
  },
  {
    id: 10,
    name: "Laser Tag Arena Łódź",
    lat: 51.7601,
    lng: 19.4503,
    status: "wszystkie",
    description: "Dynamiczna gra laserowa dla dzieci, młodzieży i dorosłych.",
    fullDescription:
      "Laser Tag Arena Łódź to idealne miejsce na aktywną rozrywkę z przyjaciółmi lub rodziną. Oferujemy realistyczne pole do gry laserowej, specjalne scenariusze misji oraz sprzęt najwyższej jakości. Możliwość organizacji urodzin, imprez firmowych i turniejów. Zapraszamy codziennie od 12:00 do 22:00.",
    category: "rozrywka, aktywność, gry",
    tags: [
      "laser tag",
      "gra zespołowa",
      "aktywny wypoczynek",
      "imprezy firmowe",
      "urodziny",
      "rozrywka dla dzieci",
      "rozrywka dla dorosłych",
      "turnieje",
      "zabawa",
      "sport"
    ]
  },
];

export default function UslugiPage() {
  const [query, setQuery] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [useAi, setUseAi] = useState(true);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const [aiMatchedIds, setAiMatchedIds] = useState<number[] | null>(null);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    const tokens = q.split(/\s+/).filter(Boolean);

    // Jeśli AI jest włączone i mamy wynik – użyj kolejności i filtrowania z modelu
    if (useAi && aiMatchedIds && aiMatchedIds.length > 0) {
      const byId: Record<number, ServiceLocation> = {};
      for (const s of services) {
        byId[s.id] = s;
      }

      let base = aiMatchedIds
        .map((id) => byId[id])
        .filter((s): s is ServiceLocation => Boolean(s));

      // Dodatkowe twarde reguły po naszej stronie:
      // jeśli zapytanie wygląda na związane z AUTEM / SAMOCHODEM,
      // odfiltruj usługi, które nie są "samochodowe"
      const autoKeywords = [
        "auto",
        "samochod",
        "samochód",
        "tesla",
        "pojazd",
        "pojazdów",
        "pojazdow",
      ];
      const isAutoQuery = tokens.some((t) =>
        autoKeywords.some((k) => t.includes(k))
      );

      if (isAutoQuery) {
        base = base.filter((service) => {
          const haystack = `${service.category} ${service.tags.join(
            " "
          )}`.toLowerCase();
          // wymagamy, żeby w danych usługi pojawiały się słowa związane z autem
          return (
            haystack.includes("auto") ||
            haystack.includes("samoch") ||
            haystack.includes("pojazd")
          );
        });
      }

      return base;
    }

    // Fallback: proste wyszukiwanie tekstowe (w tym po tagach)
    // Dzielimy zapytanie na słowa i sprawdzamy, czy JAKIKOLWIEK token występuje w danych usługi
    return services.filter((service) => {
      const haystack = `${service.name} ${service.description} ${
        service.category
      } ${service.tags.join(" ")}`.toLowerCase();
      return tokens.some((token) => haystack.includes(token));
    });
  }, [query, useAi, aiMatchedIds]);

  // Wołanie OpenAI API po zmianie zapytania
  useEffect(() => {
    const q = query.trim();
    if (!q || !useAi) {
      setAiMatchedIds(null);
      setIsLoadingAi(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoadingAi(true);
      try {
        const res = await fetch("/api/uslugi-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            services: services.map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              category: s.category,
              tags: s.tags,
            })),
          }),
        });

        if (!res.ok) {
          console.error("LLM matching error:", await res.text());
          if (!cancelled) {
            setAiMatchedIds(null);
          }
          return;
        }

        const data = (await res.json()) as { ids?: number[] };
        if (!cancelled) {
          setAiMatchedIds(data.ids && data.ids.length ? data.ids : null);
        }
      } catch (e) {
        console.error("Error calling /api/uslugi-match", e);
        if (!cancelled) {
          setAiMatchedIds(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAi(false);
        }
      }
    };

    // prosta „debounce”: odczekaj chwilę zanim zawołasz API
    const timeout = setTimeout(run, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, useAi]);

  // Jeśli po filtracji wybrana usługa zniknie z listy, odznacz ją
  useEffect(() => {
    if (!selectedServiceId) return;
    const stillThere = filteredServices.some(
      (service) => service.id === selectedServiceId
    );
    if (!stillThere) {
      setSelectedServiceId(null);
    }
  }, [filteredServices, selectedServiceId]);

  return (
    <main className="min-h-screen flex flex-col font-sans text-text-dark bg-gray-50">
      <div className="max-w-6xl mx-auto w-full px-4 py-6 space-y-4">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-primary uppercase">
            Usługi na mapie
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            Skorzystaj już dziś z{" "}
            <span className="font-semibold text-primary">
              Inteligentnej Wyszukiwarki Łodzi
            </span>{" "}
            i zaplanuj swój dzień! Znajdź mechanika, serwis rowerów, punkty
            ładowania i wiele więcej – wszystko w jednym miejscu, z dokładną
            lokalizacją na mapie.
          </p>
        </motion.header>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj usług, np. Miejsce do spędzenia wieczoru z partnerem..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>
          {/* Loading dots or results count */}
          <div className="flex items-center justify-center min-w-[200px] h-12">
            {isLoadingAi && useAi && query.trim() ? (
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-primary rounded-full"
                    animate={{
                      y: [0, -12, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            ) : query.trim() && filteredServices.length > 0 ? (
              <div className="text-sm font-semibold text-primary">
                Znaleziono {filteredServices.length}{" "}
                {filteredServices.length === 1
                  ? "wynik"
                  : filteredServices.length < 5
                  ? "wyniki"
                  : "wyników"}
              </div>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 items-stretch"
        >
          {/* List of services */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm overflow-y-auto max-h-[420px]"
          >
            <h2 className="text-sm font-bold uppercase text-primary mb-3 border-b border-gray-200 pb-2">
              Znalezione usługi
            </h2>
            {filteredServices.length === 0 ? (
              <p className="text-sm text-gray-500">
                Brak usług pasujących do wyszukiwanego hasła. Spróbuj użyć
                innego słowa kluczowego.
              </p>
            ) : (
              <ul className="space-y-3">
                {filteredServices.map((service, index) => {
                  const isActive = selectedServiceId === service.id;
                  return (
                    <motion.li
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      onClick={() => setSelectedServiceId(service.id)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className={`border border-gray-200 rounded-md p-3 hover:border-primary hover:shadow-sm transition-colors cursor-pointer ${
                        isActive ? "border-primary bg-blue-50" : ""
                      }`}
                    >
                      <h3 className="text-sm font-semibold text-black">
                        {service.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {service.description}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1 italic">
                        {service.category}
                      </p>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </motion.section>

          {/* Map with services */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-80 lg:min-h-[420px] overflow-hidden"
          >
            <MapComponent
              activeFilter="wszystkie"
              locations={filteredServices}
              selectedLocationId={selectedServiceId}
              showStatus={false}
            />
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
