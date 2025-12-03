"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import L from "leaflet";
import { motion, AnimatePresence } from "motion/react";

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
    image: "/w-trakcie.jpg",
    progress: 65,
    daysRemaining: 45,
  },
  {
    id: 2,
    name: "Rewitalizacja ul. Piotrkowskiej",
    lat: 51.7585,
    lng: 19.459,
    status: "w trakcie",
    description: "Kompleksowa rewitalizacja głównej ulicy Łodzi",
    date: "2024-01-15",
    image: "/w-trakcie.jpg",
    progress: 42,
    daysRemaining: 78,
  },
  {
    id: 3,
    name: "Modernizacja Parku Staromiejskiego",
    lat: 51.755,
    lng: 19.448,
    status: "gotowe",
    description: "Zakończona modernizacja parku z nową infrastrukturą",
    date: "2023-12-01",
    image: "/park-staromiejski-po.jpg",
    progress: 100,
    daysRemaining: 0,
  },
  {
    id: 4,
    name: "Przebudowa Placu Wolności",
    lat: 51.762,
    lng: 19.463,
    status: "w trakcie",
    description: "Przebudowa głównego placu miasta",
    date: "2024-02-01",
    image: "/w-trakcie.jpg",
    progress: 28,
    daysRemaining: 120,
  },
  {
    id: 5,
    name: "Rewitalizacja Manufaktury",
    lat: 51.768,
    lng: 19.455,
    status: "planowane",
    description: "Planowana rewitalizacja kompleksu Manufaktura",
    date: "2024-06-01",
    image: "/manufaktura-planowana.jpg",
    progress: 0,
    daysRemaining: 180,
  },
  {
    id: 6,
    name: "Zielone dachy na budynkach użyteczności publicznej",
    lat: 51.748,
    lng: 19.47,
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
    lat: 51.752,
    lng: 19.445,
    status: "inicjatywy",
    description:
      "Inicjatywa zakłada zwiększenie liczby miejsc parkingowych w okolicy dworca kolejowego Łódź Fabryczna.",
    votes: 892,
    date: "2024-03-05",
    image: "/hero.jpg",
  },
  {
    id: 8,
    name: "Bezpłatne WiFi w parkach miejskich",
    lat: 51.765,
    lng: 19.452,
    status: "inicjatywy",
    description:
      "Projekt zakłada instalację bezpłatnego WiFi we wszystkich parkach miejskich w Łodzi, aby mieszkańcy mogli korzystać z internetu podczas wypoczynku na świeżym powietrzu.",
    votes: 654,
    date: "2024-03-15",
    image: "/hero.jpg",
  },
  {
    id: 9,
    name: "Remont ul. Narutowicza",
    lat: 51.747,
    lng: 19.462,
    status: "w trakcie",
    description: "Kompleksowy remont ulicy z modernizacją nawierzchni i infrastruktury",
    date: "2024-02-10",
    image: "/w-trakcie.jpg",
    progress: 55,
    daysRemaining: 60,
  },
  {
    id: 10,
    name: "Rewitalizacja Parku Helenów",
    lat: 51.771,
    lng: 19.441,
    status: "w trakcie",
    description: "Modernizacja parku z nowymi ścieżkami, placem zabaw i oświetleniem",
    date: "2024-01-20",
    image: "/w-trakcie.jpg",
    progress: 38,
    daysRemaining: 95,
  },
  {
    id: 11,
    name: "Budowa nowej biblioteki na Widzewie",
    lat: 51.733,
    lng: 19.478,
    status: "planowane",
    description: "Nowoczesna biblioteka z czytelnią i przestrzenią coworkingową",
    date: "2024-07-01",
    image: "/hero.jpg",
    progress: 0,
    daysRemaining: 210,
  },
  {
    id: 12,
    name: "Modernizacja dworca Łódź Kaliska",
    lat: 51.757,
    lng: 19.428,
    status: "w trakcie",
    description: "Przebudowa dworca z nowoczesną infrastrukturą i udogodnieniami",
    date: "2024-01-05",
    image: "/w-trakcie.jpg",
    progress: 72,
    daysRemaining: 35,
  },
  {
    id: 13,
    name: "Więcej ścieżek rowerowych w centrum",
    lat: 51.761,
    lng: 19.451,
    status: "inicjatywy",
    description:
      "Inicjatywa zakłada rozbudowę sieci ścieżek rowerowych w centrum miasta, aby ułatwić mieszkańcom poruszanie się rowerem.",
    votes: 1123,
    date: "2024-03-20",
    image: "/hero.jpg",
  },
  {
    id: 14,
    name: "Bezpłatne zajęcia sportowe dla seniorów",
    lat: 51.754,
    lng: 19.435,
    status: "inicjatywy",
    description:
      "Projekt organizacji bezpłatnych zajęć sportowych i rekreacyjnych dla seniorów w parkach miejskich.",
    votes: 756,
    date: "2024-03-12",
    image: "/hero.jpg",
  },
  {
    id: 15,
    name: "Rewitalizacja ul. Wólczańskiej",
    lat: 51.763,
    lng: 19.472,
    status: "w trakcie",
    description: "Kompleksowa rewitalizacja ulicy z nową nawierzchnią i zielenią",
    date: "2024-02-15",
    image: "/w-trakcie.jpg",
    progress: 48,
    daysRemaining: 85,
  },
  {
    id: 16,
    name: "Modernizacja basenu Fala",
    lat: 51.778,
    lng: 19.444,
    status: "planowane",
    description: "Przebudowa basenu z nowoczesnym wyposażeniem i udogodnieniami",
    date: "2024-08-15",
    image: "/hero.jpg",
    progress: 0,
    daysRemaining: 240,
  },
  {
    id: 17,
    name: "Więcej miejsc do recyklingu",
    lat: 51.742,
    lng: 19.449,
    status: "inicjatywy",
    description:
      "Inicjatywa zakłada zwiększenie liczby punktów selektywnej zbiórki odpadów w różnych dzielnicach miasta.",
    votes: 934,
    date: "2024-03-08",
    image: "/hero.jpg",
  },
  {
    id: 18,
    name: "Rewitalizacja Placu Dąbrowskiego",
    lat: 51.752,
    lng: 19.456,
    status: "gotowe",
    description: "Zakończona rewitalizacja placu z nową zielenią i miejscami do odpoczynku",
    date: "2023-11-20",
    image: "/hero.jpg",
    progress: 100,
    daysRemaining: 0,
  },
  {
    id: 19,
    name: "Bezpłatne kursy językowe dla mieszkańców",
    lat: 51.768,
    lng: 19.465,
    status: "inicjatywy",
    description:
      "Projekt organizacji bezpłatnych kursów językowych (angielski, niemiecki) dla mieszkańców Łodzi.",
    votes: 1087,
    date: "2024-03-18",
    image: "/hero.jpg",
  },
  {
    id: 20,
    name: "Modernizacja ul. Gdańskiej",
    lat: 51.756,
    lng: 19.438,
    status: "w trakcie",
    description: "Remont ulicy z nową nawierzchnią, chodnikami i oświetleniem",
    date: "2024-01-25",
    image: "/w-trakcie.jpg",
    progress: 61,
    daysRemaining: 50,
  },
  {
    id: 21,
    name: "Budowa nowego skateparku",
    lat: 51.749,
    lng: 19.442,
    status: "planowane",
    description: "Nowoczesny skatepark dla młodzieży z bezpiecznym wyposażeniem",
    date: "2024-09-01",
    image: "/hero.jpg",
    progress: 0,
    daysRemaining: 270,
  },
  {
    id: 22,
    name: "Więcej ławek i miejsc do odpoczynku",
    lat: 51.760,
    lng: 19.448,
    status: "inicjatywy",
    description:
      "Inicjatywa zakłada zwiększenie liczby ławek i miejsc do odpoczynku w parkach i na głównych ulicach miasta.",
    votes: 823,
    date: "2024-03-14",
    image: "/hero.jpg",
  },
];

