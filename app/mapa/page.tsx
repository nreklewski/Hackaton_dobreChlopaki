"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <p className="text-gray-600">Ładowanie mapy...</p>
    </div>
  ),
});

// Sample data for locations/points
const locations = [
  {
    id: 1,
    name: "Centrum Obsługi Karty Łodzianina (Śródmieście)",
    lat: 51.7592,
    lng: 19.456,
    status: "w trakcie",
    description: "Nowe centrum obsługi klienta w centrum miasta",
    date: "2024-01-15",
    image: "/hero.jpg",
  },
  {
    id: 2,
    name: "Rewitalizacja ul. Piotrkowskiej",
    lat: 51.7592,
    lng: 19.456,
    status: "w trakcie",
    description: "Kompleksowa rewitalizacja głównej ulicy Łodzi",
    date: "2024-01-15",
    image: "/hero.jpg",
  },
  {
    id: 3,
    name: "Modernizacja Parku Staromiejskiego",
    lat: 51.7612,
    lng: 19.458,
    status: "gotowe",
    description: "Zakończona modernizacja parku z nową infrastrukturą",
    date: "2023-12-01",
    image: "/hero.jpg",
  },
  {
    id: 4,
    name: "Przebudowa Placu Wolności",
    lat: 51.7572,
    lng: 19.454,
    status: "w trakcie",
    description: "Przebudowa głównego placu miasta",
    date: "2024-02-01",
    image: "/hero.jpg",
  },
  {
    id: 5,
    name: "Rewitalizacja Manufaktury",
    lat: 51.7632,
    lng: 19.46,
    status: "planowane",
    description: "Planowana rewitalizacja kompleksu Manufaktura",
    date: "2024-06-01",
    image: "/hero.jpg",
  },
  {
    id: 6,
    name: "Zielone dachy na budynkach użyteczności publicznej",
    lat: 51.7602,
    lng: 19.457,
    status: "inicjatywy",
    description:
      "Projekt zakłada montaż zielonych dachów na budynkach użyteczności publicznej w centrum miasta, co poprawi jakość powietrza i estetykę miasta.",
    votes: 1247,
    date: "2024-03-10",
    image: "/hero.jpg",
  },
  {
    id: 7,
    name: "Więcej miejsc parkingowych przy dworcu",
    lat: 51.7582,
    lng: 19.455,
    status: "inicjatywy",
    description:
      "Inicjatywa zakłada zwiększenie liczby miejsc parkingowych w okolicy dworca kolejowego Łódź Fabryczna.",
    votes: 892,
    date: "2024-03-05",
    image: "/hero.jpg",
  },
];

// Sample data for before/after photos
const beforeAfterPhotos = [
  {
    id: 1,
    projectTitle: "Rewitalizacja ul. Piotrkowskiej",
    before: "/hero.jpg",
    after: "/hero.jpg",
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    projectTitle: "Modernizacja Parku Staromiejskiego",
    before: "/hero.jpg",
    after: "/hero.jpg",
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    projectTitle: "Przebudowa Placu Wolności",
    before: "/hero.jpg",
    after: "/hero.jpg",
    likes: 156,
    comments: 28,
  },
];

type FilterType = "wszystkie" | "planowane" | "w trakcie" | "gotowe" | "inicjatywy";

export default function MapaPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("wszystkie");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const filteredLocations = locations.filter((loc) => {
    if (activeFilter === "inicjatywy") {
      return loc.status === "inicjatywy";
    }
    if (activeFilter === "wszystkie") return true;
    return loc.status === activeFilter;
  });

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % beforeAfterPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + beforeAfterPhotos.length) % beforeAfterPhotos.length
    );
  };

  return (
    <main className="min-h-screen flex flex-col font-sans text-text-dark bg-gray-50">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Left Column - 1/4 width */}
        <div className="w-full lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Zmiany Filter Block */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-3 text-primary uppercase">Zmiany</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveFilter("planowane")}
                  className={`px-4 py-2 text-sm font-medium transition-colors text-left ${
                    activeFilter === "planowane"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Planowane
                </button>
                <button
                  onClick={() => setActiveFilter("w trakcie")}
                  className={`px-4 py-2 text-sm font-medium transition-colors text-left ${
                    activeFilter === "w trakcie"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  W trakcie
                </button>
                <button
                  onClick={() => setActiveFilter("gotowe")}
                  className={`px-4 py-2 text-sm font-medium transition-colors text-left ${
                    activeFilter === "gotowe"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Ukończone
                </button>
              </div>
              <button
                onClick={() => setActiveFilter("inicjatywy")}
                className={`w-full mt-3 px-4 py-2 text-sm font-bold uppercase transition-colors ${
                  activeFilter === "inicjatywy"
                    ? "bg-secondary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Inicjatywy
              </button>
            </div>

            {/* Locations List */}
            <div className="space-y-3">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocationId(location.id)}
                  className={`bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedLocationId === location.id
                      ? "border-primary border-2"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-primary font-medium text-sm flex-1 pr-2">
                      {location.name}
                    </h4>
                    <svg
                      className="w-5 h-5 text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 3/4 width with Map */}
        <div className="w-full lg:w-3/4 flex flex-col">
          {/* Map Section */}
          <div className="flex-1 relative min-h-[400px]">
            <MapComponent
              activeFilter={activeFilter}
              locations={locations}
              selectedLocationId={selectedLocationId}
            />
          </div>

          {/* Before/After Section - Below Map */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black uppercase border-b-2 border-primary pb-2">
                Przed i Po
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPhoto}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full"
                  aria-label="Poprzednie zdjęcie"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">
                  {currentPhotoIndex + 1} / {beforeAfterPhotos.length}
                </span>
                <button
                  onClick={nextPhoto}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-primary hover:text-white transition-colors rounded-full"
                  aria-label="Następne zdjęcie"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="p-3 bg-gray-50">
                <h3 className="font-bold text-sm">
                  {beforeAfterPhotos[currentPhotoIndex].projectTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2">
                <div>
                  <p className="text-xs font-semibold mb-1 text-gray-600">PRZED</p>
                  <div className="relative h-40">
                    <Image
                      src={beforeAfterPhotos[currentPhotoIndex].before}
                      alt="Przed"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 text-gray-600">PO</p>
                  <div className="relative h-40">
                    <Image
                      src={beforeAfterPhotos[currentPhotoIndex].after}
                      alt="Po"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <button className="flex items-center space-x-1 text-sm hover:text-primary transition-colors">
                    <span>👍</span>
                    <span>{beforeAfterPhotos[currentPhotoIndex].likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm hover:text-primary transition-colors">
                    <span>💬</span>
                    <span>{beforeAfterPhotos[currentPhotoIndex].comments}</span>
                  </button>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Dodaj komentarz..."
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