// Sample data for before/after photos
const beforeAfterPhotos = [
  {
    id: 1,
    projectTitle: "Rewitalizacja Manufaktury",
    before: "/manufaktura-przed.jpg",
    after: "/manufaktura-po.jpeg",
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    projectTitle: "Przebudowa Placu Wolności",
    before: "/plac-wolnosc-przed.jpg",
    after: "/plac-wolnosci-po.webp",
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    projectTitle: "Rewitalizacja ul. Włókienniczej",
    before: "/wlokiennicza-przed.png",
    after: "/wlokiennicza-po.png",
    likes: 156,
    comments: 28,
  },
];

type FilterType =
  | "wszystkie"
  | "planowane"
  | "w trakcie"
  | "gotowe"
  | "inicjatywy";

type TabType = "wszystkie" | "zmiany" | "inicjatywy" | "zglos-problem";

export default function MapaPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("wszystkie");
  const [activeTab, setActiveTab] = useState<TabType>("wszystkie");
  const [isZmianyExpanded, setIsZmianyExpanded] = useState(false);
  const [isInicjatywyExpanded, setIsInicjatywyExpanded] = useState(false);
  const [expandedExamples, setExpandedExamples] = useState<Set<number>>(
    new Set()
  );
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [sliderValue, setSliderValue] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showReportOverlay, setShowReportOverlay] = useState(false);
  const [reportImage, setReportImage] = useState<File | null>(null);
  const [reportDescription, setReportDescription] = useState("");
  const [reportLocation, setReportLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [votedInitiatives, setVotedInitiatives] = useState<Set<number>>(
    new Set()
  );
  const [initiativeVotes, setInitiativeVotes] = useState<Record<number, number>>({});

  const updateSliderFromClientX = (clientX: number) => {
    const container = sliderContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setSliderValue(percent);
  };

  // Filtrowanie dla mapy (zależy od activeTab)
  const filteredLocations = locations.filter((loc) => {
    if (activeTab === "wszystkie") {
      return true;
    }
    if (activeTab === "inicjatywy") {
      return loc.status === "inicjatywy";
    }
    if (activeTab === "zmiany") {
      if (activeFilter === "wszystkie") {
        return loc.status !== "inicjatywy";
      }
      return loc.status === activeFilter;
    }
    return false;
  });

  // Filtrowanie dla sekcji "Zmiany" - zawsze pokazuje tylko zmiany (nie inicjatywy)
  const zmianyLocations = locations.filter((loc) => {
    if (loc.status === "inicjatywy") {
      return false;
    }
    if (activeFilter === "wszystkie") {
      return true;
    }
    return loc.status === activeFilter;
  });

  // Filtrowanie dla sekcji "Inicjatywy" - zawsze pokazuje tylko inicjatywy
  const inicjatywyLocations = locations.filter((loc) => {
    return loc.status === "inicjatywy";
  });

  const toggleExampleExpanded = (id: number) => {
    setExpandedExamples((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (activeTab === "zglos-problem") {
      setReportLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReportImage(e.target.files[0]);
    }
  };

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
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] relative z-10">
        {/* Left Column - 1/4 width */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-1/4 bg-linear-to-b from-white to-gray-50 border-r-2 border-primary/20 relative z-10 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-5 space-y-5"
          >
            {/* Pokaż wszystko Button */}
            <motion.button
              onClick={() => {
                setActiveTab("wszystkie");
                setIsZmianyExpanded(false);
                setIsInicjatywyExpanded(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full px-5 py-4 text-left font-bold text-lg uppercase transition-all duration-300 border-2 rounded-xl shadow-md ${
                activeTab === "wszystkie"
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                  : "bg-white text-primary border-primary/30 hover:border-primary hover:shadow-lg hover:bg-primary/5"
              }`}
            >
              <span>Pokaż wszystko</span>
            </motion.button>

            {/* Zmiany Tab - Expandable */}
            <motion.div
              initial={false}
              className="bg-white border-2 border-primary/20 rounded-xl shadow-md overflow-hidden"
            >
              <motion.button
                onClick={() => {
                  setActiveTab("zmiany");
                  setIsZmianyExpanded(!isZmianyExpanded);
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full px-5 py-4 text-left font-bold text-lg uppercase transition-all duration-300 ${
                  activeTab === "zmiany"
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white text-primary hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Zmiany</span>
                  <motion.svg
                    animate={{ rotate: isZmianyExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5"
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
                  </motion.svg>
                </div>
              </motion.button>

              <AnimatePresence>
                {isZmianyExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-2 border-t-2 border-primary/10 bg-linear-to-b from-white to-gray-50/50">
                      <motion.button
                        onClick={() => setActiveFilter("planowane")}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-4 py-3 text-sm font-semibold transition-all duration-200 text-left rounded-lg ${
                          activeFilter === "planowane"
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                        }`}
                      >
                        Zaplanowane
                      </motion.button>
                      <motion.button
                        onClick={() => setActiveFilter("w trakcie")}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-4 py-3 text-sm font-semibold transition-all duration-200 text-left rounded-lg ${
                          activeFilter === "w trakcie"
                            ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                            : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                        }`}
                      >
                        W trakcie
                      </motion.button>
                      <motion.button
                        onClick={() => setActiveFilter("gotowe")}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-4 py-3 text-sm font-semibold transition-all duration-200 text-left rounded-lg ${
                          activeFilter === "gotowe"
                            ? "bg-green-500 text-white shadow-md shadow-green-500/30"
                            : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                        }`}
                      >
                        Ukończone
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isZmianyExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t-2 border-primary/10 bg-white">
                      <h4 className="font-bold text-sm mb-4 text-gray-700 uppercase tracking-wider">
                        Ostatnie renowacje
                      </h4>
                      <div className="space-y-3">
                        {zmianyLocations.map((location, index) => (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                          >
                            <motion.button
                              onClick={() => {
                                setSelectedLocationId(location.id);
                                toggleExampleExpanded(location.id);
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`w-full px-4 py-3 text-left transition-all duration-200 ${
                                selectedLocationId === location.id
                                  ? "bg-primary text-white shadow-md"
                                  : "bg-gray-50 hover:bg-primary/10"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm flex-1 pr-2">
                                  {location.name}
                                </h4>
                                <motion.svg
                                  animate={{
                                    rotate: expandedExamples.has(location.id)
                                      ? 180
                                      : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="w-5 h-5 shrink-0"
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
                                </motion.svg>
                              </div>
                            </motion.button>
                            <AnimatePresence>
                              {expandedExamples.has(location.id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 border-t-2 border-gray-200 bg-linear-to-b from-white to-gray-50/50">
                                    {location.image && (
                                      <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="mb-3 overflow-hidden rounded-lg shadow-md"
                                      >
                                        <Image
                                          src={location.image}
                                          alt={location.name}
                                          width={400}
                                          height={200}
                                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                      </motion.div>
                                    )}
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                      className="text-sm text-gray-600 leading-relaxed"
                                    >
                                      {location.description}
                                    </motion.p>
                                    {location.date && (
                                      <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-xs text-gray-500 mt-3 font-semibold"
                                      >
                                        Data: {location.date}
                                      </motion.p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Inicjatywy Tab - Expandable */}
            <motion.div
              initial={false}
              className="bg-white border-2 border-secondary/20 rounded-xl shadow-md overflow-hidden"
            >
              <motion.button
                onClick={() => {
                  setActiveTab("inicjatywy");
                  setIsInicjatywyExpanded(!isInicjatywyExpanded);
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full px-5 py-4 text-left font-bold text-lg uppercase transition-all duration-300 ${
                  activeTab === "inicjatywy"
                    ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                    : "bg-white text-secondary hover:bg-secondary/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Inicjatywy</span>
                  <motion.svg
                    animate={{ rotate: isInicjatywyExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-5"
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
                  </motion.svg>
                </div>
              </motion.button>

              <AnimatePresence>
                {isInicjatywyExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t-2 border-secondary/10 bg-linear-to-b from-white to-secondary/5">
                      <div className="space-y-3">
                        {inicjatywyLocations.map((location, index) => (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                          >
                            <motion.button
                              onClick={() => {
                                setSelectedLocationId(location.id);
                                toggleExampleExpanded(location.id);
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`w-full px-4 py-3 text-left transition-all duration-200 ${
                                selectedLocationId === location.id
                                  ? "bg-secondary text-white shadow-md"
                                  : "bg-gray-50 hover:bg-secondary/10"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm flex-1 pr-2">
                                  {location.name}
                                </h4>
                                <motion.svg
                                  animate={{
                                    rotate: expandedExamples.has(location.id)
                                      ? 180
                                      : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="w-5 h-5 shrink-0"
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
                                </motion.svg>
                              </div>
                            </motion.button>
                            <AnimatePresence>
                              {expandedExamples.has(location.id) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 border-t-2 border-gray-200 bg-linear-to-b from-white to-secondary/5">
                                    {location.image && (
                                      <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="mb-3 overflow-hidden rounded-lg shadow-md"
                                      >
                                        <Image
                                          src={location.image}
                                          alt={location.name}
                                          width={400}
                                          height={200}
                                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                      </motion.div>
                                    )}
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                      className="text-sm text-gray-600 leading-relaxed"
                                    >
                                      {location.description}
                                    </motion.p>
                                    {location.votes !== undefined && (
                                      <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-xs text-gray-500 mt-3 font-semibold flex items-center gap-1"
                                      >
                                        <span>👍</span>
                                        <span>{location.votes} głosów</span>
                                      </motion.p>
                                    )}
                                    {location.date && (
                                      <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xs text-gray-500 mt-1 font-semibold"
                                      >
                                        Data: {location.date}
                                      </motion.p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Zgłoś problem Tab */}
            <motion.button
              onClick={() => {
                setActiveTab("zglos-problem");
                setShowReportOverlay(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full px-5 py-4 text-left font-bold text-lg uppercase transition-all duration-300 border-2 rounded-xl shadow-md ${
                activeTab === "zglos-problem"
                  ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30"
                  : "bg-white text-red-600 border-red-300 hover:border-red-500 hover:shadow-lg hover:bg-red-50"
              }`}
            >
              <span>Zgłoś problem</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Column - 3/4 width with Map */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-3/4 flex flex-col relative z-10"
        >
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 relative min-h-[500px] z-10"
          >
            <MapComponent
              activeFilter={activeFilter}
              activeTab={activeTab}
              locations={locations.map((loc) => ({
                ...loc,
                votes: initiativeVotes[loc.id] !== undefined 
                  ? initiativeVotes[loc.id] 
                  : loc.votes,
              }))}
              selectedLocationId={selectedLocationId}
              onMapClick={handleMapClick}
              reportLocation={reportLocation}
              onVote={(initiativeId) => {
                if (!votedInitiatives.has(initiativeId)) {
                  setVotedInitiatives((prev) => new Set(prev).add(initiativeId));
                  setInitiativeVotes((prev) => {
                    const currentVotes = locations.find(l => l.id === initiativeId)?.votes || 0;
                    return {
                      ...prev,
                      [initiativeId]: (prev[initiativeId] || currentVotes) + 1,
                    };
                  });
                }
              }}
              votedInitiatives={votedInitiatives}
            />
          </motion.div>

          {/* Najpopularniejsze inicjatywy tego miesiąca */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white border-t-2 border-primary/20 p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-primary uppercase mb-4 tracking-wider">
              Najpopularniejsze inicjatywy tego miesiąca
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {locations
                .filter((loc) => loc.status === "inicjatywy")
                .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                .slice(0, 3)
                .map((initiative, index) => (
                  <motion.div
                    key={initiative.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-primary/20 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/40"
                  >
                    <h3 className="font-bold text-base text-primary mb-2">
                      {initiative.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {initiative.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👍</span>
                        <span className="text-sm font-semibold text-gray-700">
                          {initiative.votes || 0} głosów
                        </span>
                      </div>
                      {initiative.date && (
                        <span className="text-xs text-gray-500">
                          {initiative.date}
                        </span>
                      )}
                    </div>
                    <motion.button
                      onClick={() => {
                        setActiveTab("inicjatywy");
                        setSelectedLocationId(initiative.id);
                        setIsInicjatywyExpanded(true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-primary text-white text-sm font-bold uppercase hover:bg-primary/90 transition-colors rounded-lg shadow-md"
                    >
                      Zobacz na mapie
                    </motion.button>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Before/After Section - Below Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-linear-to-b from-white via-gray-50 to-white border-t-2 border-primary/20 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-primary uppercase tracking-wider flex items-center gap-3"
              >
                <span className="border-b-4 border-primary pb-2">
                  Przed i Po
                </span>
              </motion.h2>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={prevPhoto}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 flex items-center justify-center bg-primary text-white hover:bg-primary/90 transition-all duration-300 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl"
                  aria-label="Poprzednie zdjęcie"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
                <motion.span
                  key={currentPhotoIndex}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-full shadow-md border-2 border-primary/20 min-w-20 text-center"
                >
                  {currentPhotoIndex + 1} / {beforeAfterPhotos.length}
                </motion.span>
                <motion.button
                  onClick={nextPhoto}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 flex items-center justify-center bg-primary text-white hover:bg-primary/90 transition-all duration-300 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl"
                  aria-label="Następne zdjęcie"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            <motion.div
              key={currentPhotoIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 bg-linear-to-r from-primary/10 via-primary/5 to-transparent border-b-2 border-primary/20">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-base text-primary"
                >
                  {beforeAfterPhotos[currentPhotoIndex].projectTitle}
                </motion.h3>
              </div>

              <div className="p-5 bg-linear-to-b from-white to-gray-50/50">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-bold mb-4 text-primary uppercase tracking-wider text-center"
                >
                  Przesuń, aby porównać PRZED / PO
                </motion.p>

                <motion.div
                  ref={sliderContainerRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl bg-black cursor-col-resize select-none shadow-2xl border-4 border-white"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                    updateSliderFromClientX(e.clientX);
                  }}
                  onMouseMove={(e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    updateSliderFromClientX(e.clientX);
                  }}
                  onMouseUp={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onMouseLeave={() => setIsDragging(false)}
                  onTouchStart={(e) => {
                    setIsDragging(true);
                    updateSliderFromClientX(e.touches[0].clientX);
                  }}
                  onTouchMove={(e) => {
                    if (!isDragging) return;
                    updateSliderFromClientX(e.touches[0].clientX);
                  }}
                  onTouchEnd={() => setIsDragging(false)}
                  onTouchCancel={() => setIsDragging(false)}
                >
                  {/* Obraz PO jako tło (zawsze pełny rozmiar) */}
                  <Image
                    src={beforeAfterPhotos[currentPhotoIndex].after}
                    alt="Po"
                    fill
                    className="object-cover select-none"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />

                  {/* Obraz PRZED, przycinany clip-path zamiast skalowania */}
                  <div className="absolute inset-0 pointer-events-none">
                    <Image
                      src={beforeAfterPhotos[currentPhotoIndex].before}
                      alt="Przed"
                      fill
                      className="object-cover select-none"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      style={{
                        clipPath: `inset(0 ${100 - sliderValue}% 0 0)`,
                      }}
                    />
                  </div>

                  {/* Pionowy pasek / uchwyt suwaka */}
                  <motion.div
                    className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
                    style={{
                      left: `${sliderValue}%`,
                      transform: "translateX(-50%)",
                    }}
                    animate={{
                      scale: isDragging ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-1 h-full bg-white/90 shadow-lg" />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-white shadow-xl border-2 border-primary flex items-center justify-center text-sm font-bold text-primary backdrop-blur-sm"
                    >
                      ⇄
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="p-5 border-t-2 border-primary/20 bg-linear-to-b from-white to-gray-50/30">
                <div className="flex items-center justify-between mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-200 border-2 border-green-200 hover:border-green-300 shadow-sm hover:shadow-md"
                  >
                    <span className="text-lg">👍</span>
                    <span className="font-semibold">
                      {beforeAfterPhotos[currentPhotoIndex].likes}
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  >
                    <span className="text-lg">💬</span>
                    <span className="font-semibold">
                      {beforeAfterPhotos[currentPhotoIndex].comments}
                    </span>
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Dodaj komentarz..."
                      className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md"
                    >
                      Wyślij
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Report Problem Overlay */}
      {showReportOverlay && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          {/* Blur Background */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
            onClick={() => setShowReportOverlay(false)}
          />
          {/* Overlay Content - Vertical */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto z-101">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary uppercase">
                Zgłoś problem
              </h2>
              <button
                onClick={() => setShowReportOverlay(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zaznacz punkt na mapie
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Kliknij na mapie, aby zaznaczyć lokalizację problemu
                </p>
                {reportLocation && (
                  <p className="text-sm text-primary">
                    Zaznaczono: {reportLocation?.lat.toFixed(6)},{" "}
                    {reportLocation?.lng.toFixed(6)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zdjęcie problemu
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
                {reportImage && (
                  <div className="mt-2">
                    <Image
                      src={URL.createObjectURL(reportImage as Blob)}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis problemu
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  placeholder="Opisz problem..."
                />
              </div>
              <button
                onClick={() => {
                  // Handle submit
                  alert("Problem zgłoszony!");
                  setShowReportOverlay(false);
                  setReportImage(null);
                  setReportDescription("");
                  setReportLocation(null);
                }}
                className="w-full px-4 py-2 bg-primary text-white font-bold uppercase hover:bg-opacity-90 transition-colors"
              >
                Wyślij zgłoszenie
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
